export type QuizOptionKey = 'A' | 'B' | 'C' | 'D';
export type QuizDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface QuizOption {
  key: QuizOptionKey;
  text: string;
  textNe?: string;
}

export interface QuizQuestion {
  id: string;
  level: string;
  service: string;
  group: string;
  post: string;
  paper: string;
  subject: string;
  topicId: string;
  topic: string;
  subtopicId: string;
  subtopic: string;
  question: string;
  questionNe?: string;
  options: QuizOption[];
  correct_options: QuizOptionKey[];
  is_multi_select: boolean;
  explanation: string;
  explanationNe?: string;
  difficulty: QuizDifficulty;
  marks: number;
  sourceTitle?: string;
  sourcePath?: string;
}

export interface QuizDeck {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  questions: QuizQuestion[];
}

export const QUIZ_OPTION_KEYS: readonly QuizOptionKey[] = [
  'A',
  'B',
  'C',
  'D',
] as const;

/**
 * Language categories ('English' and 'Nepali') remain strictly single-language;
 * all other PSC subjects are presented bilingually in English and Nepali.
 */
export function isLanguageOnlySubject(subject: string): 'en' | 'ne' | null {
  const normalized = subject.trim().toLowerCase();
  if (normalized === 'english') return 'en';
  if (normalized === 'nepali') return 'ne';
  return null;
}

export function isBilingualQuizQuestion(
  question: Pick<QuizQuestion, 'subject'>
): boolean {
  return isLanguageOnlySubject(question.subject) === null;
}

/**
 * Strict real-quiz timing rule: 1 question = 1 minute (60 seconds).
 */
export function getQuizDeadlineSeconds(questionCount: number): number {
  return Math.max(1, questionCount) * 60;
}

/**
 * Sum of assigned marks across all questions in a quiz set.
 */
export function getDeckTotalMarks(questions: QuizQuestion[]): number {
  return questions.reduce((sum, q) => sum + q.marks, 0);
}

/**
 * Exact-match validation supporting both single-select and multi-select PSC items.
 */
export function isQuestionCorrect(
  question: QuizQuestion,
  pickedKeys: QuizOptionKey[] | undefined
): boolean {
  if (!pickedKeys || pickedKeys.length === 0) return false;
  if (pickedKeys.length !== question.correct_options.length) return false;
  const pickedSet = new Set(pickedKeys);
  return question.correct_options.every((key) => pickedSet.has(key));
}

const LANGUAGE_AND_WRITING_QUESTIONS: QuizQuestion[] = [
  {
    id: 'PSC-LANG-100',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'Language',
    post: 'Section Officer / general competitive examination target',
    paper: 'Language',
    subject: 'Nepali',
    topicId: 'LANG-NEP',
    topic: 'नेपाली भाषा',
    subtopicId: 'LANG-NEP-05',
    subtopic: 'प्रशासनिक लेखन',
    question: 'कार्यालयको औपचारिक पत्रमा कुन शैली उपयुक्त हुन्छ?',
    options: [
      { key: 'A', text: 'स्पष्ट, शिष्ट र औपचारिक भाषा' },
      { key: 'B', text: 'अस्पष्ट र भावनात्मक भाषा' },
      { key: 'C', text: 'अत्यधिक अनौपचारिक बोलचाल' },
      { key: 'D', text: 'असम्बन्धित व्यक्तिगत टिप्पणी' },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation: 'प्रशासनिक लेखन स्पष्ट, शिष्ट, संक्षिप्त र औपचारिक हुनुपर्छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'PSC Nayab Subba (Non-Gazetted First Class) Curriculum',
    sourcePath: '/materials/psc-nayab-subba-syllabus.pdf',
  },
  {
    id: 'PSC-LANG-101',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'Language',
    post: 'Nayab Subba / Kharidar competitive examination target',
    paper: 'Language',
    subject: 'Nepali',
    topicId: 'LANG-NEP',
    topic: 'नेपाली भाषा',
    subtopicId: 'LANG-NEP-05',
    subtopic: 'प्रशासनिक लेखन',
    question:
      'माथिल्लो निकायले मातहतका सबै कार्यालयहरूलाई एउटै विषयको निर्देशन वा जानकारी एकैसाथ पठाउने लिखित माध्यमलाई के भनिन्छ?',
    options: [
      { key: 'A', text: 'भर्पाई (Bharpai)' },
      { key: 'B', text: 'परिपत्र (Circular)' },
      { key: 'C', text: 'मुचुल्का (Muchulka)' },
      { key: 'D', text: 'बोलपत्र (Tender Notice)' },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'माथिल्लो तहको कार्यालयले आफू मातहतका अनेक कार्यालयलाई समान निर्देशन वा निर्णय जानकारी गराउन पठाउने पत्रलाई परिपत्र (Circular) भनिन्छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'PSC Nayab Subba (Non-Gazetted First Class) Curriculum',
    sourcePath: '/materials/psc-nayab-subba-syllabus.pdf',
  },
  {
    id: 'PSC-LANG-102',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'Language',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Language',
    subject: 'Nepali',
    topicId: 'LANG-NEP',
    topic: 'नेपाली भाषा',
    subtopicId: 'LANG-NEP-06',
    subtopic: 'टिप्पणी र निर्णय प्रक्रिया',
    question:
      'सरकारी कार्यालयमा नीतिगत वा प्रशासनिक निर्णयका लागि तथ्य, कानुनी व्यवस्था र रायसहित तल्लो तहबाट पेस गरिने लिखत कुन हो?',
    options: [
      { key: 'A', text: 'टिप्पणी (Tippani)' },
      { key: 'B', text: 'गोरखापत्र सूचना' },
      { key: 'C', text: 'व्यक्तिगत दैनिकी' },
      { key: 'D', text: 'रसिद (Receipt)' },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'अधिकारप्राप्त अधिकारीबाट निर्णय गराउन सम्बन्धित फाँटबाट तथ्य, प्रचलित ऐन-नियम र स्पष्ट रायसहित उठाइने आधिकारिक मस्यौदालाई टिप्पणी भनिन्छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Good Governance (Management & Operation) Act, 2064',
    sourcePath: '/materials/good-governance-act-2064.pdf',
  },
  {
    id: 'PSC-LANG-103',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'Language',
    post: 'Nayab Subba / Kharidar competitive examination target',
    paper: 'Language',
    subject: 'Nepali',
    topicId: 'LANG-NEP',
    topic: 'नेपाली भाषा',
    subtopicId: 'LANG-NEP-02',
    subtopic: 'व्याकरण र वर्णविन्यास',
    question: 'तल दिइएका शब्दहरूमध्ये मानक नेपाली वर्णविन्यासअनुसार शुद्ध शब्द कुन हो?',
    options: [
      { key: 'A', text: 'कार्यान्वयन' },
      { key: 'B', text: 'कार्यानवयन' },
      { key: 'C', text: 'कार्यान्वयेन' },
      { key: 'D', text: 'कर्यन्वयन' },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'कार्य + अन्वयन मिलेर बनेको मानक र शुद्ध प्रशासनिक शब्द "कार्यान्वयन" हो।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'PSC Kharidar (Non-Gazetted Second Class) Syllabus',
    sourcePath: '/materials/psc-kharidar-syllabus.pdf',
  },
  {
    id: 'PSC-LANG-104',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'Language',
    post: 'Nayab Subba / general competitive examination target',
    paper: 'Language',
    subject: 'Nepali',
    topicId: 'LANG-NEP',
    topic: 'नेपाली भाषा',
    subtopicId: 'LANG-NEP-03',
    subtopic: 'वाच्य र वाक्य रूपान्तरण',
    question:
      '“नागरिकद्वारा समयमै राजस्व बुझाइयो।” यो वाक्य नेपाली व्याकरणको कुन वाच्यमा रहेको छ?',
    options: [
      { key: 'A', text: 'कर्तृवाच्य' },
      { key: 'B', text: 'कर्मवाच्य' },
      { key: 'C', text: 'भाववाच्य' },
      { key: 'D', text: 'प्रेरणार्थक वाक्य' },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'कर्तामा "द्वारा" विभक्ति लागी सकर्मक क्रिया कर्मअनुसार ("राजस्व बुझाइयो") प्रयोग भएकाले यो कर्मवाच्य हो।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'PSC Nayab Subba (Non-Gazetted First Class) Curriculum',
    sourcePath: '/materials/psc-nayab-subba-syllabus.pdf',
  },
  {
    id: 'PSC-LANG-105',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'Language',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Language',
    subject: 'Nepali',
    topicId: 'LANG-NEP',
    topic: 'नेपाली भाषा',
    subtopicId: 'LANG-NEP-07',
    subtopic: 'संक्षेपीकरण र बुँदाटिपोट',
    question:
      'प्रशासनिक वा भाषिक संक्षेपीकरण (Précis Writing) गर्दा मूल अनुच्छेदको शब्दसङ्ख्याको सामान्यतया कति अंशमा संक्षेप तयार गरिन्छ?',
    options: [
      { key: 'A', text: 'करिब दुई-तिहाइ (२/३) अंश' },
      { key: 'B', text: 'करिब एक-तिहाइ (१/३) अंश' },
      { key: 'C', text: 'मूल बराबर शतप्रतिशत' },
      { key: 'D', text: 'दोब्बर शब्दसङ्ख्या' },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'संक्षेपीकरण गर्दा मूल गद्यांशको मुख्य भाव नछुट्ने गरी सामान्यतया एक-तिहाइ (१/३) शब्दसङ्ख्यामा सटिक र मौलिक रूपले लेख्नुपर्छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'PSC Nayab Subba (Non-Gazetted First Class) Curriculum',
    sourcePath: '/materials/psc-nayab-subba-syllabus.pdf',
  },
  {
    id: 'PSC-LANG-106',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'Language',
    post: 'Nayab Subba / Kharidar target',
    paper: 'Language',
    subject: 'Nepali',
    topicId: 'LANG-NEP',
    topic: 'नेपाली भाषा',
    subtopicId: 'LANG-NEP-04',
    subtopic: 'शब्दभण्डार र पारिभाषिक शब्द',
    question:
      'प्रशासनिक शब्दावलीमा अङ्ग्रेजी “Jurisdiction” शब्दको सटिक नेपाली पारिभाषिक अर्थ कुन हो?',
    options: [
      { key: 'A', text: 'अधिकारक्षेत्र (क्षेत्राधिकार)' },
      { key: 'B', text: 'लेखापरीक्षण' },
      { key: 'C', text: 'कार्यसूची' },
      { key: 'D', text: 'धरौटी फिर्ता' },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'कानुनी तथा प्रशासनिक प्रयोगमा “Jurisdiction” को मानक नेपाली पारिभाषिक शब्द "अधिकारक्षेत्र" वा "क्षेत्राधिकार" हो।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Constitution of Nepal (2072) — Core Articles & Rights',
    sourcePath: '/materials/constitution-of-nepal-2072.pdf',
  },
  {
    id: 'PSC-LANG-107',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'Language',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Language',
    subject: 'Nepali',
    topicId: 'LANG-NEP',
    topic: 'नेपाली भाषा',
    subtopicId: 'LANG-NEP-08',
    subtopic: 'प्रतिवेदन लेखन',
    question:
      'स्थलगत अध्ययन वा छानबिन प्रतिवेदन (Report Writing) मा कुन-कुन अङ्गहरू अनिवार्य रूपमा समावेश हुनुपर्छ? (सबै सही विकल्प छान्नुहोस्)',
    options: [
      { key: 'A', text: 'अध्ययनको उद्देश्य, कार्यक्षेत्र र विधि' },
      { key: 'B', text: 'तथ्यगत विवरण, विश्लेषण र निष्कर्ष' },
      { key: 'C', text: 'कार्यान्वयनयोग्य सुझाव तथा सिफारिस' },
      { key: 'D', text: 'अपुष्ट हल्ला र व्यक्तिगत आग्रह' },
    ],
    correct_options: ['A', 'B', 'C'],
    is_multi_select: true,
    explanation:
      'स्तरीय प्रशासनिक प्रतिवेदनमा उद्देश्य र विधि (A), तथ्यको वस्तुनिष्ठ विश्लेषण र निष्कर्ष (B), तथा व्यावहारिक सुझाव/सिफारिस (C) अनिवार्य हुन्छन्; अपुष्ट हल्ला (D) वर्जित हुन्छ।',
    difficulty: 'Medium',
    marks: 2,
    sourceTitle: 'PSC Nayab Subba (Non-Gazetted First Class) Curriculum',
    sourcePath: '/materials/psc-nayab-subba-syllabus.pdf',
  },
  {
    id: 'PSC-LANG-108',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'Language',
    post: 'Kharidar / Nayab Subba target',
    paper: 'Language',
    subject: 'Nepali',
    topicId: 'LANG-NEP',
    topic: 'नेपाली भाषा',
    subtopicId: 'LANG-NEP-05',
    subtopic: 'प्रशासनिक लेखन',
    question:
      'सरकारी कार्यालयको औपचारिक पत्रको सिरानमा बायाँतर्फ क्रमशः के-के उल्लेख गर्ने प्रचलन छ?',
    options: [
      { key: 'A', text: 'पत्र सङ्ख्या र चलानी नम्बर' },
      { key: 'B', text: 'बोधार्थ र हस्ताक्षर मात्र' },
      { key: 'C', text: 'व्यक्तिगत इमेल र हुलाक टिकट' },
      { key: 'D', text: 'निर्णय मिति र टिप्पणी राय' },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'नेपाल सरकारको औपचारिक पत्र ढाँचामा सिरानको दायाँतर्फ मिति र बायाँतर्फ क्रमशः "पत्र सङ्ख्या (प.सं.)" र "चलानी नं. (च.नं.)" लेखिन्छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'PSC Kharidar (Non-Gazetted Second Class) Syllabus',
    sourcePath: '/materials/psc-kharidar-syllabus.pdf',
  },
  {
    id: 'PSC-LANG-109',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'Language',
    post: 'Nayab Subba / general competitive examination target',
    paper: 'Language',
    subject: 'Nepali',
    topicId: 'LANG-NEP',
    topic: 'नेपाली भाषा',
    subtopicId: 'LANG-NEP-02',
    subtopic: 'व्याकरण र समास',
    question:
      '“लोकसेवा” (लोकको सेवा) शब्द कुन समास प्रक्रियाबाट निर्माण भएको हो?',
    options: [
      { key: 'A', text: 'द्वन्द्व समास' },
      { key: 'B', text: 'तत्पुरुष समास' },
      { key: 'C', text: 'बहुव्रीहि समास' },
      { key: 'D', text: 'द्विगु समास' },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'पूर्वपदको षष्ठी विभक्ति ("को") लोप भई उत्तरपद "सेवा" प्रधान रहने भएकाले "लोकसेवा" षष्ठी तत्पुरुष समास हो।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'PSC Nayab Subba (Non-Gazetted First Class) Curriculum',
    sourcePath: '/materials/psc-nayab-subba-syllabus.pdf',
  },
  {
    id: 'PSC-LANG-110',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'Language',
    post: 'Section Officer (Paper I — English Competence)',
    paper: 'Paper I: Administrative Aptitude Test',
    subject: 'English',
    topicId: 'LANG-ENG',
    topic: 'English Competence',
    subtopicId: 'LANG-ENG-01',
    subtopic: 'Subject-Verb Agreement',
    question:
      'Choose the grammatically correct sentence under formal English subject-verb agreement rules tested in PSC Section Officer Paper I:',
    options: [
      {
        key: 'A',
        text: 'Neither the director nor the section officers were present at the briefing.',
      },
      {
        key: 'B',
        text: 'Neither the director nor the section officers was present at the briefing.',
      },
      {
        key: 'C',
        text: 'Each of the submitted proposals have been reviewed by the committee.',
      },
      {
        key: 'D',
        text: 'The number of applicants for gazetted posts are increasing rapidly.',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'In "neither... nor..." constructions, the verb agrees with the nearer subject ("section officers" → plural "were"); "Each" and "The number of" take singular verbs ("has", "is").',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'PSC Gazetted Third Class (Section Officer) Syllabus',
    sourcePath: '/materials/psc-section-officer-syllabus.pdf',
  },
  {
    id: 'PSC-LANG-111',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'Language',
    post: 'Section Officer (Paper I — English Competence)',
    paper: 'Paper I: Administrative Aptitude Test',
    subject: 'English',
    topicId: 'LANG-ENG',
    topic: 'English Competence',
    subtopicId: 'LANG-ENG-02',
    subtopic: 'Administrative & Legal Vocabulary',
    question:
      'In legal and administrative English, which single word means "to formally repeal, annul, or abolish a law, right, or treaty"?',
    options: [
      { key: 'A', text: 'Corroborate' },
      { key: 'B', text: 'Proliferate' },
      { key: 'C', text: 'Abrogate' },
      { key: 'D', text: 'Ameliorate' },
    ],
    correct_options: ['C'],
    is_multi_select: false,
    explanation:
      '"Abrogate" means to formally repeal or abolish a law, agreement, or custom ("corroborate" = confirm, "proliferate" = multiply rapidly, "ameliorate" = improve).',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'PSC Gazetted Third Class (Section Officer) Syllabus',
    sourcePath: '/materials/psc-section-officer-syllabus.pdf',
  },
  {
    id: 'PSC-LANG-112',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'Language',
    post: 'Section Officer (Paper I — English Competence)',
    paper: 'Paper I: Administrative Aptitude Test',
    subject: 'English',
    topicId: 'LANG-ENG',
    topic: 'English Competence',
    subtopicId: 'LANG-ENG-03',
    subtopic: 'Prepositions in Official Usage',
    question:
      'Select the correct preposition to complete the official statement: "All public officials must strictly abide ___ the statutory code of conduct."',
    options: [
      { key: 'A', text: 'with' },
      { key: 'B', text: 'by' },
      { key: 'C', text: 'to' },
      { key: 'D', text: 'from' },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'The idiomatic phrasal collocation is "abide by" (meaning to comply with or observe a rule, law, or decision).',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'PSC Gazetted Third Class (Section Officer) Syllabus',
    sourcePath: '/materials/psc-section-officer-syllabus.pdf',
  },
  {
    id: 'PSC-LANG-113',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'Language',
    post: 'Section Officer (Paper I — English Competence)',
    paper: 'Paper I: Administrative Aptitude Test',
    subject: 'English',
    topicId: 'LANG-ENG',
    topic: 'English Competence',
    subtopicId: 'LANG-ENG-04',
    subtopic: 'Voice Transformation',
    question:
      'Choose the accurate passive voice form of: "The Commission has published the annual report."',
    options: [
      { key: 'A', text: 'The annual report was published by the Commission.' },
      { key: 'B', text: 'The annual report is being published by the Commission.' },
      { key: 'C', text: 'The annual report has been published by the Commission.' },
      { key: 'D', text: 'The annual report had been published by the Commission.' },
    ],
    correct_options: ['C'],
    is_multi_select: false,
    explanation:
      'Present perfect active ("has published") transforms into present perfect passive ("has been published") while preserving tense aspect.',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'PSC Gazetted Third Class (Section Officer) Syllabus',
    sourcePath: '/materials/psc-section-officer-syllabus.pdf',
  },
  {
    id: 'PSC-LANG-114',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'Language',
    post: 'Section Officer (Paper I — English Competence)',
    paper: 'Paper I: Administrative Aptitude Test',
    subject: 'English',
    topicId: 'LANG-ENG',
    topic: 'English Competence',
    subtopicId: 'LANG-ENG-05',
    subtopic: 'Official Correspondence Register',
    question:
      'When an official business letter begins with the impersonal salutation "Dear Sir or Madam,", which complimentary close follows standard formal convention?',
    options: [
      { key: 'A', text: 'Yours faithfully,' },
      { key: 'B', text: 'Yours affectionately,' },
      { key: 'C', text: 'Cheers and regards,' },
      { key: 'D', text: 'Yours Obediently Friend,' },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'In formal Commonwealth/PSC administrative correspondence, an unnamed salutation ("Dear Sir or Madam,") pairs with "Yours faithfully,", whereas a named salutation ("Dear Mr. Sharma,") pairs with "Yours sincerely,".',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'PSC Gazetted Third Class (Section Officer) Syllabus',
    sourcePath: '/materials/psc-section-officer-syllabus.pdf',
  },
];

const NEPAL_PARICHAYA_QUESTIONS: QuizQuestion[] = [
  {
    id: 'PSC-GEO-101',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba / Kharidar target',
    paper: 'Paper I: General Knowledge',
    subject: 'Geography of Nepal',
    topicId: 'GEO-PHY',
    topic: 'Physical Geography',
    subtopicId: 'GEO-PHY-01',
    subtopic: 'Ecological Belts',
    question:
      'Which ecological belt covers the largest share (approximately 68%) of Nepal’s total land area?',
    questionNe:
      'नेपालको कुल भू-भागको सबैभन्दा ठूलो हिस्सा (करिब ६८ प्रतिशत) कुन भौगोलिक प्रदेशले ओगटेको छ?',
    options: [
      { key: 'A', text: 'Terai Region', textNe: 'तराई प्रदेश' },
      { key: 'B', text: 'Hilly (Pahad) Region', textNe: 'पहाडी प्रदेश' },
      { key: 'C', text: 'Mountain (Himal) Region', textNe: 'हिमाली प्रदेश' },
      {
        key: 'D',
        text: 'Inner Terai (Bhitri Madhesh) Only',
        textNe: 'भित्री मधेश मात्र',
      },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'The Hilly (Pahad) belt spans roughly 68% of Nepal’s total land area between approximately 600 m and 3,000 m elevation, while the Terai covers ~17% and the Mountain (Himal) belt covers ~15%.',
    explanationNe:
      'समुद्र सतहबाट करिब ६०० मिटरदेखि ३,००० मिटर उचाइसम्म फैलिएको पहाडी प्रदेशले नेपालको कुल भू-भागको करिब ६८% ओगटेको छ भने तराई प्रदेशले करिब १७% र हिमाली प्रदेशले करिब १५% क्षेत्रफल ओगटेका छन्।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Nepal Parichaya: Physical Geography & Ecological Belts',
    sourcePath: '/materials/nepal-parichaya-geography.pdf',
  },
  {
    id: 'PSC-GEO-102',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba / Kharidar target',
    paper: 'Paper I: General Knowledge',
    subject: 'Geography of Nepal',
    topicId: 'GEO-HYD',
    topic: 'Hydrology & Protected Areas',
    subtopicId: 'GEO-HYD-01',
    subtopic: 'River Systems',
    question:
      'Which of the three major river systems of Nepal is the longest river within the country?',
    questionNe:
      'नेपालका तीन प्रमुख नदी प्रणालीमध्ये देशभित्रै बग्ने सबैभन्दा लामो नदी कुन हो?',
    options: [
      {
        key: 'A',
        text: 'Sapta Koshi River System',
        textNe: 'सप्तकोशी नदी प्रणाली',
      },
      {
        key: 'B',
        text: 'Sapta Gandaki (Narayani) River System',
        textNe: 'सप्तगण्डकी (नारायणी) नदी प्रणाली',
      },
      { key: 'C', text: 'Karnali River System', textNe: 'कर्णाली नदी प्रणाली' },
      { key: 'D', text: 'Mahakali River System', textNe: 'महाकाली नदी प्रणाली' },
    ],
    correct_options: ['C'],
    is_multi_select: false,
    explanation:
      'The Karnali is Nepal’s longest river (approx. 507 km within Nepal), draining western Nepal from the Tibetan plateau southward into the Ghaghara.',
    explanationNe:
      'कर्णाली नेपालको सबैभन्दा लामो नदी हो (नेपालभित्रको लम्बाइ करिब ५०७ कि.मि.)। यो तिब्बती पठारबाट उत्पत्ति भई पश्चिम नेपाल हुँदै दक्षिणतर्फ बगेर घाघरा नदीमा मिल्दछ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Nepal Parichaya: Physical Geography & Ecological Belts',
    sourcePath: '/materials/nepal-parichaya-geography.pdf',
  },
  {
    id: 'PSC-GEO-103',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba / Kharidar target',
    paper: 'Paper I: General Knowledge',
    subject: 'Geography of Nepal',
    topicId: 'GEO-PHY',
    topic: 'Physical Geography',
    subtopicId: 'GEO-PHY-02',
    subtopic: 'Boundaries & Area',
    question:
      'What is the official total area of Nepal following the constitutional map update?',
    questionNe:
      'संविधान संशोधनमार्फत अद्यावधिक नक्सा जारी भएपछि नेपालको आधिकारिक कुल क्षेत्रफल कति कायम भएको छ?',
    options: [
      { key: 'A', text: '140,800 sq. km', textNe: '१,४०,८०० वर्ग कि.मि.' },
      { key: 'B', text: '147,181 sq. km', textNe: '१,४७,१८१ वर्ग कि.मि.' },
      { key: 'C', text: '147,516 sq. km', textNe: '१,४७,५१६ वर्ग कि.मि.' },
      { key: 'D', text: '149,210 sq. km', textNe: '१,४९,२१० वर्ग कि.मि.' },
    ],
    correct_options: ['C'],
    is_multi_select: false,
    explanation:
      'Following the Second Amendment to the Constitution of Nepal (2077 BS) updating the political and administrative map to include Limpiyadhura, Lipulekh, and Kalapani, Nepal’s official area is 147,516 sq. km.',
    explanationNe:
      'नेपालको संविधानको दोस्रो संशोधन (वि.सं. २०७७) मार्फत लिम्पियाधुरा, लिपुलेक र कालापानी समेटिएको राजनीतिक तथा प्रशासनिक नक्सा अद्यावधिक भएपछि नेपालको आधिकारिक क्षेत्रफल १,४७,५१६ वर्ग किलोमिटर कायम भएको छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Nepal Parichaya: Physical Geography & Ecological Belts',
    sourcePath: '/materials/nepal-parichaya-geography.pdf',
  },
  {
    id: 'PSC-HIS-104',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge',
    subject: 'History & Culture of Nepal',
    topicId: 'HIS-MOD',
    topic: 'Modern History & Reforms',
    subtopicId: 'HIS-MOD-03',
    subtopic: 'Democratic Movements',
    question:
      'Which historic people’s movement ushered in the Comprehensive Peace Accord and paved the way for a federal democratic republic in Nepal?',
    questionNe:
      'कुन ऐतिहासिक जनआन्दोलनले विस्तृत शान्ति सम्झौताको वातावरण सिर्जना गर्दै नेपालमा संघीय लोकतान्त्रिक गणतन्त्र स्थापनाको मार्ग प्रशस्त गरेको थियो?',
    options: [
      {
        key: 'A',
        text: 'People’s Movement of 2007 BS',
        textNe: 'वि.सं. २००७ को जनक्रान्ति',
      },
      {
        key: 'B',
        text: 'Referendum Movement of 2036 BS',
        textNe: 'वि.सं. २०३६ को जनमत संग्रह आन्दोलन',
      },
      {
        key: 'C',
        text: 'Jana Andolan I of 2046 BS',
        textNe: 'वि.सं. २०४६ को प्रथम जनआन्दोलन',
      },
      {
        key: 'D',
        text: 'Jana Andolan II of 2062/63 BS',
        textNe: 'वि.सं. २०६२/६३ को दोस्रो जनआन्दोलन',
      },
    ],
    correct_options: ['D'],
    is_multi_select: false,
    explanation:
      'The 19-day Jana Andolan II in Chaitra–Baisakh 2062/63 BS (April 2006) restored the House of Representatives, led to the Comprehensive Peace Accord (Mangsir 5, 2063), and established the Constituent Assembly.',
    explanationNe:
      'वि.सं. २०६२/६३ को १९ दिने दोस्रो जनआन्दोलनले प्रतिनिधिसभाको पुनर्स्थापना गर्‍यो, वि.सं. २०६३ मंसिर ५ मा विस्तृत शान्ति सम्झौता सम्पन्न भयो र संविधानसभा गठन भई संघीय लोकतान्त्रिक गणतन्त्रको आधार तयार भयो।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Nepal Parichaya: Historical Timeline & Modern Transition',
    sourcePath: '/materials/nepal-parichaya-history.pdf',
  },
  {
    id: 'PSC-HIS-105',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge',
    subject: 'History & Culture of Nepal',
    topicId: 'HIS-ANC',
    topic: 'Ancient & Medieval History',
    subtopicId: 'HIS-ANC-02',
    subtopic: 'Licchavi Period',
    question:
      'Changunarayan Temple, home to the oldest dated Licchavi stone inscription (464 AD), was commissioned during the reign of which ruler?',
    questionNe:
      'नेपालको सबैभन्दा पुरानो प्रामाणिक लिच्छविकालीन अभिलेख (सन् ४६४) रहेको चाँगुनारायण मन्दिरको शिलालेख कुन शासकको पालामा राखिएको थियो?',
    options: [
      { key: 'A', text: 'Yalamber', textNe: 'यलम्बर' },
      { key: 'B', text: 'Manadeva I', textNe: 'मानदेव प्रथम' },
      { key: 'C', text: 'Amshuverma', textNe: 'अंशुवर्मा' },
      { key: 'D', text: 'Jayasthiti Malla', textNe: 'जयस्थिति मल्ल' },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'King Manadeva I erected the famous 464 AD (Sambat 386) pillar inscription at Changunarayan, marking the earliest verified chronological record in Nepalese history.',
    explanationNe:
      'लिच्छवि राजा मानदेव प्रथमले सन् ४६४ (शक संवत् ३८६) मा चाँगुनारायण मन्दिरमा प्रसिद्ध स्तम्भ शिलालेख स्थापना गरेका थिए, जुन नेपालको इतिहासको सबैभन्दा पुरानो प्रामाणिक अभिलेख मानिन्छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Nepal Parichaya: Historical Timeline & Modern Transition',
    sourcePath: '/materials/nepal-parichaya-history.pdf',
  },
  {
    id: 'PSC-CUL-106',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge',
    subject: 'History & Culture of Nepal',
    topicId: 'CUL-HER',
    topic: 'National Heritage & Demographics',
    subtopicId: 'CUL-HER-01',
    subtopic: 'UNESCO World Heritage Sites',
    question:
      'Which of the following are inscribed as UNESCO Natural World Heritage Sites in Nepal? (Select all correct options)',
    questionNe:
      'तलकामध्ये नेपालका कुन-कुन सम्पदा युनेस्को (UNESCO) विश्व प्राकृतिक सम्पदा सूचीमा सूचीकृत छन्? (सही सबै विकल्प छान्नुहोस्)',
    options: [
      {
        key: 'A',
        text: 'Sagarmatha National Park (inscribed 1979)',
        textNe: 'सगरमाथा राष्ट्रिय निकुञ्ज (सन् १९७९ मा सूचीकृत)',
      },
      {
        key: 'B',
        text: 'Lumbini, the Birthplace of Lord Buddha',
        textNe: 'भगवान् बुद्धको जन्मस्थल लुम्बिनी',
      },
      {
        key: 'C',
        text: 'Chitwan National Park (inscribed 1984)',
        textNe: 'चितवन राष्ट्रिय निकुञ्ज (सन् १९८४ मा सूचीकृत)',
      },
      {
        key: 'D',
        text: 'Kathmandu Valley Monument Zones',
        textNe: 'काठमाडौं उपत्यका स्मारक क्षेत्रहरू',
      },
    ],
    correct_options: ['A', 'C'],
    is_multi_select: true,
    explanation:
      'Sagarmatha National Park (1979) and Chitwan National Park (1984) are Nepal’s two UNESCO Natural World Heritage Sites, whereas Kathmandu Valley (1979) and Lumbini (1997) are UNESCO Cultural World Heritage Sites.',
    explanationNe:
      'सगरमाथा राष्ट्रिय निकुञ्ज (सन् १९७९) र चितवन राष्ट्रिय निकुञ्ज (सन् १९८४) नेपालका दुई युनेस्को विश्व प्राकृतिक सम्पदा हुन्, जबकि काठमाडौं उपत्यका (सन् १९७९) र लुम्बिनी (सन् १९९७) सांस्कृतिक विश्व सम्पदा सूचीमा पर्दछन्।',
    difficulty: 'Medium',
    marks: 2,
    sourceTitle: 'Nepal Parichaya: Culture, Languages & National Heritage',
    sourcePath: '/materials/nepal-parichaya-culture-heritage.pdf',
  },
  {
    id: 'PSC-FED-107',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba / Kharidar target',
    paper: 'Paper I: General Knowledge',
    subject: 'Geography of Nepal',
    topicId: 'FED-STR',
    topic: 'Federal Administrative Structure',
    subtopicId: 'FED-STR-01',
    subtopic: 'Local Government Units',
    question:
      'How many total local government units operate under Nepal’s three-tier federal structure?',
    questionNe:
      'नेपालको तीन तहको संघीय संरचनाअन्तर्गत हाल कुल कति स्थानीय तहहरू सञ्चालनमा छन्?',
    options: [
      { key: 'A', text: '77 units', textNe: '७७ वटा' },
      { key: 'B', text: '165 units', textNe: '१६५ वटा' },
      { key: 'C', text: '460 units', textNe: '४६० वटा' },
      { key: 'D', text: '753 units', textNe: '७५३ वटा' },
    ],
    correct_options: ['D'],
    is_multi_select: false,
    explanation:
      'Nepal has 753 local government units comprising 6 Metropolitan Cities, 11 Sub-Metropolitan Cities, 276 Municipalities, and 460 Rural Municipalities (Gaunpalikas).',
    explanationNe:
      'नेपालमा ६ महानगरपालिका, ११ उपमहानगरपालिका, २७६ नगरपालिका र ४६० गाउँपालिका गरी जम्मा ७५३ वटा स्थानीय तहहरू रहेका छन्।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Nepal Parichaya: Federal Structure & Local Governance',
    sourcePath: '/materials/nepal-parichaya-federal-structure.pdf',
  },
  {
    id: 'PSC-FED-108',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge',
    subject: 'Geography of Nepal',
    topicId: 'FED-STR',
    topic: 'Federal Administrative Structure',
    subtopicId: 'FED-STR-02',
    subtopic: 'Provincial Geography',
    question:
      'Which province is the largest in geographical area among the seven provinces of Nepal?',
    questionNe:
      'नेपालका सात प्रदेशहरूमध्ये भौगोलिक क्षेत्रफलका आधारमा सबैभन्दा ठूलो प्रदेश कुन हो?',
    options: [
      { key: 'A', text: 'Koshi Province', textNe: 'कोशी प्रदेश' },
      { key: 'B', text: 'Bagmati Province', textNe: 'बागमती प्रदेश' },
      { key: 'C', text: 'Gandaki Province', textNe: 'गण्डकी प्रदेश' },
      { key: 'D', text: 'Karnali Province', textNe: 'कर्णाली प्रदेश' },
    ],
    correct_options: ['D'],
    is_multi_select: false,
    explanation:
      'Karnali Province (capital Birendranagar) is the largest province of Nepal by geographical area, covering approximately 27,984 sq. km.',
    explanationNe:
      'करिब २७,९८४ वर्ग किलोमिटर क्षेत्रफल ओगटेको कर्णाली प्रदेश (राजधानी वीरेन्द्रनगर) क्षेत्रफलका आधारमा नेपालको सबैभन्दा ठूलो प्रदेश हो।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Nepal Parichaya: Federal Structure & Local Governance',
    sourcePath: '/materials/nepal-parichaya-federal-structure.pdf',
  },
  {
    id: 'PSC-GEO-109',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge',
    subject: 'Geography of Nepal',
    topicId: 'GEO-PHY',
    topic: 'Physical Geography',
    subtopicId: 'GEO-PHY-03',
    subtopic: 'Himalayan Peaks',
    question:
      'What is the revised official elevation of Mount Sagarmatha (Everest) jointly announced by Nepal and China in December 2020?',
    questionNe:
      'सन् २०२० डिसेम्बरमा नेपाल र चीनद्वारा संयुक्त रूपमा घोषणा गरिएको सगरमाथाको अद्यावधिक आधिकारिक उचाइ कति हो?',
    options: [
      { key: 'A', text: '8,844.43 meters', textNe: '८,८४४.४३ मिटर' },
      { key: 'B', text: '8,848.00 meters', textNe: '८,८४८.०० मिटर' },
      { key: 'C', text: '8,848.86 meters', textNe: '८,८४८.८६ मिटर' },
      { key: 'D', text: '8,850.12 meters', textNe: '८,८५०.१२ मिटर' },
    ],
    correct_options: ['C'],
    is_multi_select: false,
    explanation:
      'On 8 December 2020 (23 Mangsir 2077 BS), Nepal and China jointly announced the newly surveyed orthometric height of Mount Sagarmatha (Everest) as 8,848.86 meters above sea level.',
    explanationNe:
      'वि.सं. २०७७ मंसिर २३ (८ डिसेम्बर २०२०) मा नेपाल र चीनले संयुक्त रूपमा सगरमाथाको नयाँ नापी गरिएको आधिकारिक उचाइ समुद्र सतहबाट ८,८४८.८६ मिटर रहेको घोषणा गरेका थिए।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Nepal Parichaya: Physical Geography & Ecological Belts',
    sourcePath: '/materials/nepal-parichaya-geography.pdf',
  },
  {
    id: 'PSC-GEO-110',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Paper I: General Knowledge',
    subject: 'Geography of Nepal',
    topicId: 'GEO-HYD',
    topic: 'Hydrology & Protected Areas',
    subtopicId: 'GEO-HYD-01',
    subtopic: 'River Systems',
    question:
      'Which river system is Nepal’s largest by drainage basin and water discharge, and which of its seven tributaries is the smallest?',
    questionNe:
      'जलाधार क्षेत्र र जलप्रवाहका हिसाबले नेपालको सबैभन्दा ठूलो नदी प्रणाली कुन हो र यसका सात सहायक नदीमध्ये सबैभन्दा सानो कुन हो?',
    options: [
      { key: 'A', text: 'Sapta Koshi — Likhu', textNe: 'सप्तकोशी — लिखु' },
      {
        key: 'B',
        text: 'Sapta Gandaki — Trishuli',
        textNe: 'सप्तगण्डकी — त्रिशूली',
      },
      { key: 'C', text: 'Karnali — Tila', textNe: 'कर्णाली — तिला' },
      { key: 'D', text: 'Sapta Koshi — Arun', textNe: 'सप्तकोशी — अरुण' },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'The Sapta Koshi is Nepal’s largest river basin by drainage area and discharge; among its seven tributaries (Indrawati, Sun Koshi, Tama Koshi, Dudh Koshi, Likhu, Arun, and Tamor), Arun is the largest and Likhu is the smallest.',
    explanationNe:
      'सप्तकोशी जलाधार क्षेत्र र जलप्रवाहका आधारमा नेपालको सबैभन्दा ठूलो नदी प्रणाली हो; यसका सात सहायक नदी (इन्द्रावती, सुनकोशी, तामाकोशी, दूधकोशी, लिखु, अरुण र तमोर) मध्ये अरुण सबैभन्दा ठूलो र लिखु सबैभन्दा सानो सहायक नदी हो।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Nepal Parichaya: Physical Geography & Ecological Belts',
    sourcePath: '/materials/nepal-parichaya-geography.pdf',
  },
  {
    id: 'PSC-GEO-111',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge',
    subject: 'Geography of Nepal',
    topicId: 'GEO-HYD',
    topic: 'Hydrology & Protected Areas',
    subtopicId: 'GEO-HYD-02',
    subtopic: 'Lakes & Wetlands',
    question:
      'In which districts are Rara Lake (Nepal’s largest freshwater lake) and Shey Phoksundo Lake (Nepal’s deepest lake) respectively located?',
    questionNe:
      'नेपालको सबैभन्दा ठूलो ताल रारा र सबैभन्दा गहिरो ताल शे-फोक्सुन्डो क्रमशः कुन-कुन जिल्लामा अवस्थित छन्?',
    options: [
      {
        key: 'A',
        text: 'Jumla District (Rara) and Kaski District (Shey Phoksundo)',
        textNe: 'जुम्ला जिल्ला (रारा) र कास्की जिल्ला (शे-फोक्सुन्डो)',
      },
      {
        key: 'B',
        text: 'Mustang District (Rara) and Manang District (Shey Phoksundo)',
        textNe: 'मुस्ताङ जिल्ला (रारा) र मनाङ जिल्ला (शे-फोक्सुन्डो)',
      },
      {
        key: 'C',
        text: 'Bajura District (Rara) and Solukhumbu District (Shey Phoksundo)',
        textNe: 'बाजुरा जिल्ला (रारा) र सोलुखुम्बु जिल्ला (शे-फोक्सुन्डो)',
      },
      {
        key: 'D',
        text: 'Mugu District (Rara) and Dolpa District (Shey Phoksundo)',
        textNe: 'मुगु जिल्ला (रारा) र डोल्पा जिल्ला (शे-फोक्सुन्डो)',
      },
    ],
    correct_options: ['D'],
    is_multi_select: false,
    explanation:
      'Rara Lake (Mahendra Tal) in Mugu District is Nepal’s largest lake (~10.8 sq. km), while alpine oligotrophic Shey Phoksundo Lake in Dolpa District is Nepal’s deepest lake (~145 m).',
    explanationNe:
      'मुगु जिल्लामा अवस्थित रारा ताल (महेन्द्र ताल) नेपालको सबैभन्दा ठूलो ताल (करिब १०.८ वर्ग कि.मि.) हो भने डोल्पा जिल्लाको शे-फोक्सुन्डो ताल नेपालको सबैभन्दा गहिरो ताल (करिब १४५ मिटर) हो।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Nepal Parichaya: Physical Geography & Ecological Belts',
    sourcePath: '/materials/nepal-parichaya-geography.pdf',
  },
  {
    id: 'PSC-GEO-112',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge',
    subject: 'Geography of Nepal',
    topicId: 'GEO-HYD',
    topic: 'Hydrology & Protected Areas',
    subtopicId: 'GEO-HYD-03',
    subtopic: 'Protected Areas & National Parks',
    question:
      'Which was the first national park established in Nepal (1973 AD / 2030 BS), and which is the largest national park by area?',
    questionNe:
      'नेपालमा स्थापना भएको पहिलो राष्ट्रिय निकुञ्ज (सन् १९७३ / वि.सं. २०३०) कुन हो र क्षेत्रफलका आधारमा सबैभन्दा ठूलो राष्ट्रिय निकुञ्ज कुन हो?',
    options: [
      {
        key: 'A',
        text: 'Sagarmatha National Park (first) and Bardiya National Park (largest)',
        textNe: 'सगरमाथा राष्ट्रिय निकुञ्ज (पहिलो) र बर्दिया राष्ट्रिय निकुञ्ज (सबैभन्दा ठूलो)',
      },
      {
        key: 'B',
        text: 'Chitwan National Park (first) and Shey Phoksundo National Park (largest)',
        textNe: 'चितवन राष्ट्रिय निकुञ्ज (पहिलो) र शे-फोक्सुन्डो राष्ट्रिय निकुञ्ज (सबैभन्दा ठूलो)',
      },
      {
        key: 'C',
        text: 'Langtang National Park (first) and Makalu Barun National Park (largest)',
        textNe: 'लाङटाङ राष्ट्रिय निकुञ्ज (पहिलो) र मकालु वरुण राष्ट्रिय निकुञ्ज (सबैभन्दा ठूलो)',
      },
      {
        key: 'D',
        text: 'Chitwan National Park (first) and Rara National Park (largest)',
        textNe: 'चितवन राष्ट्रिय निकुञ्ज (पहिलो) र रारा राष्ट्रिय निकुञ्ज (सबैभन्दा ठूलो)',
      },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'Chitwan National Park was gazetted in 1973 AD (2030 BS) as Nepal’s first national park, whereas Shey Phoksundo National Park (3,555 sq. km across Dolpa and Mugu) is the largest national park in Nepal.',
    explanationNe:
      'वि.सं. २०३० (सन् १९७३) मा स्थापित चितवन राष्ट्रिय निकुञ्ज नेपालको पहिलो राष्ट्रिय निकुञ्ज हो भने डोल्पा र मुगु जिल्लामा ३,५५५ वर्ग कि.मि. मा फैलिएको शे-फोक्सुन्डो राष्ट्रिय निकुञ्ज नेपालको सबैभन्दा ठूलो राष्ट्रिय निकुञ्ज हो।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Nepal Parichaya: Physical Geography & Ecological Belts',
    sourcePath: '/materials/nepal-parichaya-geography.pdf',
  },
  {
    id: 'PSC-HIS-113',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge',
    subject: 'History & Culture of Nepal',
    topicId: 'HIS-ANC',
    topic: 'Ancient & Medieval History',
    subtopicId: 'HIS-ANC-01',
    subtopic: 'Kirat Dynasty',
    question:
      'Who is recognized in Nepalese chronicles as the founder of the Kirat dynasty in the Kathmandu Valley, and how many Kirat kings are traditionally recorded?',
    questionNe:
      'नेपालको वंशावलीअनुसार काठमाडौं उपत्यकामा किरात वंशका संस्थापक कसलाई मानिन्छ र परम्परागत रूपमा कति जना किरात राजाहरूले शासन गरेको उल्लेख पाइन्छ?',
    options: [
      {
        key: 'A',
        text: 'Yalamber — 29 to 32 kings',
        textNe: 'यलम्बर — २९ देखि ३२ जना राजा',
      },
      { key: 'B', text: 'Gasti — 18 kings', textNe: 'गस्ती — १८ जना राजा' },
      {
        key: 'C',
        text: 'Bhumiverma — 24 kings',
        textNe: 'भूमिवर्मा — २४ जना राजा',
      },
      {
        key: 'D',
        text: 'Vrishadeva — 40 kings',
        textNe: 'वृषदेव — ४० जना राजा',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Yalamber founded Kirat rule in the Kathmandu Valley after defeating Mahispal king Bhuvansingh; traditional Vamshavali chronicles record 29 to 32 Kirat rulers ending with King Gasti.',
    explanationNe:
      'महिषपाल वंशी अन्तिम राजा भुवनसिंहलाई पराजित गरी यलम्बरले काठमाडौं उपत्यकामा किरात शासनको स्थापना गरेका थिए। विभिन्न वंशावलीमा अन्तिम राजा गस्तीसम्म २९ देखि ३२ जना किरात राजाहरूले शासन गरेको उल्लेख छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Nepal Parichaya: Historical Timeline & Modern Transition',
    sourcePath: '/materials/nepal-parichaya-history.pdf',
  },
  {
    id: 'PSC-HIS-114',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge',
    subject: 'History & Culture of Nepal',
    topicId: 'HIS-MOD',
    topic: 'Modern History & Reforms',
    subtopicId: 'HIS-MOD-01',
    subtopic: 'Unification Campaign',
    question:
      'During which traditional festival in 1768 AD (1825 BS) did King Prithvi Narayan Shah’s forces capture Kantipur, establishing Kathmandu as the capital of unified Nepal?',
    questionNe:
      'वि.सं. १८२५ (सन् १७६८) मा कुन परम्परागत जात्राका दिन पृथ्वीनारायण शाहको फौजले कान्तिपुरमा विजय प्राप्त गरी काठमाडौंलाई एकीकृत नेपालको राजधानी बनाएको थियो?',
    options: [
      { key: 'A', text: 'Bisket Jatra', textNe: 'बिस्केट जात्रा' },
      {
        key: 'B',
        text: 'Rato Machhindranath Jatra',
        textNe: 'रातो मच्छिन्द्रनाथ जात्रा',
      },
      { key: 'C', text: 'Indra Jatra', textNe: 'इन्द्रजात्रा' },
      { key: 'D', text: 'Gai Jatra', textNe: 'गाईजात्रा' },
    ],
    correct_options: ['C'],
    is_multi_select: false,
    explanation:
      'On Ashwin 13, 1825 BS (25 September 1768 AD), during Indra Jatra celebrations, King Prithvi Narayan Shah entered Kantipur and established Kathmandu as the capital of unified Nepal.',
    explanationNe:
      'वि.सं. १८२५ आश्विन १३ (सन् १७६८ सेप्टेम्बर २५) का दिन इन्द्रजात्रा चलिरहेका बेला पृथ्वीनारायण शाहले कान्तिपुरमा प्रवेश गरी विजय हासिल गर्दै काठमाडौंलाई एकीकृत नेपालको राजधानी बनाएका थिए।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Nepal Parichaya: Historical Timeline & Modern Transition',
    sourcePath: '/materials/nepal-parichaya-history.pdf',
  },
  {
    id: 'PSC-HIS-115',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Paper I: General Knowledge',
    subject: 'History & Culture of Nepal',
    topicId: 'HIS-MOD',
    topic: 'Modern History & Reforms',
    subtopicId: 'HIS-MOD-02',
    subtopic: 'Social Reform Decrees',
    question:
      'In which Bikram Sambat years were the Sati custom abolished and the abolition of Slavery (Kariya Mochan) proclaimed during Chandra Shumsher’s premiership?',
    questionNe:
      'चन्द्रशमशेरको शासनकालमा सती प्रथाको अन्त्य र दास प्रथा उन्मूलन (करिया मोचन) को घोषणा क्रमशः कुन-कुन विक्रम संवत् वर्षमा गरिएका थिए?',
    options: [
      {
        key: 'A',
        text: '1960 BS (Sati) and 1970 BS (Slavery)',
        textNe: 'वि.सं. १९६० (सती प्रथा) र वि.सं. १९७० (दास प्रथा)',
      },
      {
        key: 'B',
        text: '1977 BS (Sati) and 1981 BS (Slavery)',
        textNe: 'वि.सं. १९७७ (सती प्रथा) र वि.सं. १९८१ (दास प्रथा)',
      },
      {
        key: 'C',
        text: '1985 BS (Sati) and 1990 BS (Slavery)',
        textNe: 'वि.सं. १९८५ (सती प्रथा) र वि.सं. १९९० (दास प्रथा)',
      },
      {
        key: 'D',
        text: '1910 BS (Sati) and 1958 BS (Slavery)',
        textNe: 'वि.सं. १९१० (सती प्रथा) र वि.सं. १९५८ (दास प्रथा)',
      },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'Sati was formally abolished on 25 Ashadh 1977 BS (8 July 1920 AD), and the abolition of slavery was proclaimed in Mangsir 1981 BS (1924 AD) and enforced from Baisakh 1982 BS.',
    explanationNe:
      'वि.सं. १९७७ आषाढ २५ गते सती प्रथाको औपचारिक अन्त्य गरिएको थियो भने वि.सं. १९८१ मंसिरमा दास प्रथा उन्मूलन (करिया मोचन) को घोषणा भई वि.सं. १९८२ वैशाख १ देखि पूर्ण रूपमा लागू गरिएको थियो।',
    difficulty: 'Hard',
    marks: 1,
    sourceTitle: 'Nepal Parichaya: Historical Timeline & Modern Transition',
    sourcePath: '/materials/nepal-parichaya-history.pdf',
  },
  {
    id: 'PSC-CUL-116',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge',
    subject: 'History & Culture of Nepal',
    topicId: 'CUL-HER',
    topic: 'National Heritage & Demographics',
    subtopicId: 'CUL-HER-01',
    subtopic: 'UNESCO World Heritage Sites',
    question:
      'How many monument zones together compose the Kathmandu Valley UNESCO Cultural World Heritage Site (1979), and in which year was Lumbini inscribed?',
    questionNe:
      'सन् १९७९ मा युनेस्को विश्व सांस्कृतिक सम्पदामा सूचीकृत काठमाडौं उपत्यकाभित्र कतिवटा स्मारक क्षेत्रहरू समेटिएका छन् र लुम्बिनी कहिले सूचीकृत भएको हो?',
    options: [
      {
        key: 'A',
        text: '4 monument zones; Lumbini inscribed in 1992',
        textNe: '४ स्मारक क्षेत्र; लुम्बिनी सन् १९९२ मा सूचीकृत',
      },
      {
        key: 'B',
        text: '5 monument zones; Lumbini inscribed in 1984',
        textNe: '५ स्मारक क्षेत्र; लुम्बिनी सन् १९८४ मा सूचीकृत',
      },
      {
        key: 'C',
        text: '9 monument zones; Lumbini inscribed in 2001',
        textNe: '९ स्मारक क्षेत्र; लुम्बिनी सन् २००१ मा सूचीकृत',
      },
      {
        key: 'D',
        text: '7 monument zones; Lumbini inscribed in 1997',
        textNe: '७ स्मारक क्षेत्र; लुम्बिनी सन् १९९७ मा सूचीकृत',
      },
    ],
    correct_options: ['D'],
    is_multi_select: false,
    explanation:
      'Kathmandu Valley World Heritage Site comprises 7 monument zones (Hanuman Dhoka, Patan, and Bhaktapur Durbar Squares; Swayambhunath, Bauddhanath, Pashupatinath, and Changunarayan), while Lumbini was inscribed by UNESCO in 1997.',
    explanationNe:
      'काठमाडौं उपत्यका विश्व सम्पदा क्षेत्रमा ७ वटा स्मारक क्षेत्रहरू (हनुमानढोका, पाटन र भक्तपुर दरबार क्षेत्र; स्वयम्भूनाथ, बौद्धनाथ, पशुपतिनाथ र चाँगुनारायण) पर्दछन् भने लुम्बिनी सन् १९९७ मा युनेस्को विश्व सम्पदा सूचीमा सूचीकृत भएको हो।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Nepal Parichaya: Culture, Languages & National Heritage',
    sourcePath: '/materials/nepal-parichaya-culture-heritage.pdf',
  },
  {
    id: 'PSC-CUL-117',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Paper I: General Knowledge',
    subject: 'History & Culture of Nepal',
    topicId: 'CUL-HER',
    topic: 'National Heritage & Demographics',
    subtopicId: 'CUL-HER-02',
    subtopic: 'National Census 2078',
    question:
      'According to Nepal’s National Population and Housing Census 2078 BS (2021 AD), how many mother tongues are spoken in Nepal and what is the national literacy rate (age 5+)?',
    questionNe:
      'राष्ट्रिय जनगणना २०७८ अनुसार नेपालमा कतिवटा मातृभाषा बोलिन्छन् र देशको कुल साक्षरता दर (५ वर्ष र सोभन्दा माथि) कति प्रतिशत रहेको छ?',
    options: [
      {
        key: 'A',
        text: '92 languages; 65.9% literacy',
        textNe: '९२ भाषा; ६५.९% साक्षरता दर',
      },
      {
        key: 'B',
        text: '123 languages; 71.2% literacy',
        textNe: '१२३ भाषा; ७१.२% साक्षरता दर',
      },
      {
        key: 'C',
        text: '124 languages; 76.2% literacy',
        textNe: '१२४ भाषा; ७६.२% साक्षरता दर',
      },
      {
        key: 'D',
        text: '131 languages; 81.4% literacy',
        textNe: '१३१ भाषा; ८१.४% साक्षरता दर',
      },
    ],
    correct_options: ['C'],
    is_multi_select: false,
    explanation:
      'The 2078 BS (2021 AD) Census recorded a total population of 29,164,578 speaking 124 mother tongues across 142 caste/ethnic groups, with an overall literacy rate of 76.2% (83.6% male, 69.4% female).',
    explanationNe:
      'वि.सं. २०७८ को राष्ट्रिय जनगणनाले नेपालको कुल जनसंख्या २,९१,६४,५७८, जातजाति १४२, मातृभाषा १२४ र कुल साक्षरता दर ७६.२% (पुरुष ८३.६%, महिला ६९.४%) रहेको देखाएको छ।',
    difficulty: 'Hard',
    marks: 1,
    sourceTitle: 'Nepal Parichaya: Culture, Languages & National Heritage',
    sourcePath: '/materials/nepal-parichaya-culture-heritage.pdf',
  },
  {
    id: 'PSC-CUL-118',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba / Kharidar target',
    paper: 'Paper I: General Knowledge',
    subject: 'History & Culture of Nepal',
    topicId: 'CUL-HER',
    topic: 'National Heritage & Demographics',
    subtopicId: 'CUL-HER-03',
    subtopic: 'National Emblems',
    question:
      'Which Article and Schedule of the Constitution of Nepal define the geometric construction of Nepal’s crimson-and-blue double-pennon National Flag?',
    questionNe:
      'नेपालको संविधानको कुन धारा र अनुसूचीमा सिम्रिक रङ र नीलो किनारा भएको नेपालको राष्ट्रिय झण्डा बनाउने ज्यामितीय विधि उल्लेख गरिएको छ?',
    options: [
      {
        key: 'A',
        text: 'Article 8 and Schedule-1',
        textNe: 'धारा ८ र अनुसूची-१',
      },
      {
        key: 'B',
        text: 'Article 9 and Schedule-2',
        textNe: 'धारा ९ र अनुसूची-२',
      },
      {
        key: 'C',
        text: 'Article 9 and Schedule-3',
        textNe: 'धारा ९ र अनुसूची-३',
      },
      {
        key: 'D',
        text: 'Article 7 and Schedule-4',
        textNe: 'धारा ७ र अनुसूची-४',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Article 8 of the Constitution defines the National Flag of Nepal and Schedule-1 prescribes the exact mathematical method of drawing it; Schedule-2 contains the National Anthem and Schedule-3 depicts the Coat of Arms.',
    explanationNe:
      'संविधानको धारा ८ ले नेपालको राष्ट्रिय झण्डाबारे व्यवस्था गरेको छ र अनुसूची-१ मा झण्डा बनाउने गणितीय तथा ज्यामितीय तरिका उल्लेख छ; अनुसूची-२ मा राष्ट्रिय गान र अनुसूची-३ मा निशान छाप रहेको छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Nepal Parichaya: Culture, Languages & National Heritage',
    sourcePath: '/materials/nepal-parichaya-culture-heritage.pdf',
  },
  {
    id: 'PSC-FED-119',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge',
    subject: 'Geography of Nepal',
    topicId: 'FED-STR',
    topic: 'Federal Administrative Structure',
    subtopicId: 'FED-STR-02',
    subtopic: 'Provincial Geography',
    question:
      'Which province of Nepal has the smallest geographical area (~9,661 sq. km) and consists exclusively of eight Terai districts?',
    questionNe:
      'नेपालका सात प्रदेशमध्ये सबैभन्दा सानो क्षेत्रफल (करिब ९,६६१ वर्ग कि.मि.) भएको र तराईका आठ जिल्लामात्र समेटिएको प्रदेश कुन हो?',
    options: [
      { key: 'A', text: 'Lumbini Province', textNe: 'लुम्बिनी प्रदेश' },
      { key: 'B', text: 'Madhesh Province', textNe: 'मधेश प्रदेश' },
      { key: 'C', text: 'Bagmati Province', textNe: 'बागमती प्रदेश' },
      {
        key: 'D',
        text: 'Sudurpashchim Province',
        textNe: 'सुदूरपश्चिम प्रदेश',
      },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'Madhesh Province (capital Janakpurdham) stretches from Saptari to Parsa across eight Terai districts and covers approximately 9,661 sq. km, making it the smallest province by land area.',
    explanationNe:
      'सप्तरीदेखि पर्सासम्मका तराईका आठ जिल्लामात्र समेटिएको मधेश प्रदेश (राजधानी जनकपुरधाम) करिब ९,६६१ वर्ग किलोमिटर क्षेत्रफलसहित नेपालको सबैभन्दा सानो प्रदेश हो।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Nepal Parichaya: Federal Structure & Local Governance',
    sourcePath: '/materials/nepal-parichaya-federal-structure.pdf',
  },
  {
    id: 'PSC-FED-120',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Paper I: General Knowledge',
    subject: 'Geography of Nepal',
    topicId: 'FED-STR',
    topic: 'Federal Administrative Structure',
    subtopicId: 'FED-STR-03',
    subtopic: 'Schedule-4 District Distribution',
    question:
      'How are Nepal’s 77 districts distributed across the seven provinces under Schedule-4 of the Constitution of Nepal?',
    questionNe:
      'नेपालको संविधानको अनुसूची-४ अनुसार देशका ७७ वटै जिल्लाहरू सात प्रदेशमा कसरी विभाजित छन्?',
    options: [
      {
        key: 'A',
        text: 'Koshi (14), Madhesh (8), Bagmati (13), Gandaki (11), Lumbini (12), Karnali (10), Sudurpashchim (9)',
        textNe: 'कोशी (१४), मधेश (८), बागमती (१३), गण्डकी (११), लुम्बिनी (१२), कर्णाली (१०), सुदूरपश्चिम (९)',
      },
      {
        key: 'B',
        text: 'Koshi (12), Madhesh (8), Bagmati (14), Gandaki (11), Lumbini (12), Karnali (11), Sudurpashchim (9)',
        textNe: 'कोशी (१२), मधेश (८), बागमती (१४), गण्डकी (११), लुम्बिनी (१२), कर्णाली (११), सुदूरपश्चिम (९)',
      },
      {
        key: 'C',
        text: 'Koshi (14), Madhesh (9), Bagmati (13), Gandaki (10), Lumbini (12), Karnali (10), Sudurpashchim (9)',
        textNe: 'कोशी (१४), मधेश (९), बागमती (१३), गण्डकी (१०), लुम्बिनी (१२), कर्णाली (१०), सुदूरपश्चिम (९)',
      },
      {
        key: 'D',
        text: 'Koshi (13), Madhesh (8), Bagmati (13), Gandaki (11), Lumbini (13), Karnali (10), Sudurpashchim (9)',
        textNe: 'कोशी (१३), मधेश (८), बागमती (१३), गण्डकी (११), लुम्बिनी (१३), कर्णाली (१०), सुदूरपश्चिम (९)',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Schedule-4 organizes Nepal’s 77 districts as: Koshi (14), Madhesh (8), Bagmati (13), Gandaki (11), Lumbini (12, including Eastern Rukum), Karnali (10, including Western Rukum), and Sudurpashchim (9).',
    explanationNe:
      'संविधानको अनुसूची-४ बमोजिम ७७ जिल्लाहरू कोशी (१४), मधेश (८), बागमती (१३), गण्डकी (११), लुम्बिनी (१२ — पूर्वी रुकुमसहित), कर्णाली (१० — पश्चिम रुकुमसहित) र सुदूरपश्चिम (९) गरी विभाजित छन्।',
    difficulty: 'Hard',
    marks: 1,
    sourceTitle: 'Nepal Parichaya: Federal Structure & Local Governance',
    sourcePath: '/materials/nepal-parichaya-federal-structure.pdf',
  },
];

const LAWS_AND_CONSTITUTION_QUESTIONS: QuizQuestion[] = [
  {
    id: 'PSC-CON-201',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba / Kharidar target',
    paper: 'Paper II: Governance Systems',
    subject: 'Constitution & Governance',
    topicId: 'CON-STR',
    topic: 'Constitution of Nepal',
    subtopicId: 'CON-STR-01',
    subtopic: 'Parts, Articles & Schedules',
    question:
      'How is the Constitution of Nepal (promulgated on 3 Ashoj 2072 BS) formally structured?',
    questionNe:
      'वि.सं. २०७२ असोज ३ गते जारी भएको नेपालको संविधानको औपचारिक संरचना कस्तो रहेको छ?',
    options: [
      {
        key: 'A',
        text: '25 Parts, 250 Articles, and 7 Schedules',
        textNe: '२५ भाग, २५० धारा र ७ अनुसूची',
      },
      {
        key: 'B',
        text: '35 Parts, 308 Articles, and 9 Schedules',
        textNe: '३५ भाग, ३०८ धारा र ९ अनुसूची',
      },
      {
        key: 'C',
        text: '32 Parts, 301 Articles, and 8 Schedules',
        textNe: '३२ भाग, ३०१ धारा र ८ अनुसूची',
      },
      {
        key: 'D',
        text: '35 Parts, 315 Articles, and 10 Schedules',
        textNe: '३५ भाग, ३१५ धारा र १० अनुसूची',
      },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'The Constitution of Nepal (2072 BS / 2015 AD) comprises a Preamble, 35 Parts, 308 Articles, and 9 Schedules.',
    explanationNe:
      'नेपालको संविधान (२०७२) मा प्रस्तावना सहित ३५ भाग, ३०८ धारा र ९ अनुसूची रहेका छन्।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Constitution of Nepal (2072) — Core Articles & Rights',
    sourcePath: '/materials/constitution-of-nepal-2072.pdf',
  },
  {
    id: 'PSC-CON-202',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba / Kharidar target',
    paper: 'Paper II: Governance Systems',
    subject: 'Constitution & Governance',
    topicId: 'CON-STR',
    topic: 'Constitution of Nepal',
    subtopicId: 'CON-STR-02',
    subtopic: 'Fundamental Rights & Duties',
    question:
      'Which Part and Articles of the Constitution of Nepal enshrine Fundamental Rights and Duties?',
    questionNe:
      'नेपालको संविधानको कुन भाग र धाराहरूमा मौलिक हक र कर्तव्यको व्यवस्था गरिएको छ?',
    options: [
      { key: 'A', text: 'Part 2, Articles 10–15', textNe: 'भाग २, धारा १०–१५' },
      { key: 'B', text: 'Part 3, Articles 16–48', textNe: 'भाग ३, धारा १६–४८' },
      { key: 'C', text: 'Part 4, Articles 49–55', textNe: 'भाग ४, धारा ४९–५५' },
      { key: 'D', text: 'Part 5, Articles 56–60', textNe: 'भाग ५, धारा ५६–६०' },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'Part 3 of the Constitution covers Fundamental Rights and Duties: Articles 16–46 guarantee 31 fundamental rights, Article 47 covers implementation within three years, and Article 48 defines Duties of Citizens.',
    explanationNe:
      'संविधानको भाग ३ मा मौलिक हक र कर्तव्यको व्यवस्था छ: धारा १६ देखि ४६ सम्म ३१ वटा मौलिक हक, धारा ४७ मा मौलिक हकको कार्यान्वयन र धारा ४८ मा नागरिकका कर्तव्य उल्लेख छन्।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Constitution of Nepal (2072) — Core Articles & Rights',
    sourcePath: '/materials/constitution-of-nepal-2072.pdf',
  },
  {
    id: 'PSC-CON-203',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper II: Governance Systems',
    subject: 'Constitution & Governance',
    topicId: 'CON-ORG',
    topic: 'State Organs & Commissions',
    subtopicId: 'CON-ORG-01',
    subtopic: 'Federal Parliament',
    question:
      'What is the total membership of Nepal’s bicameral Federal Parliament (House of Representatives + National Assembly)?',
    questionNe:
      'नेपालको द्विसदनात्मक संघीय संसद् (प्रतिनिधिसभा + राष्ट्रियसभा) को कुल सदस्य संख्या कति रहेको छ?',
    options: [
      { key: 'A', text: '275 members', textNe: '२७५ सदस्य' },
      { key: 'B', text: '301 members', textNe: '३०१ सदस्य' },
      { key: 'C', text: '334 members', textNe: '३३४ सदस्य' },
      { key: 'D', text: '350 members', textNe: '३५० सदस्य' },
    ],
    correct_options: ['C'],
    is_multi_select: false,
    explanation:
      'The Federal Parliament consists of 275 members in the House of Representatives (165 FPTP + 110 Proportional) and 59 members in the National Assembly, totaling 334 members.',
    explanationNe:
      'संघीय संसद्मा प्रतिनिधिसभाका २७५ सदस्य (१६५ प्रत्यक्ष + ११० समानुपातिक) र राष्ट्रियसभाका ५९ सदस्य गरी जम्मा ३३४ सदस्य रहने व्यवस्था छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Constitution of Nepal (2072) — Core Articles & Rights',
    sourcePath: '/materials/constitution-of-nepal-2072.pdf',
  },
  {
    id: 'PSC-LAW-204',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper IV: Service-Group Law',
    subject: 'Public Administration & Law',
    topicId: 'LAW-CSA',
    topic: 'Civil Service Act, 2049',
    subtopicId: 'LAW-CSA-01',
    subtopic: 'Inclusive Recruitment',
    question:
      'Under the inclusive recruitment provisions of the Civil Service Act, 2049, what percentage of total vacant posts is set aside for the inclusive pool (counted as 100% for sub-allocation)?',
    questionNe:
      'निजामती सेवा ऐन, २०४९ को समावेशी पदपूर्ति व्यवस्थाअन्तर्गत खुला प्रतियोगिताद्वारा पूर्ति हुने पदमध्ये कति प्रतिशत पद छुट्याई सो प्रतिशतलाई शतप्रतिशत मानी समावेशी समूहहरूमा बाँडफाँट गरिन्छ?',
    options: [
      { key: 'A', text: '33%', textNe: '३३%' },
      { key: 'B', text: '40%', textNe: '४०%' },
      { key: 'C', text: '45%', textNe: '४५%' },
      { key: 'D', text: '50%', textNe: '५०%' },
    ],
    correct_options: ['C'],
    is_multi_select: false,
    explanation:
      'Section 7(7) of the Civil Service Act, 2049 allocates 45% of open-competition seats to the inclusive pool, subdivided into Women (33%), Adivasi/Janajati (27%), Madhesi (22%), Dalit (9%), Persons with Disability (5%), and Backward Area (4%).',
    explanationNe:
      'निजामती सेवा ऐन, २०४९ को दफा ७(७) अनुसार खुला प्रतियोगितातर्फको ४५% पद समावेशी समूहका लागि छुट्याइन्छ, जसलाई १००% मानी महिला (३३%), आदिवासी/जनजाति (२७%), मधेसी (२२%), दलित (९%), अपाङ्गता भएका व्यक्ति (५%) र पिछडिएको क्षेत्र (४%) का लागि आरक्षण गरिएको छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Civil Service Act, 2049 (1993) — Core Provisions',
    sourcePath: '/materials/civil-service-act-2049.pdf',
  },
  {
    id: 'PSC-LAW-205',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper IV: Service-Group Law',
    subject: 'Public Administration & Law',
    topicId: 'LAW-CSA',
    topic: 'Civil Service Act, 2049',
    subtopicId: 'LAW-CSA-01',
    subtopic: 'Inclusive Recruitment',
    question:
      'Within the 45% inclusive civil service pool (treated as 100%), what share is specifically reserved for Women candidates?',
    questionNe:
      'निजामती सेवाको ४५% समावेशी समूह (जसलाई शतप्रतिशत मानी विभाजन गरिन्छ) भित्र महिला उम्मेदवारहरूका लागि कति प्रतिशत स्थान आरक्षित गरिएको छ?',
    options: [
      { key: 'A', text: '22%', textNe: '२२%' },
      { key: 'B', text: '27%', textNe: '२७%' },
      { key: 'C', text: '33%', textNe: '३३%' },
      { key: 'D', text: '45%', textNe: '४५%' },
    ],
    correct_options: ['C'],
    is_multi_select: false,
    explanation:
      'When the 45% inclusive pool is treated as 100%, 33% of those inclusive seats are reserved for Women, followed by 27% for Adivasi/Janajati and 22% for Madhesi candidates.',
    explanationNe:
      '४५% समावेशी कोटालाई शतप्रतिशत मान्दा त्यसको ३३% स्थान महिलाका लागि र त्यसपछि २७% आदिवासी/जनजाति तथा २२% मधेसी उम्मेदवारका लागि आरक्षित गरिएको छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Civil Service Act, 2049 (1993) — Core Provisions',
    sourcePath: '/materials/civil-service-act-2049.pdf',
  },
  {
    id: 'PSC-LAW-206',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper II: Governance Systems',
    subject: 'Public Administration & Law',
    topicId: 'LAW-RTI',
    topic: 'Right to Information Act, 2064',
    subtopicId: 'LAW-RTI-01',
    subtopic: 'Urgent Life-Safety Disclosure',
    question:
      'Within how many hours must an Information Officer provide requested information if the request concerns the protection of an individual’s life or personal safety?',
    questionNe:
      'कुनै व्यक्तिको जीउ ज्यानको सुरक्षासँग सम्बन्धित सूचना माग गरिएकोमा सूचना अधिकारीले कति घण्टाभित्र सूचना उपलब्ध गराउनुपर्दछ?',
    options: [
      { key: 'A', text: 'Within 24 hours', textNe: '२४ घण्टाभित्र' },
      { key: 'B', text: 'Within 48 hours', textNe: '४८ घण्टाभित्र' },
      { key: 'C', text: 'Within 7 days', textNe: '७ दिनभित्र' },
      { key: 'D', text: 'Within 15 days', textNe: '१५ दिनभित्र' },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Under the Right to Information Act, 2064, standard requests must be fulfilled within 15 days, whereas information relating to the safety of an individual’s life must be provided within 24 hours.',
    explanationNe:
      'सूचनाको हक सम्बन्धी ऐन, २०६४ अनुसार सामान्य अवस्थाको सूचना १५ दिनभित्र दिनुपर्ने र कुनै व्यक्तिको जीउ ज्यानको सुरक्षासँग सम्बन्धित सूचना २४ घण्टाभित्र उपलब्ध गराउनुपर्ने कानुनी व्यवस्था छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Right to Information Act, 2064 (2007)',
    sourcePath: '/materials/right-to-information-act-2064.pdf',
  },
  {
    id: 'PSC-LAW-207',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper II: Governance Systems',
    subject: 'Public Administration & Law',
    topicId: 'LAW-RTI',
    topic: 'Right to Information Act, 2064',
    subtopicId: 'LAW-RTI-02',
    subtopic: 'Proactive Disclosure',
    question:
      'How frequently are public bodies required to proactively update and publish institutional information under Section 5 of the Right to Information Act, 2064?',
    questionNe:
      'सूचनाको हक सम्बन्धी ऐन, २०६४ को दफा ५ बमोजिम सार्वजनिक निकायले आफ्नो निकायसँग सम्बन्धित सूचनाहरू कति-कति समयमा अद्यावधिक गरी स्वतः प्रकाशन गर्नुपर्दछ?',
    options: [
      { key: 'A', text: 'Every month', textNe: 'प्रत्येक महिना' },
      { key: 'B', text: 'Every three months', textNe: 'प्रत्येक तीन-तीन महिनामा' },
      { key: 'C', text: 'Every six months', textNe: 'प्रत्येक छ महिनामा' },
      { key: 'D', text: 'Once every fiscal year', textNe: 'प्रत्येक आर्थिक वर्षमा एकपटक' },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'Public bodies must proactively classify, update, and publish prescribed institutional details every three months.',
    explanationNe:
      'सार्वजनिक निकायले ऐनको दफा ५ बमोजिम तोकिएका संस्थागत विवरणहरू प्रत्येक तीन-तीन महिनामा अद्यावधिक गरी सार्वजनिक गर्नुपर्दछ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Right to Information Act, 2064 (2007)',
    sourcePath: '/materials/right-to-information-act-2064.pdf',
  },
  {
    id: 'PSC-LAW-208',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba / Kharidar target',
    paper: 'Paper II: Governance Systems',
    subject: 'Public Administration & Law',
    topicId: 'LAW-GGA',
    topic: 'Good Governance Act, 2064',
    subtopicId: 'LAW-GGA-01',
    subtopic: 'Citizen Charter',
    question:
      'Which instrument is mandated by the Good Governance (Management and Operation) Act, 2064 at every public office facing citizens to specify required documents, fees, and service timelines?',
    questionNe:
      'सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन, २०६४ ले सेवाग्राहीलाई आवश्यक कागजात, लाग्ने दस्तुर र सेवा प्रदान गर्ने समयावधि स्पष्ट पार्न प्रत्येक सार्वजनिक कार्यालयमा अनिवार्य राख्नुपर्ने व्यवस्था गरेको दस्तावेज कुन हो?',
    options: [
      { key: 'A', text: 'Fiscal Audit Ledger', textNe: 'वित्तीय लेखापरीक्षण खाता' },
      {
        key: 'B',
        text: 'Citizen Charter (Nagarik Badapatra)',
        textNe: 'नागरिक बडापत्र (Citizen Charter)',
      },
      { key: 'C', text: 'Parliamentary Gazette Notice', textNe: 'संसदीय राजपत्र सूचना' },
      { key: 'D', text: 'Gazetted Seniority Roster', textNe: 'राजपत्रांकित ज्येष्ठता सूची' },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'Section 25 of the Good Governance Act, 2064 requires every public office delivering services to maintain a visible Citizen Charter (Nagarik Badapatra) stating service procedures, fees, responsible officials, and timeframes.',
    explanationNe:
      'सुशासन ऐन, २०६४ को दफा २५ अनुसार सेवा प्रवाह गर्ने प्रत्येक सरकारी कार्यालयले सेवाको प्रक्रिया, दस्तुर, जिम्मेवार पदाधिकारी र समयावधि स्पष्ट देखिने गरी नागरिक बडापत्र राख्नुपर्दछ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Good Governance (Management & Operation) Act, 2064',
    sourcePath: '/materials/good-governance-act-2064.pdf',
  },
  {
    id: 'PSC-CON-209',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Paper II: Governance Systems',
    subject: 'Constitution & Governance',
    topicId: 'CON-ORG',
    topic: 'State Organs & Commissions',
    subtopicId: 'CON-ORG-02',
    subtopic: 'Constitutional Bodies & Council',
    question:
      'How many Constitutional Commissions operate under Parts 21–27 of the Constitution of Nepal, and who chairs the Constitutional Council that recommends their appointments?',
    questionNe:
      'नेपालको संविधानको भाग २१ देखि २७ सम्म कतिवटा संवैधानिक आयोग/निकायहरूको व्यवस्था छ र तिनको नियुक्तिका लागि सिफारिस गर्ने संवैधानिक परिषद्को अध्यक्ष को हुन्छ?',
    options: [
      {
        key: 'A',
        text: '10 Commissions — chaired by the President',
        textNe: '१० आयोग — राष्ट्रपति अध्यक्ष',
      },
      {
        key: 'B',
        text: '12 Commissions — chaired by the Chief Justice',
        textNe: '१२ आयोग — प्रधानन्यायाधीश अध्यक्ष',
      },
      {
        key: 'C',
        text: '15 Commissions — chaired by the Speaker',
        textNe: '१५ आयोग — सभामुख अध्यक्ष',
      },
      {
        key: 'D',
        text: '13 Commissions — chaired by the Prime Minister',
        textNe: '१३ संवैधानिक आयोग/निकाय — प्रधानमन्त्री अध्यक्ष',
      },
    ],
    correct_options: ['D'],
    is_multi_select: false,
    explanation:
      'Parts 21–27 establish 13 Constitutional Bodies (CIAA, Auditor General, PSC, Election Commission, NHRC, NNRFC, plus 7 commissions in Part 27), whose officials are recommended by the Constitutional Council chaired by the Prime Minister under Article 284.',
    explanationNe:
      'संविधानको भाग २१–२७ मा १३ वटा संवैधानिक निकाय/आयोग (अख्तियार, महालेखापरीक्षक, लोक सेवा आयोग, निर्वाचन आयोग, मानव अधिकार आयोग, वित्त आयोग र भाग २७ अन्तर्गतका ७ आयोग) रहेका छन्, जसको सिफारिस धारा २८४ बमोजिम प्रधानमन्त्रीको अध्यक्षतामा रहने संवैधानिक परिषद्ले गर्दछ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Constitution of Nepal (2072) — Core Articles & Rights',
    sourcePath: '/materials/constitution-of-nepal-2072.pdf',
  },
  {
    id: 'PSC-CON-210',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Paper II: Governance Systems',
    subject: 'Constitution & Governance',
    topicId: 'CON-FED',
    topic: 'Federalism & Fiscal Transfers',
    subtopicId: 'CON-FED-01',
    subtopic: 'Constitutional Power Schedules',
    question:
      'Which Schedule of the Constitution of Nepal lists the 22 exclusive powers of the Local Level, and under which Article do unenumerated residual powers vest in the Federation?',
    questionNe:
      'नेपालको संविधानको कुन अनुसूचीमा स्थानीय तहका २२ वटा एकल अधिकारहरू सूचीकृत छन् र कुनै पनि तहको सूचीमा नपरेका अवशिष्ट अधिकार कुन धाराबमोजिम संघमा निहित हुन्छन्?',
    options: [
      { key: 'A', text: 'Schedule-8 and Article 58', textNe: 'अनुसूची-८ र धारा ५८' },
      { key: 'B', text: 'Schedule-6 and Article 57', textNe: 'अनुसूची-६ र धारा ५७' },
      { key: 'C', text: 'Schedule-7 and Article 59', textNe: 'अनुसूची-७ र धारा ५९' },
      { key: 'D', text: 'Schedule-9 and Article 60', textNe: 'अनुसूची-९ र धारा ६०' },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Schedule-5 lists 35 Federal powers, Schedule-6 lists 21 Provincial powers, Schedule-8 lists 22 Local Level exclusive powers, and Article 58 vests residual powers in the Federation.',
    explanationNe:
      'संविधानको अनुसूची-५ मा संघ (३५), अनुसूची-६ मा प्रदेश (२१) र अनुसूची-८ मा स्थानीय तहका २२ एकल अधिकार छन् भने धारा ५८ ले अवशिष्ट अधिकार संघमा निहित हुने व्यवस्था गरेको छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Constitution of Nepal (2072) — Core Articles & Rights',
    sourcePath: '/materials/constitution-of-nepal-2072.pdf',
  },
  {
    id: 'PSC-CON-211',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration / Judicial',
    post: 'Section Officer competitive examination target',
    paper: 'Paper II: Governance Systems',
    subject: 'Constitution & Governance',
    topicId: 'CON-ORG',
    topic: 'State Organs & Commissions',
    subtopicId: 'CON-ORG-03',
    subtopic: 'Judiciary & Constitutional Bench',
    question:
      'Under Part 11 of the Constitution of Nepal, what is the maximum number of Permanent Judges in the Supreme Court in addition to the Chief Justice, and how many judges sit on the Constitutional Bench?',
    questionNe:
      'नेपालको संविधानको भाग ११ बमोजिम सर्वोच्च अदालतमा प्रधानन्यायाधीशका अतिरिक्त बढीमा कति जना न्यायाधीश रहन्छन् र संवैधानिक इजलासमा कति जना न्यायाधीश रहन्छन्?',
    options: [
      {
        key: 'A',
        text: 'Up to 15 Judges; 3-judge Constitutional Bench',
        textNe: 'बढीमा १५ न्यायाधीश; ३ सदस्यीय संवैधानिक इजलास',
      },
      {
        key: 'B',
        text: 'Up to 19 Judges; 7-judge Constitutional Bench',
        textNe: 'बढीमा १९ न्यायाधीश; ७ सदस्यीय संवैधानिक इजलास',
      },
      {
        key: 'C',
        text: 'Up to 20 Judges; 5-judge Constitutional Bench (Chief Justice + 4 Judges)',
        textNe: 'बढीमा २० न्यायाधीश; ५ सदस्यीय संवैधानिक इजलास (प्रधानन्यायाधीश + ४ न्यायाधीश)',
      },
      {
        key: 'D',
        text: 'Up to 25 Judges; 9-judge Constitutional Bench',
        textNe: 'बढीमा २५ न्यायाधीश; ९ सदस्यीय संवैधानिक इजलास',
      },
    ],
    correct_options: ['C'],
    is_multi_select: false,
    explanation:
      'Article 129 provides for up to 20 Judges in addition to the Chief Justice in the Supreme Court, while Article 137 establishes a 5-member Constitutional Bench comprising the Chief Justice and four other Judges.',
    explanationNe:
      'संविधानको धारा १२९ अनुसार सर्वोच्च अदालतमा प्रधानन्यायाधीशका अतिरिक्त बढीमा २० जना न्यायाधीश रहन्छन् र धारा १३७ बमोजिम प्रधानन्यायाधीश र अन्य ४ न्यायाधीश गरी ५ सदस्यीय संवैधानिक इजलास गठन हुन्छ।',
    difficulty: 'Hard',
    marks: 1,
    sourceTitle: 'Constitution of Nepal (2072) — Core Articles & Rights',
    sourcePath: '/materials/constitution-of-nepal-2072.pdf',
  },
  {
    id: 'PSC-CON-212',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Paper II: Governance Systems',
    subject: 'Constitution & Governance',
    topicId: 'CON-STR',
    topic: 'Constitution of Nepal',
    subtopicId: 'CON-STR-03',
    subtopic: 'Unamendable Clauses (Article 274)',
    question:
      'Under Article 274(1) of the Constitution of Nepal, which core principles are permanently unamendable? (Select all correct options)',
    questionNe:
      'नेपालको संविधानको धारा २७४(१) बमोजिम कुन-कुन आधारभूत विषयहरूको प्रतिकूल हुने गरी संविधान संशोधन गर्न सकिँदैन? (मिल्ने सबै विकल्प छान्नुहोस्)',
    options: [
      {
        key: 'A',
        text: 'Sovereignty and territorial integrity of Nepal',
        textNe: 'नेपालको सार्वभौमिकता र भौगोलिक अखण्डता',
      },
      { key: 'B', text: 'Independence of Nepal', textNe: 'नेपालको स्वाधीनता' },
      {
        key: 'C',
        text: 'Sovereignty vested in the people',
        textNe: 'जनतामा निहित सार्वभौमसत्ता',
      },
      {
        key: 'D',
        text: 'Annual customs tariff rates and excise schedules',
        textNe: 'वार्षिक भन्सार दरबन्दी र अन्तःशुल्क अनुसूची',
      },
    ],
    correct_options: ['A', 'B', 'C'],
    is_multi_select: true,
    explanation:
      'Article 274(1) permanently prohibits any constitutional amendment prejudicial to Nepal’s sovereignty, territorial integrity, independence, and sovereignty vested in the people.',
    explanationNe:
      'संविधानको धारा २७४(१) ले नेपालको सार्वभौमिकता, भौगोलिक अखण्डता, स्वाधीनता र जनतामा निहित सार्वभौमसत्ताको प्रतिकूल हुने गरी संविधान संशोधन गर्न नपाइने स्थायी बन्देज लगाएको छ।',
    difficulty: 'Hard',
    marks: 2,
    sourceTitle: 'Constitution of Nepal (2072) — Core Articles & Rights',
    sourcePath: '/materials/constitution-of-nepal-2072.pdf',
  },
  {
    id: 'PSC-CON-213',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper II: Governance Systems',
    subject: 'Constitution & Governance',
    topicId: 'CON-ORG',
    topic: 'State Organs & Commissions',
    subtopicId: 'CON-ORG-04',
    subtopic: 'Public Service Commission',
    question:
      'Which Part and Article of the Constitution of Nepal establish the Public Service Commission (Lok Sewa Aayog), and what is the term of its Chairperson and four Members?',
    questionNe:
      'नेपालको संविधानको कुन भाग र धारामा लोक सेवा आयोगको व्यवस्था गरिएको छ तथा यसका अध्यक्ष र चार सदस्यहरूको पदावधि कति वर्ष हुन्छ?',
    options: [
      {
        key: 'A',
        text: 'Part 23, Article 242 — 6 years from appointment',
        textNe: 'भाग २३, धारा २४२ — नियुक्तिको मितिले ६ वर्ष',
      },
      {
        key: 'B',
        text: 'Part 21, Article 238 — 5 years from appointment',
        textNe: 'भाग २१, धारा २३८ — ५ वर्ष',
      },
      {
        key: 'C',
        text: 'Part 24, Article 245 — 4 years from appointment',
        textNe: 'भाग २४, धारा २४५ — ४ वर्ष',
      },
      {
        key: 'D',
        text: 'Part 22, Article 240 — 7 years from appointment',
        textNe: 'भाग २२, धारा २४० — ७ वर्ष',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Part 23, Article 242 establishes a five-member Public Service Commission (Chairperson and four Members) appointed for a six-year term, subject to mandatory retirement at age 65.',
    explanationNe:
      'संविधानको भाग २३, धारा २४२ मा अध्यक्ष र चार सदस्य रहने लोक सेवा आयोगको व्यवस्था छ, जसको पदावधि नियुक्तिको मितिले ६ वर्ष (वा ६५ वर्ष उमेर पूरा नहुञ्जेल) हुन्छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Constitution of Nepal (2072) — Core Articles & Rights',
    sourcePath: '/materials/constitution-of-nepal-2072.pdf',
  },
  {
    id: 'PSC-LAW-214',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Paper IV: Service-Group Law',
    subject: 'Public Administration & Law',
    topicId: 'LAW-CSA',
    topic: 'Civil Service Act, 2049',
    subtopicId: 'LAW-CSA-02',
    subtopic: 'Tenure of Senior Officials',
    question:
      'Under the Civil Service Act, 2049, what are the fixed tenures of office for the Chief Secretary and a Government Secretary (Gazetted Special Class)?',
    questionNe:
      'निजामती सेवा ऐन, २०४९ बमोजिम मुख्य सचिव र सचिव (राजपत्रांकित विशिष्ट श्रेणी) को पदावधि क्रमशः कति-कति वर्ष निर्धारित गरिएको छ?',
    options: [
      {
        key: 'A',
        text: '2 years for Chief Secretary and 4 years for Secretary',
        textNe: 'मुख्य सचिव २ वर्ष र सचिव ४ वर्ष',
      },
      {
        key: 'B',
        text: '4 years for Chief Secretary and 6 years for Secretary',
        textNe: 'मुख्य सचिव ४ वर्ष र सचिव ६ वर्ष',
      },
      {
        key: 'C',
        text: '5 years for both Chief Secretary and Secretary',
        textNe: 'मुख्य सचिव र सचिव दुवै ५ वर्ष',
      },
      {
        key: 'D',
        text: '3 years for Chief Secretary and 5 years for Secretary',
        textNe: 'मुख्य सचिव ३ वर्ष र सचिव ५ वर्ष',
      },
    ],
    correct_options: ['D'],
    is_multi_select: false,
    explanation:
      'Under the Civil Service Act, 2049, the Chief Secretary serves a 3-year tenure and a Gazetted Special Class Secretary serves a 5-year tenure, subject to the statutory retirement age.',
    explanationNe:
      'निजामती सेवा ऐन, २०४९ अनुसार अनिर्वाय अवकाश उमेरको अधीनमा रही मुख्य सचिवको पदावधि ३ वर्ष र विशिष्ट श्रेणीको सचिवको पदावधि ५ वर्ष तोकिएको छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Civil Service Act, 2049 (1993) — Core Provisions',
    sourcePath: '/materials/civil-service-act-2049.pdf',
  },
  {
    id: 'PSC-LAW-215',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba / Kharidar target',
    paper: 'Paper IV: Service-Group Law',
    subject: 'Public Administration & Law',
    topicId: 'LAW-CSA',
    topic: 'Civil Service Act, 2049',
    subtopicId: 'LAW-CSA-03',
    subtopic: 'Probation Period',
    question:
      'Under Section 16 of the Civil Service Act, 2049, what is the probation period (Parikshan Kal) for newly appointed permanent civil employees?',
    questionNe:
      'निजामती सेवा ऐन, २०४९ को दफा १६ बमोजिम निजामती सेवाको पदमा स्थायी नियुक्ति हुने नयाँ कर्मचारीको परीक्षणकाल (Probation Period) कति अवधि रहन्छ?',
    options: [
      {
        key: 'A',
        text: 'Six months for female employees and one year for male employees',
        textNe: 'महिला कर्मचारीका लागि ६ महिना र पुरुष कर्मचारीका लागि १ वर्ष',
      },
      {
        key: 'B',
        text: 'Six months for all civil employees',
        textNe: 'सबै निजामती कर्मचारीका लागि ६ महिना',
      },
      {
        key: 'C',
        text: 'One year for all civil employees regardless of gender',
        textNe: 'लैङ्गिक भेदभावबिना सबै कर्मचारीका लागि १ वर्ष',
      },
      {
        key: 'D',
        text: 'One year for female employees and two years for male employees',
        textNe: 'महिला कर्मचारीका लागि १ वर्ष र पुरुष कर्मचारीका लागि २ वर्ष',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Section 16 of the Civil Service Act, 2049 sets a probation period of six months for women civil servants and one year for men civil servants appointed permanently through open competition.',
    explanationNe:
      'निजामती सेवा ऐन, २०४९ को दफा १६ अनुसार निजामती सेवाको स्थायी पदमा सुरु नियुक्ति पाउने महिला कर्मचारीको हकमा ६ महिना र पुरुष कर्मचारीको हकमा १ वर्ष परीक्षणकाल रहन्छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Civil Service Act, 2049 (1993) — Core Provisions',
    sourcePath: '/materials/civil-service-act-2049.pdf',
  },
  {
    id: 'PSC-LAW-216',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Paper IV: Service-Group Law',
    subject: 'Public Administration & Law',
    topicId: 'LAW-CSA',
    topic: 'Civil Service Act, 2049',
    subtopicId: 'LAW-CSA-04',
    subtopic: 'Reservation Review Cycle',
    question:
      'Under Section 7(11) of the Civil Service Act, 2049, how often must the percentage reservation under the 45% inclusive recruitment system be reviewed?',
    questionNe:
      'निजामती सेवा ऐन, २०४९ को दफा ७(११) बमोजिम ४५% समावेशी पदपूर्तिअन्तर्गत निर्धारण गरिएको प्रतिशत आरक्षणको पुनरावलोकन कति-कति वर्षमा गर्नुपर्ने व्यवस्था छ?',
    options: [
      { key: 'A', text: 'Every 5 years', textNe: 'प्रत्येक ५ वर्षमा' },
      { key: 'B', text: 'Every 8 years', textNe: 'प्रत्येक ८ वर्षमा' },
      { key: 'C', text: 'Every 10 years', textNe: 'प्रत्येक १० वर्षमा' },
      { key: 'D', text: 'Every 15 years', textNe: 'प्रत्येक १५ वर्षमा' },
    ],
    correct_options: ['C'],
    is_multi_select: false,
    explanation:
      'Section 7(11) of the Civil Service Act, 2049 stipulates that the inclusive seat percentages allocated under Section 7(7) shall be reviewed every 10 years.',
    explanationNe:
      'निजामती सेवा ऐन, २०४९ को दफा ७(११) ले दफा ७(७) बमोजिमको समावेशी पदपूर्ति प्रतिशतको प्रत्येक १० वर्षमा पुनरावलोकन गरिने व्यवस्था गरेको छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Civil Service Act, 2049 (1993) — Core Provisions',
    sourcePath: '/materials/civil-service-act-2049.pdf',
  },
  {
    id: 'PSC-LAW-217',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Paper II: Governance Systems',
    subject: 'Public Administration & Law',
    topicId: 'LAW-RTI',
    topic: 'Right to Information Act, 2064',
    subtopicId: 'LAW-RTI-03',
    subtopic: 'Complaint & NIC Appeal Timelines',
    question:
      'Under Sections 9 and 10 of the Right to Information Act, 2064, within how many days may a requester complain to the Chief of the Public Body if denied information, and subsequently appeal to the National Information Commission?',
    questionNe:
      'सूचनाको हक सम्बन्धी ऐन, २०६४ को दफा ९ र १० बमोजिम सूचना नपाएमा निवेदकले क्रमशः सार्वजनिक निकायको प्रमुखसमक्ष कति दिनभित्र उजुरी र सोउपर राष्ट्रिय सूचना आयोगमा कति दिनभित्र पुनरावेदन दिन सक्दछ?',
    options: [
      {
        key: 'A',
        text: 'Within 3 days to the Chief; within 15 days to the Commission',
        textNe: 'प्रमुखसमक्ष ३ दिनभित्र; आयोगमा १५ दिनभित्र',
      },
      {
        key: 'B',
        text: 'Within 15 days to the Chief; within 30 days to the Commission',
        textNe: 'प्रमुखसमक्ष १५ दिनभित्र; आयोगमा ३० दिनभित्र',
      },
      {
        key: 'C',
        text: 'Within 30 days to the Chief; within 60 days to the Commission',
        textNe: 'प्रमुखसमक्ष ३० दिनभित्र; आयोगमा ६० दिनभित्र',
      },
      {
        key: 'D',
        text: 'Within 7 days to the Chief; within 35 days to the Commission',
        textNe: 'कार्यालय प्रमुखसमक्ष ७ दिनभित्र; राष्ट्रिय सूचना आयोगमा ३५ दिनभित्र',
      },
    ],
    correct_options: ['D'],
    is_multi_select: false,
    explanation:
      'If an Information Officer denies or fails to supply information, the applicant may complain to the Office Chief within 7 days (Section 9) and appeal the Chief’s decision to the National Information Commission within 35 days (Section 10).',
    explanationNe:
      'सूचना अधिकारीले सूचना नदिएमा दफा ९ अनुसार ७ दिनभित्र कार्यालय प्रमुखसमक्ष उजुरी दिन र प्रमुखको निर्णयउपर चित्त नबुझेमा दफा १० अनुसार ३५ दिनभित्र राष्ट्रिय सूचना आयोगमा पुनरावेदन दिन सकिन्छ।',
    difficulty: 'Hard',
    marks: 1,
    sourceTitle: 'Right to Information Act, 2064 (2007)',
    sourcePath: '/materials/right-to-information-act-2064.pdf',
  },
  {
    id: 'PSC-LAW-218',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Paper II: Governance Systems',
    subject: 'Public Administration & Law',
    topicId: 'LAW-RTI',
    topic: 'Right to Information Act, 2064',
    subtopicId: 'LAW-RTI-04',
    subtopic: 'Statutory Disclosure Exemptions',
    question:
      'How many specific categories of sensitive information are exempted from disclosure under Section 3(3) of the Right to Information Act, 2064?',
    questionNe:
      'सूचनाको हक सम्बन्धी ऐन, २०६४ को दफा ३(३) अन्तर्गत सार्वजनिक निकायले प्रवाह नगर्ने भनी कतिवटा संवेदनशील सूचनाका क्षेत्रहरू अपवादका रूपमा तोकिएका छन्?',
    options: [
      { key: 'A', text: 'Three categories', textNe: 'तीन क्षेत्र' },
      { key: 'B', text: 'Five categories', textNe: 'पाँच क्षेत्र' },
      { key: 'C', text: 'Eight categories', textNe: 'आठ क्षेत्र' },
      { key: 'D', text: 'Ten categories', textNe: 'दश क्षेत्र' },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'Section 3(3) exempts five specific categories: (1) national sovereignty/security, (2) ongoing criminal investigation/prosecution, (3) economic/commercial/banking secrets, (4) inter-caste or communal harmony, and (5) personal privacy and life/property safety.',
    explanationNe:
      'दफा ३(३) ले पाँच प्रकारका सूचना प्रवाह नहुने व्यवस्था गरेको छ: (१) राष्ट्रिय सार्वभौमसत्ता/सुरक्षा, (२) अपराध अनुसन्धान/तहकिकात, (३) आर्थिक/व्यापारिक/बैंकिङ गोपनीयता, (४) जातीय वा साम्प्रदायिक सद्भाव र (५) व्यक्तिगत गोपनीयता तथा जीउधनको सुरक्षा।',
    difficulty: 'Hard',
    marks: 1,
    sourceTitle: 'Right to Information Act, 2064 (2007)',
    sourcePath: '/materials/right-to-information-act-2064.pdf',
  },
  {
    id: 'PSC-LAW-219',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper II: Governance Systems',
    subject: 'Public Administration & Law',
    topicId: 'LAW-GGA',
    topic: 'Good Governance Act, 2064',
    subtopicId: 'LAW-GGA-02',
    subtopic: 'Accountability & Grievance Mechanisms',
    question:
      'Which citizen-interface mechanisms are mandated under the Good Governance (Management and Operation) Act, 2064 to promote public accountability and grievance redressal?',
    questionNe:
      'सार्वजनिक जवाफदेहिता र गुनासो सुनुवाइ प्रवर्द्धन गर्न सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन, २०६४ ले कुन-कुन नागरिकमैत्री संयन्त्रहरूको व्यवस्था गरेको छ?',
    options: [
      {
        key: 'A',
        text: 'Public Hearings (Sarbajanik Sunuwai), Grievance Boxes, Spokesperson, and Mobile Service (Ghumti Sewa)',
        textNe: 'सार्वजनिक सुनुवाइ, गुनासो पेटिका/व्यवस्थापन, प्रवक्ता र घुम्ती सेवा',
      },
      {
        key: 'B',
        text: 'Closed executive tribunals without public access',
        textNe: 'सार्वजनिक पहुँचबिनाका बन्द कार्यकारी न्यायाधिकरण',
      },
      {
        key: 'C',
        text: 'Mandatory High Court litigation for routine tax receipts',
        textNe: 'सामान्य कर रसिदका लागि उच्च अदालतमा अनिवार्य मुद्दा',
      },
      {
        key: 'D',
        text: 'Suspension of local service counters during audits',
        textNe: 'लेखापरीक्षण अवधिमा सेवा काउन्टर बन्द गर्ने व्यवस्था',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Alongside Citizen Charters (Section 25), the Good Governance Act, 2064 institutionalizes Mobile Service delivery (Section 26), Public Hearings (Section 30), Grievance Management (Section 31), and official Spokespersons (Section 35).',
    explanationNe:
      'नागरिक बडापत्र (दफा २५) का अतिरिक्त सुशासन ऐन, २०६४ ले घुम्ती सेवा (दफा २६), सार्वजनिक सुनुवाइ (दफा ३०), गुनासो व्यवस्थापन (दफा ३१) र प्रवक्ता तोक्ने (दफा ३५) व्यवस्था गरेको छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Good Governance (Management & Operation) Act, 2064',
    sourcePath: '/materials/good-governance-act-2064.pdf',
  },
  {
    id: 'PSC-LAW-220',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Paper II: Governance Systems',
    subject: 'Public Administration & Law',
    topicId: 'LAW-GGA',
    topic: 'Good Governance Act, 2064',
    subtopicId: 'LAW-GGA-03',
    subtopic: 'Time-Bound Administrative Decisions',
    question:
      'Under the Good Governance (Management and Operation) Act, 2064, what is required when an authorized official cannot decide an administrative matter within the prescribed statutory timeframe?',
    questionNe:
      'सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन, २०६४ बमोजिम अधिकारप्राप्त अधिकारीले तोकिएको समयसीमाभित्र कुनै विषयमा निर्णय गर्न नसकेमा के गर्नुपर्ने कानुनी कर्तव्य रहन्छ?',
    options: [
      {
        key: 'A',
        text: 'No written explanation is needed if the file remains pending',
        textNe: 'फाइल विचाराधीन रहेमा कुनै लिखित कारण खुलाउनु पर्दैन',
      },
      {
        key: 'B',
        text: 'The application automatically lapses after seven days',
        textNe: '७ दिनपछि निवेदन स्वतः खारेज हुन्छ',
      },
      {
        key: 'C',
        text: 'The applicant must resubmit all fees from scratch',
        textNe: 'सेवाग्राहीले सुरुदेखि नै पुनः सबै दस्तुर बुझाउनुपर्दछ',
      },
      {
        key: 'D',
        text: 'The official must record clear written reasons, inform the superior authority/service seeker, and answer for unreasonable delay',
        textNe: 'स्पष्ट लिखित कारण अभिलेख गरी माथिल्लो अधिकारी र सरोकारवालालाई जानकारी दिनुपर्दछ तथा मनासिब कारणबिना ढिलाइ भएमा जवाफदेही हुनुपर्दछ',
      },
    ],
    correct_options: ['D'],
    is_multi_select: false,
    explanation:
      'Sections 14–19 and 22 require time-bound transparent decision-making; if a decision cannot be taken on schedule, the official must state reasons in writing, escalate/inform appropriately, and bear departmental accountability for unjustified delay.',
    explanationNe:
      'दफा १४–१९ र २२ ले समयबद्ध र पारदर्शी निर्णयको व्यवस्था गरेका छन्; तोकिएको अवधिमा निर्णय गर्न नसकिएमा स्पष्ट लिखित आधार र कारण खुलाई माथिल्लो अधिकारी वा सेवाग्राहीलाई जानकारी दिनुपर्दछ तथा अनुचित ढिलाइमा विभागीय जवाफदेहिता वहन गर्नुपर्दछ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Good Governance (Management & Operation) Act, 2064',
    sourcePath: '/materials/good-governance-act-2064.pdf',
  },
];

const PSC_AND_PLANNING_QUESTIONS: QuizQuestion[] = [
  {
    id: 'PSC-ADM-301',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba / Kharidar target',
    paper: 'Paper I: Administrative Aptitude Test',
    subject: 'Public Administration & Law',
    topicId: 'PSC-EXM',
    topic: 'PSC Examination System',
    subtopicId: 'PSC-EXM-01',
    subtopic: 'Objective Negative Marking',
    question:
      'In the Public Service Commission (Lok Sewa) Phase I Objective MCQ test, what penalty is applied for each incorrect response?',
    questionNe:
      'लोक सेवा आयोगको प्रथम चरणको वस्तुगत बहुवैकल्पिक (MCQ) परीक्षामा प्रत्येक गलत उत्तरबापत कति अङ्क कट्टा गरिन्छ?',
    options: [
      { key: 'A', text: 'No negative marking', textNe: 'नकारात्मक अङ्क नकाटिने' },
      {
        key: 'B',
        text: '10% of the question’s marks deducted',
        textNe: 'प्रश्नको पूर्णाङ्कको १०% अङ्क कट्टा',
      },
      {
        key: 'C',
        text: '20% of the question’s marks deducted',
        textNe: 'प्रश्नको पूर्णाङ्कको २०% अङ्क कट्टा',
      },
      {
        key: 'D',
        text: '25% of the question’s marks deducted',
        textNe: 'प्रश्नको पूर्णाङ्कको २५% अङ्क कट्टा',
      },
    ],
    correct_options: ['C'],
    is_multi_select: false,
    explanation:
      'PSC objective multiple-choice examinations deduct 20% of the assigned mark for each wrong answer, while leaving a question blank incurs zero penalty.',
    explanationNe:
      'लोक सेवा आयोगको वस्तुगत बहुवैकल्पिक परीक्षामा प्रत्येक गलत उत्तरका लागि निर्धारित अङ्कभारको २०% अङ्क कट्टा गरिन्छ, तर अनुत्तरित (खाली) छोडिएको प्रश्नमा अङ्क काटिँदैन।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'PSC Gazetted Third Class (Section Officer) Syllabus',
    sourcePath: '/materials/psc-section-officer-syllabus.pdf',
  },
  {
    id: 'PSC-ADM-302',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Paper I: Administrative Aptitude Test',
    subject: 'Public Administration & Law',
    topicId: 'PSC-EXM',
    topic: 'PSC Examination System',
    subtopicId: 'PSC-EXM-02',
    subtopic: 'Section Officer Paper I Structure',
    question:
      'Which three components make up Paper I (Administrative Aptitude Test — 100 Marks) of the Gazetted Third Class (Section Officer) examination?',
    questionNe:
      'राजपत्रांकित तृतीय श्रेणी (शाखा अधिकृत) परीक्षाको प्रथम पत्र (प्रशासनिक अभिरुचि परीक्षण — १०० पूर्णाङ्क) मा कुन तीन विषयक्षेत्रहरू समावेश हुन्छन्?',
    options: [
      {
        key: 'A',
        text: 'Nepali Essay, Constitutional Law, and Accounting',
        textNe: 'नेपाली निबन्ध, संवैधानिक कानुन र लेखा',
      },
      {
        key: 'B',
        text: 'General Knowledge (50), General Mental Ability/IQ (30), and English Competence (20)',
        textNe: 'सामान्य ज्ञान (५०), सामान्य बौद्धिक परीक्षण/IQ (३०) र अंग्रेजी भाषा दक्षता (२०)',
      },
      {
        key: 'C',
        text: 'Geography (40), History (40), and Computer Skill Test (20)',
        textNe: 'भूगोल (४०), इतिहास (४०) र कम्प्युटर सीप परीक्षण (२०)',
      },
      {
        key: 'D',
        text: 'Public Policy (50), Economics (25), and Diplomacy (25)',
        textNe: 'सार्वजनिक नीति (५०), अर्थशास्त्र (२५) र कूटनीति (२५)',
      },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'Phase I Administrative Aptitude Test (100 marks, 90 minutes) comprises General Knowledge (50 marks), Aptitude/IQ (30 marks), and English Language Competence (20 marks).',
    explanationNe:
      'प्रथम चरणको प्रशासनिक अभिरुचि परीक्षण (१०० पूर्णाङ्क, ९० मिनेट) मा सामान्य ज्ञान (५० अङ्क), बौद्धिक परीक्षण/IQ (३० अङ्क) र अंग्रेजी भाषा ज्ञान (२० अङ्क) समावेश गरिएको हुन्छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'PSC Gazetted Third Class (Section Officer) Syllabus',
    sourcePath: '/materials/psc-section-officer-syllabus.pdf',
  },
  {
    id: 'PSC-ADM-303',
    level: 'Non-Gazetted First Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Nayab Subba competitive examination target',
    paper: 'Stage I: Preliminary Examination',
    subject: 'Public Administration & Law',
    topicId: 'PSC-EXM',
    topic: 'PSC Examination System',
    subtopicId: 'PSC-EXM-03',
    subtopic: 'Nayab Subba Stage I Qualifying Rule',
    question:
      'Under the official Lok Sewa Aayog Non-Gazetted First Class (Nayab Subba) examination scheme, what is the Stage I pass mark and how are Stage I marks treated in final merit?',
    questionNe:
      'लोक सेवा आयोगको आधिकारिक रा.प.अनं. प्रथम श्रेणी (नायब सुब्बा) परीक्षा प्रणालीअन्तर्गत प्रथम चरणको उत्तीर्णाङ्क कति हो र प्रथम चरणमा प्राप्त अङ्क अन्तिम योग्यताक्रममा कसरी गणना गरिन्छ?',
    options: [
      {
        key: 'A',
        text: '45 marks minimum (45%); Stage I is strictly qualifying and 0% of its marks are added to final merit',
        textNe: 'न्यूनतम ४५ अङ्क (४५%); प्रथम चरण केवल छनोट (Qualifying) हो र यसको ०% अङ्क मात्र अन्तिम योग्यताक्रममा जोडिन्छ (जोडिँदैन)',
      },
      {
        key: 'B',
        text: '40 marks minimum (40%); 50% of Stage I marks are carried forward into final merit',
        textNe: 'न्यूनतम ४० अङ्क (४०%); प्रथम चरणको ५०% अङ्क अन्तिम योग्यताक्रममा जोडिन्छ',
      },
      {
        key: 'C',
        text: '50 marks minimum (50%); 100% of Stage I marks are added to final merit',
        textNe: 'न्यूनतम ५० अङ्क (५०%); प्रथम चरणको १००% अङ्क अन्तिम योग्यताक्रममा जोडिन्छ',
      },
      {
        key: 'D',
        text: '35 marks minimum (35%); only GMAT/IQ marks are carried forward',
        textNe: 'न्यूनतम ३५ अङ्क (३५%); केवल GMAT/IQ अङ्क मात्र जोडिन्छ',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Under the official Lok Sewa Aayog Nayab Subba curriculum (2081 BS), candidates must score at least 45 out of 100 (45%) in Stage I (Preliminary Examination) to qualify for Stage II, and Stage I marks are NOT added to the 240-mark final merit (Paper II 100M + Paper III 100M + Computer Skill 10M + Interview 30M).',
    explanationNe:
      'लोक सेवा आयोगको आधिकारिक नायब सुब्बा पाठ्यक्रम (२०८१) अनुसार द्वितीय चरणमा प्रवेश गर्न प्रथम चरणमा १०० मा कम्तीमा ४५ अङ्क (४५%) ल्याउनुपर्दछ र प्रथम चरणको अङ्क २४० पूर्णाङ्कको अन्तिम योग्यताक्रम (पत्र २: १०० + पत्र ३: १०० + कम्प्युटर: १० + अन्तर्वार्ता: ३०) मा जोडिँदैन।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Official PSC Nayab Subba Syllabus — Phase I (GK & GMAT)',
    sourcePath: '/materials/official-psc/psc-official-nayab-subba-phase1.pdf',
  },
  {
    id: 'PSC-PLN-304',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'Economic Planning & Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper III: Contemporary Issues',
    subject: 'Development Planning',
    topicId: 'PLN-DEV',
    topic: 'Sixteenth Periodic Plan',
    subtopicId: 'PLN-DEV-01',
    subtopic: 'National Vision (2081/82–2085/86)',
    question:
      'What is the overarching vision of Nepal’s Sixteenth Periodic Plan (Fiscal Years 2081/82–2085/86)?',
    questionNe:
      'नेपालको सोह्रौँ आवधिक योजना (आर्थिक वर्ष २०८१/८२–२०८५/८६) को मूलभूत दीर्घकालीन सोच (Vision) के रहेको छ?',
    options: [
      {
        key: 'A',
        text: 'Rapid Privatization and Export Deregulation',
        textNe: 'तीव्र निजीकरण र निर्यात नियमन फुकुवा',
      },
      {
        key: 'B',
        text: 'Good Governance, Social Justice, and Prosperity',
        textNe: 'सुशासन, सामाजिक न्याय र समृद्धि',
      },
      {
        key: 'C',
        text: 'Zero Import Economy by 2085',
        textNe: '२०८५ सम्म शून्य आयात अर्थतन्त्र',
      },
      {
        key: 'D',
        text: 'Exclusive Heavy Industrialization',
        textNe: 'केवल भारी औद्योगिकीकरण',
      },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'The Sixteenth Periodic Plan (2081/82–2085/86) centers on the overarching national vision of "Good Governance, Social Justice, and Prosperity."',
    explanationNe:
      'सोह्रौँ आवधिक योजना (२०८१/८२–२०८५/८६) ले "सुशासन, सामाजिक न्याय र समृद्धि" लाई आफ्नो मूल सोच (Vision) का रूपमा अङ्गीकार गरेको छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Sixteenth Periodic Plan of Nepal (2081/82–2085/86)',
    sourcePath: '/materials/sixteenth-plan-summary.pdf',
  },
  {
    id: 'PSC-APT-305',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'Aptitude & IQ',
    post: 'Section Officer / Nayab Subba / Kharidar target',
    paper: 'Paper I: General Mental Ability',
    subject: 'General Mental Ability (IQ)',
    topicId: 'APT-NUM',
    topic: 'Quantitative & Numerical Reasoning',
    subtopicId: 'APT-NUM-01',
    subtopic: 'Number Series',
    question: 'Find the next number in the sequence: 3, 8, 15, 24, 35, ?',
    questionNe: 'दिइएको श्रेणीमा आउने अर्को संख्या पत्ता लगाउनुहोस्: ३, ८, १५, २४, ३५, ?',
    options: [
      { key: 'A', text: '46', textNe: '४६' },
      { key: 'B', text: '48', textNe: '४८' },
      { key: 'C', text: '49', textNe: '४९' },
      { key: 'D', text: '50', textNe: '५०' },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'Each term follows (n² - 1) starting at n = 2: 2²-1 = 3, 3²-1 = 8, 4²-1 = 15, 5²-1 = 24, 6²-1 = 35, and 7²-1 = 48 (consecutive odd differences +5, +7, +9, +11, +13).',
    explanationNe:
      'प्रत्येक पद n = २ बाट सुरु भई (n² - 1) ढाँचामा छ: २²-१=३, ३²-१=८, ४²-१=१५, ५²-१=२४, ६²-१=३५ र ७²-१=४८ (अन्तर क्रमशः +५, +७, +९, +११, +१३)।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'PSC General Knowledge & Aptitude Master Reference',
    sourcePath: '/materials/psc-gk-aptitude-outline.pdf',
  },
  {
    id: 'PSC-APT-306',
    level: 'Non-Gazetted Second Class',
    service: 'Federal Civil Service preparation',
    group: 'Aptitude & IQ',
    post: 'Kharidar / Nayab Subba target',
    paper: 'Paper I: General Mental Ability',
    subject: 'General Mental Ability (IQ)',
    topicId: 'APT-NUM',
    topic: 'Quantitative & Numerical Reasoning',
    subtopicId: 'APT-NUM-02',
    subtopic: 'Time & Work',
    question:
      'If an office digitization task takes 12 clerks 10 working days to complete, how many days will 15 clerks working at the same rate require?',
    questionNe:
      'कुनै कार्यालयको डिजिटलाइजेसन कार्य १२ जना कर्मचारीले १० कार्यदिनमा पूरा गर्दछन् भने सोही गतिमा काम गर्दा १५ जना कर्मचारीलाई उक्त कार्य पूरा गर्न कति दिन लाग्छ?',
    options: [
      { key: 'A', text: '6 days', textNe: '६ दिन' },
      { key: 'B', text: '7.5 days', textNe: '७.५ दिन' },
      { key: 'C', text: '8 days', textNe: '८ दिन' },
      { key: 'D', text: '9 days', textNe: '९ दिन' },
    ],
    correct_options: ['C'],
    is_multi_select: false,
    explanation:
      'Total work = 12 clerks × 10 days = 120 clerk-days. Dividing 120 clerk-days by 15 clerks yields 8 working days.',
    explanationNe:
      'कुल कार्य = १२ कर्मचारी × १० दिन = १२० मानव-दिन। १२० मानव-दिनलाई १५ कर्मचारीले भाग गर्दा ८ कार्यदिन लाग्दछ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'PSC Kharidar (Non-Gazetted Second Class) Syllabus',
    sourcePath: '/materials/psc-kharidar-syllabus.pdf',
  },
  {
    id: 'PSC-APT-307',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'Aptitude & IQ',
    post: 'Section Officer / Nayab Subba / Kharidar target',
    paper: 'Paper I: General Mental Ability',
    subject: 'General Mental Ability (IQ)',
    topicId: 'APT-NUM',
    topic: 'Quantitative & Numerical Reasoning',
    subtopicId: 'APT-NUM-03',
    subtopic: 'Percentage Change',
    question:
      'A municipal development budget increases by 20% in Year 1 and decreases by 10% in Year 2. What is the net percentage change over the two years?',
    questionNe:
      'कुनै नगरपालिकाको विकास बजेट पहिलो वर्ष २०% ले वृद्धि भई दोस्रो वर्ष १०% ले घट्छ भने दुई वर्षमा कुल खुद प्रतिशत परिवर्तन कति हुन्छ?',
    options: [
      { key: 'A', text: '+8%', textNe: '+८%' },
      { key: 'B', text: '+10%', textNe: '+१०%' },
      { key: 'C', text: '+12%', textNe: '+१२%' },
      { key: 'D', text: '+15%', textNe: '+१५%' },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Starting from 100: increasing by 20% gives 120; decreasing 120 by 10% (-12) gives 108, which is a net +8% increase.',
    explanationNe:
      'प्रारम्भिक बजेट १०० मान्दा: २०% बढ्दा १२० हुन्छ; १२० मा १०% (-१२) घट्दा १०८ हुन्छ, अर्थात् समग्रमा +८% वृद्धि हुन्छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'PSC Kharidar (Non-Gazetted Second Class) Syllabus',
    sourcePath: '/materials/psc-kharidar-syllabus.pdf',
  },
  {
    id: 'PSC-ADM-308',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge',
    subject: 'Public Administration & Law',
    topicId: 'PSC-EXM',
    topic: 'PSC Examination System',
    subtopicId: 'PSC-EXM-04',
    subtopic: 'GK Weightage & Syllabus Focus',
    question:
      'In PSC First Phase General Knowledge syllabi, which topic area typically carries the single highest unit weightage among core GK sections?',
    questionNe:
      'लोक सेवा आयोगको प्रथम चरणको सामान्य ज्ञान पाठ्यक्रममा मुख्य खण्डहरूमध्ये सामान्यतया कुन विषयक्षेत्रले सबैभन्दा बढी अङ्कभार ओगटेको हुन्छ?',
    options: [
      { key: 'A', text: 'Sports & Cinema Trivia', textNe: 'खेलकुद र चलचित्र सम्बन्धी सामान्य जानकारी' },
      {
        key: 'B',
        text: 'Geography, History, Culture & Polity of Nepal',
        textNe: 'नेपालको भूगोल, इतिहास, संस्कृति र शासन प्रणाली',
      },
      { key: 'C', text: 'Foreign Stock Indices', textNe: 'विदेशी सेयर बजार सूचकाङ्क' },
      { key: 'D', text: 'Classical Latin Grammar', textNe: 'शास्त्रीय ल्याटिन व्याकरण' },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'Geography, History, Social/Cultural Heritage, and Constitutional Governance of Nepal collectively account for the largest weightage share in PSC Phase I General Knowledge.',
    explanationNe:
      'नेपालको भूगोल, इतिहास, सामाजिक/सांस्कृतिक सम्पदा तथा संवैधानिक शासन व्यवस्थाले लोक सेवा आयोगको प्रथम चरण सामान्य ज्ञानमा सामूहिक रूपमा सर्वाधिक अङ्कभार ओगट्दछ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'PSC General Knowledge & Aptitude Master Reference',
    sourcePath: '/materials/psc-gk-aptitude-outline.pdf',
  },
  {
    id: 'PSC-ADM-309',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Paper I: Administrative Aptitude Test',
    subject: 'Public Administration & Law',
    topicId: 'PSC-EXM',
    topic: 'PSC Examination System',
    subtopicId: 'PSC-EXM-05',
    subtopic: 'Phase I Qualifying Threshold',
    question:
      'In the PSC Gazetted Third Class (Section Officer) examination, what is the minimum passing score in Phase I (Paper I — 100 marks), and how are Phase I marks treated in final merit?',
    questionNe:
      'लोक सेवा आयोगको राजपत्रांकित तृतीय श्रेणी (शाखा अधिकृत) परीक्षामा प्रथम चरण (प्रथम पत्र — १०० अङ्क) को न्यूनतम उत्तीर्णाङ्क कति हो र प्रथम चरणको अङ्क अन्तिम योग्यताक्रममा कसरी समावेश हुन्छ?',
    options: [
      {
        key: 'A',
        text: '45 marks minimum (45%); Phase I is strictly qualifying and its marks are not added to Phase II merit',
        textNe: 'न्यूनतम ४५ अङ्क (४५%); प्रथम चरण केवल छनोटका लागि हो र यसको अङ्क द्वितीय चरणको योग्यताक्रममा जोडिँदैन',
      },
      {
        key: 'B',
        text: '35 marks minimum; 50% of Phase I marks are added to Phase II merit',
        textNe: 'न्यूनतम ३५ अङ्क; प्रथम चरणको ५०% अङ्क द्वितीय चरणमा जोडिन्छ',
      },
      {
        key: 'C',
        text: '40 marks minimum; 100% of Phase I marks are added to Phase II merit',
        textNe: 'न्यूनतम ४० अङ्क; प्रथम चरणको १००% अङ्क द्वितीय चरणमा जोडिन्छ',
      },
      {
        key: 'D',
        text: '50 marks minimum; 25% of Phase I marks are added to Phase II merit',
        textNe: 'न्यूनतम ५० अङ्क; प्रथम चरणको २५% अङ्क द्वितीय चरणमा जोडिन्छ',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Under the official Lok Sewa Aayog Section Officer examination scheme (2081/2082 BS), Phase I requires at least 45 marks (45%) with 20% negative marking to qualify for Phase II written papers, and 0% of Phase I marks are added to the 360-mark Phase II + Final Stage merit.',
    explanationNe:
      'लोक सेवा आयोगको आधिकारिक शाखा अधिकृत पाठ्यक्रम (२०८१/२०८२) अनुसार द्वितीय चरणको लिखित परीक्षामा सहभागी हुन प्रथम चरणमा २०% नकारात्मक अङ्क कट्टा सहित कम्तीमा ४५ अङ्क (४५%) ल्याउनुपर्दछ र प्रथम चरणको अङ्क ३६० अङ्कको अन्तिम योग्यताक्रममा जोडिँदैन।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle:
      'Official PSC Section Officer Syllabus — Phase I (AAT & Scheme)',
    sourcePath:
      '/materials/official-psc/psc-official-section-officer-phase1.pdf',
  },
  {
    id: 'PSC-APT-310',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'Aptitude & IQ',
    post: 'Section Officer competitive examination target',
    paper: 'Paper I: Administrative Aptitude Test',
    subject: 'General Mental Ability (IQ)',
    topicId: 'APT-NUM',
    topic: 'Quantitative & Numerical Reasoning',
    subtopicId: 'APT-NUM-04',
    subtopic: 'Negative Marking Score Calculation',
    question:
      'In a 50-question PSC objective paper worth 2 marks per question (total 100 marks) with 20% negative marking, a candidate answers 38 correctly, gets 10 wrong, and skips 2. What is the net score?',
    questionNe:
      'प्रतिप्रश्न २ अङ्कका ५० वटा वस्तुगत प्रश्न (कुल १०० अङ्क) र २०% नकारात्मक अङ्क कट्टा हुने परीक्षामा एक परीक्षार्थीले ३८ वटा सही, १० वटा गलत र २ वटा अनुत्तरित छोडेमा उसको खुद प्राप्ताङ्क कति हुन्छ?',
    options: [
      { key: 'A', text: '68.0 marks', textNe: '६८.० अङ्क' },
      { key: 'B', text: '70.0 marks', textNe: '७०.० अङ्क' },
      { key: 'C', text: '74.0 marks', textNe: '७४.० अङ्क' },
      { key: 'D', text: '72.0 marks', textNe: '७२.० अङ्क' },
    ],
    correct_options: ['D'],
    is_multi_select: false,
    explanation:
      '38 correct answers × 2 marks = 76.0 marks. Each wrong answer deducts 20% of 2 marks = 0.4 marks, so 10 wrong answers deduct 4.0 marks (2 skipped = 0 deduction), yielding 76.0 - 4.0 = 72.0 marks.',
    explanationNe:
      '३८ सही उत्तर × २ अङ्क = ७६.० अङ्क। प्रत्येक गलत उत्तरमा २ को २०% अर्थात् ०.४ अङ्क घट्ने भएकाले १० गलत उत्तरमा ४.० अङ्क कट्टा हुन्छ (२ अनुत्तरित = ० कट्टा), जसअनुसार ७६.० - ४.० = ७२.० अङ्क प्राप्त हुन्छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'PSC Gazetted Third Class (Section Officer) Syllabus',
    sourcePath: '/materials/psc-section-officer-syllabus.pdf',
  },
  {
    id: 'PSC-ADM-311',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Phase II: Written Examination',
    subject: 'Public Administration & Law',
    topicId: 'PSC-EXM',
    topic: 'PSC Examination System',
    subtopicId: 'PSC-EXM-06',
    subtopic: 'Section Officer Phase II Papers',
    question:
      'Which 100-mark written papers belong to Phase II of the PSC Section Officer (Non-Technical General Administration, Revenue, Audit, and Parliament) examination? (Select all correct options)',
    questionNe:
      'लोक सेवा आयोगको शाखा अधिकृत (अप्राविधिक सामान्य प्रशासन, राजस्व, लेखापरीक्षण र संसद्) द्वितीय चरणको परीक्षामा कुन-कुन १०० पूर्णाङ्कका लिखित पत्रहरू पर्दछन्? (मिल्ने सबै विकल्प छान्नुहोस्)',
    options: [
      {
        key: 'A',
        text: 'Paper II: Governance Systems',
        textNe: 'द्वितीय पत्र: शासन प्रणाली (Governance Systems)',
      },
      {
        key: 'B',
        text: 'Paper III: Contemporary Issues',
        textNe: 'तृतीय पत्र: समसामयिक विषय (Contemporary Issues)',
      },
      {
        key: 'C',
        text: 'Paper IV: Service-Group Related Subject',
        textNe: 'चतुर्थ पत्र: सेवा/समूह सम्बन्धी विषय (Service-Group Related Subject)',
      },
      {
        key: 'D',
        text: 'Paper V: Mandatory Agronomy & Clinical Lab Practical',
        textNe: 'पञ्चम पत्र: अनिवार्य कृषि विज्ञान तथा क्लिनिकल प्रयोगशाला प्रयोगात्मक',
      },
    ],
    correct_options: ['A', 'B', 'C'],
    is_multi_select: true,
    explanation:
      'Phase II of the non-technical Section Officer exam consists of three 100-mark descriptive papers: Governance Systems (Paper II), Contemporary Issues (Paper III), and Service-Group Related Subject (Paper IV).',
    explanationNe:
      'अप्राविधिक शाखा अधिकृतको द्वितीय चरणमा १००–१०० अङ्कका तीनवटा विषयगत लिखित पत्रहरू हुन्छन्: द्वितीय पत्र (शासन प्रणाली), तृतीय पत्र (समसामयिक विषय) र चतुर्थ पत्र (सेवा/समूह सम्बन्धी विषय)।',
    difficulty: 'Medium',
    marks: 2,
    sourceTitle: 'PSC Gazetted Third Class (Section Officer) Syllabus',
    sourcePath: '/materials/psc-section-officer-syllabus.pdf',
  },
  {
    id: 'PSC-PLN-312',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'Economic Planning & Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper III: Contemporary Issues',
    subject: 'Development Planning',
    topicId: 'PLN-DEV',
    topic: 'Sixteenth Periodic Plan',
    subtopicId: 'PLN-DEV-02',
    subtopic: 'National Planning Commission',
    question:
      'Which apex advisory institution formulates Nepal’s Periodic Development Plans—including the Sixteenth Plan—and who serves as its ex-officio Chairperson?',
    questionNe:
      'सोह्रौँ योजना सहित नेपालका आवधिक विकास योजनाहरू तर्जुमा गर्ने सर्वोच्च परामर्शदात्री निकाय कुन हो र यसको पदेन अध्यक्ष को हुन्छन्?',
    options: [
      {
        key: 'A',
        text: 'Ministry of Finance — chaired by the Finance Minister',
        textNe: 'अर्थ मन्त्रालय — अर्थमन्त्री अध्यक्ष',
      },
      {
        key: 'B',
        text: 'Nepal Rastra Bank — chaired by the Governor',
        textNe: 'नेपाल राष्ट्र बैंक — गभर्नर अध्यक्ष',
      },
      {
        key: 'C',
        text: 'National Natural Resources and Fiscal Commission — chaired by the President',
        textNe: 'राष्ट्रिय प्राकृतिक स्रोत तथा वित्त आयोग — राष्ट्रपति अध्यक्ष',
      },
      {
        key: 'D',
        text: 'National Planning Commission (NPC) — chaired by the Prime Minister',
        textNe: 'राष्ट्रिय योजना आयोग (NPC) — प्रधानमन्त्री पदेन अध्यक्ष',
      },
    ],
    correct_options: ['D'],
    is_multi_select: false,
    explanation:
      'The National Planning Commission (NPC) formulates Nepal’s periodic development plans under the ex-officio chairmanship of the Prime Minister, assisted by a full-time Vice-Chairperson and Members.',
    explanationNe:
      'राष्ट्रिय योजना आयोग (NPC) ले प्रधानमन्त्रीको पदेन अध्यक्षता तथा पूर्णकालीन उपाध्यक्ष र सदस्यहरूको संलग्नतामा नेपालका आवधिक विकास योजनाहरू तर्जुमा गर्दछ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Sixteenth Periodic Plan of Nepal (2081/82–2085/86)',
    sourcePath: '/materials/sixteenth-plan-summary.pdf',
  },
  {
    id: 'PSC-PLN-313',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'Economic Planning & Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Paper III: Contemporary Issues',
    subject: 'Development Planning',
    topicId: 'PLN-DEV',
    topic: 'Sixteenth Periodic Plan',
    subtopicId: 'PLN-DEV-03',
    subtopic: 'LDC Graduation Strategy',
    question:
      'Which major international transition occurs midway through Nepal’s Sixteenth Periodic Plan (2081/82–2085/86), shaping its structural economic transformation strategy?',
    questionNe:
      'नेपालको सोह्रौँ आवधिक योजना (२०८१/८२–२०८५/८६) को मध्यतिर कुन प्रमुख अन्तर्राष्ट्रिय स्तरोन्नति/संक्रमण हुने तय भएको छ, जसले योजनाको संरचनात्मक आर्थिक रूपान्तरण रणनीतिलाई निर्देशित गरेको छ?',
    options: [
      {
        key: 'A',
        text: 'Adoption of a Pegged Gold Standard in 2025',
        textNe: 'सन् २०२५ मा स्वर्ण मान (Gold Standard) लागू हुनु',
      },
      {
        key: 'B',
        text: 'Dissolution of Customs Duties across Asia in 2025',
        textNe: 'सन् २०२५ मा एसियाभर भन्सार महसुल खारेज हुनु',
      },
      {
        key: 'C',
        text: 'Nepal’s scheduled graduation from Least Developed Country (LDC) status in November 2026',
        textNe: 'सन् २०२६ नोभेम्बरमा नेपाल अतिकम विकसित राष्ट्र (LDC) बाट विकासशील राष्ट्रमा स्तरोन्नति हुनु',
      },
      {
        key: 'D',
        text: 'Replacement of VAT with Municipal Poll Taxes in 2027',
        textNe: 'सन् २०२७ मा मूल्य अभिवृद्धि कर हटाई नगर कर लागू गरिनु',
      },
    ],
    correct_options: ['C'],
    is_multi_select: false,
    explanation:
      'Nepal is scheduled by UN General Assembly resolution to graduate from the Least Developed Country (LDC) category in November 2026, making smooth and irreversible LDC graduation a core priority of the Sixteenth Plan.',
    explanationNe:
      'संयुक्त राष्ट्रसंघ महासभाको प्रस्तावबमोजिम नेपाल सन् २०२६ नोभेम्बरमा अतिकम विकसित राष्ट्र (LDC) को सूचीबाट स्तरोन्नति हुन गइरहेकाले सहज र दिगो LDC स्तरोन्नति सोह्रौँ योजनाको प्रमुख प्राथमिकता हो।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Sixteenth Periodic Plan of Nepal (2081/82–2085/86)',
    sourcePath: '/materials/sixteenth-plan-summary.pdf',
  },
  {
    id: 'PSC-PLN-314',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'Economic Planning & Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge',
    subject: 'Development Planning',
    topicId: 'PLN-DEV',
    topic: 'Sixteenth Periodic Plan',
    subtopicId: 'PLN-DEV-04',
    subtopic: 'History of Periodic Planning',
    question:
      'When was Nepal’s First Five-Year Periodic Plan launched, and who was serving as Prime Minister when planned development formally began?',
    questionNe:
      'नेपालमा प्रथम पञ्चवर्षीय आवधिक योजना कहिले सुरु भएको थियो र योजनाबद्ध विकासको औपचारिक थालनी हुँदा प्रधानमन्त्री को थिए?',
    options: [
      {
        key: 'A',
        text: '2013 BS (1956 AD) — Tanka Prasad Acharya',
        textNe: 'वि.सं. २०१३ (सन् १९५६) — टंकप्रसाद आचार्य',
      },
      {
        key: 'B',
        text: '2007 BS (1951 AD) — Mohan Shumsher',
        textNe: 'वि.सं. २००७ (सन् १९५१) — मोहनशमशेर',
      },
      {
        key: 'C',
        text: '2017 BS (1960 AD) — Bishweshwar Prasad Koirala',
        textNe: 'वि.सं. २०१७ (सन् १९६०) — विश्वेश्वरप्रसाद कोइराला',
      },
      {
        key: 'D',
        text: '2028 BS (1971 AD) — Kirtinidhi Bista',
        textNe: 'वि.सं. २०२८ (सन् १९७१) — कीर्तिनिधि विष्ट',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Planned economic development in Nepal commenced in Ashoj 2013 BS (September 1956 AD) with the First Five-Year Plan (2013–2018 BS) during the prime ministership of Tanka Prasad Acharya.',
    explanationNe:
      'नेपालमा योजनाबद्ध आर्थिक विकासको सुरुवात टंकप्रसाद आचार्य प्रधानमन्त्री हुँदा वि.सं. २०१३ असोज (सन् १९५६ सेप्टेम्बर) मा प्रथम पञ्चवर्षीय योजना (२०१३–२०१८) लागू भएसँगै भएको हो।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Sixteenth Periodic Plan of Nepal (2081/82–2085/86)',
    sourcePath: '/materials/sixteenth-plan-summary.pdf',
  },
  {
    id: 'PSC-APT-315',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'Aptitude & IQ',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Mental Ability',
    subject: 'General Mental Ability (IQ)',
    topicId: 'APT-LOG',
    topic: 'Verbal & Spatial Reasoning',
    subtopicId: 'APT-LOG-01',
    subtopic: 'Coding & Decoding',
    question:
      'In a certain code language, SERVICE is coded as UGTXKEG (each letter shifted two places forward). How is OFFICER written in the same code?',
    questionNe:
      'कुनै सांकेतिक भाषामा SERVICE लाई UGTXKEG लेखिन्छ (प्रत्येक अक्षर २ स्थान अगाडि सारिएको) भने सोही भाषामा OFFICER लाई कसरी लेखिन्छ?',
    options: [
      { key: 'A', text: 'PIILFHU', textNe: 'PIILFHU' },
      { key: 'B', text: 'QGGJDFS', textNe: 'QGGJDFS' },
      { key: 'C', text: 'RIILEHU', textNe: 'RIILEHU' },
      { key: 'D', text: 'QHHKEGT', textNe: 'QHHKEGT' },
    ],
    correct_options: ['D'],
    is_multi_select: false,
    explanation:
      'Shifting each letter forward by +2 positions in the alphabet: O→Q, F→H, F→H, I→K, C→E, E→G, and R→T, producing QHHKEGT.',
    explanationNe:
      'अंग्रेजी वर्णमालामा प्रत्येक अक्षरलाई +२ स्थान अगाडि सार्दा: O→Q, F→H, F→H, I→K, C→E, E→G र R→T भई QHHKEGT बन्दछ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'PSC General Knowledge & Aptitude Master Reference',
    sourcePath: '/materials/psc-gk-aptitude-outline.pdf',
  },
  {
    id: 'PSC-APT-316',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'Aptitude & IQ',
    post: 'Section Officer / Nayab Subba / Kharidar target',
    paper: 'Paper I: General Mental Ability',
    subject: 'General Mental Ability (IQ)',
    topicId: 'APT-LOG',
    topic: 'Verbal & Spatial Reasoning',
    subtopicId: 'APT-LOG-02',
    subtopic: 'Direction & Distance',
    question:
      'A field officer walks 8 km due North from the district headquarters and then turns due East and walks 6 km to reach a ward office. What is the shortest straight-line distance and direction from headquarters to the ward office?',
    questionNe:
      'एक फिल्ड अधिकृत जिल्ला सदरमुकामबाट ८ कि.मि. उत्तरतर्फ हिँडी त्यसपछि पूर्वतर्फ फर्केर ६ कि.मि. हिँड्दै वडा कार्यालय पुग्दछ। सदरमुकामबाट वडा कार्यालयसम्मको न्यूनतम सीधा दूरी र दिशा कति हो?',
    options: [
      { key: 'A', text: '14 km North-East', textNe: '१४ कि.मि. उत्तर-पूर्व' },
      { key: 'B', text: '10 km North-East', textNe: '१० कि.मि. उत्तर-पूर्व' },
      { key: 'C', text: '10 km South-West', textNe: '१० कि.मि. दक्षिण-पश्चिम' },
      { key: 'D', text: '12 km East', textNe: '१२ कि.मि. पूर्व' },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'By the Pythagorean theorem, straight-line distance = √(8² + 6²) = √(64 + 36) = √100 = 10 km, and moving North then East places the destination due North-East of the starting point.',
    explanationNe:
      'पाइथागोरस साध्य अनुसार सीधा दूरी = √(८² + ६²) = √(६४ + ३६) = √१०० = १० कि.मि. हुन्छ र उत्तर हुँदै पूर्व जाँदा गन्तव्य प्रारम्भिक बिन्दुबाट उत्तर-पूर्व दिशामा पर्दछ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'PSC General Knowledge & Aptitude Master Reference',
    sourcePath: '/materials/psc-gk-aptitude-outline.pdf',
  },
  {
    id: 'PSC-APT-317',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'Aptitude & IQ',
    post: 'Section Officer competitive examination target',
    paper: 'Paper I: General Mental Ability',
    subject: 'General Mental Ability (IQ)',
    topicId: 'APT-LOG',
    topic: 'Verbal & Spatial Reasoning',
    subtopicId: 'APT-LOG-03',
    subtopic: 'Logical Syllogism',
    question:
      'Statements: (1) All Gazetted Officers are Civil Servants. (2) All Civil Servants are Public Officials. Which conclusion necessarily follows?',
    questionNe:
      'कथनहरू: (१) सबै राजपत्रांकित अधिकृतहरू निजामती कर्मचारी हुन्। (२) सबै निजामती कर्मचारीहरू सार्वजनिक पदाधिकारी हुन्। यसबाट कुन निष्कर्ष अनिवार्य रूपमा निस्कन्छ?',
    options: [
      {
        key: 'A',
        text: 'All Public Officials are Gazetted Officers',
        textNe: 'सबै सार्वजनिक पदाधिकारीहरू राजपत्रांकित अधिकृत हुन्',
      },
      {
        key: 'B',
        text: 'No Gazetted Officer is a Public Official',
        textNe: 'कुनै पनि राजपत्रांकित अधिकृत सार्वजनिक पदाधिकारी होइन',
      },
      {
        key: 'C',
        text: 'Only Gazetted Officers are Civil Servants',
        textNe: 'केवल राजपत्रांकित अधिकृत मात्र निजामती कर्मचारी हुन्',
      },
      {
        key: 'D',
        text: 'All Gazetted Officers are Public Officials',
        textNe: 'सबै राजपत्रांकित अधिकृतहरू सार्वजनिक पदाधिकारी हुन्',
      },
    ],
    correct_options: ['D'],
    is_multi_select: false,
    explanation:
      'Because Gazetted Officers are a subset of Civil Servants and Civil Servants are a subset of Public Officials, it logically follows that all Gazetted Officers are Public Officials.',
    explanationNe:
      'राजपत्रांकित अधिकृत निजामती कर्मचारीको उपसमूह र निजामती कर्मचारी सार्वजनिक पदाधिकारीको उपसमूह भएकाले तार्किक रूपमा सबै राजपत्रांकित अधिकृतहरू सार्वजनिक पदाधिकारी हुन् भन्ने निष्कर्ष निस्कन्छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'PSC General Knowledge & Aptitude Master Reference',
    sourcePath: '/materials/psc-gk-aptitude-outline.pdf',
  },
  {
    id: 'PSC-APT-318',
    level: 'Non-Gazetted Second Class',
    service: 'Federal Civil Service preparation',
    group: 'Aptitude & IQ',
    post: 'Kharidar / Nayab Subba target',
    paper: 'Paper I: General Mental Ability',
    subject: 'General Mental Ability (IQ)',
    topicId: 'APT-NUM',
    topic: 'Quantitative & Numerical Reasoning',
    subtopicId: 'APT-NUM-05',
    subtopic: 'Arithmetic Averages',
    question:
      'The average age of 5 section employees is 32 years. When a newly recruited officer joins the unit, the average age of all 6 employees becomes 31 years. What is the age of the newly recruited officer?',
    questionNe:
      'कुनै शाखाका ५ जना कर्मचारीको औसत उमेर ३२ वर्ष छ। १ जना नयाँ अधिकृत उक्त एकाइमा थपिँदा सबै ६ जना कर्मचारीको औसत उमेर ३१ वर्ष हुन्छ भने नयाँ नियुक्त अधिकृतको उमेर कति वर्ष होला?',
    options: [
      { key: 'A', text: '26 years', textNe: '२६ वर्ष' },
      { key: 'B', text: '24 years', textNe: '२४ वर्ष' },
      { key: 'C', text: '25 years', textNe: '२५ वर्ष' },
      { key: 'D', text: '28 years', textNe: '२८ वर्ष' },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Sum of ages of 5 employees = 5 × 32 = 160 years. New sum of ages of 6 employees = 6 × 31 = 186 years. Therefore, the new officer’s age is 186 - 160 = 26 years.',
    explanationNe:
      '५ जना कर्मचारीको कुल उमेर = ५ × ३२ = १६० वर्ष। ६ जना कर्मचारीको नयाँ कुल उमेर = ६ × ३१ = १८६ वर्ष। त्यसैले, नयाँ अधिकृतको उमेर = १८६ - १६० = २६ वर्ष हुन्छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'PSC Kharidar (Non-Gazetted Second Class) Syllabus',
    sourcePath: '/materials/psc-kharidar-syllabus.pdf',
  },
  {
    id: 'PSC-APT-319',
    level: 'Non-Gazetted Second Class',
    service: 'Federal Civil Service preparation',
    group: 'Aptitude & IQ',
    post: 'Kharidar competitive examination target',
    paper: 'Paper I: Civic Mathematics',
    subject: 'General Mental Ability (IQ)',
    topicId: 'APT-NUM',
    topic: 'Quantitative & Numerical Reasoning',
    subtopicId: 'APT-NUM-06',
    subtopic: 'Simple Interest',
    question:
      'At what annual rate of simple interest will a principal sum of Rs. 25,000 yield Rs. 6,000 in interest over 3 years?',
    questionNe:
      'रु. २५,००० साँवा रकमले ३ वर्षमा रु. ६,००० साधारण ब्याज प्राप्त गर्न वार्षिक ब्याजदर कति प्रतिशत हुनुपर्दछ?',
    options: [
      { key: 'A', text: '6% per annum', textNe: 'वार्षिक ६%' },
      { key: 'B', text: '7.5% per annum', textNe: 'वार्षिक ७.५%' },
      { key: 'C', text: '8% per annum', textNe: 'वार्षिक ८%' },
      { key: 'D', text: '9% per annum', textNe: 'वार्षिक ९%' },
    ],
    correct_options: ['C'],
    is_multi_select: false,
    explanation:
      'Using Rate R = (I × 100) / (P × T) = (6,000 × 100) / (25,000 × 3) = 600,000 / 75,000 = 8% per annum.',
    explanationNe:
      'सूत्र R = (I × 100) / (P × T) प्रयोग गर्दा = (६,००० × १००) / (२५,००० × ३) = ६,००,००० / ७५,००० = वार्षिक ८% हुन्छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'PSC Kharidar (Non-Gazetted Second Class) Syllabus',
    sourcePath: '/materials/psc-kharidar-syllabus.pdf',
  },
  {
    id: 'PSC-ADM-320',
    level: 'Non-Gazetted First Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Nayab Subba / Kharidar target',
    paper: 'Paper II: Office Management',
    subject: 'Public Administration & Law',
    topicId: 'PSC-EXM',
    topic: 'PSC Examination System',
    subtopicId: 'PSC-EXM-07',
    subtopic: 'Office Registry (Darta & Chalani)',
    question:
      'In Nepalese public office administration, what are the two foundational registry operations used to log incoming letters and outgoing dispatches respectively?',
    questionNe:
      'नेपालको सार्वजनिक कार्यालय प्रशासनमा बाहिरबाट प्राप्त हुने पत्र र कार्यालयबाट बाहिर पठाइने पत्रको अभिलेख राख्न क्रमशः प्रयोग गरिने दुई आधारभूत अभिलेख प्रक्रियाहरू के-के हुन्?',
    options: [
      { key: 'A', text: 'Beruju and Fasfarak', textNe: 'बेरुजु र फसफरक' },
      { key: 'B', text: 'Tippani and Rajpatra', textNe: 'टिप्पणी र राजपत्र' },
      { key: 'C', text: 'Jinshi and Dharauti', textNe: 'जिन्सी र धरौटी' },
      {
        key: 'D',
        text: 'Darta (Registration) and Chalani (Dispatch)',
        textNe: 'दर्ता (Darta) र चलानी (Chalani)',
      },
    ],
    correct_options: ['D'],
    is_multi_select: false,
    explanation:
      'Darta records incoming correspondence with serial numbers and receipt dates, whereas Chalani logs outgoing official letters prior to dispatch—core procedures in Nayab Subba and Kharidar syllabi.',
    explanationNe:
      'कार्यालयमा प्राप्त पत्रहरूलाई क्रमसंख्या र मिति सहित अभिलेख राख्ने कार्य दर्ता हो भने कार्यालयबाट बाहिर पठाइने पत्रहरूको अभिलेख राख्ने कार्य चलानी हो—यी नायब सुब्बा र खरिदार पाठ्यक्रमका आधारभूत विषय हुन्।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'PSC Nayab Subba (Non-Gazetted First Class) Curriculum',
    sourcePath: '/materials/psc-nayab-subba-syllabus.pdf',
  },
];

const COMPREHENSIVE_EXTRA_QUESTIONS: QuizQuestion[] = [
  {
    id: 'PSC-INT-401',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'Foreign Affairs / General Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Paper I: General Knowledge',
    subject: 'History & Culture of Nepal',
    topicId: 'HIS-MOD',
    topic: 'Modern History & Reforms',
    subtopicId: 'HIS-MOD-04',
    subtopic: 'UN & SAARC Diplomacy',
    question:
      'On which date was Nepal admitted as a member state of the United Nations, and where is the Permanent Secretariat of SAARC located?',
    questionNe:
      'नेपालले संयुक्त राष्ट्रसंघ (UN) को सदस्यता कहिले प्राप्त गरेको थियो र सार्क (SAARC) को स्थायी सचिवालय कहाँ रहेको छ?',
    options: [
      {
        key: 'A',
        text: '14 December 1955 — Kathmandu, Nepal',
        textNe: 'सन् १९५५ डिसेम्बर १४ — काठमाडौँ, नेपाल',
      },
      {
        key: 'B',
        text: '24 October 1945 — Dhaka, Bangladesh',
        textNe: 'सन् १९४५ अक्टोबर २४ — ढाका, बंगलादेश',
      },
      {
        key: 'C',
        text: '8 December 1985 — Colombo, Sri Lanka',
        textNe: 'सन् १९८५ डिसेम्बर ८ — कोलम्बो, श्रीलंका',
      },
      {
        key: 'D',
        text: '18 May 1956 — New Delhi, India',
        textNe: 'सन् १९५६ मे १८ — नयाँ दिल्ली, भारत',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Nepal became a member of the United Nations on 14 December 1955, and the Permanent Secretariat of SAARC has operated in Kathmandu since January 1987.',
    explanationNe:
      'नेपाल सन् १९५५ डिसेम्बर १४ मा संयुक्त राष्ट्रसंघको सदस्य बनेको हो र सार्कको स्थायी सचिवालय सन् १९८७ जनवरीदेखि काठमाडौँमा सञ्चालन हुँदै आएको छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'PSC General Knowledge & Aptitude Master Reference',
    sourcePath: '/materials/psc-gk-aptitude-outline.pdf',
  },
  {
    id: 'PSC-INT-402',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'Foreign Affairs / General Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Paper I: General Knowledge',
    subject: 'History & Culture of Nepal',
    topicId: 'HIS-MOD',
    topic: 'Modern History & Reforms',
    subtopicId: 'HIS-MOD-05',
    subtopic: 'Bilateral Diplomatic Relations',
    question:
      'Which country was the first with which Nepal established formal diplomatic relations (1816 AD), followed by the United States as the second in 1947 AD?',
    questionNe:
      'नेपालले सर्वप्रथम कुन देशसँग औपचारिक कूटनीतिक सम्बन्ध (सन् १८१६) स्थापना गरेको थियो, जसपश्चात् दोस्रोमा सन् १९४७ मा अमेरिकासँग सम्बन्ध स्थापना भएको थियो?',
    options: [
      { key: 'A', text: 'India', textNe: 'भारत' },
      { key: 'B', text: 'China', textNe: 'चीन' },
      { key: 'C', text: 'United Kingdom', textNe: 'संयुक्त अधिराज्य (बेलायत)' },
      { key: 'D', text: 'France', textNe: 'फ्रान्स' },
    ],
    correct_options: ['C'],
    is_multi_select: false,
    explanation:
      'Nepal’s earliest diplomatic relations were established with the United Kingdom in 1816, followed by the United States (25 April 1947), India (13 June 1947), France (1949), and China (1955).',
    explanationNe:
      'नेपालको सबैभन्दा पहिले कूटनीतिक सम्बन्ध सन् १८१६ मा संयुक्त अधिराज्य (बेलायत) सँग स्थापना भएको थियो। त्यसपछि अमेरिका (२५ अप्रिल १९४७), भारत (१३ जुन १९४७), फ्रान्स (१९४९) र चीन (१९५५) सँग कूटनीतिक सम्बन्ध कायम भएको हो।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Nepal Parichaya: Historical Timeline & Modern Transition',
    sourcePath: '/materials/nepal-parichaya-history.pdf',
  },
  {
    id: 'PSC-INT-403',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'Revenue / General Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Paper II: Governance Systems',
    subject: 'Constitution & Governance',
    topicId: 'CON-FED',
    topic: 'Federalism & Fiscal Transfers',
    subtopicId: 'CON-FED-02',
    subtopic: 'Intergovernmental Fiscal Grants',
    question:
      'Under Article 60 of the Constitution of Nepal, which four categories of intergovernmental fiscal grants are distributed from the Federal Government to Provinces and Local Levels?',
    questionNe:
      'नेपालको संविधानको धारा ६० बमोजिम संघीय सरकारले प्रदेश तथा स्थानीय तहलाई कुन चार प्रकारका अन्तरसरकारी वित्तीय अनुदानहरू वितरण गर्दछ?',
    options: [
      {
        key: 'A',
        text: 'Import Duty, Excise Duty, Capital Gains, and Property Grants',
        textNe: 'आयात महसुल, अन्तःशुल्क, पुँजीगत लाभ र सम्पत्ति अनुदान',
      },
      {
        key: 'B',
        text: 'Fiscal Equalization, Conditional, Complementary (Matching), and Special Grants',
        textNe: 'वित्तीय समानीकरण, सशर्त, समपूरक (म्याचिङ) र विशेष अनुदान',
      },
      {
        key: 'C',
        text: 'Foreign Aid, Commercial Loans, Treasury Bills, and Overdrafts',
        textNe: 'वैदेशिक सहायता, वाणिज्य ऋण, ट्रेजरी बिल र ओभरड्राफ्ट',
      },
      {
        key: 'D',
        text: 'Municipal Toll, Royalty Surcharge, Stamp Duty, and Court Fee Grants',
        textNe: 'नगर कर, रोयल्टी अधिभार, टिकट दस्तुर र अदालत शुल्क अनुदान',
      },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'Article 60 provides for Fiscal Equalization, Conditional, Complementary (Matching), and Special Grants distributed on the recommendation of the National Natural Resources and Fiscal Commission (NNRFC).',
    explanationNe:
      'संविधानको धारा ६० ले राष्ट्रिय प्राकृतिक स्रोत तथा वित्त आयोगको सिफारिसमा प्रदेश र स्थानीय तहलाई वित्तीय समानीकरण, सशर्त, समपूरक र विशेष गरी चार प्रकारका अनुदान वितरण गर्ने व्यवस्था गरेको छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Constitution of Nepal (2072) — Core Articles & Rights',
    sourcePath: '/materials/constitution-of-nepal-2072.pdf',
  },
  {
    id: 'PSC-INT-404',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'Revenue / Audit / Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Paper II: Governance Systems',
    subject: 'Constitution & Governance',
    topicId: 'CON-FED',
    topic: 'Federalism & Fiscal Transfers',
    subtopicId: 'CON-FED-03',
    subtopic: 'Constitutional Budget Calendar',
    question:
      'Which date is constitutionally fixed by Article 119(3) of the Constitution of Nepal for presenting the annual Federal Budget before a joint sitting of the Federal Parliament?',
    questionNe:
      'नेपालको संविधानको धारा ११९(३) बमोजिम संघीय संसद्को संयुक्त बैठकमा वार्षिक संघीय बजेट पेस गर्ने संवैधानिक मिति कुन हो?',
    options: [
      { key: 'A', text: '1st of Shrawan every year', textNe: 'प्रत्येक वर्ष साउन १ गते' },
      { key: 'B', text: '1st of Ashadh every year', textNe: 'प्रत्येक वर्ष असार १ गते' },
      { key: 'C', text: '10th of Ashadh every year', textNe: 'प्रत्येक वर्ष असार १० गते' },
      { key: 'D', text: '15th of Jestha every year', textNe: 'प्रत्येक वर्ष जेठ १५ गते' },
    ],
    correct_options: ['D'],
    is_multi_select: false,
    explanation:
      'Article 119(3) mandates that the Finance Minister table the annual revenue and expenditure estimates before the joint sitting of Parliament on the 15th of Jestha each Bikram Sambat year (Provinces present on 1st Ashadh and Local Levels by 10th Ashadh).',
    explanationNe:
      'संविधानको धारा ११९(३) ले अर्थमन्त्रीले प्रत्येक वर्ष जेठ महिनाको १५ गते संघीय संसद्को संयुक्त बैठकमा वार्षिक राजस्व र व्ययको अनुमान पेस गर्नुपर्ने व्यवस्था गरेको छ (प्रदेशले असार १ गते र स्थानीय तहले असार १० गतेभित्र बजेट पेस गर्दछन्)।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Constitution of Nepal (2072) — Core Articles & Rights',
    sourcePath: '/materials/constitution-of-nepal-2072.pdf',
  },
  {
    id: 'PSC-INT-405',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge',
    subject: 'Geography of Nepal',
    topicId: 'GEO-PHY',
    topic: 'Physical Geography',
    subtopicId: 'GEO-PHY-04',
    subtopic: 'Altitudinal Climatic Zones',
    question:
      'Into how many altitudinal climatic zones is Nepal conventionally classified from the southern plains below 1,200 m up to the high Himalayan snowline above 5,000 m?',
    questionNe:
      '१,२०० मिटरभन्दा मुनिको दक्षिणी समथर भू-भागदेखि ५,००० मिटरभन्दा माथिको उच्च हिमाली हिमरेखासम्म नेपाललाई उचाइका आधारमा कतिवटा हावापानी क्षेत्रहरूमा वर्गीकरण गरिन्छ?',
    options: [
      { key: 'A', text: 'Three climatic zones', textNe: 'तीन हावापानी क्षेत्र' },
      { key: 'B', text: 'Five climatic zones', textNe: 'पाँच हावापानी क्षेत्र' },
      { key: 'C', text: 'Seven climatic zones', textNe: 'सात हावापानी क्षेत्र' },
      { key: 'D', text: 'Nine climatic zones', textNe: 'नौ हावापानी क्षेत्र' },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'Nepal’s vertical topography creates five distinct climatic zones: Sub-Tropical/Monsoon (<1,200 m), Warm Temperate (1,200–2,100 m), Cool Temperate (2,100–3,300 m), Alpine (3,300–5,000 m), and Tundra/Arctic (>5,000 m).',
    explanationNe:
      'नेपालको उचाइगत विविधताले पाँचवटा हावापानी क्षेत्र निर्माण गरेको छ: उष्ण मनसुनी (<१,२०० मि.), न्यानो समशीतोष्ण (१,२००–२,१०० मि.), चिसो समशीतोष्ण (२,१००–३,३०० मि.), लेकाली/अल्पाइन (३,३००–५,००० मि.) र टुण्ड्रा/हिमाली (>५,००० मि.)।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Nepal Parichaya: Physical Geography & Ecological Belts',
    sourcePath: '/materials/nepal-parichaya-geography.pdf',
  },
  {
    id: 'PSC-INT-406',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'Aptitude & IQ',
    post: 'Section Officer competitive examination target',
    paper: 'Paper I: General Mental Ability',
    subject: 'General Mental Ability (IQ)',
    topicId: 'APT-NUM',
    topic: 'Quantitative & Numerical Reasoning',
    subtopicId: 'APT-NUM-01',
    subtopic: 'Number Series',
    question:
      'Find the missing term in the numerical sequence: 2, 6, 12, 20, 30, 42, ?',
    questionNe: 'दिइएको संख्यात्मक श्रेणीमा छुटेको अंक पत्ता लगाउनुहोस्: २, ६, १२, २०, ३०, ४२, ?',
    options: [
      { key: 'A', text: '52', textNe: '५२' },
      { key: 'B', text: '54', textNe: '५४' },
      { key: 'C', text: '58', textNe: '५८' },
      { key: 'D', text: '56', textNe: '५६' },
    ],
    correct_options: ['D'],
    is_multi_select: false,
    explanation:
      'The terms follow n(n + 1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42, and 7×8=56 (step differences +4, +6, +8, +10, +12, +14).',
    explanationNe:
      'यस श्रेणीका पदहरू n(n + 1) को नियमअनुसार छन्: १×२=२, २×३=६, ३×४=१२, ४×५=२०, ५×६=३०, ६×७=४२ र ७×८=५६ (क्रमिक अन्तर +४, +६, +८, +१०, +१२, +१४)।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'PSC General Knowledge & Aptitude Master Reference',
    sourcePath: '/materials/psc-gk-aptitude-outline.pdf',
  },
  {
    id: 'PSC-INT-407',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'Aptitude & IQ',
    post: 'Section Officer competitive examination target',
    paper: 'Paper I: General Mental Ability',
    subject: 'General Mental Ability (IQ)',
    topicId: 'APT-LOG',
    topic: 'Verbal & Spatial Reasoning',
    subtopicId: 'APT-LOG-04',
    subtopic: 'Order & Ranking',
    question:
      'In a merit list of 45 candidates, Sita ranks 14th from the top and Ramesh ranks 19th from the bottom. How many candidates are ranked strictly between Sita and Ramesh?',
    questionNe:
      '४५ जना परीक्षार्थीको योग्यताक्रम (मेरििट लिस्ट) मा सीता माथिबाट १४औँ स्थानमा र रमेश तलबाट १९औँ स्थानमा छन् भने सीता र रमेशको बीचमा कति जना परीक्षार्थी रहेका छन्?',
    options: [
      { key: 'A', text: '11 candidates', textNe: '११ जना परीक्षार्थी' },
      { key: 'B', text: '12 candidates', textNe: '१२ जना परीक्षार्थी' },
      { key: 'C', text: '13 candidates', textNe: '१३ जना परीक्षार्थी' },
      { key: 'D', text: '14 candidates', textNe: '१४ जना परीक्षार्थी' },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'Since 14 + 19 = 33 is less than 45, the rankings do not overlap; the number of candidates strictly between them is 45 - (14 + 19) = 12 candidates.',
    explanationNe:
      '१४ + १९ = ३३ जुन जम्मा ४५ भन्दा कम भएकाले स्थान खप्टिँदैन। तसर्थ, उनीहरूको बीचमा रहेका परीक्षार्थीको संख्या = ४५ - (१४ + १९) = १२ जना हुन्छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'PSC General Knowledge & Aptitude Master Reference',
    sourcePath: '/materials/psc-gk-aptitude-outline.pdf',
  },
  {
    id: 'PSC-INT-408',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper IV: Service-Group Law',
    subject: 'Public Administration & Law',
    topicId: 'LAW-GGA',
    topic: 'Good Governance Act, 2064',
    subtopicId: 'LAW-GGA-04',
    subtopic: 'Administrative Decision Memos',
    question:
      'What is the formal written administrative memo initiated at the section level summarizing facts, statutory provisions, and options for upward policy or operational decision?',
    questionNe:
      'कुनै विषयमा तथ्य, कानुनी व्यवस्था र निर्णयका विकल्पहरू संक्षेपमा उल्लेख गरी शाखा तहबाट माथिल्लो अधिकारप्राप्त अधिकारीसमक्ष निर्णयका लागि पेस गरिने औपचारिक लिखित प्रशासकीय लिखत के हो?',
    options: [
      {
        key: 'A',
        text: 'Tippani (Administrative Decision Memo)',
        textNe: 'टिप्पणी (Tippani)',
      },
      {
        key: 'B',
        text: 'Muchulka (Public Witness Record)',
        textNe: 'मुचुल्का (Muchulka)',
      },
      {
        key: 'C',
        text: 'Rajpatra (Official Gazette)',
        textNe: 'राजपत्र (Rajpatra)',
      },
      {
        key: 'D',
        text: 'Bharpai (Acknowledgment Receipt)',
        textNe: 'भरपाई (Bharpai)',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'A Tippani is the structured decision memorandum initiated from the concerned operational section presenting facts, applicable legal provisions, and recommendations to the competent authority.',
    explanationNe:
      'सम्बन्धित शाखाबाट विषयको यथार्थ तथ्य, प्रचलित कानुनी प्रावधान र राय/सिफारिस सहित सक्षम अधिकारीसमक्ष निर्णयका लागि पेस गरिने व्यवस्थित अभिलेख नै टिप्पणी हो।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Good Governance (Management & Operation) Act, 2064',
    sourcePath: '/materials/good-governance-act-2064.pdf',
  },
  {
    id: 'PSC-INT-409',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'Economic Planning & Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper III: Contemporary Issues',
    subject: 'Development Planning',
    topicId: 'PLN-DEV',
    topic: 'Sixteenth Periodic Plan',
    subtopicId: 'PLN-DEV-05',
    subtopic: 'Sustainable Development Goals (SDGs)',
    question:
      'How many Global Goals and Targets constitute the UN 2030 Agenda for Sustainable Development (SDGs) localized into Nepal’s periodic plans and medium-term expenditure frameworks?',
    questionNe:
      'नेपालका आवधिक योजना र मध्यमकालीन खर्च संरचनामा आन्तरिकीकरण गरिएको संयुक्त राष्ट्रसंघको दिगो विकास लक्ष्य (SDGs) २०३० एजेन्डामा कतिवटा विश्वव्यापी लक्ष्य र परिमाणात्मक गन्तव्यहरू रहेका छन्?',
    options: [
      { key: 'A', text: '8 Goals and 21 Targets', textNe: '८ लक्ष्य र २१ गन्तव्य' },
      { key: 'B', text: '15 Goals and 120 Targets', textNe: '१५ लक्ष्य र १२० गन्तव्य' },
      { key: 'C', text: '17 Goals and 169 Targets', textNe: '१७ लक्ष्य र १६९ गन्तव्य' },
      { key: 'D', text: '20 Goals and 200 Targets', textNe: '२० लक्ष्य र २०० गन्तव्य' },
    ],
    correct_options: ['C'],
    is_multi_select: false,
    explanation:
      'Adopted by the UN in 2015 for the 2016–2030 horizon, the Sustainable Development Goals comprise 17 Goals and 169 Targets.',
    explanationNe:
      'सन् २०१५ मा संयुक्त राष्ट्रसंघद्वारा सन् २०१६–२०३० अवधिका लागि पारित दिगो विकास लक्ष्यहरूमा १७ वटा लक्ष्य (Goals) र १६९ वटा गन्तव्यहरू (Targets) समावेश छन्।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Sixteenth Periodic Plan of Nepal (2081/82–2085/86)',
    sourcePath: '/materials/sixteenth-plan-summary.pdf',
  },
  {
    id: 'PSC-INT-410',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge',
    subject: 'History & Culture of Nepal',
    topicId: 'HIS-MOD',
    topic: 'Modern History & Reforms',
    subtopicId: 'HIS-MOD-06',
    subtopic: 'Infrastructure Milestones',
    question:
      'Which was the first hydroelectric power station constructed in Nepal (500 kW capacity, commissioned in 1911 AD / 1968 BS)?',
    questionNe:
      'नेपालमा सर्वप्रथम निर्माण गरिएको जलविद्युत् आयोजना कुन हो (५०० किलोवाट क्षमता, वि.सं. १९६८ / सन् १९११ मा सञ्चालित)?',
    options: [
      { key: 'A', text: 'Sundarijal Hydropower Station', textNe: 'सुन्दरीजल जलविद्युत् केन्द्र' },
      { key: 'B', text: 'Panauti Hydropower Station', textNe: 'पनौती जलविद्युत् केन्द्र' },
      { key: 'C', text: 'Trishuli Hydropower Station', textNe: 'त्रिशूली जलविद्युत् केन्द्र' },
      {
        key: 'D',
        text: 'Pharping (Chandra Jyoti) Hydropower Station',
        textNe: 'फर्पिङ (चन्द्रज्योति) जलविद्युत् केन्द्र',
      },
    ],
    correct_options: ['D'],
    is_multi_select: false,
    explanation:
      'Pharping Hydropower Station (500 kW, named Chandra Jyoti) was inaugurated in Jestha 1968 BS (May 1911 AD)—Nepal’s first hydropower project and one of the oldest in Asia.',
    explanationNe:
      'फर्पिङ जलविद्युत् केन्द्र (५०० किलोवाट, चन्द्रज्योति नामकरण गरिएको) वि.सं. १९६८ जेठमा उद्घाटन भएको नेपालको पहिलो र एसियाकै पुरानोमध्ये एक जलविद्युत् आयोजना हो।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Nepal Parichaya: Historical Timeline & Modern Transition',
    sourcePath: '/materials/nepal-parichaya-history.pdf',
  },
  {
    id: 'PSC-INT-411',
    level: 'Gazetted Third Class / Non-Gazetted First Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba / Kharidar target',
    paper: 'Paper IV: Service-Group Law',
    subject: 'Public Administration & Law',
    topicId: 'LAW-LGO',
    topic: 'Local Government Operation Act, 2074',
    subtopicId: 'LAW-LGO-01',
    subtopic: 'Judicial Committee (Article 217 & Sec. 47)',
    question:
      'Under Article 217 of the Constitution of Nepal and Section 47 of the Local Government Operation Act, 2074, how is the Local Level Judicial Committee composed, and within how many days may an appeal against its decision be filed at the District Court?',
    questionNe:
      'नेपालको संविधानको धारा २१७ र स्थानीय सरकार सञ्चालन ऐन, २०७४ को दफा ४७ बमोजिम स्थानीय तहको न्यायिक समितिको गठन कसरी हुन्छ र सो समितिको निर्णयउपर कति दिनभित्र जिल्ला अदालतमा पुनरावेदन दिन सकिन्छ?',
    options: [
      {
        key: 'A',
        text: '3-member committee coordinated by Deputy Mayor / Vice-Chairperson; appeal to District Court within 35 days',
        textNe: 'उपप्रमुख/उपाध्यक्षको संयोजकत्वमा ३ सदस्यीय समिति; ३५ दिनभित्र जिल्ला अदालतमा पुनरावेदन',
      },
      {
        key: 'B',
        text: '5-member committee chaired by Mayor / Chairperson; appeal to High Court within 60 days',
        textNe: 'प्रमुख/अध्यक्षको अध्यक्षतामा ५ सदस्यीय समिति; ६० दिनभित्र उच्च अदालतमा पुनरावेदन',
      },
      {
        key: 'C',
        text: '3-member committee chaired by Chief Administrative Officer; appeal within 15 days',
        textNe: 'प्रमुख प्रशासकीय अधिकृतको अध्यक्षतामा ३ सदस्यीय समिति; १५ दिनभित्र पुनरावेदन',
      },
      {
        key: 'D',
        text: '7-member committee chaired by District Judge; no appeal permitted',
        textNe: 'जिल्ला न्यायाधीशको अध्यक्षतामा ७ सदस्यीय समिति; पुनरावेदन नलाग्ने',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Article 217 establishes a 3-member Judicial Committee coordinated by the Deputy Mayor (in a Municipality) or Vice-Chairperson (in a Rural Municipality) plus two Assembly members; under LGOA Section 51, a party dissatisfied with its Section 47(1) decision may appeal to the District Court within 35 days.',
    explanationNe:
      'संविधानको धारा २१७ अनुसार नगरपालिकामा उपप्रमुख र गाउँपालिकामा उपाध्यक्षको संयोजकत्वमा सभाका २ सदस्य सहित ३ सदस्यीय न्यायिक समिति रहन्छ। स्थानीय सरकार सञ्चालन ऐनको दफा ५१ बमोजिम दफा ४७(१) अनुसार भएको निर्णयमा चित्त नबुझ्ने पक्षले ३५ दिनभित्र जिल्ला अदालतमा पुनरावेदन दिन सक्दछ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Local Government Operation Act, 2074 — Core Provisions',
    sourcePath: '/materials/local-government-operation-act-2074.pdf',
  },
  {
    id: 'PSC-INT-412',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration / Accounts',
    post: 'Section Officer / Nayab Subba / Kharidar target',
    paper: 'Paper IV: Service-Group Law',
    subject: 'Public Administration & Law',
    topicId: 'LAW-LGO',
    topic: 'Local Government Operation Act, 2074',
    subtopicId: 'LAW-LGO-02',
    subtopic: '7-Step Planning & Ashadh 10 Budget',
    question:
      'Under Section 71 of the Local Government Operation Act, 2074 (and the Intergovernmental Fiscal Arrangement Act, 2074), by what statutory date must the Local Executive table the annual revenue and expenditure budget before the Village or Municipal Assembly, and by when must it be passed?',
    questionNe:
      'स्थानीय सरकार सञ्चालन ऐन, २०७४ को दफा ७१ (तथा अन्तर-सरकारी वित्त व्यवस्थापन ऐन, २०७४) बमोजिम स्थानीय कार्यपालिकाले गाउँ वा नगर सभामा आगामी आर्थिक वर्षको वार्षिक राजस्व र व्ययको अनुमान (बजेट) कहिलेसम्म पेस गर्नुपर्दछ र कहिलेसम्म पारित गरिसक्नुपर्दछ?',
    options: [
      {
        key: 'A',
        text: 'Tabled by Jestha 15; passed by Ashadh 15',
        textNe: 'जेठ १५ सम्म पेस; असार १५ सम्म पारित',
      },
      {
        key: 'B',
        text: 'Tabled by Ashadh 1; passed by Shrawan 1',
        textNe: 'असार १ सम्म पेस; साउन १ सम्म पारित',
      },
      {
        key: 'C',
        text: 'Tabled by Ashadh 10; passed by the end of Ashadh (Ashadh Masanta)',
        textNe: 'असार १० गतेभित्र पेस; असार मसान्तभित्र पारित',
      },
      {
        key: 'D',
        text: 'Tabled by Ashadh 25; passed by Bhadra 15',
        textNe: 'असार २५ सम्म पेस; भदौ १५ सम्म पारित',
      },
    ],
    correct_options: ['C'],
    is_multi_select: false,
    explanation:
      'Following the 7-step local participatory planning cycle, Local Executives must present the annual budget to the Village/Municipal Assembly by Ashadh 10 and approve it before the end of Ashadh (Ashadh Masanta).',
    explanationNe:
      '७-चरणीय स्थानीय सहभागितामूलक योजना तर्जुमा प्रक्रिया पूरा गरी स्थानीय कार्यपालिकाले असार १० गतेभित्र गाउँ/नगर सभामा वार्षिक बजेट पेस गर्नुपर्ने र असार मसान्तभित्र सभाबाट पारित गरिसक्नुपर्ने कानुनी व्यवस्था छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Local Government Operation Act, 2074 — Core Provisions',
    sourcePath: '/materials/local-government-operation-act-2074.pdf',
  },
  {
    id: 'PSC-INT-413',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba / Kharidar target',
    paper: 'Paper II: Governance Systems',
    subject: 'Public Administration & Law',
    topicId: 'LAW-LGO',
    topic: 'Local Government Operation Act, 2074',
    subtopicId: 'LAW-LGO-03',
    subtopic: 'Ward Committee Composition',
    question:
      'Under Articles 222 and 223 of the Constitution of Nepal and the Local Government Operation Act, 2074, how many total elected members constitute each Ward Committee in a Rural Municipality or Municipality?',
    questionNe:
      'नेपालको संविधानको धारा २२२ र २२३ तथा स्थानीय सरकार सञ्चालन ऐन, २०७४ बमोजिम गाउँपालिका वा नगरपालिकाको प्रत्येक वडा समितिमा जम्मा कति जना निर्वाचित सदस्यहरू रहन्छन्?',
    options: [
      {
        key: 'A',
        text: '3 members (Ward Chairperson + 2 Members)',
        textNe: '३ सदस्य (वडाध्यक्ष + २ सदस्य)',
      },
      {
        key: 'B',
        text: '5 members (Ward Chairperson + 4 Ward Members including at least 2 Women, one Dalit Woman)',
        textNe: '५ सदस्य (वडाध्यक्ष + कम्तीमा १ दलित महिला सहित २ महिला र ४ वडा सदस्य)',
      },
      {
        key: 'C',
        text: '7 members (Ward Chairperson + 6 Ward Members)',
        textNe: '७ सदस्य (वडाध्यक्ष + ६ वडा सदस्य)',
      },
      {
        key: 'D',
        text: '9 members including the Ward Secretary',
        textNe: 'वडा सचिव सहित ९ सदस्य',
      },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'Every Ward Committee consists of 5 elected representatives: a Ward Chairperson and four Ward Members (at least two of whom must be women, including one Dalit woman member under Article 222/223).',
    explanationNe:
      'प्रत्येक वडा समितिमा १ जना वडाध्यक्ष र ४ जना सदस्य (जसमध्ये धारा २२२/२२३ अनुसार एक दलित महिला सहित कम्तीमा २ जना महिला) गरी जम्मा ५ जना निर्वाचित प्रतिनिधिहरू रहन्छन्।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Local Government Operation Act, 2074 — Core Provisions',
    sourcePath: '/materials/local-government-operation-act-2074.pdf',
  },
  {
    id: 'PSC-INT-414',
    level: 'Gazetted Third Class / Non-Gazetted First Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba / Kharidar target',
    paper: 'Paper II: Governance Systems',
    subject: 'Public Administration & Law',
    topicId: 'LAW-CPA',
    topic: 'Prevention of Corruption Act, 2059',
    subtopicId: 'LAW-CPA-01',
    subtopic: 'Property Declaration (Section 50)',
    question:
      'Under Section 50 of the Prevention of Corruption Act, 2059, within how many days must a person holding public office submit their statement of property (Sampatti Bibaran) upon assuming office and after the end of each fiscal year?',
    questionNe:
      'भ्रष्टाचार निवारण ऐन, २०५९ को दफा ५० बमोजिम सार्वजनिक पद धारण गरेको व्यक्तिले पद धारण गरेको र प्रत्येक आर्थिक वर्ष समाप्त भएको मितिले कति दिनभित्र आफ्नो सम्पत्तिको विवरण (सम्पत्ति विवरण) बुझाउनुपर्दछ?',
    options: [
      { key: 'A', text: 'Within 30 days', textNe: '३० दिनभित्र' },
      { key: 'B', text: 'Within 35 days', textNe: '३५ दिनभित्र' },
      { key: 'C', text: 'Within 60 days', textNe: '६० दिनभित्र' },
      { key: 'D', text: 'Within 90 days', textNe: '९० दिनभित्र' },
    ],
    correct_options: ['C'],
    is_multi_select: false,
    explanation:
      'Section 50(1) of the Prevention of Corruption Act, 2059 mandates every public office holder to submit an updated statement of property within 60 days of assuming office and within 60 days after the end of every fiscal year (i.e., by Bhadra 28/29); failure incurs a Rs. 5,000 fine and investigation.',
    explanationNe:
      'भ्रष्टाचार निवारण ऐन, २०५९ को दफा ५०(१) अनुसार सार्वजनिक पद धारण गरेको व्यक्तिले पदमा बहाल भएको र प्रत्येक आर्थिक वर्ष समाप्त भएको मितिले ६० दिनभित्र सम्पत्ति विवरण पेस गर्नुपर्दछ; समयमा नबुझाएमा रु. ५,००० जरिवाना र छानबिन हुने व्यवस्था छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Prevention of Corruption Act, 2059 (2002) — Core Digest',
    sourcePath: '/materials/corruption-prevention-act-2059.pdf',
  },
  {
    id: 'PSC-INT-415',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Paper II: Governance Systems',
    subject: 'Public Administration & Law',
    topicId: 'LAW-CPA',
    topic: 'Prevention of Corruption Act, 2059',
    subtopicId: 'LAW-CPA-02',
    subtopic: 'National Vigilance Centre (Section 38)',
    question:
      'Under Section 38 of the Prevention of Corruption Act, 2059, under whose direct supervision and control does the National Vigilance Centre (Rastriya Satarkata Kendra) operate, and what rank of officer serves as its Chief Officer?',
    questionNe:
      'भ्रष्टाचार निवारण ऐन, २०५९ को दफा ३८ बमोजिम राष्ट्रिय सतर्कता केन्द्र कसको प्रत्यक्ष रेखदेख र नियन्त्रणमा रहन्छ र यसको प्रमुख अधिकृत कुन श्रेणीको कर्मचारी हुन्छ?',
    options: [
      {
        key: 'A',
        text: 'Direct supervision of the Prime Minister — headed by a Gazetted Special Class Officer (Secretary)',
        textNe: 'प्रधानमन्त्रीको प्रत्यक्ष रेखदेख र नियन्त्रण — राजपत्रांकित विशिष्ट श्रेणीको अधिकृत (सचिव) प्रमुख',
      },
      {
        key: 'B',
        text: 'Direct supervision of the Chief Commissioner of CIAA — headed by a Joint Secretary',
        textNe: 'अख्तियारका प्रमुख आयुक्तको प्रत्यक्ष रेखदेख — सहसचिव प्रमुख',
      },
      {
        key: 'C',
        text: 'Direct supervision of the Auditor General — headed by a Deputy Auditor General',
        textNe: 'महालेखापरीक्षकको प्रत्यक्ष रेखदेख — नायब महालेखापरीक्षक प्रमुख',
      },
      {
        key: 'D',
        text: 'Direct supervision of the Home Minister — headed by an Inspector General',
        textNe: 'गृहमन्त्रीको प्रत्यक्ष रेखदेख — प्रहरी महानिरीक्षक प्रमुख',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Section 38 establishes the National Vigilance Centre under the direct supervision and control of the Prime Minister, headed by a Gazetted Special Class civil servant as Chief Officer to conduct preventive surveillance, technical audits (Prabidhik Parikshan), and property declaration monitoring.',
    explanationNe:
      'दफा ३८ बमोजिम भ्रष्टाचारविरुद्ध निरोधात्मक कार्य, प्राविधिक परीक्षण र सम्पत्ति विवरण अनुगमनका लागि प्रधानमन्त्रीको प्रत्यक्ष रेखदेख र नियन्त्रणमा रहने गरी राजपत्रांकित विशिष्ट श्रेणीको अधिकृत प्रमुख रहने राष्ट्रिय सतर्कता केन्द्रको व्यवस्था गरिएको छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Prevention of Corruption Act, 2059 (2002) — Core Digest',
    sourcePath: '/materials/corruption-prevention-act-2059.pdf',
  },
  {
    id: 'PSC-INT-416',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration / Judicial',
    post: 'Section Officer competitive examination target',
    paper: 'Paper IV: Service-Group Law',
    subject: 'Public Administration & Law',
    topicId: 'LAW-CPA',
    topic: 'Prevention of Corruption Act, 2059',
    subtopicId: 'LAW-CPA-03',
    subtopic: 'Statutory Offenses of Corruption',
    question:
      'Which of the following acts are punishable corruption offenses under Chapter 2 (Sections 3–20) of the Prevention of Corruption Act, 2059? (Select all correct options)',
    questionNe:
      'भ्रष्टाचार निवारण ऐन, २०५९ को परिच्छेद २ (दफा ३–२०) अन्तर्गत निम्नमध्ये कुन-कुन कार्यहरू दण्डनीय भ्रष्टाचारजन्य कसुर मानिन्छन्? (मिल्ने सबै विकल्प छान्नुहोस्)',
    options: [
      {
        key: 'A',
        text: 'Accepting or agreeing to accept graft/bribery (Riswat) in exchange for official action',
        textNe: 'सरकारी कामबापत रिसवत (घुस) लिने वा लिन मञ्जुर गर्ने',
      },
      {
        key: 'B',
        text: 'Causing revenue leakage (Rajaswa Chuhawat) or preparing false official documents',
        textNe: 'राजस्व चुहावट गर्ने वा गलत सरकारी लिखत तयार पार्ने',
      },
      {
        key: 'C',
        text: 'Amassing unexplained property disproportionate to known lawful income sources (Section 20)',
        textNe: 'कानुनी आयस्रोतको तुलनामा अमिल्दो तथा अस्वाभाविक सम्पत्ति आर्जन गर्ने (दफा २०)',
      },
      {
        key: 'D',
        text: 'Publishing quarterly proactive disclosures under Section 5 of the RTI Act',
        textNe: 'सूचनाको हक सम्बन्धी ऐनको दफा ५ बमोजिम त्रैमासिक स्वतः प्रकाशन गर्ने',
      },
    ],
    correct_options: ['A', 'B', 'C'],
    is_multi_select: true,
    explanation:
      'Chapter 2 of the Prevention of Corruption Act, 2059 criminalizes bribery/graft (Sec. 3), accepting goods/services free or below cost (Sec. 5), revenue leakage (Sec. 7), falsifying public documents (Sec. 9), damaging public property (Sec. 17), and illicit enrichment / unexplained wealth (Sec. 20).',
    explanationNe:
      'भ्रष्टाचार निवारण ऐन, २०५९ को परिच्छेद २ ले रिसवत लिने-दिने (दफा ३), बिना मूल्य वा कम मूल्यमा वस्तु/सेवा लिने (दफा ५), राजस्व चुहावट (दफा ७), गलत लिखत तयार पार्ने (दफा ९), सार्वजनिक सम्पत्ति हानि-नोक्सानी (दफा १७) र गैरकानुनी सम्पत्ति आर्जन (दफा २०) लाई भ्रष्टाचार कसुर मानेको छ।',
    difficulty: 'Medium',
    marks: 2,
    sourceTitle: 'Prevention of Corruption Act, 2059 (2002) — Core Digest',
    sourcePath: '/materials/corruption-prevention-act-2059.pdf',
  },
  {
    id: 'PSC-INT-417',
    level: 'Gazetted Third Class / Non-Gazetted First Class',
    service: 'Federal Civil Service preparation',
    group: 'Accounts / Revenue / General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper IV: Service-Group Law',
    subject: 'Public Administration & Law',
    topicId: 'LAW-PPA',
    topic: 'Public Procurement & Fiscal Laws',
    subtopicId: 'LAW-PPA-01',
    subtopic: 'Public Procurement Act, 2063 Methods',
    question:
      'Under Section 11 of the Public Procurement Act, 2063, which procurement methods may a public entity select depending on thresholds and procurement nature, and what is the statutory Bid Security (Bolpatra Jamanat) range?',
    questionNe:
      'सार्वजनिक खरिद ऐन, २०६३ को दफा ११ बमोजिम सार्वजनिक निकायले खरिदको प्रकृति र सीमाका आधारमा कुन-कुन खरिद विधि अपनाउन सक्दछ र बोलपत्र जमानत (Bid Security) कति प्रतिशत तोकिएको छ?',
    options: [
      {
        key: 'A',
        text: 'Open Bidding, Sealed Quotation, Direct Purchase, Users’ Committee, Force Account (Amanat), and Lump Sum Rate — Bid Security of 2% to 3% of estimated cost',
        textNe: 'खुला बोलपत्र, सिलबन्दी दरभाउपत्र, सोझै खरिद, उपभोक्ता समिति, अमानत र एकमुष्ठ दर विधि — लागत अनुमानको २% देखि ३% बोलपत्र जमानत',
      },
      {
        key: 'B',
        text: 'Verbal Negotiation only — Bid Security of 15% of estimated cost',
        textNe: 'मौखिक वार्ता मात्र — लागत अनुमानको १५% बोलपत्र जमानत',
      },
      {
        key: 'C',
        text: 'International Tendering exclusively for all purchases — 0.5% Bid Security',
        textNe: 'सबै खरिदका लागि अन्तर्राष्ट्रिय बोलपत्र मात्र — ०.५% बोलपत्र जमानत',
      },
      {
        key: 'D',
        text: 'Private Barter Contracts — 25% Performance Deposit at bid opening',
        textNe: 'निजी सट्टापट्टा करार — बोलपत्र खुल्दा नै २५% कार्यसम्पादन जमानत',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Section 11 of the Public Procurement Act, 2063 prescribes Open Bidding (international/national), Sealed Quotation, Direct Purchase, Users’ Committee/Beneficiary Group, Force Account (Amanat), Lump Sum Piece Rate, Catalogue/Manufacturer rate, and Limited Tendering, with Bid Security set at 2%–3% of approved estimated cost (and 5% Performance Security upon contract award).',
    explanationNe:
      'सार्वजनिक खरिद ऐन, २०६३ को दफा ११ ले खुला बोलपत्र (अन्तर्राष्ट्रिय/राष्ट्रिय), सिलबन्दी दरभाउपत्र, सोझै खरिद, उपभोक्ता समिति, अमानत, एकमुष्ठ दर, उत्पादक/विक्रेताको निर्धारित दर र सीमित बोलपत्र विधि व्यवस्था गरेको छ, जसमा बोलपत्र जमानत २%–३% (र कार्यसम्पादन जमानत ५%) तोकिएको छ।',
    difficulty: 'Hard',
    marks: 1,
    sourceTitle:
      'Public Procurement Act, 2063 & Fiscal Accountability Act, 2076',
    sourcePath: '/materials/public-procurement-fiscal-act.pdf',
  },
  {
    id: 'PSC-INT-418',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'Audit / Accounts / General Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Paper IV: Service-Group Law',
    subject: 'Public Administration & Law',
    topicId: 'LAW-PPA',
    topic: 'Public Procurement & Fiscal Laws',
    subtopicId: 'LAW-PPA-02',
    subtopic: 'Accounting Officer & Beruju Settlement',
    question:
      'Under the Financial Procedures and Fiscal Accountability Act, 2076, who serves as the Accounting Officer (Lekha Uttaradayi Adhikrit) of a Ministry, and within how many days must an office respond/settle irregularities (Beruju) upon receiving an audit notice?',
    questionNe:
      'आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन, २०७६ बमोजिम मन्त्रालयको लेखा उत्तरदायी अधिकृत को हुन्छ र लेखापरीक्षणबाट औँल्याइएको बेरुजु फर्स्योटका लागि सूचना पाएको कति दिनभित्र प्रतिक्रिया/प्रमाण पेस गर्नुपर्दछ?',
    options: [
      {
        key: 'A',
        text: 'Departmental Section Officer — within 90 days',
        textNe: 'विभागीय शाखा अधिकृत — ९० दिनभित्र',
      },
      {
        key: 'B',
        text: 'Secretary of the concerned Ministry / Constitutional Body — within 35 days',
        textNe: 'सम्बन्धित मन्त्रालय वा संवैधानिक निकायको सचिव — ३५ दिनभित्र',
      },
      {
        key: 'C',
        text: 'Governor of Nepal Rastra Bank — within 15 days',
        textNe: 'नेपाल राष्ट्र बैंकको गभर्नर — १५ दिनभित्र',
      },
      {
        key: 'D',
        text: 'Chief District Officer — within 120 days',
        textNe: 'प्रमुख जिल्ला अधिकारी — १२० दिनभित्र',
      },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'Under the Financial Procedures and Fiscal Accountability Act, 2076, the Secretary (Gazetted Special Class) of the concerned Ministry or Constitutional Body is the Accounting Officer accountable to the Public Accounts Committee for internal control and audit clearance, and offices must submit settlement evidence/responses on Beruju within 35 days.',
    explanationNe:
      'आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन, २०७६ अनुसार सम्बन्धित मन्त्रालय वा संवैधानिक निकायको सचिव लेखा उत्तरदायी अधिकृत हुन्छ र आन्तरिक नियन्त्रण तथा बेरुजु फर्स्योटका लागि लेखापरीक्षण सूचना पाएको ३५ दिनभित्र प्रमाण सहित जवाफ पठाउनुपर्दछ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle:
      'Public Procurement Act, 2063 & Fiscal Accountability Act, 2076',
    sourcePath: '/materials/public-procurement-fiscal-act.pdf',
  },
  {
    id: 'PSC-INT-419',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'Accounts / Audit / Administration',
    post: 'Section Officer / Nayab Subba / Kharidar target',
    paper: 'Paper IV: Service-Group Law',
    subject: 'Public Administration & Law',
    topicId: 'LAW-PPA',
    topic: 'Public Procurement & Fiscal Laws',
    subtopicId: 'LAW-PPA-03',
    subtopic: 'Treasury Single Account (TSA) & FCGO',
    question:
      'Which central government agency administers the Treasury Single Account (TSA / Ekal Khata Kosh) system and conducts internal audit across federal public offices through District Treasury Controller Offices (DTCO)?',
    questionNe:
      'जिल्लास्थित कोष तथा लेखा नियन्त्रक कार्यालय (कोलेनिका) मार्फत एकल खाता कोष (TSA) प्रणाली सञ्चालन गर्ने र संघीय सरकारी कार्यालयहरूको आन्तरिक लेखापरीक्षण गर्ने केन्द्रीय सरकारी निकाय कुन हो?',
    options: [
      {
        key: 'A',
        text: 'Financial Comptroller General Office (FCGO / Mahalekha Niyantrak Karyalaya)',
        textNe: 'महालेखा नियन्त्रक कार्यालय (FCGO)',
      },
      {
        key: 'B',
        text: 'Inland Revenue Department (IRD)',
        textNe: 'आन्तरिक राजस्व विभाग (IRD)',
      },
      {
        key: 'C',
        text: 'Securities Board of Nepal (SEBON)',
        textNe: 'नेपाल धितोपत्र बोर्ड (SEBON)',
      },
      {
        key: 'D',
        text: 'Public Debt Management Office',
        textNe: 'सार्वजनिक ऋण व्यवस्थापन कार्यालय',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'The Financial Comptroller General Office (FCGO) operates the Consolidated Fund and Treasury Single Account (TSA) across all 77 districts via DTCOs (Ko.Le.Ni.Ka.) and performs internal audits, whereas the Office of the Auditor General (Article 241) performs final external audit.',
    explanationNe:
      'महालेखा नियन्त्रक कार्यालय (FCGO) ले ७७ वटै जिल्लाका कोष तथा लेखा नियन्त्रक कार्यालय (कोलेनिका) मार्फत सञ्चित कोष र एकल खाता कोष (TSA) सञ्चालन तथा आन्तरिक लेखापरीक्षण गर्दछ; जबकि अन्तिम बाह्य लेखापरीक्षण महालेखापरीक्षकको कार्यालय (धारा २४१) ले गर्दछ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle:
      'Public Procurement Act, 2063 & Fiscal Accountability Act, 2076',
    sourcePath: '/materials/public-procurement-fiscal-act.pdf',
  },
  {
    id: 'PSC-INT-420',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer competitive examination target',
    paper: 'Paper I: Administrative Aptitude Test',
    subject: 'Public Administration & Law',
    topicId: 'PSC-EXM',
    topic: 'PSC Examination System',
    subtopicId: 'PSC-EXM-08',
    subtopic: '3-Month Statutory Amendment Rule',
    question:
      'According to the mandatory "Drashtabya" (Note) printed on official Lok Sewa Aayog syllabi, up to what cutoff point prior to the examination date are newly enacted or amended Acts, Rules, and Policies deemed part of the syllabus?',
    questionNe:
      'लोक सेवा आयोगको आधिकारिक पाठ्यक्रमको "द्रष्टव्य" मा उल्लेखित व्यवस्था अनुसार परीक्षा मितिभन्दा कति समयअगाडिसम्म लागू वा संशोधन भएका ऐन, नियम र नीतिहरू पाठ्यक्रममा समावेश मानिन्छन्?',
    options: [
      {
        key: 'A',
        text: 'Amendments made up to 1 year before the exam date',
        textNe: 'परीक्षा मितिभन्दा १ वर्षअघिसम्म भएका संशोधन',
      },
      {
        key: 'B',
        text: 'Amendments made up to 6 months before the exam date',
        textNe: 'परीक्षा मितिभन्दा ६ महिनाअघिसम्म भएका संशोधन',
      },
      {
        key: 'C',
        text: 'Amendments or enactments made up to 3 months before the exam date',
        textNe: 'परीक्षा मितिभन्दा ३ महिनाअगाडि (३ महिना पहिले) सम्म भएका संशोधन वा लागू भएका कानुन',
      },
      {
        key: 'D',
        text: 'Amendments made on the morning of the exam date',
        textNe: 'परीक्षाको दिन बिहानसम्म भएका संशोधन',
      },
    ],
    correct_options: ['C'],
    is_multi_select: false,
    explanation:
      'Official Lok Sewa Aayog syllabi explicitly state that any Constitution, Act, Rule, Formation Order, or Policy enacted or amended up to 3 months prior to the examination date is automatically included in the syllabus (and provisions repealed more than 3 months prior are excluded).',
    explanationNe:
      'लोक सेवा आयोगको आधिकारिक पाठ्यक्रमअनुसार लिखित परीक्षा सञ्चालन हुने मितिभन्दा ३ महिनाअगाडि संशोधन वा लागू भएका संविधान, ऐन, नियम, गठन आदेश तथा नीतिहरू स्वतः पाठ्यक्रममा परेको मानिन्छ (र ३ महिनाअगावै खारेज भएका व्यवस्था हटाइन्छन्)।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle:
      'Official PSC Section Officer Syllabus — Phase I (AAT & Scheme)',
    sourcePath:
      '/materials/official-psc/psc-official-section-officer-phase1.pdf',
  },
  {
    id: 'PSC-INT-421',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration / Foreign Affairs',
    post: 'Section Officer competitive examination target',
    paper: 'Phase II & Final Stage Scheme',
    subject: 'Public Administration & Law',
    topicId: 'PSC-EXM',
    topic: 'PSC Examination System',
    subtopicId: 'PSC-EXM-09',
    subtopic: 'Section Officer 360-Mark Final Merit',
    question:
      'Under the official Lok Sewa Aayog Gazetted Third Class (Section Officer — General Administration, Revenue, Accounts, Audit & Parliament) scheme, how is the 360-mark Final Selection Merit distributed across Phase II and the Final Stage?',
    questionNe:
      'लोक सेवा आयोगको आधिकारिक राजपत्रांकित तृतीय श्रेणी (शाखा अधिकृत — सामान्य प्रशासन, राजस्व, लेखा, लेखापरीक्षण र संसद्) परीक्षा योजनाअनुसार द्वितीय र अन्तिम चरणको जम्मा ३६० पूर्णाङ्क कसरी विभाजन गरिएको छ?',
    options: [
      {
        key: 'A',
        text: '300 Marks Main Written (Papers II, III, IV × 100M) + 10M IT Skill Test + 10M Group Test + 40M Oral Interview = 360 Marks',
        textNe: 'मुख्य लिखित ३०० अङ्क (पत्र २, ३ र ४ × १००) + सूचना प्रविधि सीप १० अङ्क + सामूहिक परीक्षण १० अङ्क + अन्तर्वार्ता ४० अङ्क = ३६० अङ्क',
      },
      {
        key: 'B',
        text: '100M Phase I + 200M Written + 60M Interview = 360 Marks',
        textNe: 'प्रथम चरण १०० + लिखित २०० + अन्तर्वार्ता ६० = ३६० अङ्क',
      },
      {
        key: 'C',
        text: '300M Main Written + 20M IT Skill Test + 40M Group Test = 360 Marks',
        textNe: 'मुख्य लिखित ३०० + आईटी सीप २० + सामूहिक परीक्षण ४० = ३६० अङ्क',
      },
      {
        key: 'D',
        text: '250M Written + 10M Typing + 100M Oral Interview = 360 Marks',
        textNe: 'लिखित २५० + टाइपिङ १० + अन्तर्वार्ता १०० = ३६० अङ्क',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'For General Admin, Revenue, Accounts, Audit, and Federal Parliament services, final merit totals 360 Marks: Paper II (100M) + Paper III (100M) + Paper IV (100M) + IT Skill Test (10M) + Group Test (10M) + Oral Interview (40M). Foreign Service adds two 50M papers and a 50M interview for 470 Marks.',
    explanationNe:
      'सामान्य प्रशासन, राजस्व, लेखा, लेखापरीक्षण र संघीय संसद् सेवाका लागि अन्तिम योग्यताक्रम ३६० पूर्णाङ्कको हुन्छ: द्वितीय पत्र (१००) + तृतीय पत्र (१००) + चतुर्थ पत्र (१००) + आईटी सीप परीक्षण (१०) + सामूहिक परीक्षण (१०) + अन्तर्वार्ता (४०)। परराष्ट्र सेवामा थप दुई ५०–५० अङ्कका पत्र र ५० अङ्कको अन्तर्वार्ता भई ४७० अङ्क हुन्छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle:
      'Official PSC Section Officer Syllabus — Phase II (Papers II, III & IV)',
    sourcePath:
      '/materials/official-psc/psc-official-section-officer-phase2.pdf',
  },
  {
    id: 'PSC-INT-422',
    level: 'Non-Gazetted First Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Nayab Subba competitive examination target',
    paper: 'Stage I: Preliminary Examination',
    subject: 'Public Administration & Law',
    topicId: 'PSC-EXM',
    topic: 'PSC Examination System',
    subtopicId: 'PSC-EXM-10',
    subtopic: 'Nayab Subba Paper I Marks Breakdown',
    question:
      'In the official Nayab Subba (Non-Gazetted First Class) Stage I Preliminary Examination (100 Marks, 45 Minutes), how are the 50 objective questions distributed between General Knowledge and General Mental Ability Test (GMAT)?',
    questionNe:
      'आधिकारिक नायब सुब्बा (रा.प.अनं. प्रथम श्रेणी) प्रथम चरणको प्रारम्भिक परीक्षा (१०० पूर्णाङ्क, ४५ मिनेट) मा ५० वटा वस्तुगत प्रश्नहरू सामान्य ज्ञान र सामान्य बौद्धिक परीक्षण (GMAT) बीच कसरी विभाजन गरिएका हुन्छन्?',
    options: [
      {
        key: 'A',
        text: '25 GK questions (50M) and 25 GMAT questions (50M)',
        textNe: '२५ सामान्य ज्ञान (५० अङ्क) र २५ बौद्धिक परीक्षण (५० अङ्क)',
      },
      {
        key: 'B',
        text: '30 GK questions × 2M (60 Marks) and 20 GMAT questions × 2M (40 Marks)',
        textNe: '३० सामान्य ज्ञान प्रश्न × २ अङ्क (६० अङ्क) र २० सामान्य बौद्धिक परीक्षण प्रश्न × २ अङ्क (४० अङ्क)',
      },
      {
        key: 'C',
        text: '35 GK questions (70M) and 15 GMAT questions (30M)',
        textNe: '३५ सामान्य ज्ञान (७० अङ्क) र १५ बौद्धिक परीक्षण (३० अङ्क)',
      },
      {
        key: 'D',
        text: '40 GK questions (80M) and 10 English questions (20M)',
        textNe: '४० सामान्य ज्ञान (८० अङ्क) र १० अंग्रेजी (२० अङ्क)',
      },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'Nayab Subba Stage I tests 50 objective MCQs at 2 marks each (45 minutes, pass marks 45, -20% negative marking): 30 General Knowledge questions (60 marks) and 20 General Mental Ability Test (GMAT/IQ) questions (40 marks).',
    explanationNe:
      'नायब सुब्बा प्रथम चरणमा प्रतिप्रश्न २ अङ्कका दरले ५० वस्तुगत बहुवैकल्पिक प्रश्न सोधिन्छन् (समय ४५ मिनेट, उत्तीर्णाङ्क ४५, २०% नकारात्मक अङ्क): जसमा ३० सामान्य ज्ञान (६० अङ्क) र २० सामान्य बौद्धिक परीक्षण (४० अङ्क) रहन्छन्।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Official PSC Nayab Subba Syllabus — Phase I (GK & GMAT)',
    sourcePath: '/materials/official-psc/psc-official-nayab-subba-phase1.pdf',
  },
  {
    id: 'PSC-INT-423',
    level: 'Non-Gazetted First Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Nayab Subba competitive examination target',
    paper: 'Stage II: Main Written Examination',
    subject: 'Public Administration & Law',
    topicId: 'PSC-EXM',
    topic: 'PSC Examination System',
    subtopicId: 'PSC-EXM-11',
    subtopic: 'Nayab Subba Written Format & 240M Merit',
    question:
      'In the official Nayab Subba Stage II Main Examination (Paper II: Contemporary Studies & Public Service Management — 100 Marks, 2 Hours 30 Minutes), what is the exact question-and-mark structure, and what is the Final Selection Merit total?',
    questionNe:
      'आधिकारिक नायब सुब्बा द्वितीय चरणको मुख्य परीक्षा (द्वितीय पत्र: समसामयिक अध्ययन र सार्वजनिक सेवा व्यवस्थापन — १०० अङ्क, २ घण्टा ३० मिनेट) मा प्रश्न तथा अङ्क संरचना कस्तो हुन्छ र अन्तिम छनोट योग्यताक्रमको कुल पूर्णाङ्क कति हुन्छ?',
    options: [
      {
        key: 'A',
        text: '14 short questions × 5M (70M) + 3 long questions × 10M (30M); Final Merit = 240 Marks (200M Written + 10M Computer + 30M Interview)',
        textNe: '१४ छोटो प्रश्न × ५ अङ्क (७०) + ३ लामो प्रश्न × १० अङ्क (३०); अन्तिम योग्यताक्रम = २४० अङ्क (२०० लिखित + १० कम्प्युटर + ३० अन्तर्वार्ता)',
      },
      {
        key: 'B',
        text: '10 questions × 10M (100M); Final Merit = 290 Marks including 50% of Stage I',
        textNe: '१० प्रश्न × १० अङ्क (१००); प्रथम चरणको ५०% सहित २९० अङ्क',
      },
      {
        key: 'C',
        text: '20 questions × 5M (100M); Final Merit = 220 Marks',
        textNe: '२० प्रश्न × ५ अङ्क (१००); अन्तिम योग्यताक्रम = २२० अङ्क',
      },
      {
        key: 'D',
        text: '5 case studies × 20M (100M); Final Merit = 300 Marks',
        textNe: '५ केस स्टडी × २० अङ्क (१००); अन्तिम योग्यताक्रम = ३०० अङ्क',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Under the official Nayab Subba Phase II syllabus, Paper II and Paper III each test 14 short questions of 5 marks (70M) and 3 long analytical questions of 10 marks (30M) in 2 hrs 30 mins (Pass Marks: 40), combining with Computer Skill Test (10M) and Interview (30M) for a 240-mark final merit.',
    explanationNe:
      'आधिकारिक नायब सुब्बा द्वितीय चरणको पाठ्यक्रमअनुसार द्वितीय र तृतीय पत्र दुवैमा २ घण्टा ३० मिनेटमा ५ अङ्कका १४ छोटो उत्तर (७० अङ्क) र १० अङ्कका ३ लामो विश्लेषणात्मक प्रश्न (३० अङ्क) सोधिन्छन् (उत्तीर्णाङ्क ४०); जसमा कम्प्युटर सीप (१०) र अन्तर्वार्ता (३०) जोडी कुल २४० अङ्कको अन्तिम योग्यताक्रम बन्दछ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle:
      'Official PSC Nayab Subba Syllabus — Phase II (Papers II & III)',
    sourcePath: '/materials/official-psc/psc-official-nayab-subba-phase2.pdf',
  },
  {
    id: 'PSC-INT-424',
    level: 'Non-Gazetted Second Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration / Accounts',
    post: 'Kharidar competitive examination target',
    paper: 'Stage I: Preliminary Examination',
    subject: 'Public Administration & Law',
    topicId: 'PSC-EXM',
    topic: 'PSC Examination System',
    subtopicId: 'PSC-EXM-12',
    subtopic: 'Kharidar Stage I GK & BOST Breakdown',
    question:
      'In the official Lok Sewa Aayog Kharidar (Non-Gazetted Second Class) Stage I Preliminary Examination (100 Marks, 45 Minutes, Pass Marks 45), what are the two sections and their exact mark allocations?',
    questionNe:
      'लोक सेवा आयोगको आधिकारिक खरिदार (रा.प.अनं. द्वितीय श्रेणी) प्रथम चरणको प्रारम्भिक परीक्षा (१०० अङ्क, ४५ मिनेट, उत्तीर्णाङ्क ४५) का दुई खण्ड र तिनको अङ्कभार विभाजन के हो?',
    options: [
      {
        key: 'A',
        text: 'General Knowledge (30 MCQs × 2M = 60 Marks) and Basic Office Skills Test / BOST (20 MCQs × 2M = 40 Marks)',
        textNe: 'सामान्य ज्ञान (३० प्रश्न × २ अङ्क = ६० अङ्क) र आधारभूत कार्यालय सीप परीक्षण / BOST (२० प्रश्न × २ अङ्क = ४० अङ्क)',
      },
      {
        key: 'B',
        text: 'General Knowledge (25 MCQs = 50M) and English Translation (25 MCQs = 50M)',
        textNe: 'सामान्य ज्ञान (२५ प्रश्न = ५० अङ्क) र अंग्रेजी अनुवाद (२५ प्रश्न = ५० अङ्क)',
      },
      {
        key: 'C',
        text: 'Nepali Grammar (50M) and Civic Mathematics (50M)',
        textNe: 'नेपाली व्याकरण (५० अङ्क) र कार्यालय गणित (५० अङ्क)',
      },
      {
        key: 'D',
        text: 'General Knowledge (70M) and Computer Typing (30M)',
        textNe: 'सामान्य ज्ञान (७० अङ्क) र कम्प्युटर टाइपिङ (३० अङ्क)',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Kharidar Stage I tests 30 General Knowledge questions (60 marks) and 20 Basic Office Skills Test (BOST: verbal, numerical, spatial, and clerical verification) questions (40 marks) in 45 minutes with a 45-mark qualifying threshold.',
    explanationNe:
      'खरिदार प्रथम चरणमा ४५ मिनेटमा सामान्य ज्ञानका ३० प्रश्न (६० अङ्क) र आधारभूत कार्यालय सीप परीक्षण (BOST: शाब्दिक, संख्यात्मक, स्थानिक र अभिलेख रुजु) का २० प्रश्न (४० अङ्क) सोधिन्छन्, जसको उत्तीर्णाङ्क ४५ रहेको छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Official PSC Kharidar Syllabus — Phase I (GK & BOST)',
    sourcePath: '/materials/official-psc/psc-official-kharidar-phase1.pdf',
  },
  {
    id: 'PSC-INT-425',
    level: 'Non-Gazetted Second Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration / Judicial / Accounts',
    post: 'Kharidar competitive examination target',
    paper: 'Stage II: Main Written Examination',
    subject: 'Public Administration & Law',
    topicId: 'PSC-EXM',
    topic: 'PSC Examination System',
    subtopicId: 'PSC-EXM-13',
    subtopic: 'Kharidar Paper II & 240M Merit',
    question:
      'In the official Kharidar Stage II Paper II (Office Management — 100 Marks, 2 Hours 30 Minutes), how are the three sections weighted, and what is the total Final Merit score including Paper III, Computer Skill, and Interview?',
    questionNe:
      'आधिकारिक खरिदार द्वितीय चरणको द्वितीय पत्र (कार्यालय व्यवस्थापन — १०० अङ्क, २ घण्टा ३० मिनेट) मा तीन खण्डको अङ्कभार कसरी विभाजन गरिएको छ र तृतीय पत्र, कम्प्युटर सीप तथा अन्तर्वार्ता सहितको कुल अन्तिम योग्यताक्रम अङ्क कति हुन्छ?',
    options: [
      {
        key: 'A',
        text: 'Section A Office Management & Nepali Writing (35M) + Section B Constitution & Civic Duties (35M) + Section C Office Mathematics (30M); Final Merit = 240 Marks',
        textNe: 'खण्ड क: कार्यालय व्यवस्थापन र नेपाली लेखन (३५ अङ्क) + खण्ड ख: संविधान र नागरिक चेतना (३५ अङ्क) + खण्ड ग: कार्यालय गणित (३० अङ्क); अन्तिम योग्यताक्रम = २४० अङ्क',
      },
      {
        key: 'B',
        text: 'Office Management (50M) + Science (50M); Final Merit = 230 Marks',
        textNe: 'कार्यालय व्यवस्थापन (५० अङ्क) + विज्ञान (५० अङ्क); अन्तिम योग्यताक्रम = २३० अङ्क',
      },
      {
        key: 'C',
        text: 'Constitution (60M) + English Essay (40M); Final Merit = 200 Marks',
        textNe: 'संविधान (६० अङ्क) + अंग्रेजी निबन्ध (४० अङ्क); अन्तिम योग्यताक्रम = २०० अङ्क',
      },
      {
        key: 'D',
        text: 'Accounting only (100M); Final Merit = 300 Marks',
        textNe: 'लेखा मात्र (१०० अङ्क); अन्तिम योग्यताक्रम = ३०० अङ्क',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Kharidar Paper II comprises Office Management & Official Nepali Writing (35M), Constitution & Public Service Values (35M), and Practical Office Mathematics (30M). Combined with Paper III (100M), Computer Skill Test (10M), and Oral Interview (30M), total final merit is 240 Marks.',
    explanationNe:
      'खरिदार द्वितीय पत्रमा कार्यालय व्यवस्थापन तथा नेपाली लेखन (३५ अङ्क), संविधान तथा सार्वजनिक सेवा मूल्य (३५ अङ्क) र व्यावहारिक कार्यालय गणित (३० अङ्क) समावेश छन्। तृतीय पत्र (१००), कम्प्युटर सीप परीक्षण (१०) र अन्तर्वार्ता (३०) जोडी कुल २४० अङ्कको अन्तिम योग्यताक्रम कायम हुन्छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle:
      'Official PSC Kharidar Syllabus — Phase II (Papers II & III)',
    sourcePath: '/materials/official-psc/psc-official-kharidar-phase2.pdf',
  },
];

/**
 * Deduplicated master question bank across all PSC subjects, topics, subtopics, and difficulties.
 */
export const ALL_QUIZ_QUESTIONS: QuizQuestion[] = [
  ...LANGUAGE_AND_WRITING_QUESTIONS,
  ...NEPAL_PARICHAYA_QUESTIONS,
  ...LAWS_AND_CONSTITUTION_QUESTIONS,
  ...PSC_AND_PLANNING_QUESTIONS,
  ...COMPREHENSIVE_EXTRA_QUESTIONS,
];

export const QUIZ_DECKS: QuizDeck[] = [
  {
    id: 'comprehensive-mock',
    title: 'Comprehensive Lok Sewa Real Mock Quiz',
    subtitle: '30 Questions · 30-Minute Reverse Countdown',
    description:
      'Full 30-question integrated mock exam combining Nepali Administrative Writing, English Competence, Nepal Parichaya, Constitutional Law, LGOA 2074, Anti-Corruption & Fiscal Acts, Periodic Planning, and PSC Aptitude under a strict 30:00 reverse timer.',
    questions: [
      LANGUAGE_AND_WRITING_QUESTIONS[0], // PSC-LANG-100 (Nepali official style)
      LANGUAGE_AND_WRITING_QUESTIONS[1], // PSC-LANG-101 (Paripatra)
      LANGUAGE_AND_WRITING_QUESTIONS[7], // PSC-LANG-107 (Multi-select report writing)
      LANGUAGE_AND_WRITING_QUESTIONS[10], // PSC-LANG-110 (English SVA)
      LANGUAGE_AND_WRITING_QUESTIONS[11], // PSC-LANG-111 (English Abrogate)
      NEPAL_PARICHAYA_QUESTIONS[0], // PSC-GEO-101
      NEPAL_PARICHAYA_QUESTIONS[2], // PSC-GEO-103
      NEPAL_PARICHAYA_QUESTIONS[3], // PSC-HIS-104
      NEPAL_PARICHAYA_QUESTIONS[5], // PSC-CUL-106 (Multi-select UNESCO Natural)
      NEPAL_PARICHAYA_QUESTIONS[6], // PSC-FED-107
      COMPREHENSIVE_EXTRA_QUESTIONS[10], // PSC-INT-411 (LGOA Judicial Committee)
      COMPREHENSIVE_EXTRA_QUESTIONS[0], // PSC-INT-401
      COMPREHENSIVE_EXTRA_QUESTIONS[1], // PSC-INT-402
      COMPREHENSIVE_EXTRA_QUESTIONS[4], // PSC-INT-405
      COMPREHENSIVE_EXTRA_QUESTIONS[9], // PSC-INT-410
      LAWS_AND_CONSTITUTION_QUESTIONS[0], // PSC-CON-201
      LAWS_AND_CONSTITUTION_QUESTIONS[1], // PSC-CON-202
      LAWS_AND_CONSTITUTION_QUESTIONS[3], // PSC-LAW-204
      COMPREHENSIVE_EXTRA_QUESTIONS[13], // PSC-INT-414 (Corruption Act Sec 50 60-day)
      LAWS_AND_CONSTITUTION_QUESTIONS[9], // PSC-CON-210
      LAWS_AND_CONSTITUTION_QUESTIONS[11], // PSC-CON-212 (Multi-select Article 274)
      COMPREHENSIVE_EXTRA_QUESTIONS[2], // PSC-INT-403
      COMPREHENSIVE_EXTRA_QUESTIONS[3], // PSC-INT-404
      COMPREHENSIVE_EXTRA_QUESTIONS[17], // PSC-INT-418 (Fiscal Accountability Act Beruju)
      PSC_AND_PLANNING_QUESTIONS[0], // PSC-ADM-301
      PSC_AND_PLANNING_QUESTIONS[3], // PSC-PLN-304
      PSC_AND_PLANNING_QUESTIONS[9], // PSC-APT-310
      COMPREHENSIVE_EXTRA_QUESTIONS[5], // PSC-INT-406
      COMPREHENSIVE_EXTRA_QUESTIONS[6], // PSC-INT-407
      COMPREHENSIVE_EXTRA_QUESTIONS[8], // PSC-INT-409
    ],
  },
  {
    id: 'language-and-writing',
    title: 'Language & Official Writing (नेपाली र English)',
    subtitle: '15 Questions · 15-Minute Reverse Countdown',
    description:
      'Practice Nepali administrative writing (प्रशासनिक लेखन, टिप्पणी, परिपत्र, प्रतिवेदन, संक्षेपीकरण, व्याकरण) and PSC Section Officer English Competence under a strict 15:00 reverse timer.',
    questions: LANGUAGE_AND_WRITING_QUESTIONS,
  },
  {
    id: 'nepal-parichaya',
    title: 'Nepal Parichaya Mastery',
    subtitle: '20 Questions · 20-Minute Reverse Countdown',
    description:
      'Test your grasp of ecological belts, river basins, Himalayan peaks, lakes, national parks, ancient-to-modern historical milestones, Census 2078 demographics, UNESCO sites, and all 7 provinces & 753 local governments.',
    questions: NEPAL_PARICHAYA_QUESTIONS,
  },
  {
    id: 'laws-and-constitution',
    title: 'Constitution & Public Laws',
    subtitle: '20 Questions · 20-Minute Reverse Countdown',
    description:
      'Assess constitutional structure, Fundamental Rights, Supreme Court & 13 Commissions, federal schedules, 45% inclusive civil service rules, probation & tenures, RTI appeals, and Good Governance Act safeguards.',
    questions: LAWS_AND_CONSTITUTION_QUESTIONS,
  },
  {
    id: 'psc-and-planning',
    title: 'PSC Syllabus, 16th Plan & Aptitude',
    subtitle: '20 Questions · 20-Minute Reverse Countdown',
    description:
      'Practice Section Officer, Nayab Subba, and Kharidar exam rules, -20% negative marking math, Sixteenth Periodic Plan & LDC graduation priorities, Darta-Chalani, and verbal/quantitative IQ.',
    questions: PSC_AND_PLANNING_QUESTIONS,
  },
];
