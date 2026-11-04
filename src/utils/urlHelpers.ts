import { READING_MATERIAL_CATEGORIES } from '../data/readingMaterials';
import type { SampleEdition } from '../types/pdf';

export const SAMPLE_EDITIONS: SampleEdition[] = [
  {
    id: 'sample-nepal-parichaya',
    title: 'Nepal Parichaya: Physical Geography & Ecological Belts',
    author: 'Dept. of Information Compendium',
    category: 'Nepal Parichaya',
    pages: 5,
    path: '/materials/nepal-parichaya-geography.pdf',
    description:
      'Coordinates, Himal/Pahad/Terai physiography, Koshi-Gandaki-Karnali basins, climate zones, and national parks.',
  },
  {
    id: 'sample-constitution',
    title: 'Constitution of Nepal (2072) — Core Articles & Rights',
    author: 'Nepal Law Commission Digest',
    category: 'Laws & Legislation',
    pages: 5,
    path: '/materials/constitution-of-nepal-2072.pdf',
    description:
      'Constitutional supremacy, Fundamental Rights & Duties, Federal structure, and Constitutional Commissions.',
  },
  {
    id: 'sample-official-so-syllabus',
    title: 'Official PSC Section Officer (Gazetted Class III) Syllabus — Phase I',
    author: 'Public Service Commission, Nepal',
    category: 'Official PSC Syllabi',
    pages: 24,
    path: '/materials/official-psc/psc-official-section-officer-phase1.pdf',
    description:
      'Verbatim Lok Sewa Aayog joint examination scheme and Paper I Administrative Aptitude Test (AAT) syllabus.',
  },
];

export interface UrlValidationResult {
  valid: boolean;
  normalizedUrl: string;
  errorMessage?: string;
}

/**
 * Validates user-entered PDF URLs. Supports absolute http(s) URLs as well as
 * same-origin relative study material paths (e.g. /materials/...).
 */
export function validatePdfUrl(rawInput: string): UrlValidationResult {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return {
      valid: false,
      normalizedUrl: '',
      errorMessage: 'Please enter a PDF URL to open.',
    };
  }

  if (trimmed.startsWith('/')) {
    const fullUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}${trimmed}`
        : trimmed;
    return {
      valid: true,
      normalizedUrl: fullUrl,
    };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        valid: false,
        normalizedUrl: trimmed,
        errorMessage: 'Only HTTP and HTTPS document URLs are supported.',
      };
    }
    return {
      valid: true,
      normalizedUrl: parsed.toString(),
    };
  } catch {
    return {
      valid: false,
      normalizedUrl: trimmed,
      errorMessage:
        'Enter a complete, valid URL starting with https:// (for example, https://example.com/book.pdf).',
    };
  }
}

/**
 * Generates a deterministic, serializable book ID from a URL or local file signature.
 */
export function createBookIdFromUrl(url: string): string {
  let normalized = url.trim();
  if (typeof window !== 'undefined' && normalized.startsWith(window.location.origin)) {
    normalized = normalized.slice(window.location.origin.length);
  }
  let hash = 5381;
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) + hash) ^ normalized.charCodeAt(i);
  }
  return `url-${(hash >>> 0).toString(36)}`;
}

export function createBookIdFromLocalFile(fileName: string, fileSize: number): string {
  const raw = `${fileName.toLowerCase()}::${fileSize}`;
  let hash = 5381;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) + hash) ^ raw.charCodeAt(i);
  }
  return `local-${(hash >>> 0).toString(36)}`;
}

/**
 * Extracts a clean, human-readable book title from a URL or filename.
 */
export function deriveTitleFromSource(urlOrFileName: string): string {
  try {
    let rawSegment = urlOrFileName;
    if (urlOrFileName.includes('://') || urlOrFileName.startsWith('/')) {
      const parsed = new URL(
        urlOrFileName,
        typeof window !== 'undefined' ? window.location.origin : 'https://localhost'
      );
      for (const category of READING_MATERIAL_CATEGORIES) {
        const matched = category.items.find((item) => item.path === parsed.pathname);
        if (matched) {
          return matched.title;
        }
      }
      const segments = parsed.pathname.split('/').filter(Boolean);
      rawSegment = segments[segments.length - 1] || parsed.hostname;
    }

    const decoded = decodeURIComponent(rawSegment)
      .replace(/\.pdf$/i, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!decoded) return 'Untitled Document';

    return decoded.replace(/\b\w/g, (ch) => ch.toUpperCase());
  } catch {
    return 'Untitled Document';
  }
}

export function resolveSampleUrl(path: string): string {
  if (typeof window === 'undefined') return path;
  return `${window.location.origin}${path}`;
}
