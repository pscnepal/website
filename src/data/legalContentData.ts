import { STORAGE_KEYS } from '../services/storageService';
import { SITE_CONFIG } from './siteConfig';

export const PRIVACY_POLICY_CONTENT = {
  breadcrumbLabel: 'Privacy Policy',
  title: 'Privacy Policy',
  effectiveDateLabel: `Effective Date: ${SITE_CONFIG.legalEffectiveDate}`,
  subtitle: 'Data Protection, Cloud Sync & Local Privacy Controls',
  intro:
    'PSC Nepal respects your privacy while keeping your Lok Sewa Aayog preparation organized across sessions and devices. Signed-in aspirants sync profile preferences, quiz attempts, OMR simulations, written answer evaluations, flashcards, and errata flags securely to their account, while personal PDF files opened from your device stay strictly inside your browser session.',
  highlights: [
    {
      label: 'Local PDF Rendering',
      value: '0 Bytes Uploaded',
      detail: 'Your device PDFs render in-browser via Web Workers and never leave your computer or phone.',
    },
    {
      label: 'Cloud Account Isolation',
      value: 'UID-Scoped Rules',
      detail: 'Signed-in study history is isolated per verified Google account using Firestore Security Rules.',
    },
    {
      label: 'Analytics & Ads',
      value: 'Google Tags',
      detail: 'Aggregate traffic measurement via Google Analytics and policy-compliant Google AdSense / Ads support when enabled.',
    },
  ],
  tableOfContents: [
    { id: 'privacy-pdf', label: '1. Local PDFs' },
    { id: 'privacy-auth', label: '2. Google Sign-In' },
    { id: 'privacy-firestore', label: '3. Cloud Firestore Sync' },
    { id: 'privacy-storage', label: '4. Local Storage Inventory' },
    { id: 'privacy-remote', label: '5. Remote Links & Portals' },
    { id: 'privacy-cookies', label: '6. Cookies & Audio' },
    { id: 'privacy-rights', label: '7. Retention & Erasure' },
    { id: 'privacy-eligibility', label: '8. Eligibility & Contact' },
  ],
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
        ' object URLs exist strictly for your active browser tab session and are automatically revoked when you close or reload the tab. Your private books, notes, and scanned study volumes are never transmitted to PSC Nepal servers or Firebase Storage.',
      paragraph3:
        'Only lightweight document metadata (file title, page count, and your last-read page number) is stored locally so you can locate recent titles on your shelf.',
    },
    googleAuth: {
      heading: '2. Google Sign-In & Firebase Authentication Data',
      paragraph1:
        'All syllabi, current affairs briefs, study materials, flashcards, and written question references are free to browse without creating an account. When you voluntarily choose to start a timed quiz, submit an errata report, or sync progress across devices, authentication is handled through Google Sign-In via Firebase Authentication.',
      bullets: [
        {
          title: 'Account Identifiers Received',
          detail:
            'Your Firebase User ID (UID), verified email address, display name, and Google profile avatar URL (if configured on your Google account).',
        },
        {
          title: 'No Password Handling',
          detail:
            'PSC Nepal never collects, views, or stores your Google account password. OAuth tokens are managed directly by Google and Firebase Authentication.',
        },
        {
          title: 'Candidate Profile Fields',
          detail:
            'You may optionally configure your target PSC/NTC cadre (e.g., Section Officer, Nayab Subba, Kharidar, NTC Computer Engineer Level 7), preferred exam track, and study preferences inside your profile.',
        },
      ],
    },
    cloudFirestore: {
      heading: '3. Cloud Firestore Sync, Ownership & Role Isolation',
      paragraph1:
        'For signed-in candidates with a verified email, PSC Nepal stores preparation records in Cloud Firestore so your progress follows you across browsers and mobile devices:',
      bullets: [
        {
          title: 'Private Candidate Collections',
          detail:
            'Quiz attempt records, OMR & written hall simulation runs, Paper II–IV self-evaluations, syllabus unit checkmarks, Leitner flashcard intervals, PYQ/current affairs bookmarks, exam checklists, flagged questions, and personal reaction states are scoped strictly to your authenticated UID.',
        },
        {
          title: 'Public Aggregate Counters & Opt-In Leaderboard',
          detail:
            'Anonymized view/helpful counters, admin-verified question banks, and public aspirant leaderboard summaries (strictly display name, avatar, target cadre, and aggregate Reading/Written/Quiz quantities) never expose emails, phone numbers, or private written drafts. Signed-in candidates can hide their public leaderboard profile anytime via the Public Profile switch.',
        },
        {
          title: 'Contact & Errata Submissions',
          detail:
            'When you submit a message or question errata report on the Contact page, your submitted message, category, and reply status are visible only to you and verified platform administrators for resolution.',
        },
        {
          title: 'Editorial / Admin Operations',
          detail:
            'Authorized administrators managing question banks (including bulk CSV/JSON imports and errata moderation) authenticate via verified admin role rules enforced at the database layer.',
        },
      ],
    },
    savedRecords: {
      heading: '4. Complete Local Browser Storage & IndexedDB Inventory',
      description:
        'To keep your workspace fast and accessible offline—even before signing in—PSC Nepal stores structured workspace keys in localStorage alongside a durable IndexedDB cache (psc_nepal_offline_v1) for quiz banks, study materials, cached PDF binaries, and user progress snapshots:',
    },
    remotePdfLinks: {
      heading: '5. Remote PDF Requests, Government Portals & Fonts',
      paragraph1Lead:
        'When you paste a remote HTTPS PDF link into the URL reader or click an official government reference link in ',
      paragraph1LinkLabel: 'Study Materials',
      paragraph1Trail:
        ' or Current Affairs (such as psc.gov.np, lawcommission.gov.np, npc.gov.np, mof.gov.np, or nrb.org.np), your browser connects directly to that external host. External websites log standard HTTP metadata (IP address, browser User-Agent, and referrer policy) under their own privacy notices.',
      paragraph2:
        'Curated statutory PDFs hosted on PSC Nepal are served directly from the application origin. PSC Nepal also loads web typography (Fraunces, Plus Jakarta Sans, Noto Sans Devanagari, and JetBrains Mono) via Google Fonts for clear English and Devanagari rendering.',
    },
    cookiesAnalytics: {
      heading: '6. Cookies, Google Analytics, Advertising & Web Audio',
      body: 'PSC Nepal uses Google Analytics (GA4) to measure aggregate page views and study feature usage without transmitting personal exam drafts or account passwords. When Google AdSense or Google Ads is enabled, Google and third-party vendors may use cookies to serve ads based on prior visits to this or other websites; users can manage or opt out of personalized advertising via Google Ad Settings (adssettings.google.com) and review how Google uses information from partner sites at policies.google.com/technologies/partner-sites. Essential browser storage remains strictly for Firebase Authentication session persistence and your local study preferences, while page-turn sound effects in the flipbook reader are synthesized completely offline via the Web Audio API.',
    },
    retentionAndRights: {
      heading: '7. Data Retention, Portable Exports & Deletion Controls',
      bullets: [
        {
          title: 'Export Your Data Anytime',
          detail:
            'You can download a complete JSON snapshot of your preparation history, drafts, quiz attempts, flashcards, and simulation runs from the Dashboard Data & Backup tab, and admins can export full question banks as UTF-8 CSV or JSON.',
        },
        {
          title: 'Immediate Local Wipe',
          detail:
            'Use the granular clear controls in Section 9 below to erase individual categories (reading history, quiz attempts, written drafts/evaluations, flashcards/bookmarks, or syllabus checklists) from your browser immediately.',
        },
        {
          title: 'Cloud Account & Record Deletion',
          detail:
            'Signed-in users can clear cloud-synced flagged questions directly or request complete removal of their Cloud Firestore profile, quiz logs, and inquiry tickets by contacting the support desk from their registered email.',
        },
      ],
    },
    eligibilityAndChanges: {
      heading: '8. Candidate Eligibility, Policy Updates & Contact',
      paragraph1:
        'PSC Nepal is designed for civil service examination candidates and adult learners preparing for Nepal Lok Sewa Aayog examinations. We do not knowingly solicit personal data from children under 16 years of age; if such information is inadvertently submitted, please contact us for prompt deletion.',
      paragraph2:
        'We may revise this Privacy Policy when introducing new study modules, Firestore collections, or security controls. Material updates are reflected by the Effective Date shown at the top of this page.',
    },
    manageData: {
      heading: '9. Manage or Erase Your Workspace Data',
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
      'Stores Light/Dark theme appearance, Flipbook vs Standard PDF mode default, and Web Audio page-turn sound preference.',
    countType: 'settings' as const,
  },
  {
    keyName: STORAGE_KEYS.RECENT_BOOKS,
    purpose:
      'Stores title and page metadata for up to 12 recently opened documents (temporary local blob URLs are stripped prior to saving).',
    countType: 'recentBooks' as const,
  },
  {
    keyName: STORAGE_KEYS.READING_PROGRESS,
    purpose:
      'Remembers your last-read page number and total page count per document ID so PDFs reopen right where you stopped.',
    countType: 'readingProgress' as const,
  },
  {
    keyName: STORAGE_KEYS.READING_STATS,
    purpose:
      'Logs active reading seconds, pages turned, unique pages visited, and average pages-per-minute study pace.',
    countType: 'readingStats' as const,
  },
  {
    keyName: STORAGE_KEYS.QUIZ_STATE,
    purpose:
      'Stores preferred Exam vs Study quiz mode and up to 30 timed PSC quiz attempts with per-question outcomes and net scores.',
    countType: 'quizAttempts' as const,
  },
  {
    keyName: STORAGE_KEYS.WRITTEN_STATE,
    purpose:
      'Stores preferred bilingual answer language (EN/नेपाली/Bilingual), written drafts, rubric checkmarks, and mastery status.',
    countType: 'writtenRecords' as const,
  },
  {
    keyName: STORAGE_KEYS.WRITTEN_EVALUATIONS,
    purpose:
      'Stores self-evaluated Paper II–IV answer scores across Introduction, Core Analysis, Statutes, and Conclusion rubrics.',
    countType: 'writtenEvaluations' as const,
  },
  {
    keyName: STORAGE_KEYS.PSC_PREP_STATE,
    purpose:
      'Stores active target PSC cadre, checked syllabus units/topics, unit bookmarks, and OMR/written hall simulation history.',
    countType: 'pscPrep' as const,
  },
  {
    keyName: STORAGE_KEYS.FLASHCARD_PROGRESS,
    purpose:
      'Stores Leitner 3-box spaced repetition levels, review counts, and last-reviewed timestamps for memory flashcards.',
    countType: 'flashcards' as const,
  },
  {
    keyName: `${STORAGE_KEYS.PYQ_BOOKMARKS} / ${STORAGE_KEYS.AFFAIR_BOOKMARKS} / ${STORAGE_KEYS.EXAM_CHECKLIST}`,
    purpose:
      'Stores saved Past-Year Question (PYQ) bookmarks, Current Affairs bookmarks, and Exam Hall readiness checklists.',
    countType: 'bookmarksChecklist' as const,
  },
  {
    keyName: `${STORAGE_KEYS.FLAGGED_QUESTIONS} / ${STORAGE_KEYS.REACTIONS}`,
    purpose:
      'Stores your personal question errata flags and cloud-synced helpful/like reaction and view records.',
    countType: 'flagsReactions' as const,
  },
  {
    keyName: 'psc_nepal_daily_quiz_v1',
    purpose:
      'Stores your daily 5-question Current Affairs widget rotation, selected options, and completion streak state.',
    countType: 'dailyWidget' as const,
  },
  {
    keyName: STORAGE_KEYS.CONTACT_INQUIRIES,
    purpose:
      'Stores local copies of contact inquiries, material requests, and question errata notes submitted on the Contact page.',
    countType: 'inquiries' as const,
  },
] as const;

export const TERMS_OF_SERVICE_CONTENT = {
  breadcrumbLabel: 'Terms of Service',
  title: 'Terms of Service',
  lastUpdatedLabel: `Last Updated: ${SITE_CONFIG.legalEffectiveDate}`,
  subtitle: 'Educational Study, Exam Simulation & Reader Workspace Terms',
  intro:
    'By accessing or using PSC Nepal—including its official syllabus tracker, OMR and written exam hall simulator, Paper II–IV answer evaluator, current affairs digests, Leitner flashcards, PDF flipbook reader, curated statutory library, and timed mock quizzes—you agree to the following terms of use.',
  highlights: [
    {
      label: 'Affiliation Status',
      value: 'Independent Platform',
      detail: 'Not affiliated with Lok Sewa Aayog or any Government of Nepal authority.',
    },
    {
      label: 'Primary Authoritative Source',
      value: 'Nepal Gazette & psc.gov.np',
      detail: 'Always cross-verify statutes, notices, and exam dates against official portals.',
    },
    {
      label: 'Permitted Usage',
      value: 'Personal Self-Study',
      detail: 'Free for individual preparation; commercial scraping or resale of banks is prohibited.',
    },
  ],
  tableOfContents: [
    { id: 'terms-purpose', label: '1. Independence & Scope' },
    { id: 'terms-accounts', label: '2. Accounts & Roles' },
    { id: 'terms-scoring', label: '3. Quizzes & OMR Rules' },
    { id: 'terms-written', label: '4. Written & Current Affairs' },
    { id: 'terms-pdfs', label: '5. User PDFs & Conduct' },
    { id: 'terms-ip', label: '6. Public Sources & IP' },
    { id: 'terms-exports', label: '7. CSV/JSON Fair Use' },
    { id: 'terms-errata', label: '8. Errata & Feedback' },
    { id: 'terms-availability', label: '9. Sync & Modifications' },
    { id: 'terms-liability', label: '10. Liability & Law' },
  ],
  sections: {
    purpose: {
      heading: '1. Purpose & Independent Educational Disclaimer',
      paragraph1Lead:
        'PSC Nepal is an independent competitive examination self-study and digital document reading platform. It is ',
      paragraph1Strong: 'not affiliated with, endorsed by, or operated by',
      paragraph1Mid: ' the Public Service Commission of Nepal (',
      paragraph1Em: 'Lok Sewa Aayog',
      paragraph1Trail:
        '), the Nepal Law Commission, the National Planning Commission, Nepal Rastra Bank, or any federal, provincial, or local government agency.',
      paragraph2Lead:
        'Curated syllabus maps, statutory digests, current affairs briefs, and practice questions are prepared strictly for educational revision. Candidates must always verify latest amendments, vacancy deadlines, syllabus revisions, and exam centers against authentic notices in the ',
      paragraph2Em: 'Nepal Gazette',
      paragraph2Trail: ' and official portals (such as psc.gov.np).',
    },
    accounts: {
      heading: '2. Candidate Accounts, Google Sign-In & Role Permissions',
      paragraph1:
        'Browsing study materials, syllabus outlines, and reading PDFs requires no login. Timed quiz sessions and cloud synchronization require signing in with a valid, email-verified Google account.',
      bullets: [
        'You are responsible for maintaining control of the Google account you use to access PSC Nepal and for all progress or inquiry activity recorded under it.',
        'Candidate accounts are intended for individual self-study only and may not be shared as automated bots or bulk scraping accounts.',
        'Administrative privileges for editing question banks, resolving flagged errata, or uploading official materials are restricted exclusively to verified platform maintainers.',
      ],
    },
    scoring: {
      heading: '3. Timed Quizzes, OMR Negative Marking & Simulator Rules',
      paragraph2Lead:
        'Mock scores, accuracy percentages, OMR percentile projections, and subject mastery metrics displayed on the ',
      paragraph2LinkLabel: 'Progress',
      paragraph2Trail:
        ' page are self-assessment indicators only and carry zero official examination weight or guarantee of selection.',
    },
    writtenAndAffairs: {
      heading: '4. Written Answer Evaluator, Flashcards & Current Affairs',
      paragraph1:
        'Bilingual (English and Nepali) Paper II, III, and IV model solutions, 5-mark and 10-mark analytical structures, and self-scoring rubrics on the Written Q&A and Answer Evaluator pages illustrate standard Lok Sewa presentation practices. Real commission examiners retain complete discretion over answer evaluation.',
      paragraph2:
        'Current Affairs (Daily, Weekly, and Monthly digests) and Economic Survey highlights are compiled from publicly available government publications and news summaries for academic revision and may become superseded by subsequent policy or statutory announcements.',
    },
    acceptableUse: {
      heading: '5. User-Supplied PDFs & Acceptable Use',
      paragraph1:
        'PSC Nepal allows you to open local PDF files from your device or load publicly accessible HTTPS PDF links. You are solely responsible for ensuring you possess the lawful right or license to view any third-party document loaded into your reader workspace.',
      paragraph2:
        'You agree not to misuse the platform, attempt to bypass Firestore security rules, probe or overload authentication/database endpoints, upload malicious payloads, or disrupt client-side rendering for other learners.',
    },
    intellectualProperty: {
      heading: '6. Public-Domain Government Sources & Intellectual Property',
      paragraph1:
        'Official Nepali statutory texts, constitutional provisions, Nepal Parichaya volumes, Economic Surveys, and official commission syllabi reproduced or linked in Study Materials remain public-domain Government of Nepal or originating agency publications.',
      paragraph2:
        'PSC Nepal’s platform source code, interface design, curated bilingual question explanations, original rubric breakdowns, and compiled mock decks are protected for personal non-commercial educational use.',
    },
    exportsAndCsv: {
      heading: '7. Data Exports, CSV/JSON Backups & Fair-Use Licensing',
      paragraph1:
        'Candidates may freely export their own preparation records, quiz history, and written drafts in JSON format for personal archival or cross-device migration. Authorized editors using CSV/JSON question bank exports must maintain source attribution and statutory accuracy.',
      paragraph2:
        'Automated scraping, republishing, repackaging, or commercial resale of curated PSC Nepal question banks, bilingual rationales, or study decks as a competing paid database is strictly prohibited without prior written consent.',
    },
    errataAndFeedback: {
      heading: '8. Errata Reports, Question Flags & Community Feedback',
      paragraph1:
        'When you flag a question, report a translation or answer-key discrepancy, or submit a request via the Contact & Errata desk, you grant PSC Nepal a non-exclusive, royalty-free right to review and incorporate corrections into the shared question bank to improve accuracy for all aspirants.',
    },
    persistence: {
      heading: '9. Study Progress Sync, Service Availability & Modifications',
      lead: 'Your study progress, quiz attempts, flagged questions, and reading positions are summarized on the ',
      linkLabel: 'Progress',
      trail:
        ' page. We strive for continuous availability, but may temporarily suspend features, update question banks to reflect new Nepal laws, enforce storage/rate limits, or revoke access for accounts violating these Terms.',
    },
    disclaimer: {
      heading: '10. Warranty Disclaimer, Liability & Governing Law',
      lead: 'PSC Nepal and all accompanying study materials, timelines, and question banks are provided on an “as is” and “as available” basis without warranties of any kind, express or implied, including fitness for a particular examination outcome. To the maximum extent permitted under the laws of Nepal (with exclusive venue in Kathmandu, Nepal), PSC Nepal and its maintainers shall not be liable for any indirect, incidental, or exam-related loss arising from use of the workspace. If you spot an error in any question, date, or statute, please report it via our ',
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
