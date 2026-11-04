import type { PscCadreId } from './pscSyllabusData.ts';
import { ALL_QUIZ_QUESTIONS, type QuizQuestion } from './quizData.ts';

export type BookletKey = 'A' | 'B' | 'C' | 'D';

export interface OmrPreset {
  id: string;
  cadreId: PscCadreId;
  cadreLabel: string;
  title: string;
  nepaliTitle: string;
  questionCount: number;
  marksPerQuestion: number;
  negativeRate: number;
  passPercent: number;
  allocatedSeconds: number;
  blueprintSummary: string;
  selectQuestions: () => QuizQuestion[];
}

export interface WrittenHallPreset {
  id: string;
  cadreId: PscCadreId;
  paperCode: string;
  title: string;
  nepaliTitle: string;
  allocatedSeconds: number;
  questionIds: string[];
  description: string;
}

export function deterministicPermute<T>(items: T[], key: BookletKey): T[] {
  const seedMap: Record<BookletKey, number> = {
    A: 1,
    B: 7,
    C: 13,
    D: 19,
  };
  const step = seedMap[key];
  if (key === 'A' || items.length <= 1) return [...items];

  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = (i * step + 5) % (i + 1);
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

function pickBalancedQuestions(count: number, offset: number): QuizQuestion[] {
  if (ALL_QUIZ_QUESTIONS.length <= count) return [...ALL_QUIZ_QUESTIONS];
  const bySubject = new Map<string, QuizQuestion[]>();
  for (const q of ALL_QUIZ_QUESTIONS) {
    const arr = bySubject.get(q.subject) ?? [];
    arr.push(q);
    bySubject.set(q.subject, arr);
  }
  const buckets = Array.from(bySubject.values());
  const selected: QuizQuestion[] = [];
  let round = offset;
  while (selected.length < count) {
    let addedInPass = false;
    for (const bucket of buckets) {
      if (selected.length >= count) break;
      const idx = round % bucket.length;
      const candidate = bucket[idx];
      if (!selected.some((item) => item.id === candidate.id)) {
        selected.push(candidate);
        addedInPass = true;
      }
    }
    round += 1;
    if (!addedInPass) break;
  }
  return selected;
}

export const OMR_PRESETS: readonly OmrPreset[] = [
  {
    id: 'so-phase1-omr',
    cadreId: 'section-officer',
    cadreLabel: 'Section Officer · Gazetted III',
    title: 'Section Officer Phase I (AAT) Screening Hall',
    nepaliTitle: 'शाखा अधिकृत प्रथम चरण · प्रशासनिक अभिरुचि OMR परीक्षा',
    questionCount: 30,
    marksPerQuestion: 1,
    negativeRate: 0.2,
    passPercent: 45,
    allocatedSeconds: 27 * 60,
    blueprintSummary:
      'Balanced GK, Constitutional Law, Public Administration, Aptitude IQ & English Competence · 1.00M correct · -0.20M wrong · 45% Pass Gate',
    selectQuestions: () => pickBalancedQuestions(30, 0),
  },
  {
    id: 'nasu-phase1-omr',
    cadreId: 'nayab-subba',
    cadreLabel: 'Nayab Subba · Non-Gazetted I',
    title: 'Nayab Subba Phase I (GK & GMAT) Screening Hall',
    nepaliTitle: 'नायब सुब्बा प्रथम चरण · सामान्य ज्ञान तथा बौद्धिक परीक्षण',
    questionCount: 25,
    marksPerQuestion: 2,
    negativeRate: 0.2,
    passPercent: 45,
    allocatedSeconds: Math.round(22.5 * 60),
    blueprintSummary:
      'Scaled 50-Mark Sitting (25 MCQs × 2 Marks) · 54s per question hall pace · +2.00M correct · -0.40M wrong · 45% Pass Gate',
    selectQuestions: () => pickBalancedQuestions(25, 2),
  },
  {
    id: 'kharidar-phase1-omr',
    cadreId: 'kharidar',
    cadreLabel: 'Kharidar · Non-Gazetted II',
    title: 'Kharidar Phase I Preliminary OMR Hall',
    nepaliTitle: 'खरिदार प्रथम चरण · प्रारम्भिक वस्तुगत OMR परीक्षा',
    questionCount: 25,
    marksPerQuestion: 2,
    negativeRate: 0.2,
    passPercent: 45,
    allocatedSeconds: Math.round(22.5 * 60),
    blueprintSummary:
      'Scaled 50-Mark Sitting (25 MCQs × 2 Marks) covering Nepal GK, Civic Rules, Nepali Writing & BOST Aptitude · -0.40M wrong · 45% Pass Gate',
    selectQuestions: () => pickBalancedQuestions(25, 4),
  },
  {
    id: 'rapid-15-omr',
    cadreId: 'section-officer',
    cadreLabel: 'All Cadres · Speed Conditioning',
    title: '15-Question High-Pressure OMR Sprint',
    nepaliTitle: '१५ प्रश्न द्रुत OMR अभ्यास सत्र',
    questionCount: 15,
    marksPerQuestion: 1,
    negativeRate: 0.2,
    passPercent: 45,
    allocatedSeconds: 15 * 60,
    blueprintSummary:
      '15 cross-topic PSC questions under a strict 15:00 clock to train elimination accuracy and 45% OMR screening discipline',
    selectQuestions: () => pickBalancedQuestions(15, 1),
  },
];

export const WRITTEN_PRESETS: readonly WrittenHallPreset[] = [
  {
    id: 'written-paper-2',
    cadreId: 'section-officer',
    paperCode: 'Paper II',
    title: 'Governance Systems Timed Mini-Sitting (15 Marks)',
    nepaliTitle: 'द्वितीय पत्र · शासन प्रणाली लिखित अभ्यास (१५ अङ्क)',
    allocatedSeconds: 27 * 60,
    questionIds: ['PSC-WR-206', 'PSC-WR-201'],
    description:
      'Combines one 5-mark short analytical question (RTI Proactive Disclosure) and one 10-mark long analytical question (Fundamental Rights Enforcement) at 1.8 minutes/mark.',
  },
  {
    id: 'written-paper-3',
    cadreId: 'section-officer',
    paperCode: 'Paper III',
    title: 'Contemporary Issues & 16th Plan Sitting (15 Marks)',
    nepaliTitle: 'तृतीय पत्र · समसामयिक विषय र सोह्रौँ योजना (१५ अङ्क)',
    allocatedSeconds: 27 * 60,
    questionIds: ['PSC-WR-304', 'PSC-WR-301'],
    description:
      'Combines Foreign Policy & Economic Diplomacy (5 Marks) with Sixteenth Periodic Plan Structural Transformation (10 Marks).',
  },
  {
    id: 'written-paper-4',
    cadreId: 'section-officer',
    paperCode: 'Paper IV',
    title: 'Service Delivery & Office Chief Case Study Sitting (20 Marks)',
    nepaliTitle: 'चतुर्थ पत्र · सेवा प्रवाह र मामिला अध्ययन (२० अङ्क)',
    allocatedSeconds: 36 * 60,
    questionIds: ['PSC-WR-401', 'PSC-WR-403'],
    description:
      'Full 36-minute subjective sitting pairing E-Governance Modernization (10 Marks) with a practical Frontline Office Turnaround Case Study (10 Marks).',
  },
  {
    id: 'written-office-nasu',
    cadreId: 'nayab-subba',
    paperCode: 'Nayab Subba Paper II',
    title: 'Office Operations & Federalism Sitting (15 Marks)',
    nepaliTitle: 'नायब सुब्बा · कार्यालय व्यवस्थापन र संघीयता (१५ अङ्क)',
    allocatedSeconds: 27 * 60,
    questionIds: ['PSC-WR-402', 'PSC-WR-202'],
    description:
      'Practices Darta-Chalani & Record Digitization (5 Marks) alongside Federal Inter-Governmental Relations (10 Marks).',
  },
];
