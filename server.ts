import dns from 'node:dns/promises';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import express, { type Request, type Response } from 'express';

const PORT = Number(process.env.PORT) || 3000;
const MAX_PDF_BYTES = 75 * 1024 * 1024; // 75 MB safety cap
const MAX_REDIRECTS = 4;
const FETCH_TIMEOUT_MS = 25000;

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'ip6-localhost',
  'ip6-loopback',
  'metadata.google.internal',
  'metadata',
]);

function isPrivateOrReservedIpv4(ip: string): boolean {
  const parts = ip.split('.').map((part) => Number(part));
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return true;
  }

  const [a, b, c] = parts;
  if (a === 0) return true; // 0.0.0.0/8
  if (a === 10) return true; // 10.0.0.0/8
  if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 CGNAT
  if (a === 127) return true; // 127.0.0.0/8 loopback
  if (a === 169 && b === 254) return true; // 169.254.0.0/16 link-local & cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
  if (a === 192 && b === 0 && c === 0) return true; // 192.0.0.0/24
  if (a === 192 && b === 0 && c === 2) return true; // TEST-NET-1
  if (a === 192 && b === 168) return true; // 192.168.0.0/16
  if (a === 198 && (b === 18 || b === 19)) return true; // benchmarking
  if (a === 198 && b === 51 && c === 100) return true; // TEST-NET-2
  if (a === 203 && b === 0 && c === 113) return true; // TEST-NET-3
  if (a >= 224) return true; // multicast & reserved
  return false;
}

function isPrivateOrReservedIp(rawIp: string): boolean {
  const ip = rawIp.split('%')[0]?.trim().toLowerCase() ?? '';
  if (!ip) return true;

  const ipVersion = net.isIP(ip);
  if (ipVersion === 4) {
    return isPrivateOrReservedIpv4(ip);
  }
  if (ipVersion === 6) {
    if (ip === '::' || ip === '::1') return true;
    if (ip.startsWith('::ffff:')) {
      const mapped = ip.slice('::ffff:'.length);
      if (net.isIP(mapped) === 4) {
        return isPrivateOrReservedIpv4(mapped);
      }
      const hexParts = mapped.split(':');
      if (hexParts.length === 2) {
        const hi = parseInt(hexParts[0], 16);
        const lo = parseInt(hexParts[1], 16);
        if (!Number.isNaN(hi) && !Number.isNaN(lo)) {
          const ipv4 = `${(hi >> 8) & 0xff}.${hi & 0xff}.${(lo >> 8) & 0xff}.${lo & 0xff}`;
          return isPrivateOrReservedIpv4(ipv4);
        }
      }
      return true;
    }
    if (ip.startsWith('fc') || ip.startsWith('fd')) return true; // fc00::/7 unique local
    if (
      ip.startsWith('fe8') ||
      ip.startsWith('fe9') ||
      ip.startsWith('fea') ||
      ip.startsWith('feb')
    ) {
      return true; // fe80::/10 link-local
    }
    if (ip.startsWith('ff')) return true; // ff00::/8 multicast
    return false;
  }

  return true;
}

async function validatePublicTargetUrl(rawUrl: string): Promise<URL> {
  if (!rawUrl || rawUrl.length > 2048) {
    throw new Error('Invalid or overly long PDF URL.');
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error('Malformed PDF URL.');
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only HTTP and HTTPS PDF URLs are supported.');
  }

  if (parsed.username || parsed.password) {
    throw new Error('URLs with embedded credentials are not allowed.');
  }

  const hostname = parsed.hostname.replace(/^\[|\]$/g, '').toLowerCase();
  if (
    !hostname ||
    BLOCKED_HOSTNAMES.has(hostname) ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.localdomain')
  ) {
    throw new Error('Target host is not permitted.');
  }

  if (net.isIP(hostname) !== 0) {
    if (isPrivateOrReservedIp(hostname)) {
      throw new Error('Private or loopback IP addresses are not permitted.');
    }
    return parsed;
  }

  const resolved = await dns.lookup(hostname, { all: true, verbatim: true });
  if (!resolved || resolved.length === 0) {
    throw new Error('Unable to resolve target PDF host.');
  }

  for (const entry of resolved) {
    if (isPrivateOrReservedIp(entry.address)) {
      throw new Error('Resolved target address is not publicly routable.');
    }
  }

  return parsed;
}

function containsPdfMagicBytes(chunk: Uint8Array): boolean {
  const limit = Math.min(chunk.byteLength, 1024);
  if (limit < 5) return false;
  const headerSlice = Buffer.from(chunk.subarray(0, limit)).toString('latin1');
  return headerSlice.includes('%PDF-');
}

async function fetchPdfWithValidatedRedirects(
  initialUrl: string,
  rangeHeader?: string
): Promise<globalThis.Response> {
  let currentUrl = initialUrl;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const validatedUrl = await validatePublicTargetUrl(currentUrl);
    const headers: Record<string, string> = {
      Accept: 'application/pdf,application/octet-stream;q=0.9,*/*;q=0.8',
      'User-Agent': 'PSC-Nepal-Reader/1.0',
    };

    if (rangeHeader && /^bytes=\d*-\d*$/i.test(rangeHeader)) {
      headers.Range = rangeHeader;
    }

    const upstreamResponse = await fetch(validatedUrl.toString(), {
      method: 'GET',
      headers,
      redirect: 'manual',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (
      upstreamResponse.status >= 300 &&
      upstreamResponse.status < 400
    ) {
      const location = upstreamResponse.headers.get('location');
      await upstreamResponse.body?.cancel().catch(() => {});
      if (!location) {
        throw new Error('Upstream server returned a redirect without Location.');
      }
      currentUrl = new URL(location, validatedUrl).toString();
      continue;
    }

    return upstreamResponse;
  }

  throw new Error('Too many redirects while fetching PDF.');
}

async function handlePdfProxy(req: Request, res: Response): Promise<void> {
  const rawUrl = typeof req.query.url === 'string' ? req.query.url.trim() : '';
  if (!rawUrl) {
    res.status(400).json({ error: 'Missing required "url" query parameter.' });
    return;
  }

  try {
    await validatePublicTargetUrl(rawUrl);
  } catch (err) {
    res.status(400).json({
      error: err instanceof Error ? err.message : 'Invalid PDF target URL.',
    });
    return;
  }

  const rangeHeader =
    typeof req.headers.range === 'string' ? req.headers.range : undefined;

  let upstreamResponse: globalThis.Response;
  try {
    upstreamResponse = await fetchPdfWithValidatedRedirects(rawUrl, rangeHeader);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to connect to PDF host.';
    const statusCode = /not permitted|publicly routable|credentials|Invalid|Malformed/i.test(
      message
    )
      ? 400
      : 502;
    res.status(statusCode).json({ error: message });
    return;
  }

  if (!upstreamResponse.ok) {
    const status =
      upstreamResponse.status === 401 ||
      upstreamResponse.status === 403 ||
      upstreamResponse.status === 404
        ? upstreamResponse.status
        : 502;
    await upstreamResponse.body?.cancel().catch(() => {});
    res.status(status).json({
      error: `Remote server responded with HTTP ${upstreamResponse.status}.`,
    });
    return;
  }

  const rawContentLength = upstreamResponse.headers.get('content-length');
  if (rawContentLength) {
    const parsedLength = Number(rawContentLength);
    if (Number.isFinite(parsedLength) && parsedLength > MAX_PDF_BYTES) {
      await upstreamResponse.body?.cancel().catch(() => {});
      res.status(413).json({ error: 'PDF exceeds maximum allowed size.' });
      return;
    }
  }

  const upstreamContentType = (
    upstreamResponse.headers.get('content-type') || ''
  ).toLowerCase();

  if (
    upstreamContentType &&
    (upstreamContentType.includes('text/html') ||
      upstreamContentType.includes('application/xhtml') ||
      upstreamContentType.includes('application/json') ||
      upstreamContentType.startsWith('image/') ||
      upstreamContentType.startsWith('video/'))
  ) {
    await upstreamResponse.body?.cancel().catch(() => {});
    res.status(415).json({
      error: 'The target URL did not return a PDF document.',
    });
    return;
  }

  const body = upstreamResponse.body;
  if (!body) {
    res.status(502).json({ error: 'Empty response received from PDF server.' });
    return;
  }

  const reader = body.getReader();
  let clientClosed = false;
  res.on('close', () => {
    clientClosed = true;
    void reader.cancel().catch(() => {});
  });

  try {
    const firstRead = await reader.read();
    if (firstRead.done || !firstRead.value || firstRead.value.byteLength === 0) {
      res.status(502).json({ error: 'Upstream returned an empty PDF stream.' });
      return;
    }

    const firstChunk = firstRead.value;
    if (upstreamResponse.status === 200 && !containsPdfMagicBytes(firstChunk)) {
      await reader.cancel().catch(() => {});
      res.status(415).json({
        error: 'The target URL did not return a valid PDF binary.',
      });
      return;
    }

    res.status(upstreamResponse.status === 206 ? 206 : 200);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    const acceptRanges = upstreamResponse.headers.get('accept-ranges');
    if (acceptRanges) {
      res.setHeader('Accept-Ranges', acceptRanges);
    }
    const contentRange = upstreamResponse.headers.get('content-range');
    if (contentRange && upstreamResponse.status === 206) {
      res.setHeader('Content-Range', contentRange);
    }
    if (rawContentLength) {
      res.setHeader('Content-Length', rawContentLength);
    }

    let totalBytes = firstChunk.byteLength;
    if (totalBytes > MAX_PDF_BYTES) {
      await reader.cancel().catch(() => {});
      res.end();
      return;
    }

    res.write(Buffer.from(firstChunk));

    while (!clientClosed) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value || value.byteLength === 0) continue;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_PDF_BYTES) {
        await reader.cancel().catch(() => {});
        break;
      }
      if (!res.write(Buffer.from(value))) {
        await new Promise<void>((resolve) => {
          res.once('drain', resolve);
        });
      }
    }

    if (!res.writableEnded) {
      res.end();
    }
  } catch (err) {
    void reader.cancel().catch(() => {});
    if (!res.headersSent) {
      res.status(502).json({
        error:
          err instanceof Error ? err.message : 'Failed while streaming PDF.',
      });
    } else if (!res.writableEnded) {
      res.end();
    }
  }
}

async function startServer(): Promise<void> {
  const app = express();
  app.set('trust proxy', 1);

  const httpServer = http.createServer(app);

  app.get('/api/pdf-proxy', (req, res) => {
    void handlePdfProxy(req, res);
  });

  const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.npm_lifecycle_event === 'start';

  if (isProduction) {
    const distDir = path.resolve(import.meta.dirname, 'dist');
    app.use(
      '/assets',
      express.static(path.join(distDir, 'assets'), {
        maxAge: '1y',
        immutable: true,
      })
    );
    app.use(
      express.static(distDir, {
        maxAge: '1h',
        setHeaders(res, filePath) {
          if (
            filePath.endsWith('.html') ||
            filePath.endsWith('sw.js') ||
            filePath.endsWith('site.webmanifest')
          ) {
            res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
          }
        },
      })
    );
    app.get('/{*splat}', (req, res) => {
      if (req.path.startsWith('/api/')) {
        res.status(404).json({ error: 'API route not found.' });
        return;
      }
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const disableHmr = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        ...(disableHmr
          ? { hmr: false, ws: false }
          : { hmr: { server: httpServer } }),
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`PSC Nepal server listening on http://0.0.0.0:${PORT}`);
  });
}

void startServer();
