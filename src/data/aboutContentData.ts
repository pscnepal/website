import type { LucideIcon } from 'lucide-react';
import {
  Award,
  BookOpen,
  Compass,
  FileText,
  Layers,
  Lock,
  Scale,
  Sparkles,
} from 'lucide-react';
import type { PscCadreId } from './pscSyllabusData';
import { SITE_CONFIG } from './siteConfig';

export interface AboutMissionCard {
  id: 'mission' | 'vision';
  title: string;
  body: string;
  icon: LucideIcon;
  tone: 'blue' | 'crimson';
}

export interface AboutPlatformPillar {
  id: string;
  title: string;
  description: string;
  linkLabel: string;
  to: string;
  icon: LucideIcon;
  tone: 'blue' | 'crimson' | 'emerald' | 'purple' | 'amber' | 'teal';
}

export interface AboutCadreSummary {
  cadreId: PscCadreId;
  levelBadge: string;
  educationBadge: string;
  heading: string;
  description: string;
  ctaLabel: string;
  tone: 'blue' | 'crimson' | 'emerald';
}

export const ABOUT_HERO_CONTENT = {
  badge: 'About PSC Nepal (हाम्रो बारेमा)',
  headline:
    "Empowering Nepal's Civil Service Aspirants with Open, Structured & Rigorous Digital Preparation",
  lead: 'PSC Nepal is an independent educational workspace engineered to bridge the preparation gap for Lok Sewa Aayog (लोक सेवा आयोग) candidates across all 7 Provinces and 77 districts of Nepal—offering official syllabi, realistic OMR and written examination halls, bilingual model answers, and 3D PDF flipbooks.',
} as const;

export const ABOUT_MISSION_VISION: ReadonlyArray<AboutMissionCard> = [
  {
    id: 'mission',
    title: 'Our Mission (हाम्रो उद्देश्य)',
    body: 'To democratize access to authentic Lok Sewa study materials, official curriculum benchmarks, and disciplined examination practice for every aspiring civil servant in Nepal, regardless of geographic location or financial background. We believe that public administration talent flourishes when learning tools are transparent, accessible, and grounded in constitutional merit.',
    icon: Compass,
    tone: 'blue',
  },
  {
    id: 'vision',
    title: 'Our Vision (हाम्रो परिकल्पना)',
    body: 'To cultivate a digitally equipped, ethically grounded, and policy-conscious next generation of public service leaders for Nepal. By practicing under exact examination constraints—such as strict time pacers, negative marking penalties, and structured rubric evaluations—candidates build both competitive competence and public governance mindset.',
    icon: Sparkles,
    tone: 'crimson',
  },
];

export const ABOUT_PILLARS_HEADER = {
  title: 'The Five Pillars of PSC Nepal',
  subtitle:
    'Every feature on PSC Nepal is built around the verified statutory requirements and question formats published by the Public Service Commission of Nepal.',
} as const;

export const ABOUT_PLATFORM_PILLARS: ReadonlyArray<AboutPlatformPillar> = [
  {
    id: 'syllabi',
    title: 'Official Syllabus Checklists',
    description:
      'Exhaustive phase, paper, unit, and chapter checklists for Section Officer (शाखा अधिकृत), Nayab Subba (नायब सुब्बा), and Kharidar (खरिदार) with interactive completion checkmarks and marks allocations.',
    linkLabel: 'Explore Syllabi →',
    to: '/syllabus',
    icon: Layers,
    tone: 'blue',
  },
  {
    id: 'halls',
    title: 'Realistic Examination Halls',
    description:
      'Authentic OMR bubble-sheet simulation with randomized booklet keys (A, B, C, D) and -20% negative marking penalty, paired with a Phase II Timed Written Hall (1.8 mins/mark) and rubric self-scoring.',
    linkLabel: 'Enter Exam Hall →',
    to: '/simulate',
    icon: Scale,
    tone: 'crimson',
  },
  {
    id: 'written',
    title: 'Bilingual Model Answers',
    description:
      'Structured 5M and 10M subjective answers formatted side-by-side in English and नेपाली, featuring introductory citations, numbered thematic analysis, and balanced conclusions.',
    linkLabel: 'View Model Answers →',
    to: '/written',
    icon: FileText,
    tone: 'emerald',
  },
  {
    id: 'flipbook',
    title: '3D Flipbook & PDF Reader',
    description:
      'Read the Constitution of Nepal 2072, Civil Service Act 2049, Local Government Operation Act 2074, and Nepal Parichaya in realistic two-page turn flipbook or continuous scroll mode with bookmarking.',
    linkLabel: 'Browse Materials →',
    to: '/materials',
    icon: BookOpen,
    tone: 'purple',
  },
  {
    id: 'quiz',
    title: 'Verified MCQ Question Arena',
    description:
      'Practice across Constitution, Governance, Economy, Geography, History, and Aptitude in either Exam Mode (strict countdown with locked submission) or Study Mode (instant statutory explanation).',
    linkLabel: 'Practice Quizzes →',
    to: '/quiz',
    icon: Award,
    tone: 'amber',
  },
  {
    id: 'privacy',
    title: 'Account Sync & Privacy',
    description:
      'Keep your syllabus progress, quiz history, and bookmarks synced across devices with your account, with zero third-party ad tracking.',
    linkLabel: 'Privacy Policy →',
    to: '/privacy',
    icon: Lock,
    tone: 'teal',
  },
];

export const ABOUT_CADRES_HEADER = {
  title: 'Target Cadres & Civil Service Levels',
  subtitle:
    "Comprehensive coverage of the three premier open-competition entry levels in Nepal's civil service:",
} as const;

export const ABOUT_CADRE_SUMMARIES: ReadonlyArray<AboutCadreSummary> = [
  {
    cadreId: 'section-officer',
    levelBadge: 'Class III Gazetted',
    educationBadge: 'Bachelor Degree',
    heading: 'Section Officer (शाखा अधिकृत)',
    description:
      'Nepal Administration, Foreign, Judicial, Audit & Parliament services. 100M Phase I Screening (GK + IQ) with 45% pass gate, followed by 3 core subjective papers (300M) and Stage III interview/skill test.',
    ctaLabel: 'Officer Blueprint & PDF →',
    tone: 'blue',
  },
  {
    cadreId: 'nayab-subba',
    levelBadge: 'Non-Gazetted 1st Class',
    educationBadge: '10+2 / Higher Sec',
    heading: 'Nayab Subba (नायब सुब्बा)',
    description:
      'Key administrative supervision rank across General Administration, Accounts, and Revenue. 100M Phase I (40% pass gate, 50% carried forward), 2 written papers (200M), and Computer Skill Test + Interview.',
    ctaLabel: 'Na. Su. Blueprint & PDF →',
    tone: 'crimson',
  },
  {
    cadreId: 'kharidar',
    levelBadge: 'Non-Gazetted 2nd Class',
    educationBadge: 'SEE / SLC',
    heading: 'Kharidar (खरिदार)',
    description:
      'Foundation civil service operational rank. 100M Phase I Basic Aptitude (40% pass gate, 50% carried forward), 2 written office administration papers (200M), and Computer Skill Test + Interview.',
    ctaLabel: 'Kharidar Blueprint & PDF →',
    tone: 'emerald',
  },
];

export const ABOUT_EDITORIAL_INTEGRITY = {
  title: 'Statutory Grounding & Continuous Errata Review',
  leadBeforeDomain:
    'All curricula, objective questions, and written model answers on PSC Nepal are strictly reconciled against official gazette publications of the Public Service Commission (',
  domain: 'psc.gov.np',
  leadAfterDomain:
    '), authenticated acts published by the Nepal Law Commission, and periodic economic plans approved by the National Planning Commission. If any legislative revision occurs, our editorial desk rapidly reconciles citations and releases errata updates.',
  reportErrataLabel: 'Report Question Errata / Suggest Syllabus Update',
  termsLabel: 'Educational Terms & Disclaimer',
} as const;

export const ABOUT_CONTACT_CTA = {
  title: 'Get in Touch with the Editorial Desk',
  description:
    'Have feedback, question corrections, or requests for additional statutory acts? Reach out directly.',
  email: SITE_CONFIG.supportEmail,
  primaryCtaLabel: 'Submit Inquiry Ticket',
  primaryCtaTo: '/contact',
  secondaryCtaLabel: 'Launch Mock Exam',
  secondaryCtaTo: '/simulate',
} as const;
