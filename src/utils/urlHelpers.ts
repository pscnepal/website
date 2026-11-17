import { materialStorageService } from '../services/materialStorageService';
import type { SampleEdition } from '../types/pdf';

export const SAMPLE_EDITIONS: SampleEdition[] = [
  {
    id: 'sample-nepal-parichaya',
    title: 'नेपाल परिचय (१४ औं संस्करण), २०८३',
    author: 'Department of Information and Broadcasting (DoIB)',
    category: 'Nepal Parichaya',
    pages: 440,
    path: 'https://giwmscdnone.gov.np/media/pdf_upload/Nepal%20Parichaya%2014th%20edition_2083_With%20Cover_fjr5vfa.pdf',
    description:
      'Latest 14th edition (2083 BS) official DoIB compendium covering Nepal geography, history, culture, 2078 census demographics, and 16th Plan indicators.',
  },
  {
    id: 'sample-constitution',
    title: 'Constitution of Nepal (2nd Amendment) — Official English Text',
    author: 'Nepal Law Commission (नेपाल कानून आयोग)',
    category: 'Constitution & Admin Laws',
    pages: 226,
    path: 'https://giwmscdnone.gov.np/media/files/Constitution%20of%20Nepal%20(2nd%20amd.%20English)_xf33zb3.pdf',
    description:
      'Official Nepal Law Commission English text covering Constitutional supremacy, Fundamental Rights, Federal structure, and Constitutional Commissions.',
  },
  {
    id: 'sample-official-so-syllabus',
    title: 'Official PSC Section Officer (Gazetted Class III) Syllabus — Phase I',
    author: 'Public Service Commission, Nepal',
    category: 'Official PSC Syllabi',
    pages: 24,
    path: 'https://psc.gov.np/site_uploads/course/202512091112156938040f1c8f0.pdf',
    description:
      'Verbatim Lok Sewa Aayog joint examination scheme and Paper I Administrative Aptitude Test (AAT) syllabus.',
  },
];

export const LEGACY_MATERIAL_PATH_MAP: Record<string, string> = {
  '/materials/psc-section-officer-syllabus.pdf':
    'https://psc.gov.np/site_uploads/course/202512091112156938040f1c8f0.pdf',
  '/materials/psc-nayab-subba-syllabus.pdf':
    'https://psc.gov.np/site_uploads/course/2024072511021066a230b2d30f6.pdf',
  '/materials/psc-kharidar-syllabus.pdf':
    'https://psc.gov.np/site_uploads/course/2024072511005966a2306b5a7ca.pdf',
  '/materials/official-psc/psc-official-section-officer-phase1.pdf':
    'https://psc.gov.np/site_uploads/course/202512091112156938040f1c8f0.pdf',
  '/materials/official-psc/psc-official-section-officer-phase2.pdf':
    'https://psc.gov.np/site_uploads/course/202512091043336937fd55e8f3c1.pdf',
  '/materials/official-psc/psc-official-nayab-subba-phase1.pdf':
    'https://psc.gov.np/site_uploads/course/2024072511021066a230b2d30f6.pdf',
  '/materials/official-psc/psc-official-nayab-subba-phase2.pdf':
    'https://psc.gov.np/site_uploads/course/2024072511021066a230b2d30f61.pdf',
  '/materials/official-psc/psc-official-kharidar-phase1.pdf':
    'https://psc.gov.np/site_uploads/course/2024072511005966a2306b5a7ca.pdf',
  '/materials/official-psc/psc-official-kharidar-phase2.pdf':
    'https://psc.gov.np/site_uploads/course/2024072511005966a2306b5a7ca1.pdf',
  '/materials/constitution-of-nepal-2072.pdf':
    'https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%A8%E0%A5%87%E0%A4%AA%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8B%20%E0%A4%B8_%E0%A4%82%E0%A4%B5%E0%A4%BF%E0%A4%A7%E0%A4%BE%E0%A4%A8%20unicode%20%E0%A4%AD%E0%A4%BE%E0%A4%A6%E0%A5%8D%E0%A4%B0%20%E0%A5%A8%E0%A5%A6%E0%A5%AE%E0%A5%A7_mtbuyjt.pdf',
  '/materials/civil-service-act-2049.pdf':
    'https://giwmscdnone.gov.np/media/app/public/275/posts/1719471204_53.pdf',
  '/materials/right-to-information-act-2064.pdf':
    'https://giwmscdnone.gov.np/media/pdf_upload/16.%E0%A4%B8%E0%A4%9A%E0%A4%A8%E0%A4%95_%E0%A4%B9%E0%A4%95_%E0%A4%B8%E0%A4%AE%E0%A4%AC%E0%A4%A8%E0%A4%A7_%E0%A4%90%E0%A4%A8_%E0%A5%A8%E0%A5%A6%E0%A5%AC%E0%A5%AA.pdf',
  '/materials/good-governance-act-2064.pdf':
    'https://giwmscdnone.gov.np/media/pdf_upload/10.%E0%A4%B8%E0%A5%81%E0%A4%B6%E0%A4%BE%E0%A4%B8%E0%A4%A8%20(%E0%A4%B5%E0%A5%8D%E0%A4%AF%E0%A4%B5%E0%A4%B8%E0%A5%8D%E0%A4%A5%E0%A4%BE%E0%A4%AA%E0%A4%A8%20%E0%A4%A4%E0%A4%A5%E0%A4%BE%20%E0%A4%B8%E0%A4%9E%E0%A5%8D%E0%A4%9A%E0%A4%BE%E0%A4%B2%E0%A4%A8)%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AC%E0%A5%AA_rbx6erv.pdf',
  '/materials/sixteenth-plan-summary.pdf':
    'https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%B8%E0%A5%8B%E0%A4%B9%E0%A5%8D%E0%A4%B0%E0%A5%8C%E0%A4%82%20%E0%A4%AF%E0%A5%8B%E0%A4%9C%E0%A4%A8%E0%A4%BE_rfucaur.pdf',
  '/materials/local-government-operation-act-2074.pdf':
    'https://giwmscdnone.gov.np/media/pdf_upload/5.%E0%A4%B8%E0%A5%8D%E0%A4%A5%E0%A4%BE%E0%A4%A8%E0%A5%80%E0%A4%AF%20%E0%A4%B8%E0%A4%B0%E0%A4%95%E0%A4%BE%E0%A4%B0%20%E0%A4%B8%E0%A4%9E%E0%A5%8D_%E0%A4%9A%E0%A4%BE%E0%A4%B2%E0%A4%A8%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AD%E0%A5%AA_uhq3r7x.pdf',
  '/materials/corruption-prevention-act-2059.pdf':
    'https://giwmscdnone.gov.np/media/pdf_upload/4.%E0%A4%AD%E0%A5%8D%E0%A4%B0%E0%A4%B7%E0%A5%8D%E0%A4%9F%E0%A4%BE%E0%A4%9A%E0%A4%BE%E0%A4%B0%20%E0%A4%A8%E0%A4%BF%E0%A4%B5%E0%A4%BE%E0%A4%B0%E0%A4%A3%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AB%E0%A5%AF_clwpfdz.pdf',
  '/materials/public-procurement-fiscal-act.pdf':
    'https://giwmscdnone.gov.np/media/pdf_upload/8.%E0%A4%B8%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%B5%E0%A4%9C%E0%A4%A8%E0%A4%BF%E0%A4%95%20%E0%A4%96%E0%A4%B0%E0%A4%BF%E0%A4%A6%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AC%E0%A5%A9_dsrretl.pdf',
};

import type { UrlValidationResult } from '../types/common';

export type { UrlValidationResult };

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

  // Check legacy relative path map first
  if (LEGACY_MATERIAL_PATH_MAP[trimmed]) {
    return {
      valid: true,
      normalizedUrl: LEGACY_MATERIAL_PATH_MAP[trimmed],
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
  if (!urlOrFileName) return 'Untitled Document';
  try {
    const trimmed = urlOrFileName.trim();

    // Direct match against live reading material catalog items (by path, externalSourceUrl, or id)
    const liveCategories = materialStorageService.loadMaterialCategories();
    for (const category of liveCategories) {
      const directMatch = category.items.find(
        (item) =>
          item.path === trimmed ||
          item.externalSourceUrl === trimmed ||
          item.id === trimmed
      );
      if (directMatch) {
        return directMatch.title;
      }
    }

    let rawSegment = trimmed;
    if (trimmed.includes('://') || trimmed.startsWith('/')) {
      const parsed = new URL(
        trimmed,
        typeof window !== 'undefined' ? window.location.origin : 'https://localhost'
      );

      for (const category of liveCategories) {
        const matched = category.items.find(
          (item) =>
            item.path === parsed.href ||
            item.path === parsed.pathname ||
            item.externalSourceUrl === parsed.href ||
            item.path.endsWith(parsed.pathname)
        );
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

/**
 * Resolves a reading material path or URL to an absolute URL.
 * Handles absolute http(s) URLs directly, maps legacy relative /materials/... paths
 * to catalog URLs, and prefixes same-origin paths with window.location.origin.
 */
export function resolveSampleUrl(path: string): string {
  if (!path) return '';
  const trimmed = path.trim();

  // If already an absolute web URL or blob/data URI, return directly
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }

  // Check legacy map first
  if (LEGACY_MATERIAL_PATH_MAP[trimmed]) {
    return LEGACY_MATERIAL_PATH_MAP[trimmed];
  }

  // Look up legacy relative path or material ID in live catalog to get updated official web URL
  const legacyFilename = trimmed.split('/').pop() || trimmed;
  for (const category of materialStorageService.loadMaterialCategories()) {
    const matched = category.items.find((item) => {
      if (item.path === trimmed || item.id === trimmed) return true;
      const itemFilename = item.path.split('/').pop();
      return itemFilename && itemFilename === legacyFilename;
    });

    if (matched && (matched.path.startsWith('http://') || matched.path.startsWith('https://'))) {
      return matched.path;
    }
  }

  if (typeof window === 'undefined') return trimmed;
  return `${window.location.origin}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
}
