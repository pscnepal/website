import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel, type Content } from '@google/genai';
import express, { type Request, type Response } from 'express';
import {
  buildSystemInstructionForTurn,
  type ChatTurnMessage,
  type ClientStudyContext,
} from './src/server/pscKnowledgeBase.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GEMINI_MODEL = 'gemini-3.8-flash';

function createGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error(
      'API_KEY_INVALID: Gemini API key is not configured. Please check or select your API key in the Settings > Secrets panel.'
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function normalizeContents(messages: ChatTurnMessage[]): Content[] {
  const trimmed = messages
    .slice(-20)
    .map((m) => ({
      role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
      text: (m.content ?? '').trim(),
    }))
    .filter((m) => m.text.length > 0);

  // Ensure the conversation starts with a 'user' message
  while (trimmed.length > 0 && trimmed[0].role !== 'user') {
    trimmed.shift();
  }

  // Merge consecutive messages of the same role so turn alternation is valid
  const merged: Content[] = [];
  for (const item of trimmed) {
    const prev = merged[merged.length - 1];
    if (prev && prev.role === item.role && prev.parts?.[0]?.text) {
      prev.parts[0].text = `${prev.parts[0].text}\n\n${item.text}`;
    } else {
      merged.push({
        role: item.role,
        parts: [{ text: item.text }],
      });
    }
  }

  return merged;
}

function formatGeminiErrorMessage(err: unknown): string {
  const raw =
    err instanceof Error
      ? err.message
      : typeof err === 'string'
        ? err
        : 'Unexpected error communicating with the study assistant.';

  const upper = raw.toUpperCase();

  if (
    upper.includes('PERMISSION_DENIED') ||
    upper.includes('API_KEY_INVALID') ||
    upper.includes('API KEY NOT VALID') ||
    upper.includes('403') ||
    (upper.includes('400') && upper.includes('KEY'))
  ) {
    return 'Unable to authenticate with the Gemini API. Please check your API key (or select one if not set) in the Settings > Secrets panel.';
  }

  if (
    upper.includes('RESOURCE_EXHAUSTED') ||
    upper.includes('429') ||
    upper.includes('QUOTA')
  ) {
    return 'Rate limit or quota reached for the current API key. Upgrading to a paid tier increases your quota — you can select a billing-enabled API key in the Settings > Secrets panel, or wait a moment and try again.';
  }

  return raw;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function openGeminiStreamWithRetry(
  ai: GoogleGenAI,
  contents: Content[],
  systemInstruction: string
) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await ai.models.generateContentStream({
        model: GEMINI_MODEL,
        contents,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      const isTransient =
        msg.includes('503') ||
        msg.includes('500') ||
        msg.includes('UNAVAILABLE') ||
        msg.includes('fetch failed');
      if (!isTransient || attempt === 1) {
        throw err;
      }
      await sleep(500 * (attempt + 1));
    }
  }
  throw lastError;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'psc-nepal-assistant' });
  });

  app.post('/api/chat', async (req: Request, res: Response) => {
    const body = req.body as {
      messages?: ChatTurnMessage[];
      clientContext?: ClientStudyContext;
    };

    const rawMessages = Array.isArray(body?.messages) ? body.messages : [];
    const validMessages: ChatTurnMessage[] = rawMessages.filter(
      (m): m is ChatTurnMessage =>
        Boolean(m) &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0
    );

    const contents = normalizeContents(validMessages);
    if (contents.length === 0) {
      res.status(400).json({
        error: 'Please enter a question for the PSC Nepal Study Assistant.',
      });
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    let clientDisconnected = false;
    res.on('close', () => {
      clientDisconnected = true;
    });

    const sendSseEvent = (payload: Record<string, unknown>) => {
      if (clientDisconnected || res.writableEnded) return;
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
      const maybeFlush = (res as unknown as { flush?: () => void }).flush;
      if (typeof maybeFlush === 'function') {
        maybeFlush.call(res);
      }
    };

    try {
      const ai = createGeminiClient();
      const systemInstruction = buildSystemInstructionForTurn(
        validMessages,
        body?.clientContext
      );

      const streamResponse = await openGeminiStreamWithRetry(
        ai,
        contents,
        systemInstruction
      );

      for await (const chunk of streamResponse) {
        if (clientDisconnected) break;
        const deltaText = chunk.text;
        if (deltaText) {
          sendSseEvent({ type: 'delta', text: deltaText });
        }
      }

      if (!clientDisconnected) {
        sendSseEvent({ type: 'done' });
        res.end();
      }
    } catch (err) {
      const friendlyError = formatGeminiErrorMessage(err);
      sendSseEvent({ type: 'error', error: friendlyError });
      if (!res.writableEnded) {
        res.end();
      }
    }
  });

  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'API endpoint not found.' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.use((_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PSC Nepal full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start PSC Nepal server:', err);
  process.exit(1);
});
