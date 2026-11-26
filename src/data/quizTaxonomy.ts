import type { QuizQuestion } from '../types/assessment';

export interface PscQuizTheme {
  id: string;
  titleEn: string;
  titleNe: string;
  description: string;
  sampleTopics: string[];
  matchQuestion: (q: QuizQuestion) => boolean;
}

export interface QuizSubtopicGroup {
  subtopicId: string;
  subtopic: string;
  topicId: string;
  topic: string;
  subject: string;
  questions: QuizQuestion[];
  totalMarks: number;
}

export interface QuizTopicGroup {
  topicId: string;
  topic: string;
  subject: string;
  questions: QuizQuestion[];
  totalMarks: number;
  subtopics: QuizSubtopicGroup[];
}

export interface QuizSubjectGroup {
  subject: string;
  questions: QuizQuestion[];
  totalMarks: number;
  topics: QuizTopicGroup[];
  subtopicCount: number;
}

const matchesAnyKeyword = (value: string, keywords: readonly string[]): boolean => {
  const normalized = value.toLowerCase();
  return keywords.some((kw) => normalized.includes(kw));
};

export const PSC_QUIZ_THEMES: readonly PscQuizTheme[] = [
  {
    id: 'general-awareness',
    titleEn: 'General Awareness (GK)',
    titleNe: 'सामान्य ज्ञान',
    description:
      'Integrated general awareness spanning Nepal’s geography, history, culture, periodic planning, and national indicators.',
    sampleTopics: ['Geography', 'History & Culture', 'Development Planning', 'National Facts'],
    matchQuestion: (q) => {
      const s = q.subject.toLowerCase();
      return (
        s.includes('geography') ||
        s.includes('history') ||
        s.includes('culture') ||
        s.includes('planning') ||
        s.includes('current affair') ||
        s.includes('samasamayik')
      );
    },
  },
  {
    id: 'contemporary-issues',
    titleEn: 'Contemporary Issues & Current Affairs',
    titleNe: 'समसामयिक विषय र घटनाक्रम',
    description:
      'Latest policy shifts, Economic Survey, Federal Budget, NRB monetary policy, COP29, LDC graduation, and annual audit reports.',
    sampleTopics: ['Economic Survey', 'Monetary Policy', 'Climate Diplomacy', 'OAG & CIAA Reports'],
    matchQuestion: (q) => {
      const s = q.subject.toLowerCase();
      const t = q.topic.toLowerCase();
      return (
        s.includes('current affair') ||
        s.includes('samasamayik') ||
        s.includes('contemporary') ||
        s.includes('planning') ||
        t.includes('ldc') ||
        t.includes('climate')
      );
    },
  },
  {
    id: 'history',
    titleEn: 'History & Diplomatic Milestones',
    titleNe: 'इतिहास र कूटनीति',
    description:
      'Ancient Kirat and Licchavi eras, unification campaign, democratic movements, UN & SAARC diplomacy, and national milestones.',
    sampleTopics: ['Ancient & Medieval History', 'Unification Campaign', 'Democratic Movements', 'Diplomacy'],
    matchQuestion: (q) => {
      const tid = q.topicId.toUpperCase();
      return (
        tid.startsWith('HIS-') ||
        matchesAnyKeyword(`${q.topic} ${q.subtopic}`, [
          'history',
          'licchavi',
          'kirat',
          'unification',
          'democratic movement',
          'diplomacy',
          'diplomatic',
        ])
      );
    },
  },
  {
    id: 'culture',
    titleEn: 'Culture, Heritage & Demographics',
    titleNe: 'संस्कृति, सम्पदा र जनसाङ्ख्यिकी',
    description:
      'UNESCO natural & cultural world heritage sites, Census 2078 demographic indicators, national emblems, and cultural traditions.',
    sampleTopics: ['UNESCO Heritage Sites', 'Census 2078', 'National Emblems', 'Cultural Heritage'],
    matchQuestion: (q) => {
      const tid = q.topicId.toUpperCase();
      return (
        tid.startsWith('CUL-') ||
        matchesAnyKeyword(`${q.topic} ${q.subtopic}`, [
          'culture',
          'heritage',
          'unesco',
          'census',
          'emblem',
          'demographic',
          'festival',
        ])
      );
    },
  },
  {
    id: 'economy',
    titleEn: 'Economy, Budget & Periodic Planning',
    titleNe: 'अर्थतन्त्र, बजेट र आवधिक योजना',
    description:
      'Sixteenth Periodic Plan, sectoral GDP, NRB monetary policy, Federal Budget calendar, NLSS-IV poverty, and public procurement/fiscal laws.',
    sampleTopics: ['16th Periodic Plan', 'Federal Budget & GDP', 'NRB Monetary Policy', 'Fiscal & Procurement Laws'],
    matchQuestion: (q) => {
      const s = q.subject.toLowerCase();
      const combined = `${q.topic} ${q.subtopic}`.toLowerCase();
      return (
        s.includes('planning') ||
        matchesAnyKeyword(combined, [
          'econom',
          'budget',
          'monetary',
          'gdp',
          'poverty',
          'procurement',
          'fiscal',
          'beruju',
          'treasury',
          'ldc',
          'sdg',
          'plan',
        ])
      );
    },
  },
  {
    id: 'constitution-governance',
    titleEn: 'Constitution, Law & Public Administration',
    titleNe: 'संविधान, कानुन र सार्वजनिक प्रशासन',
    description:
      'Constitutional provisions, federal schedules, Civil Service Act 2049, RTI 2064, Good Governance 2064, LGOA 2074, and Integrity Acts.',
    sampleTopics: ['Constitution of Nepal', 'Civil Service Act', 'RTI & Good Governance', 'LGOA 2074'],
    matchQuestion: (q) => {
      const s = q.subject.toLowerCase();
      return (
        s.includes('constitution') ||
        s.includes('governance') ||
        s.includes('administration') ||
        s.includes('law')
      );
    },
  },
];

export function findQuizThemeById(themeId: string): PscQuizTheme | undefined {
  return PSC_QUIZ_THEMES.find((t) => t.id === themeId);
}

export function filterQuestionsByTheme(
  questions: QuizQuestion[],
  themeId: string
): QuizQuestion[] {
  const theme = findQuizThemeById(themeId);
  if (!theme) return [];
  return questions.filter(theme.matchQuestion);
}

export function buildQuizTaxonomyTree(
  questions: QuizQuestion[]
): QuizSubjectGroup[] {
  const subjectMap = new Map<
    string,
    Map<string, Map<string, QuizQuestion[]>>
  >();

  for (const q of questions) {
    const subj = q.subject.trim() || 'General';
    const topic = q.topic.trim() || 'General Topic';
    const subtopic = q.subtopic.trim() || 'General Subtopic';

    if (!subjectMap.has(subj)) {
      subjectMap.set(subj, new Map());
    }
    const topicMap = subjectMap.get(subj)!;
    if (!topicMap.has(topic)) {
      topicMap.set(topic, new Map());
    }
    const subMap = topicMap.get(topic)!;
    if (!subMap.has(subtopic)) {
      subMap.set(subtopic, []);
    }
    subMap.get(subtopic)!.push(q);
  }

  const subjects: QuizSubjectGroup[] = [];

  for (const [subject, topicMap] of subjectMap.entries()) {
    const topics: QuizTopicGroup[] = [];
    const subjectQuestions: QuizQuestion[] = [];
    let subtopicCount = 0;

    for (const [topic, subMap] of topicMap.entries()) {
      const subtopics: QuizSubtopicGroup[] = [];
      const topicQuestions: QuizQuestion[] = [];

      for (const [subtopic, items] of subMap.entries()) {
        subtopicCount += 1;
        topicQuestions.push(...items);
        subtopics.push({
          subtopicId: items[0]?.subtopicId || subtopic,
          subtopic,
          topicId: items[0]?.topicId || topic,
          topic,
          subject,
          questions: items,
          totalMarks: items.reduce((s, item) => s + item.marks, 0),
        });
      }

      subtopics.sort((a, b) => b.questions.length - a.questions.length || a.subtopic.localeCompare(b.subtopic));
      subjectQuestions.push(...topicQuestions);
      topics.push({
        topicId: topicQuestions[0]?.topicId || topic,
        topic,
        subject,
        questions: topicQuestions,
        totalMarks: topicQuestions.reduce((s, item) => s + item.marks, 0),
        subtopics,
      });
    }

    topics.sort((a, b) => b.questions.length - a.questions.length || a.topic.localeCompare(b.topic));
    subjects.push({
      subject,
      questions: subjectQuestions,
      totalMarks: subjectQuestions.reduce((s, item) => s + item.marks, 0),
      topics,
      subtopicCount,
    });
  }

  subjects.sort((a, b) => b.questions.length - a.questions.length || a.subject.localeCompare(b.subject));
  return subjects;
}
