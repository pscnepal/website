export interface HomePillarDefinition {
  id: string;
  order: string;
  to: string;
  title: string;
  description: string;
  spanWide?: boolean;
  metaTag?: string;
  ctaLabel?: string;
}

export interface StudyTrackItem {
  id: string;
  code: string;
  title: string;
  summary: string;
  syllabusHref: string;
  readHref: string;
  readLabel: string;
  quizHref: string;
  quizLabel: string;
  writtenHref: string;
  writtenLabel: string;
}

export interface HomeFaqItem {
  id: string;
  question: string;
  answerLead: string;
  /** Used for plain-text Schema.org FAQPage JSON-LD so SEO & visible FAQ share exact wording */
  getPlainAnswer: (counts: {
    totalSyllabusUnits: number;
    totalWrittenQuestions: number;
  }) => string;
}

export const HOME_HERO_CONTENT = {
  headline: 'Your central command hub for Lok Sewa PSC preparation.',
  lead: 'Track official Section Officer, Nayab Subba, and Kharidar syllabi unit by unit, read statutes in two-page flipbooks, drill Paper I MCQs, write bilingual Papers II–IV answers (English & नेपाली), and sit timed OMR hall simulations with -20% negative marking.',
  affairsButtonLabel: 'समसामयिक (Affairs)',
  dashboardButtonLabel: 'Dashboard & Banks',
} as const;

export const HOME_HERITAGE_BANNER = {
  nepaliLocation: 'सिंहदरबार · काठमाडौँ',
  elevationLabel: 'Elevation 1,400m',
  title: 'From Preliminary Screening to Singha Durbar.',
  description:
    'The constitutional seat of the Federal Civil Service of Nepal. Master your syllabus with official past questions, legal gazettes, and timed mock simulations.',
  fallbackImagePath: '/images/nepal_singha_durbar_1793889770945.jpg',
  imageAlt:
    'Singha Durbar and snow-capped Himalayan mountain peaks, Kathmandu, Nepal',
  ctaLabel: 'Enter Exam Hall',
} as const;

export const HOME_PILLARS_HEADER = {
  title: 'Seven Integrated Preparation Pillars',
  subtitle:
    'Every syllabus unit links directly to its reference statute PDF, objective question bank, bilingual written model answer, and timed simulation hall.',
} as const;

export const HOME_PILLAR_ITEMS: ReadonlyArray<HomePillarDefinition> = [
  {
    id: 'syllabus',
    order: '01',
    to: '/syllabus',
    title: 'Official PSC Syllabus',
    description:
      'Inspect exact Stage I–III weightages and attached original Lok Sewa Aayog PDFs for Section Officer, Nayab Subba, and Kharidar.',
  },
  {
    id: 'materials',
    order: '02',
    to: '/materials',
    title: 'Study Books & Statutes',
    description:
      'Read Official PSC Syllabi, Nepal Parichaya, Constitution (2072), Civil Service, LGOA, Anti-Corruption, Procurement & 16th Plan PDFs in two-page spreads.',
  },
  {
    id: 'quiz',
    order: '03',
    to: '/quiz',
    title: 'Paper I Objective Quizzes',
    description:
      'Filter questions by subject, topic, subtopic, and difficulty with instant study explanations or 1-min/question timers.',
  },
  {
    id: 'written',
    order: '04',
    to: '/written',
    title: 'Written Papers II–IV',
    description:
      'Master 5 & 10-mark analytical questions and administrative case studies in side-by-side English and नेपाली.',
  },
  {
    id: 'simulate',
    order: '05',
    to: '/simulate',
    title: 'Exam Hall Simulator',
    description:
      'Practice shading digital OMR bubbles under -20% negative marking, sit timed subjective papers, and simulate merit math.',
  },
  {
    id: 'progress',
    order: '06',
    to: '/progress',
    title: 'Readiness & Progress',
    description:
      'Audit syllabus unit completion, weak MCQ recovery sets, written rubric progress, and cumulative study hours.',
  },
  {
    id: 'current-affairs',
    order: '07',
    to: '/current-affairs',
    title: 'समसामयिक विषयवस्तु तथा घटनाक्रम (2081/82 Feed)',
    metaTag: 'समसामयिक (Current Affairs)',
    description:
      'High-yield national and international affairs, periodic plan targets, budget outlays, and demographic indicators curated for Paper I GK and Papers II–IV written analytical bullets. Includes monthly printable digests.',
    spanWide: true,
    ctaLabel: 'Explore Feed',
  },
];

export const HOME_TRACKS_HEADER = {
  title: 'Integrated Read, Quiz & Written Study Tracks',
  subtitle:
    'Move directly from primary reference PDFs into timed objective mocks and bilingual long-answer practice.',
  ctaLabel: 'View Curriculum Checklist',
  ctaHref: '/progress',
} as const;

export const PAIRED_STUDY_TRACKS: ReadonlyArray<StudyTrackItem> = [
  {
    id: 'track-nepal',
    code: 'Track 01',
    title: 'Nepal Parichaya: Geography, History & Federalism',
    summary:
      'Study physical belts, river basins, dynasties, heritage, and federal inter-relations, then practice objective quizzes and bilingual written answers.',
    syllabusHref: '/syllabus/section-officer',
    readHref: '/materials/nepal-parichaya',
    readLabel: 'Read 4 Volumes',
    quizHref: '/quiz/nepal-parichaya',
    quizLabel: '20-Min Quiz',
    writtenHref: '/written/PSC-WR-202',
    writtenLabel: 'Written Q&A (EN/ने)',
  },
  {
    id: 'track-constitution',
    code: 'Track 02',
    title: 'Constitution (2072), Civil Service & Governance Acts',
    summary:
      'Review Fundamental Rights, Civil Service Act 2049, Right to Information, and Good Governance provisions alongside MCQs and 10-mark answers.',
    syllabusHref: '/syllabus/section-officer',
    readHref: '/materials/laws-and-acts',
    readLabel: 'Read 4 Statutes',
    quizHref: '/quiz/laws-and-constitution',
    quizLabel: '20-Min Quiz',
    writtenHref: '/written/PSC-WR-201',
    writtenLabel: 'Written Q&A (EN/ने)',
  },
  {
    id: 'track-psc-mock',
    code: 'Track 03',
    title: 'Official PSC Syllabi, Case Study & Hall Simulation',
    summary:
      'Inspect original Lok Sewa Aayog syllabus PDFs for Section Officer, Nayab Subba & Kharidar, sit a 30-question OMR screening hall exam, and solve Paper IV case studies.',
    syllabusHref: '/syllabus/section-officer',
    readHref: '/materials/official-psc-syllabi',
    readLabel: '6 Official PSC PDFs',
    quizHref: '/simulate?preset=so-phase1-omr&launch=1',
    quizLabel: 'OMR Hall Sim',
    writtenHref: '/written/PSC-WR-403',
    writtenLabel: 'Case Study (EN/ने)',
  },
  {
    id: 'track-plan-iq',
    code: 'Track 04',
    title: '16th Periodic Plan, Governance Statutes & Aptitude',
    summary:
      'Master FY 2081/82–2085/86 targets, Local Government Operation Act 2074, Anti-Corruption & Public Procurement laws, and quantitative IQ.',
    syllabusHref: '/syllabus/nayab-subba',
    readHref: '/materials/planning-and-governance-statutes',
    readLabel: 'Read Plan & Acts',
    quizHref: '/quiz/psc-and-planning',
    quizLabel: '20-Min Plan & IQ',
    writtenHref: '/written/PSC-WR-301',
    writtenLabel: '16th Plan Q&A',
  },
];

export const HOME_READER_SECTION_CONTENT = {
  title: 'Open Any Custom PDF Handout or Gazette',
  subtitle:
    'Load any external PDF URL or drop your own local Lok Sewa notes directly into the two-page flipbook reader.',
} as const;

export const HOME_FAQ_HEADER = {
  title: 'PSC Nepal & Lok Sewa Exam Rules Reference',
  subtitle:
    'Essential rules and platform coverage for Nepal Public Service Commission (लोक सेवा आयोग) candidates.',
} as const;

export const HOME_FAQS: ReadonlyArray<HomeFaqItem> = [
  {
    id: 'faq-syllabi-coverage',
    question: 'Which Nepal Lok Sewa Aayog syllabi are covered on PSC Nepal?',
    answerLead:
      'PSC Nepal covers the official Public Service Commission (Lok Sewa Aayog) non-technical curricula for Gazetted Class III Section Officer, Non-Gazetted Class I Nayab Subba, and Non-Gazetted Class II Kharidar.',
    getPlainAnswer: ({ totalSyllabusUnits }) =>
      `PSC Nepal covers the official Public Service Commission (Lok Sewa Aayog) non-technical curricula for Gazetted Class III Section Officer, Non-Gazetted Class I Nayab Subba, and Non-Gazetted Class II Kharidar across ${totalSyllabusUnits} structured syllabus units with attached original PSC PDFs.`,
  },
  {
    id: 'faq-omr-scoring',
    question:
      'How are Lok Sewa Paper I objective mock exams scored on PSC Nepal?',
    answerLead:
      'Objective OMR simulations enforce official Nepal PSC examination rules.',
    getPlainAnswer: () =>
      'Objective OMR simulations enforce official Nepal PSC rules: a strict reverse countdown timer, -20% negative marking deducted per wrong response, and a 45% qualifying pass threshold in Stage I screening (with Stage I marks treated as screening-only where prescribed by the unified scheme).',
  },
  {
    id: 'faq-bilingual-written',
    question:
      'Are written exam model answers available in both English and Nepali?',
    answerLead:
      'Yes. Structured 5-mark and 10-mark written model answers are presented side by side.',
    getPlainAnswer: ({ totalWrittenQuestions }) =>
      `Yes. PSC Nepal provides ${totalWrittenQuestions} structured 5-mark and 10-mark written Papers II–IV questions with side-by-side English and नेपाली introductions, analytical bullet points, statutory citations, and way-forward conclusions.`,
  },
];
