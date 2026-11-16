import { STORAGE_KEYS } from '../services/storageService';
import { SITE_CONFIG } from './siteConfig';

export const PRIVACY_POLICY_CONTENT = {
  breadcrumbLabel: 'Privacy Policy',
  title: 'Privacy Policy',
  effectiveDateLabel: `Effective Date: ${SITE_CONFIG.legalEffectiveDate}`,
  subtitle: 'Data & Privacy Controls',
  intro:
    'PSC Nepal respects your privacy while keeping your Lok Sewa preparation workspace organized across sessions. Signed-in aspirants sync quiz attempts, flagged questions, and ratings with their account, while personal PDF files opened from your device stay private to your viewing session.',
  sections: {
    localPdfProcessing: {
      heading: '1. Local PDF Processing & Zero File Uploads',
      paragraph1Lead:
        'When you open a PDF from your computer or mobile device using the file picker or drag-and-drop intake, PSC Nepal renders every page locally inside your browser’s memory using Web Workers (',
      paragraph1Code: 'pdfjs-dist',
      paragraph1Trail: ').',
      paragraph2Lead: 'Temporary ',
      paragraph2Code: 'blob:',
      paragraph2Trail:
        ' object URLs exist strictly for your active browser tab session and are automatically revoked when you close or reload the tab. Your private books, notes, and documents are never transmitted to external servers.',
    },
    savedRecords: {
      heading: '2. Saved Workspace Preferences & Study Records',
      description:
        'Signed-in users sync profile details, quiz attempts, flagged questions, and ratings across devices. To keep your reading positions, preferences, and practice sessions responsive, PSC Nepal also maintains the following workspace records:',
    },
    remotePdfLinks: {
      heading: '3. Remote PDF Links & Third-Party Requests',
      paragraph1Lead:
        'When you paste a remote HTTPS PDF link into the URL reader, your browser requests that PDF directly from the origin domain you specified. That external host may log standard HTTP request headers (such as IP address and User-Agent) under its own privacy policy. Curated study documents in ',
      paragraph1LinkLabel: 'Study Materials',
      paragraph1Trail:
        ' are served directly from the same origin as PSC Nepal.',
      paragraph2:
        'PSC Nepal loads web typography (Fraunces, Plus Jakarta Sans, Noto Sans Devanagari, and JetBrains Mono) from Google Fonts to ensure legible Devanagari, serif, and tabular numeric rendering.',
    },
    cookiesAnalytics: {
      heading: '4. Cookies, Analytics & Advertising',
      body: 'PSC Nepal does not set advertising cookies, cross-site tracking pixels, or behavioral profiling scripts. Page-turn sound effects are synthesized locally via the browser’s Web Audio API.',
    },
    manageData: {
      heading: '5. Manage or Erase Your Workspace Data',
      lead: 'You have direct, immediate control over your saved study records, and you can inspect your full study breakdown anytime on the ',
      progressLinkLabel: 'Progress',
      trail: ' page.',
    },
  },
} as const;

export const PRIVACY_STORAGE_KEY_DESCRIPTIONS = [
  {
    keyName: STORAGE_KEYS.SETTINGS,
    purpose:
      'Stores your preferred Light/Dark appearance, Flipbook vs Standard PDF default, and page-turn audio setting.',
    countType: 'settings' as const,
  },
  {
    keyName: STORAGE_KEYS.RECENT_BOOKS,
    purpose:
      'Stores metadata for up to 12 recently opened documents (local blob URLs are stripped prior to saving).',
    countType: 'recentBooks' as const,
  },
  {
    keyName: STORAGE_KEYS.READING_PROGRESS,
    purpose:
      'Remembers your last-read page and total page count per document ID so you can resume seamlessly.',
    countType: 'readingProgress' as const,
  },
  {
    keyName: STORAGE_KEYS.READING_STATS,
    purpose:
      'Logs active reading seconds, pages turned, unique pages visited, and pages-per-minute pace.',
    countType: 'readingStats' as const,
  },
  {
    keyName: STORAGE_KEYS.QUIZ_STATE,
    purpose:
      'Stores your preferred quiz mode and up to 30 timed PSC quiz attempts with per-question outcomes.',
    countType: 'quizAttempts' as const,
  },
  {
    keyName: STORAGE_KEYS.WRITTEN_STATE,
    purpose:
      'Stores preferred bilingual language view (EN/नेपाली), local answer drafts, rubric checkmarks, and written question mastery.',
    countType: 'writtenRecords' as const,
  },
  {
    keyName: STORAGE_KEYS.PSC_PREP_STATE,
    purpose:
      'Stores your active target PSC cadre, checked syllabus units and topics, bookmarked units, and OMR/written simulation runs.',
    countType: 'pscPrep' as const,
  },
  {
    keyName: STORAGE_KEYS.CONTACT_INQUIRIES,
    purpose:
      'Stores optional inquiry or question errata notes submitted on the Contact page.',
    countType: 'inquiries' as const,
  },
] as const;

export const TERMS_OF_SERVICE_CONTENT = {
  breadcrumbLabel: 'Terms of Service',
  title: 'Terms of Service',
  lastUpdatedLabel: `Last Updated: ${SITE_CONFIG.legalEffectiveDate}`,
  subtitle: 'Educational Study & Reader Workspace Terms',
  intro:
    'By accessing or using PSC Nepal—including its official syllabus tracker, OMR and written exam simulator, PDF flipbook and continuous reader, curated statutory digests, timed mock quizzes, and study progress dashboard—you agree to the following terms of use.',
  sections: {
    purpose: {
      heading: '1. Purpose & Independent Educational Disclaimer',
      paragraph1Lead:
        'PSC Nepal is an independent competitive examination self-study and digital document reading platform. It is ',
      paragraph1Strong: 'not affiliated with, endorsed by, or operated by',
      paragraph1Mid: ' the Public Service Commission of Nepal (',
      paragraph1Em: 'Lok Sewa Aayog',
      paragraph1Trail:
        '), the Nepal Law Commission, the National Planning Commission, or any federal, provincial, or local government body.',
      paragraph2Lead:
        'Curated summaries, statutory digests, and practice questions are prepared strictly for educational revision. Examination candidates should always verify statutory amendments, official notices, and syllabi against authentic publications in the ',
      paragraph2Em: 'Nepal Gazette',
      paragraph2Trail: ' and official commission portals.',
    },
    scoring: {
      heading: '2. Timed Quizzes & Scoring Rules',
      paragraph2Lead:
        'Mock scores, accuracy percentages, and subject mastery metrics displayed on the ',
      paragraph2LinkLabel: 'Progress',
      paragraph2Trail:
        ' page are self-assessment indicators only and do not represent official examination standing.',
    },
    acceptableUse: {
      heading: '3. User-Supplied PDFs & Acceptable Use',
      paragraph1:
        'PSC Nepal allows you to open local PDF files from your device or load publicly accessible HTTPS PDF links. You are solely responsible for ensuring you have the lawful right or license to view any third-party documents you open in the workspace.',
      paragraph2:
        'You agree not to misuse the application, attempt to disrupt client-side rendering, or redistribute proprietary content without authorization from its respective copyright holder.',
    },
    persistence: {
      heading: '4. Study Progress & Data Persistence',
      lead: 'Your study progress, quiz attempts, flagged questions, and reading positions are summarized on the ',
      linkLabel: 'Progress',
      trail:
        ' page. Signing in with your account preserves your preparation history and preferences across devices.',
    },
    disclaimer: {
      heading: '5. Warranty Disclaimer & Limitation of Liability',
      lead: 'PSC Nepal and all accompanying study materials and question banks are provided on an “as is” and “as available” basis without warranties of any kind, express or implied. While every effort is made to maintain factual and statutory accuracy, typographical or legislative changes may occur. If you spot an error in any question or reference PDF, please report it via our ',
      linkLabel: 'Contact & Errata form',
      trail: '.',
    },
  },
} as const;

export const NOT_FOUND_CONTENT = {
  code: '404',
  title: 'Page not found',
  description:
    'The syllabus, question set, or document link you requested was not found on PSC Nepal. Return to the main hub or browse curated study materials.',
  primaryCtaLabel: 'Return Home',
  primaryCtaTo: '/',
  secondaryCtaLabel: 'Study Materials',
  secondaryCtaTo: '/materials',
} as const;
