import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ChatMarkdownProps {
  content: string;
  showCursor?: boolean;
  onNavigateInternal: (path: string) => void;
}

const KNOWN_INTERNAL_PREFIXES = [
  '/syllabus',
  '/materials',
  '/quiz',
  '/written',
  '/simulate',
  '/progress',
  '/library',
  '/read',
  '/features',
  '/contact',
  '/privacy',
  '/terms',
];

function isInternalAppRoute(href: string): boolean {
  if (href === '/') return true;
  return KNOWN_INTERNAL_PREFIXES.some(
    (prefix) =>
      href === prefix ||
      href.startsWith(`${prefix}/`) ||
      href.startsWith(`${prefix}?`) ||
      href.startsWith(`${prefix}#`)
  );
}

function renderInlineSegments(
  text: string,
  onNavigateInternal: (path: string) => void,
  keyPrefix: string
): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Matches: [label](url), **bold**, `code`, *italic*
  const tokenRegex =
    /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|\*([^*\n]+)\*)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let partIdx = 0;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const [, , linkLabel, linkHref, boldText, codeText, italicText] = match;
    const key = `${keyPrefix}-${partIdx++}`;

    if (linkLabel !== undefined && linkHref !== undefined) {
      const cleanHref = linkHref.trim();
      if (cleanHref.startsWith('/')) {
        nodes.push(
          <button
            key={key}
            type="button"
            onClick={() => onNavigateInternal(cleanHref)}
            className="inline-flex items-center gap-0.5 font-medium text-blue-700 dark:text-blue-400 underline underline-offset-3 decoration-blue-700/45 dark:decoration-blue-400/45 hover:text-crimson-700 dark:hover:text-crimson-400 hover:decoration-crimson-700 transition-colors cursor-pointer text-left"
          >
            <span>{linkLabel}</span>
            <ArrowUpRight className="w-3 h-3 shrink-0" />
          </button>
        );
      } else {
        nodes.push(
          <a
            key={key}
            href={cleanHref}
            target={cleanHref.startsWith('mailto:') ? undefined : '_blank'}
            rel={
              cleanHref.startsWith('mailto:')
                ? undefined
                : 'noopener noreferrer'
            }
            className="inline-flex items-center gap-0.5 font-medium text-blue-700 dark:text-blue-400 underline underline-offset-3 decoration-blue-700/45 dark:decoration-blue-400/45 hover:text-crimson-700 dark:hover:text-crimson-400 transition-colors break-all"
          >
            <span>{linkLabel}</span>
            <ArrowUpRight className="w-3 h-3 shrink-0" />
          </a>
        );
      }
    } else if (boldText !== undefined) {
      nodes.push(
        <strong
          key={key}
          className="font-semibold text-zinc-950 dark:text-zinc-50"
        >
          {renderInlineSegments(boldText, onNavigateInternal, `${key}-b`)}
        </strong>
      );
    } else if (codeText !== undefined) {
      const trimmedCode = codeText.trim();
      if (isInternalAppRoute(trimmedCode)) {
        nodes.push(
          <button
            key={key}
            type="button"
            onClick={() => onNavigateInternal(trimmedCode)}
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/70 font-mono text-[0.8125em] text-blue-800 dark:text-blue-300 hover:border-crimson-600/50 hover:text-crimson-700 dark:hover:text-crimson-300 transition-colors cursor-pointer"
          >
            <span>{trimmedCode}</span>
            <ArrowUpRight className="w-2.5 h-2.5 shrink-0" />
          </button>
        );
      } else {
        nodes.push(
          <code
            key={key}
            className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 font-mono text-[0.8125em] text-zinc-900 dark:text-zinc-100"
          >
            {codeText}
          </code>
        );
      }
    } else if (italicText !== undefined) {
      nodes.push(
        <em key={key} className="italic text-zinc-800 dark:text-zinc-200">
          {italicText}
        </em>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function TypingCursor() {
  return (
    <span
      aria-hidden="true"
      className="inline-block w-[6px] h-[1.08em] ml-0.5 -mb-[2px] rounded-[1px] bg-crimson-700 dark:bg-crimson-400 animate-pulse"
    />
  );
}

function parseTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function isTableDivider(line: string): boolean {
  return /^\|?[\s:-]+\|[\s|:-]+\|?$/.test(line.trim());
}

export function ChatMarkdown({
  content,
  showCursor = false,
  onNavigateInternal,
}: ChatMarkdownProps) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];

  let i = 0;
  let blockKey = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    // Fenced code block
    if (trimmed.startsWith('```')) {
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) {
        i += 1;
      }
      const isLastBlock = i >= lines.length;
      blocks.push(
        <pre
          key={`code-${blockKey++}`}
          className="overflow-x-auto rounded-lg bg-zinc-900 dark:bg-zinc-950 border border-zinc-800 p-3 font-mono text-xs text-zinc-100 leading-relaxed"
        >
          <code>
            {codeLines.join('\n')}
            {showCursor && isLastBlock && <TypingCursor />}
          </code>
        </pre>
      );
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      i += 1;
      blocks.push(
        <hr
          key={`hr-${blockKey++}`}
          className="border-zinc-200 dark:border-zinc-800 my-2"
        />
      );
      continue;
    }

    // Heading (#, ##, ###, ####)
    const headingMatch = /^(#{1,4})\s+(.+)$/.exec(trimmed);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingText = headingMatch[2];
      i += 1;
      const isLastBlock =
        i >= lines.length || lines.slice(i).every((l) => !l.trim());
      const sizeClass =
        level <= 2
          ? 'font-serif text-sm sm:text-[15px] font-semibold text-zinc-950 dark:text-zinc-50 pt-1'
          : 'text-xs sm:text-[13.5px] font-semibold text-zinc-900 dark:text-zinc-100 pt-0.5';

      blocks.push(
        <h3 key={`h-${blockKey++}`} className={sizeClass}>
          {renderInlineSegments(
            headingText,
            onNavigateInternal,
            `h-${blockKey}`
          )}
          {showCursor && isLastBlock && <TypingCursor />}
        </h3>
      );
      continue;
    }

    // Markdown table
    if (
      trimmed.includes('|') &&
      i + 1 < lines.length &&
      isTableDivider(lines[i + 1])
    ) {
      const headers = parseTableRow(lines[i]);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().includes('|')) {
        if (!isTableDivider(lines[i])) {
          rows.push(parseTableRow(lines[i]));
        }
        i += 1;
      }
      const isLastBlock =
        i >= lines.length || lines.slice(i).every((l) => !l.trim());
      blocks.push(
        <div
          key={`tbl-${blockKey++}`}
          className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800"
        >
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-zinc-100/80 dark:bg-zinc-800/70 text-zinc-800 dark:text-zinc-200">
              <tr>
                {headers.map((header, hIdx) => (
                  <th
                    key={hIdx}
                    className="px-2.5 py-1.5 font-semibold border-b border-zinc-200 dark:border-zinc-700"
                  >
                    {renderInlineSegments(
                      header,
                      onNavigateInternal,
                      `th-${blockKey}-${hIdx}`
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="bg-white/60 dark:bg-zinc-900/50">
                  {row.map((cell, cIdx) => {
                    const isFinalCell =
                      isLastBlock &&
                      rIdx === rows.length - 1 &&
                      cIdx === row.length - 1;
                    return (
                      <td
                        key={cIdx}
                        className="px-2.5 py-1.5 text-zinc-700 dark:text-zinc-300 align-top"
                      >
                        {renderInlineSegments(
                          cell,
                          onNavigateInternal,
                          `td-${blockKey}-${rIdx}-${cIdx}`
                        )}
                        {showCursor && isFinalCell && <TypingCursor />}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i += 1;
      }
      const isLastBlock =
        i >= lines.length || lines.slice(i).every((l) => !l.trim());
      blocks.push(
        <blockquote
          key={`bq-${blockKey++}`}
          className="border-l-2 border-crimson-700 dark:border-crimson-400 pl-3 py-0.5 text-zinc-700 dark:text-zinc-300 italic"
        >
          {renderInlineSegments(
            quoteLines.join(' '),
            onNavigateInternal,
            `bq-${blockKey}`
          )}
          {showCursor && isLastBlock && <TypingCursor />}
        </blockquote>
      );
      continue;
    }

    // Unordered or Ordered List
    const isBullet = /^([-*•])\s+/.test(trimmed);
    const isOrdered = /^([\d०-९]+)[.)]\s+/.test(trimmed);

    if (isBullet || isOrdered) {
      const items: Array<{ marker?: string; text: string }> = [];
      while (i < lines.length) {
        const lineTrimmed = lines[i].trim();
        const bMatch = /^([-*•])\s+(.+)$/.exec(lineTrimmed);
        const oMatch = /^([\d०-९]+[.)])\s+(.+)$/.exec(lineTrimmed);
        if (isBullet && bMatch) {
          items.push({ text: bMatch[2] });
          i += 1;
        } else if (isOrdered && oMatch) {
          items.push({ marker: oMatch[1], text: oMatch[2] });
          i += 1;
        } else {
          break;
        }
      }

      const isLastBlock =
        i >= lines.length || lines.slice(i).every((l) => !l.trim());

      if (isOrdered) {
        blocks.push(
          <ol key={`ol-${blockKey++}`} className="space-y-1.5 pl-0.5">
            {items.map((item, idx) => {
              const isFinalItem = isLastBlock && idx === items.length - 1;
              return (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="font-mono text-xs font-semibold text-crimson-700 dark:text-crimson-400 shrink-0 mt-0.5 tabular-nums">
                    {item.marker}
                  </span>
                  <span className="min-w-0 flex-1">
                    {renderInlineSegments(
                      item.text,
                      onNavigateInternal,
                      `oli-${blockKey}-${idx}`
                    )}
                    {showCursor && isFinalItem && <TypingCursor />}
                  </span>
                </li>
              );
            })}
          </ol>
        );
      } else {
        blocks.push(
          <ul key={`ul-${blockKey++}`} className="space-y-1.5 pl-0.5">
            {items.map((item, idx) => {
              const isFinalItem = isLastBlock && idx === items.length - 1;
              return (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-crimson-700 dark:bg-crimson-400 shrink-0 mt-2"
                  />
                  <span className="min-w-0 flex-1">
                    {renderInlineSegments(
                      item.text,
                      onNavigateInternal,
                      `uli-${blockKey}-${idx}`
                    )}
                    {showCursor && isFinalItem && <TypingCursor />}
                  </span>
                </li>
              );
            })}
          </ul>
        );
      }
      continue;
    }

    // Standard paragraph (collect consecutive normal lines)
    const paraLines: string[] = [];
    while (i < lines.length) {
      const nextTrimmed = lines[i].trim();
      if (
        !nextTrimmed ||
        nextTrimmed.startsWith('```') ||
        nextTrimmed.startsWith('#') ||
        nextTrimmed.startsWith('>') ||
        /^([-*•])\s+/.test(nextTrimmed) ||
        /^([\d०-९]+)[.)]\s+/.test(nextTrimmed) ||
        /^(-{3,}|\*{3,})$/.test(nextTrimmed)
      ) {
        break;
      }
      paraLines.push(nextTrimmed);
      i += 1;
    }

    const isLastBlock =
      i >= lines.length || lines.slice(i).every((l) => !l.trim());
    blocks.push(
      <p key={`p-${blockKey++}`} className="leading-relaxed">
        {renderInlineSegments(
          paraLines.join(' '),
          onNavigateInternal,
          `p-${blockKey}`
        )}
        {showCursor && isLastBlock && <TypingCursor />}
      </p>
    );
  }

  if (blocks.length === 0 && showCursor) {
    return <TypingCursor />;
  }

  return <div className="space-y-2.5 break-words">{blocks}</div>;
}
