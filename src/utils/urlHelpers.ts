import { READING_MATERIAL_CATEGORIES } from '../data/readingMaterials';
import type { SampleEdition } from '../types/pdf';

export const SAMPLE_EDITIONS: SampleEdition[] = [
  {
    id: 'sample-nepal-parichaya',
    title: 'Nepal Parichaya: Physical Geography & Ecological Belts',
    author: 'Dept. of Information Compendium',
    category: 'Nepal Parichaya',
    pages: 5,
    path: 'https://doib.gov.np/media/app/public/nepal-parichaya-physical-geography.pdf',
    description:
      'Coordinates, Himal/Pahad/Terai physiography, Koshi-Gandaki-Karnali basins, climate zones, and national parks.',
  },
  {
    id: 'sample-constitution',
    title: 'Constitution of Nepal (2072) — Core Articles & Rights',
    author: 'Nepal Law Commission Digest',
    category: 'Laws & Legislation',
    pages: 5,
    path: 'https://lawcommission.gov.np/np/wp-content/uploads/2021/01/Nepal-ko-Sambhidhan-2072.pdf',
    description:
      'Constitutional supremacy, Fundamental Rights & Duties, Federal structure, and Constitutional Commissions.',
  },
  {
    id: 'sample-official-so-syllabus',
    title: 'Official PSC Section Officer (Gazetted Class III) Syllabus — Phase I',
    author: 'Public Service Commission, Nepal',
    category: 'Official PSC Syllabi',
    pages: 24,
    path: 'https://psc.gov.np/site_uploads/course/2024072511005966a2306b5a7ca.pdf',
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
  '/materials/psc-gk-aptitude-outline.pdf':
    'https://psc.gov.np/site_uploads/course/202512091112156938040f1c8f0.pdf',
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
  '/materials/nepal-parichaya-geography.pdf':
    'https://doib.gov.np/media/app/public/nepal-parichaya-physical-geography.pdf',
  '/materials/nepal-parichaya-history.pdf':
    'https://doib.gov.np/media/app/public/nepal-parichaya-history-unification.pdf',
  '/materials/nepal-parichaya-culture-heritage.pdf':
    'https://doib.gov.np/media/app/public/nepal-parichaya-culture-heritage.pdf',
  '/materials/nepal-parichaya-federal-structure.pdf':
    'https://doib.gov.np/media/app/public/nepal-parichaya-federal-structure.pdf',
  '/materials/constitution-of-nepal-2072.pdf':
    'https://lawcommission.gov.np/np/wp-content/uploads/2021/01/Nepal-ko-Sambhidhan-2072.pdf',
  '/materials/civil-service-act-2049.pdf':
    'https://lawcommission.gov.np/np/wp-content/uploads/2019/03/Nijamati-Sewa-Ain-2049.pdf',
  '/materials/right-to-information-act-2064.pdf':
    'https://lawcommission.gov.np/np/wp-content/uploads/2019/03/Suchana-ko-Hak-Sambandhi-Ain-2064.pdf',
  '/materials/good-governance-act-2064.pdf':
    'https://lawcommission.gov.np/np/wp-content/uploads/2019/03/Sushashan-Ain-2064.pdf',
  '/materials/sixteenth-plan-summary.pdf':
    'https://npc.gov.np/images/category/16th_Plan_Draft_Approved_2081.pdf',
  '/materials/local-government-operation-act-2074.pdf':
    'https://lawcommission.gov.np/np/wp-content/uploads/2019/03/Sthaniya-Sarkar-Sanchalan-Ain-2074.pdf',
  '/materials/corruption-prevention-act-2059.pdf':
    'https://lawcommission.gov.np/np/wp-content/uploads/2019/03/Bhrastachar-Niwaran-Ain-2059.pdf',
  '/materials/public-procurement-fiscal-act.pdf':
    'https://lawcommission.gov.np/np/wp-content/uploads/2019/03/Sarbajanik-Kharid-Ain-2063.pdf',
};

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

    // Direct match against reading material catalog items (by path, externalSourceUrl, or id)
    for (const category of READING_MATERIAL_CATEGORIES) {
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

      for (const category of READING_MATERIAL_CATEGORIES) {
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

  // Look up legacy relative path or material ID in catalog to get updated official web URL
  const legacyFilename = trimmed.split('/').pop() || trimmed;
  for (const category of READING_MATERIAL_CATEGORIES) {
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
