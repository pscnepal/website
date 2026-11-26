import type {
  DashboardAccentColor,
  DashboardModuleConfig,
  SiteDashboardTab,
  SiteNavLinkItem,
} from '../types/dashboard';

export type {
  DashboardAccentColor,
  DashboardModuleConfig,
  SiteDashboardTab,
  SiteNavLinkItem,
};

export const SITE_CONFIG = {
  brandName: 'PSC Nepal',
  brandNepaliName: 'लोक सेवा आयोग (Lok Sewa Aayog)',
  workspaceLabel: 'Unified Study & Exam Workspace',
  commandConsoleLabel: 'Command Dashboard',
  tagline:
    'Section Officer · Nayab Subba · Kharidar · NTC Computer Engineer (L7)',
  footerDescription:
    'Central Nepal PSC (Lok Sewa) preparation workspace combining official curricula, two-page PDF study volumes, timed MCQ drills, bilingual written Q&A (EN/नेपाली), and OMR exam hall simulations.',
  copyrightSubtitle: 'Independent Lok Sewa study & exam preparation platform.',
  supportEmail: 'info.pscnepal@gmail.com',
  siteUrl: 'https://pscnepal.pages.dev',
  ogImagePath: '/og-psc-nepal.svg',
  academicSession: '२०८१/८२ Session',
  academicSessionYear: '२०८१/८२',
  legalEffectiveDate: 'November 2026',
  defaultSeoTitle: 'PSC Nepal | Lok Sewa Syllabus, Mock Exams & Study Hub',
  defaultSeoDescription:
    'Prepare for Nepal Lok Sewa Aayog exams on PSC Nepal with official syllabi, OMR & written simulations, timed MCQs, bilingual answers, and PDF flipbooks.',
} as const;

export const DESKTOP_NAV_ITEMS: ReadonlyArray<SiteNavLinkItem> = [
  { to: '/dashboard', label: 'Dashboard', end: false },
  { to: '/syllabus', label: 'Syllabus', end: false },
  { to: '/calendar', label: 'Calendar', end: false },
  { to: '/current-affairs', label: 'Affairs', end: false },
  { to: '/materials', label: 'Materials', end: false },
  { to: '/quiz', label: 'Quiz', end: false },
  { to: '/written', label: 'Written', end: false },
  { to: '/leaderboard', label: 'Leaderboard', end: false },
];

export const MOBILE_NAV_ITEMS: ReadonlyArray<SiteNavLinkItem> = [
  { to: '/dashboard', label: 'Dashboard & Banks', end: false },
  { to: '/calendar', label: 'PSC Calendar & Notices (कार्यतालिका)', end: false },
  { to: '/current-affairs', label: 'Current Affairs (समसामयिक)', end: false },
  { to: '/syllabus', label: 'PSC Syllabus', end: false },
  { to: '/materials', label: 'Study Materials', end: false },
  { to: '/quiz', label: 'Objective Quiz', end: false },
  { to: '/written', label: 'Written Q&A (EN/ने)', end: false },
  { to: '/leaderboard', label: 'Public Leaderboard (अग्रस्थान)', end: false },
  { to: '/evaluator', label: 'Answer Evaluator (रुब्रिक मूल्याङ्कन)', end: false },
  { to: '/pyq', label: 'Past Questions & PYQ (विगतका प्रश्न)', end: false },
  { to: '/flashcards', label: 'Flashcards & Memory (स्मरण कार्ड)', end: false },
  { to: '/progress', label: 'Study Progress', end: false },
  { to: '/library', label: 'Personal Library', end: false },
  { to: '/read', label: 'PDF Flipbook Reader', end: false },
  { to: '/about', label: 'About PSC Nepal', end: false },
];

export const FOOTER_STUDY_LINKS: ReadonlyArray<SiteNavLinkItem> = [
  { to: '/dashboard', label: 'Dashboard & Banks' },
  { to: '/syllabus', label: 'PSC Syllabus' },
  { to: '/simulate', label: 'Exam Simulator' },
  { to: '/materials', label: 'Study Materials' },
  { to: '/quiz', label: 'Objective Quizzes' },
  { to: '/written', label: 'Written Q&A (EN/ने)' },
  { to: '/leaderboard', label: 'Public Leaderboard' },
  { to: '/current-affairs', label: 'समसामयिक (Affairs)' },
  { to: '/calendar', label: 'कार्यतालिका (Calendar)' },
  { to: '/pyq', label: 'विगतका प्रश्न (PYQ)' },
  { to: '/flashcards', label: 'स्मरण कार्ड (Flashcards)' },
  { to: '/evaluator', label: 'उत्तर मूल्याङ्कन (Evaluator)' },
  { to: '/progress', label: 'Progress Tracker' },
  { to: '/library', label: 'Personal Library' },
  { to: '/read', label: 'PDF Reader' },
];

export const FOOTER_LEGAL_LINKS: ReadonlyArray<SiteNavLinkItem> = [
  { to: '/about', label: 'About PSC Nepal' },
  { to: '/contact', label: 'Contact & Errata' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
];

export const INTERNAL_ROUTE_PREFIXES: ReadonlyArray<string> = [
  '/dashboard',
  '/syllabus',
  '/calendar',
  '/notices',
  '/current-affairs',
  '/materials',
  '/quiz',
  '/written',
  '/evaluator',
  '/pyq',
  '/flashcards',
  '/leaderboard',
  '/simulate',
  '/progress',
  '/library',
  '/read',
  '/features',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
];

export const DASHBOARD_NAV_MODULES: ReadonlyArray<DashboardModuleConfig> = [
  {
    id: 'overview',
    path: '/dashboard',
    label: 'Executive Overview',
    quickActionLabel: 'Executive Overview',
    category: 'Console',
    title: 'Executive Overview',
    subtitle: 'System metrics, preparation KPIs & daily progress',
    description: 'KPI summary, progress tracker & analytics',
    quickDescription: 'System KPIs & analytics overview',
    seoTitle: 'PSC Nepal Command Dashboard | Lok Sewa Prep Central',
    seoDescription:
      'Access your comprehensive PSC Nepal command dashboard: track syllabus coverage, question banks, aspirant cohort activity, and study backups.',
    seoBreadcrumb: 'Command Dashboard',
    color: 'blue',
  },
  {
    id: 'quiz-bank',
    path: '/dashboard/quiz-bank',
    label: 'MCQ Question Bank',
    quickActionLabel: 'MCQ Question Bank',
    category: 'Question Banks',
    title: 'Objective Question Bank',
    subtitle: 'Official PSC preliminary MCQs, explanations & references',
    description: 'Stage I Objective questions database',
    quickDescription: 'Inspect verified preliminary items',
    seoTitle: `Lok Sewa MCQ Question Bank | ${SITE_CONFIG.brandName}`,
    seoDescription:
      'Browse, filter, and search verified Nepal Lok Sewa Paper I MCQs across General Knowledge, IQ, and Public Administration with answers.',
    seoBreadcrumb: 'MCQ Question Bank',
    color: 'emerald',
  },
  {
    id: 'flagged',
    path: '/dashboard/flagged',
    label: 'Flagged Reports',
    quickActionLabel: 'User Flag Reports',
    category: 'Question Banks',
    title: 'User Flag Reports',
    subtitle: 'Question flags, total counts & reasons submitted by aspirants',
    description: 'Questions & reasons flagged by registered users',
    quickDescription: 'User-submitted flags & reasons',
    seoTitle: `User Flag Reports | ${SITE_CONFIG.brandName}`,
    seoDescription:
      'Review flagged Lok Sewa quiz and written questions along with candidate reasons and errata reports.',
    seoBreadcrumb: 'User Flag Reports',
    color: 'amber',
  },
  {
    id: 'written-bank',
    path: '/dashboard/written-bank',
    label: 'Written Question Bank',
    quickActionLabel: 'Written Question Bank',
    category: 'Question Banks',
    title: 'Subjective Written Bank',
    subtitle: 'Phase II analytical questions, rubrics & model answers',
    description: 'Stage II Subjective cases & model solutions',
    quickDescription: 'Subjective papers & model rubrics',
    seoTitle: `Lok Sewa Written Question Bank | ${SITE_CONFIG.brandName}`,
    seoDescription:
      'Explore subjective written exam questions for Nepal Lok Sewa Papers II–IV with bilingual model answers, rubrics, and marking schemes.',
    seoBreadcrumb: 'Written Question Bank',
    color: 'crimson',
  },
  {
    id: 'materials',
    path: '/dashboard/materials',
    label: 'Materials Inventory',
    quickActionLabel: 'Materials Inventory',
    category: 'Official Archives',
    title: 'Study Materials & Parichaya Archives',
    subtitle: '19 volumes of Nepal Parichaya, Constitution & core statutes',
    description: 'Parichaya editions, Constitution & statutes',
    quickDescription: 'Official reference documents & PDFs',
    seoTitle: `Lok Sewa Materials & Syllabus Inventory | ${SITE_CONFIG.brandName}`,
    seoDescription:
      'Audit and manage Lok Sewa curriculum units, official PSC gazette PDFs, Nepal Parichaya documents, and bilingual preparation flipbooks.',
    seoBreadcrumb: 'Materials Inventory',
    color: 'blue',
  },
  {
    id: 'users',
    path: '/dashboard/users',
    label: 'Aspirants Cohort',
    quickActionLabel: 'Aspirants Cohort',
    category: 'Directory',
    title: 'Aspirants Directory',
    subtitle: 'Candidate cohorts, target cadres & preparation profiles',
    description: 'Live Firestore user directory & quiz telemetry',
    quickDescription: 'Directory & candidate dossiers',
    seoTitle: `Aspirants Community & Study Cohort | ${SITE_CONFIG.brandName}`,
    seoDescription:
      'Connect with fellow Nepal Lok Sewa and public enterprise aspirants across all 7 provinces preparing for Section Officer, Nayab Subba, Kharidar, and NTC Computer Engineer (Level 7) examinations.',
    seoBreadcrumb: 'Aspirants Cohort',
    color: 'purple',
    dividerBefore: true,
  },
  {
    id: 'inquiries',
    path: '/dashboard/inquiries',
    label: 'Contact & Errata Inbox',
    quickActionLabel: 'Contact & Errata Inbox',
    category: 'Directory',
    title: 'Contact & Errata Inbox',
    subtitle: 'Candidate errata reports, material requests & official replies',
    description: 'Triage support tickets and reply via Firestore',
    quickDescription: 'Triage support & errata tickets',
    seoTitle: `Contact & Errata Inbox | ${SITE_CONFIG.brandName}`,
    seoDescription:
      'Manage candidate contact inquiries, question bank errata reports, and reading material requests in real time.',
    seoBreadcrumb: 'Contact & Errata Inbox',
    color: 'amber',
  },
  {
    id: 'data',
    path: '/dashboard/data',
    label: 'Data & Backup',
    quickActionLabel: 'Data Backup & Export',
    category: 'System',
    title: 'Data, Backup & Export',
    subtitle: 'Manage workspace data, exports & backups',
    description: 'Export, import & manage workspace backups',
    quickDescription: 'Export study state & statistics',
    seoTitle: `Study Data Backup & Sync Hub | ${SITE_CONFIG.brandName}`,
    seoDescription:
      'Export, import, and back up your Lok Sewa mock exam scores, written answer submissions, and syllabus checklist progress safely in JSON format.',
    seoBreadcrumb: 'Data Backup & Sync',
    color: 'zinc',
  },
];

export const DASHBOARD_TAB_META: Record<SiteDashboardTab, DashboardModuleConfig> =
  DASHBOARD_NAV_MODULES.reduce(
    (acc, mod) => {
      acc[mod.id] = mod;
      return acc;
    },
    {} as Record<SiteDashboardTab, DashboardModuleConfig>
  );

export const AUTH_GATE_DEFAULTS = {
  description:
    'All study materials, syllabus guides, and quiz decks are free to browse publicly. Sign in with Google to start taking this timed quiz.',
  benefits: [
    'Reverse countdown begins only after you sign in',
    'Tracks PSC net scores & attempt history to your account',
  ],
  actionLabel: 'Continue with Google to Start',
} as const;

export const QUICK_FLAG_REASONS = [
  'Needs revision / difficult concept',
  'Suspected wrong answer key',
  'Unclear wording or translation error',
  'Outdated statutory or GK data',
  'Duplicate or formatting issue',
] as const;
