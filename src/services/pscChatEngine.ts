import {
  PSC_CADRE_SYLLABI,
  type PscCadreSyllabus,
  type PscSyllabusPaper,
  type PscSyllabusTopic,
} from '../data/pscSyllabusData';
import {
  ALL_QUIZ_QUESTIONS,
  type QuizQuestion,
} from '../data/quizData';
import {
  WRITTEN_QUESTIONS,
  type WrittenQuestion,
} from '../data/writtenQuestionsData';

export interface ClientStudyContext {
  currentPath?: string;
  targetCadreId?: string;
  completedTopicsCount?: number;
  completedUnitsCount?: number;
  quizAttemptsCount?: number;
  bestQuizAccuracy?: number | null;
  writtenMasteredCount?: number;
  writtenPracticingCount?: number;
  simulationRunsCount?: number;
  recentBooksCount?: number;
}

export interface ChatMessageTurn {
  role: 'user' | 'assistant';
  content: string;
}

function extractKeywords(text: string): string[] {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
        .split(/\s+/)
        .filter((t) => t.length >= 2)
    )
  );
}

function isDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

// -------------------------------------------------------------
// Specialized Handlers for High-Frequency Academic Queries
// -------------------------------------------------------------

function handleNegativeMarking(cadre?: PscCadreSyllabus): string {
  const cadreName = cadre ? cadre.title : 'Section Officer, Nayab Subba & Kharidar';
  return `### PSC Nepal Negative Marking Rules (माइनस मार्किङ नियम)

In Nepal Lok Sewa Aayog (लोक सेवा आयोग) Phase I Objective Multiple-Choice (MCQ) Screening Exams across **${cadreName}**, negative marking is strictly enforced at **20% (-20%)**:

- **For 1-Mark MCQs** (General Knowledge, English, Math, General Aptitude):
  - **Correct Answer**: \`+1.00\` mark
  - **Wrong Answer**: \`-0.20\` mark deducted (20% penalty)
  - **Unattempted / Blank**: \`0.00\` mark (no penalty)
- **For 2-Mark MCQs** (where 50 questions = 100 marks, e.g. Section Officer Paper I):
  - **Correct Answer**: \`+2.00\` marks
  - **Wrong Answer**: \`-0.40\` marks deducted (20% of 2 marks)
  - **Unattempted / Blank**: \`0.00\` mark

#### Strategic Takeaway for Candidates
- **50/50 Educated Guess**: If you can eliminate 2 wrong options, the expected statistical yield is \`+0.50 × 1.0 - 0.50 × 0.20 = +0.40\` mark per question. Educated guessing is statistically advantageous.
- **Blind Random Guess**: Expected yield across 4 options is \`+0.25 × 1.0 - 0.75 × 0.20 = +0.10\` mark, but high variance risks dipping below the **45% or 40% screening pass mark**.
- You can test your strategy in the [Aggregate Merit & Negative-Marking Strategy Lab](/simulate?mode=merit-lab).`;
}

function handleSyllabusComparison(): string {
  return `### Comprehensive Comparison: Section Officer, Nayab Subba & Kharidar

| Metric / Feature | [Section Officer (शाखा अधिकृत)](/syllabus/section-officer) | [Nayab Subba (नायब सुब्बा)](/syllabus/nayab-subba) | [Kharidar (खरिदार)](/syllabus/kharidar) |
|---|---|---|---|
| **Gazetted Level** | Gazetted Class III (राजपत्राङ्कित तृतीय) | Non-Gazetted 1st Class (राजपत्र अनङ्कित प्रथम) | Non-Gazetted 2nd Class (राजपत्र अनङ्कित द्वितीय) |
| **Minimum Academic Eligibility** | Bachelor's Degree (स्नातक तह) | Higher Secondary / 10+2 (प्रवीणता प्रमाण पत्र / १२ कक्षा) | SLC / SEE with GPA ≥ 1.6 or equivalent |
| **Phase I Screening** | 100 Marks (50 MCQs × 2M: GK 60M + IQ 40M) | 100 Marks (50 MCQs × 2M: GK 60M + General Aptitude 40M) | 100 Marks (50 MCQs × 2M: GK 60M + Basic Aptitude 40M) |
| **Phase I Duration** | 90 Minutes (1.5 Hours) | 45 Minutes | 45 Minutes |
| **Phase I Pass Gate** | **45% (45 Marks)** | **40% (40 Marks)** | **40% (40 Marks)** |
| **Phase I Marks in Final Merit?** | **No** (Screening filter only) | **Yes, 50% carried forward** (50M max) | **Yes, 50% carried forward** (50M max) |
| **Phase II Written Papers** | Paper II: Governance (100M)<br/>Paper III: Contemporary (100M)<br/>Paper IV: Service-Specific (100M) | Paper II: Contemporary & Public Mgmt (100M)<br/>Paper III: Service-Specific Subject (100M) | Paper II: Office Mgmt & Governance (100M)<br/>Paper III: Job-Oriented Knowledge (100M) |
| **Phase III / Stage III** | Extra Paper (Foreign Service 100M) + Skill Test (10M) + Group Discussion (10M) + Viva (40M) | Computer Skill Test (10M) + Interview (40M) | Computer Skill Test (10M) + Interview (30M) |

- Explore all papers, chapters, and topic briefs in the [Official Syllabus Explorer](/syllabus).`;
}

function handleMockHallSummary(): string {
  return `### PSC Nepal Examination Hall Simulations

PSC Nepal features three distinct, realistic simulation halls designed to replicate official Lok Sewa Aayog exam conditions:

#### 1. [Phase I OMR Screening Hall](/simulate?mode=omr-hall)
- **Authentic OMR Bubble Sheet**: Fill bubbles \`[A]\`, \`[B]\`, \`[C]\`, \`[D]\` with booklet key randomization (\`Key A\`, \`Key B\`, \`Key C\`, \`Key D\`).
- **Strict Countdown Timer**: Timed down to the second with automated auto-submission.
- **Official Scoring**: Instant score breakdown with \`-20%\` negative marking and official Pass/Fail screening qualification determination.
- **Available Presets**:
  - [Section Officer Phase I Master OMR](/simulate?mode=omr-hall&preset=so-phase1-omr&launch=1) (50 MCQs, 90 mins, 45% pass gate)
  - [Nayab Subba Phase I Speed Drill](/simulate?mode=omr-hall&preset=nasu-phase1-omr&launch=1) (50 MCQs, 45 mins, 40% pass gate)
  - [Kharidar Phase I Foundation OMR](/simulate?mode=omr-hall&preset=kh-phase1-omr&launch=1) (50 MCQs, 45 mins, 40% pass gate)
  - [Phase I 15-Minute Sprint](/simulate?mode=omr-hall&preset=mini-omr-sprint&launch=1) (15 MCQs, quick tune-up)

#### 2. [Phase II Timed Written Paper Hall](/simulate?mode=written-hall)
- **Bilingual Prompts**: Toggle between English and नेपाली instructions and model rubrics.
- **Strict Writing Pacer**: Allocates \`1.8 minutes per mark\` (e.g. 9 mins for 5M, 18 mins for 10M).
- **In-App Answer Editor & Word Counter**: Type or draft answers with real-time word counting.
- **Self-Scoring Examiner Rubric**: Verify key required points and self-evaluate with Full Credit (100%), Partial Credit (55%), or Missed (0%).
- **Available Presets**:
  - [Section Officer Paper II Governance Hall](/simulate?mode=written-hall&preset=so-paper2-hall&launch=1)
  - [Nayab Subba Paper II Public Management](/simulate?mode=written-hall&preset=nasu-paper2-hall&launch=1)
  - [Kharidar Paper II Office Administration](/simulate?mode=written-hall&preset=kh-paper2-hall&launch=1)
  - [Governance & Contemporary Case Study Sprint](/simulate?mode=written-hall&preset=governance-case-sprint&launch=1)

#### 3. [Merit & Negative-Marking Strategy Lab](/simulate?mode=merit-lab)
- Calculate statistically expected net scores under different risk appetites (confident answers, 50/50 educated guesses, and blind guesses).
- Calculate total aggregate merit ranking points across Phase I, II, and III.`;
}

function handlePdfAndContact(): string {
  return `### Official PSC PDFs, 3D Flipbook & Support Desk

#### Authentic Official Lok Sewa Syllabi & Statutory PDFs
PSC Nepal provides full original PDFs viewable inside an interactive 3D Flipbook reader or standard continuous scroll mode:
- **Official Syllabi**:
  - [Section Officer Phase I & Phase II Syllabus](/read?sample=%2Fmaterials%2Fofficial-psc%2Fpsc-official-section-officer-phase1.pdf)
  - [Nayab Subba Phase I & Phase II Syllabus](/read?sample=%2Fmaterials%2Fofficial-psc%2Fpsc-official-nayab-subba-phase1.pdf)
  - [Kharidar Phase I & Phase II Syllabus](/read?sample=%2Fmaterials%2Fofficial-psc%2Fpsc-official-kharidar-phase1.pdf)
- **Key Statutes & General Knowledge**:
  - [Constitution of Nepal 2072](/read?sample=%2Fmaterials%2Fconstitution-of-nepal-2072.pdf)
  - [Civil Service Act 2049](/read?sample=%2Fmaterials%2Fcivil-service-act-2049.pdf)
  - [Good Governance Act 2064](/read?sample=%2Fmaterials%2Fgood-governance-act-2064.pdf)
  - [Local Government Operation Act 2074](/read?sample=%2Fmaterials%2Flocal-government-operation-act-2074.pdf)
  - [Corruption Prevention Act 2059](/read?sample=%2Fmaterials%2Fcorruption-prevention-act-2059.pdf)
  - [Right to Information Act 2064](/read?sample=%2Fmaterials%2Fright-to-information-act-2064.pdf)
  - [Nepal Parichaya (Geography, History & Heritage)](/materials/nepal-parichaya)

Browse all reading materials in the [Study Materials Catalog](/materials).

#### 3D Flipbook Reader Keyboard Shortcuts
- \`Left Arrow (←)\` / \`Right Arrow (→)\`: Flip pages forward or backward
- \`+\` / \`-\`: Zoom in / Zoom out
- \`0\`: Reset zoom
- \`F\`: Toggle full-screen mode
- \`Esc\`: Close dialogs / exit full-screen

#### Editorial Support Desk & Errata
- **Contact Email**: \`info.pscnepal@gmail.com\`
- **Contact Desk Page**: Visit the [Contact Page](/contact) to generate a tracked inquiry ticket (\`PSC-YYYY-XXXX\`) for:
  1. *Quiz / Written Q&A Errata* (with Question ID citation)
  2. *Reading Material / Syllabus Request*
  3. *PDF Reader / Flipbook Support*
  4. *General Feedback*`;
}

function handleCandidateProgress(clientContext?: ClientStudyContext): string {
  if (!clientContext) {
    return 'You can review your detailed syllabus completion progress, quiz attempts, and exam simulation history on the [Candidate Progress Ledger](/progress).';
  }

  const {
    targetCadreId = 'section-officer',
    completedTopicsCount = 0,
    completedUnitsCount = 0,
    quizAttemptsCount = 0,
    bestQuizAccuracy,
    writtenMasteredCount = 0,
    writtenPracticingCount = 0,
    simulationRunsCount = 0,
    recentBooksCount = 0,
  } = clientContext;

  const cadreLabel =
    targetCadreId === 'section-officer'
      ? 'Section Officer (शाखा अधिकृत)'
      : targetCadreId === 'nayab-subba'
        ? 'Nayab Subba (नायब सुब्बा)'
        : 'Kharidar (खरिदार)';

  return `### Your Active Study Dashboard Summary

- **Active Target Cadre**: **${cadreLabel}** ([Switch or View Syllabus](/syllabus/${targetCadreId}))
- **Syllabus Coverage**: **${completedTopicsCount} topics** across **${completedUnitsCount} units** marked as completed.
- **Objective MCQs**: **${quizAttemptsCount} test sessions** attempted${bestQuizAccuracy !== null ? ` (Best Session Accuracy: **${bestQuizAccuracy}%**)` : ''}.
- **Written Questions**: **${writtenMasteredCount} mastered**, **${writtenPracticingCount} in practice** ([Open Written Q&A Bank](/written)).
- **Examination Simulations**: **${simulationRunsCount} exam hall runs** completed in the [Simulation Hall](/simulate).
- **Personal Library**: **${recentBooksCount} documents** opened in the [Reader & Library](/library).

Keep up the disciplined preparation! All progress is securely saved in your browser storage.`;
}

// -------------------------------------------------------------
// Format Specific Question or Resource
// -------------------------------------------------------------

function formatWrittenQuestionDetail(wq: WrittenQuestion): string {
  const enSections = wq.en.sections
    .map(
      (sec) =>
        `##### ${sec.heading}\n${sec.points.map((p) => `- ${p}`).join('\n')}`
    )
    .join('\n\n');

  const neSections = wq.ne.sections
    .map(
      (sec) =>
        `##### ${sec.heading}\n${sec.points.map((p) => `- ${p}`).join('\n')}`
    )
    .join('\n\n');

  const rubricItems = wq.rubric
    .map((r, i) => `${i + 1}. **${r.en}** / *${r.ne}*`)
    .join('\n');

  return `### Written Question: [${wq.id}] ${wq.en.title} (/written/${wq.id})
- **Paper**: ${wq.paper} | **Subject**: ${wq.subject} | **Marks**: ${wq.marks} Marks (${wq.en.marksAllocation})
- **Target Cadre**: ${wq.postTarget} | **Recommended Time**: ${wq.recommendedMinutes} Minutes
- **Source Reference**: ${wq.sourceTitle}

---

#### 1. English Model Answer
**Prompt**: *${wq.en.question}*

**Introduction**:
${wq.en.introduction}

${enSections}

**Conclusion**:
${wq.en.conclusion}

---

#### 2. नेपाली नमुना उत्तर
**प्रश्न**: *${wq.ne.question}*

**पृष्ठभूमि / परिचय**:
${wq.ne.introduction}

${neSections}

**निष्कर्ष**:
${wq.ne.conclusion}

---

#### Examiner Evaluation Rubric
${rubricItems}

You can practice drafting this answer under timed conditions in the [Written Question Studio](/written/${wq.id}).`;
}

function formatQuizQuestionDetail(q: QuizQuestion): string {
  const isBilingual =
    q.subject.trim().toLowerCase() !== 'english' &&
    q.subject.trim().toLowerCase() !== 'nepali';

  const optionsList = q.options
    .map((o) => {
      const isCorrect = q.correct_options.includes(o.key);
      const neText =
        isBilingual && o.textNe && o.textNe.trim() !== o.text.trim()
          ? ` *(${o.textNe})*`
          : '';
      return `- **(${o.key})** ${o.text}${neText} ${isCorrect ? '✅ *(Correct Answer)*' : ''}`;
    })
    .join('\n');

  const questionNeBlock =
    isBilingual && q.questionNe?.trim() ? `\n> ${q.questionNe.trim()}` : '';
  const explanationNeBlock =
    isBilingual && q.explanationNe?.trim() ? `\n\n${q.explanationNe.trim()}` : '';

  return `### Question [${q.id}] (${q.subject} > ${q.subtopic})
**Difficulty**: ${q.difficulty.toUpperCase()} | **Marks**: ${q.marks}M

**Question**:
> ${q.question}${questionNeBlock}

**Options**:
${optionsList}

**Verified Answer**: Option **${q.correct_options.join(', ')}**

**Statutory & Conceptual Explanation**:
${q.explanation}${explanationNeBlock}

${q.sourceTitle ? `*Reference: ${q.sourceTitle}*` : ''}

Practice more questions on this topic in the [MCQ Quiz Arena](/quiz).`;
}

// -------------------------------------------------------------
// Core Pure Client Search and Answer Synthesizer
// -------------------------------------------------------------

export function generatePscChatResponse(
  userQuery: string,
  clientContext?: ClientStudyContext
): string {
  const query = userQuery.trim();
  const lowerQuery = query.toLowerCase();
  const keywords = extractKeywords(query);

  // 1. Starter Prompts & High-Priority Direct Patterns
  if (/about( psc nepal)?|who are you|mission|हाम्रो बारेमा/i.test(query)) {
    return `### About PSC Nepal (हाम्रो बारेमा)

**PSC Nepal** is an independent digital study workspace engineered to empower Nepal's civil service aspirants across all 7 Provinces and 77 districts with open, structured, and rigorous preparation.

#### Core Pillars:
- **Official Syllabi**: Comprehensive phase, paper, and topic checklists for Section Officer, Nayab Subba, and Kharidar.
- **Realistic Exam Hall Simulator**: Phase I OMR screening with -20% negative marking and Phase II Timed Written Hall (1.8 mins/mark) with rubric self-evaluation.
- **Bilingual Model Answers**: Structured 5M and 10M subjective answers formatted in English and नेपाली.
- **3D Flipbook Reader**: Two-page spread viewing of the Constitution 2072, Civil Service Act 2049, Local Government Operation Act 2074, and Nepal Parichaya.
- **Local-First Privacy**: 100% of study progress, quiz scores, and bookmarks remain private in your browser.

Read more about our mission on the [About PSC Nepal Page](/about) or reach our editorial desk at \`info.pscnepal@gmail.com\`.`;
  }

  if (
    /syllabus.*(-20%|negative|marking|rules|scheme|pass|compare)/i.test(query) ||
    /(-20%|negative marking|माइनस मार्किङ)/i.test(query)
  ) {
    if (/compare|section officer.*nayab subba|scheme/i.test(query)) {
      return `${handleSyllabusComparison()}\n\n---\n\n${handleNegativeMarking()}`;
    }
    return handleNegativeMarking();
  }

  if (
    /practice.*(3|few|mcqs?|questions?)|give me.*mcq/i.test(lowerQuery) ||
    lowerQuery.includes('practice 3 psc mcqs')
  ) {
    // Pick 3 high-yield questions across Constitution, Governance, and Planning
    const candidates = ALL_QUIZ_QUESTIONS.filter((q) =>
      ['Constitution & Public Law', 'Governance & Civil Service', 'Economic Development & Planning'].includes(
        q.subject
      )
    ).slice(0, 3);

    const questionsFormatted = (candidates.length > 0 ? candidates : ALL_QUIZ_QUESTIONS.slice(0, 3))
      .map((q, idx) => `#### Question ${idx + 1}:\n${formatQuizQuestionDetail(q)}`)
      .join('\n\n---\n\n');

    return `Here are 3 high-yield Lok Sewa Aayog practice MCQs from the official question bank:\n\n${questionsFormatted}\n\nTo practice with a timed countdown timer and negative marking, open the [MCQ Quiz Arena](/quiz).`;
  }

  if (
    /bilingual.*(10m|model|answer|rubric)|psc-wr-201/i.test(lowerQuery) ||
    lowerQuery.includes('psc-wr-201')
  ) {
    const targetWq = WRITTEN_QUESTIONS.find((w) => w.id === 'PSC-WR-201') || WRITTEN_QUESTIONS[0];
    return formatWrittenQuestionDetail(targetWq);
  }

  if (
    /mock.*(exam|hall|simulation|simulator)|launch.*omr/i.test(lowerQuery) ||
    lowerQuery.includes('mock exams & simulator')
  ) {
    return handleMockHallSummary();
  }

  if (
    /pdf|flipbook|contact|support|desk|email|reader/i.test(lowerQuery) ||
    lowerQuery.includes('pdfs & contact info')
  ) {
    return handlePdfAndContact();
  }

  if (
    /my progress|how am i doing|dashboard|my stats|completed topics/i.test(lowerQuery)
  ) {
    return handleCandidateProgress(clientContext);
  }

  // 2. Direct ID lookups (e.g., PSC-WR-*, PSC-CONST-*, etc.)
  const writtenIdMatch = query.toUpperCase().match(/PSC-WR-\d+/);
  if (writtenIdMatch) {
    const found = WRITTEN_QUESTIONS.find((w) => w.id === writtenIdMatch[0]);
    if (found) {
      return formatWrittenQuestionDetail(found);
    }
  }

  const quizIdMatch = query.toUpperCase().match(/PSC-[A-Z]+-\d+/);
  if (quizIdMatch) {
    const found = ALL_QUIZ_QUESTIONS.find((q) => q.id === quizIdMatch[0]);
    if (found) {
      return formatQuizQuestionDetail(found);
    }
  }

  // 3. Cadre-Specific Syllabus Inquiries
  if (
    /section officer|शाखा अधिकृत/i.test(query) &&
    /syllabus|paper|marks|exam|phase|पाठ्यक्रम/i.test(query)
  ) {
    const soCadre = PSC_CADRE_SYLLABI.find((c) => c.id === 'section-officer')!;
    const phase1 = soCadre.phases[0];
    const phase2 = soCadre.phases[1];
    return `### Section Officer (शाखा अधिकृत) — Official Syllabus Blueprint
- **Gazetted Level**: ${soCadre.rankClassification} | **Eligibility**: ${soCadre.eligibilitySummary}
- **Screening Rule**: Pass Gate is **${soCadre.screeningPassPercent}% (45 Marks)** with **-${soCadre.negativeMarkingPercent}%** negative marking on Paper I. (Screening score does not count toward final merit).
- **Official Syllabus PDF**: [Open Official PDF in 3D Flipbook](/read?sample=%2Fmaterials%2Fofficial-psc%2Fpsc-official-section-officer-phase1.pdf)

#### Examination Phases & Papers:
1. **${phase1.title} (${phase1.nepaliTitle})**:
   - Paper I: *Administrative Aptitude Test (GK 60M + IQ/Aptitude 40M)* = 100 Marks (50 MCQs × 2M), 90 Minutes.
2. **${phase2.title} (${phase2.nepaliTitle})**:
   - Paper II: *Governance System (शासन प्रणाली)* = 100 Marks (Subjective, 3 Hours)
   - Paper III: *Contemporary Issues (समसामयिक विषय)* = 100 Marks (Subjective, 3 Hours)
   - Paper IV: *Service-Specific Subject (सेवा सम्बन्धी)* = 100 Marks (Subjective, 3 Hours)
3. **Stage III**: Extra Paper (Foreign Service only, 100M) + Computer Skill Test (10M) + Group Discussion (10M) + Individual Interview (40M).

View chapter and topic checklists on the [Section Officer Syllabus Explorer](/syllabus/section-officer).`;
  }

  if (
    /nayab subba|नायब सुब्बा|na\.? su\.?/i.test(query) &&
    /syllabus|paper|marks|exam|phase|पाठ्यक्रम/i.test(query)
  ) {
    const nasuCadre = PSC_CADRE_SYLLABI.find((c) => c.id === 'nayab-subba')!;
    return `### Nayab Subba (नायब सुब्बा) — Official Syllabus Blueprint
- **Rank**: ${nasuCadre.rankClassification} | **Eligibility**: ${nasuCadre.eligibilitySummary}
- **Screening Rule**: Pass Gate is **${nasuCadre.screeningPassPercent}% (40 Marks)** with **-${nasuCadre.negativeMarkingPercent}%** negative marking. **50% of Phase I marks** carry forward into the final merit calculation.
- **Official Syllabus PDF**: [Open Nayab Subba PDF in 3D Flipbook](/read?sample=%2Fmaterials%2Fofficial-psc%2Fpsc-official-nayab-subba-phase1.pdf)

#### Examination Phases:
1. **Phase I (प्रथम चरण)**: Paper I *General Knowledge & General Aptitude Test* = 100 Marks (50 MCQs × 2M: GK 60M + Aptitude 40M), 45 Minutes.
2. **Phase II (द्वितीय चरण)**:
   - Paper II: *Contemporary Studies & Public Management (समसामयिक अध्ययन तथा सार्वजनिक व्यवस्थापन)* = 100 Marks, 3 Hours.
   - Paper III: *Service-Specific Paper (सेवा समूह सम्बन्धी कार्यज्ञान)* = 100 Marks, 3 Hours.
3. **Phase III (तृतीय चरण)**: Computer Skill Test (10 Marks, 15 Mins) + Interview (40 Marks).

View all topics and checklists on the [Nayab Subba Syllabus Explorer](/syllabus/nayab-subba).`;
  }

  if (
    /kharidar|खरिदार/i.test(query) &&
    /syllabus|paper|marks|exam|phase|पाठ्यक्रम/i.test(query)
  ) {
    const khCadre = PSC_CADRE_SYLLABI.find((c) => c.id === 'kharidar')!;
    return `### Kharidar (खरिदार) — Official Syllabus Blueprint
- **Rank**: ${khCadre.rankClassification} | **Eligibility**: ${khCadre.eligibilitySummary}
- **Screening Rule**: Pass Gate is **${khCadre.screeningPassPercent}% (40 Marks)** with **-${khCadre.negativeMarkingPercent}%** negative marking. **50% of Phase I marks** carry forward into the final merit calculation.
- **Official Syllabus PDF**: [Open Kharidar PDF in 3D Flipbook](/read?sample=%2Fmaterials%2Fofficial-psc%2Fpsc-official-kharidar-phase1.pdf)

#### Examination Phases:
1. **Phase I (प्रथम चरण)**: Paper I *General Knowledge & Basic Aptitude Test* = 100 Marks (50 MCQs × 2M: GK 60M + Basic Aptitude 40M), 45 Minutes.
2. **Phase II (द्वितीय चरण)**:
   - Paper II: *Office Management (कार्यालय व्यवस्थापन)* = 100 Marks, 2.5 Hours.
   - Paper III: *Job-Oriented Knowledge (कार्यज्ञान सम्बन्धी विषय)* = 100 Marks, 2.5 Hours.
3. **Phase III (तृतीय चरण)**: Computer Skill Test (10 Marks, 15 Mins) + Interview (30 Marks).

View all topics and checklists on the [Kharidar Syllabus Explorer](/syllabus/kharidar).`;
  }

  // 4. Constitution of Nepal (संविधान) specific inquiry
  if (/constitution|संविधान|2072|मौलिक हक|directive principles/i.test(query)) {
    const relatedWritten = WRITTEN_QUESTIONS.find((w) =>
      w.en.title.toLowerCase().includes('constitution') || w.subject.toLowerCase().includes('constitutional')
    );

    let extraWrittenSnippet = '';
    if (relatedWritten) {
      extraWrittenSnippet = `\n\n#### Model Written Question on Constitutional Law:
- **[${relatedWritten.id}] ${relatedWritten.en.title}** (${relatedWritten.marks}M):
  > *${relatedWritten.en.question}*
  [Read Full Bilingual Model Answer & Rubric](/written/${relatedWritten.id})`;
    }

    return `### Constitution of Nepal 2072 (नेपालको संविधान)

- **Promulgation Date**: 2072 Ashwin 3 (September 20, 2015)
- **Structure**: 35 Parts, 308 Articles, 9 Schedules
- **Fundamental Rights**: Part 3, Articles 16 to 46 (31 Fundamental Rights)
- **Directive Principles & State Policies**: Part 4, Articles 47 to 55
- **Federal Structure**: Part 5 (Federation, 7 Provinces, 753 Local Levels)
- **Constitutional Organs**: Part 21 to 27 (Commission for Investigation of Abuse of Authority, Auditor General, Public Service Commission [Part 23, Arts 242-243], etc.)

Read the complete official document in the [3D Constitution Flipbook](/read?sample=%2Fmaterials%2Fconstitution-of-nepal-2072.pdf) or practice [Laws & Constitution Quiz Deck](/quiz/laws-and-constitution).${extraWrittenSnippet}`;
  }

  // 5. General Search across Written Questions
  let bestWritten: WrittenQuestion | null = null;
  let bestWrittenScore = 0;
  for (const wq of WRITTEN_QUESTIONS) {
    const text = `${wq.id} ${wq.paper} ${wq.subject} ${wq.postTarget} ${wq.en.title} ${wq.en.question} ${wq.ne.title} ${wq.ne.question}`.toLowerCase();
    let score = 0;
    for (const kw of keywords) {
      if (text.includes(kw)) score += kw.length >= 5 ? 3 : 1.5;
    }
    if (score > bestWrittenScore) {
      bestWrittenScore = score;
      bestWritten = wq;
    }
  }

  // 6. General Search across MCQ Quiz Questions
  let bestQuiz: QuizQuestion | null = null;
  let bestQuizScore = 0;
  for (const q of ALL_QUIZ_QUESTIONS) {
    const text = `${q.id} ${q.subject} ${q.topic} ${q.subtopic} ${q.question} ${q.questionNe ?? ''} ${q.explanation} ${q.explanationNe ?? ''}`.toLowerCase();
    let score = 0;
    for (const kw of keywords) {
      if (text.includes(kw)) score += kw.length >= 5 ? 3 : 1.5;
    }
    if (score > bestQuizScore) {
      bestQuizScore = score;
      bestQuiz = q;
    }
  }

  // If query is specifically asking for written question or essay
  if (
    /written|model answer|long question|subjective|लिखित|नमुना/i.test(query) &&
    bestWritten &&
    bestWrittenScore >= 3
  ) {
    return formatWrittenQuestionDetail(bestWritten);
  }

  // If query specifically matches an MCQ
  if (
    /mcq|quiz|question|objective|vastugat|वस्तुगत/i.test(query) &&
    bestQuiz &&
    bestQuizScore >= 3
  ) {
    return formatQuizQuestionDetail(bestQuiz);
  }

  // 7. General search across Syllabus Topics
  interface FoundTopic {
    cadre: PscCadreSyllabus;
    paper: PscSyllabusPaper;
    topic: PscSyllabusTopic;
    score: number;
  }
  let bestTopic: FoundTopic | null = null;
  let bestTopicScore = 0;

  for (const cadre of PSC_CADRE_SYLLABI) {
    for (const phase of cadre.phases) {
      const allPapers = [
        ...phase.papers,
        ...(phase.serviceStreams?.flatMap((s) => s.papers) ?? []),
      ];
      for (const paper of allPapers) {
        for (const unit of paper.units) {
          for (const ch of unit.chapters) {
            for (const topic of ch.topics) {
              const text = `${cadre.shortTitle} ${paper.title} ${unit.title} ${ch.chapterName} ${topic.topic} ${topic.nepaliTopic ?? ''} ${topic.brief}`.toLowerCase();
              let score = 0;
              for (const kw of keywords) {
                if (text.includes(kw)) score += kw.length >= 5 ? 3 : 1.5;
              }
              if (score > bestTopicScore) {
                bestTopicScore = score;
                bestTopic = { cadre, paper, topic, score };
              }
            }
          }
        }
      }
    }
  }

  if (bestTopic && bestTopicScore >= 4) {
    const { cadre, paper, topic } = bestTopic;
    const subtopics = (topic.subtopics ?? [])
      .map((s) => `- **${s.code} ${s.subtopic}**${s.nepaliSubtopic ? ` (${s.nepaliSubtopic})` : ''}: ${s.brief}`)
      .join('\n');

    return `### Syllabus Topic: [${topic.code}] ${topic.topic} ${topic.nepaliTopic ? `(${topic.nepaliTopic})` : ''}
- **Cadre**: [${cadre.title}](/syllabus/${cadre.id}) | **Paper**: ${paper.code} (${paper.title})
- **Study Brief**: ${topic.brief}
${subtopics ? `\n#### Subtopics & Key Points:\n${subtopics}` : ''}

Mark this topic complete in the [${cadre.shortTitle} Syllabus Checklist](/syllabus/${cadre.id}).`;
  }

  // 8. If high scoring written question exists, show it with navigation
  if (bestWritten && bestWrittenScore >= 5) {
    return formatWrittenQuestionDetail(bestWritten);
  }

  // 9. If high scoring MCQ exists, show it
  if (bestQuiz && bestQuizScore >= 4) {
    return formatQuizQuestionDetail(bestQuiz);
  }

  // 10. Friendly Fallback / General Guide
  const isNepali = isDevanagari(query);

  if (isNepali) {
    return `### नमस्कार! म लोक सेवा तयारी सहायक (PSC Nepal Study Assistant) हुँ।

तपाईंले खोज्नुभएको विषयवस्तुबारे तलका मुख्य खण्डहरूमा अध्ययन गर्न सक्नुहुन्छ:

1. **आधिकारिक पाठ्यक्रम (Syllabus)**:
   - [शाखा अधिकृत (Section Officer) पाठ्यक्रम](/syllabus/section-officer)
   - [नायब सुब्बा (Nayab Subba) पाठ्यक्रम](/syllabus/nayab-subba)
   - [खरिदार (Kharidar) पाठ्यक्रम](/syllabus/kharidar)
2. **वस्तुगत प्रश्नोत्तर (MCQs)**:
   - -२०% माइनस मार्किङ र समय सीमासहित अभ्यास गर्न [वस्तुगत प्रश्न बैंक](/quiz) मा जानुहोस्।
3. **विषयगत नमुना उत्तर (Written Model Answers)**:
   - नेपाली र अङ्ग्रेजी दुवै भाषामा लेखिएका ५ र १० अङ्कका उत्तरहरूका लागि [लिखित प्रश्न उत्तर खण्ड](/written) मा जानुहोस्।
4. **परीक्षा हल सिमुलेटर (Mock Hall)**:
   - [OMR स्क्रिनिङ र लिखित परीक्षा सिमुलेसन](/simulate) मा जानुहोस्।
5. **ऐन, कानुन र पुस्तकहरू (PDFs)**:
   - नेपालको संविधान २०७२, निजामती सेवा ऐन २०४९ लगायतका सामग्रीहरू [३डी फ्लिपबुक रिडर](/materials) मा पढ्न सक्नुहुन्छ।

थप स्पष्टताको लागि कुनै निश्चित विषय, ऐन, पद वा प्रश्न नम्बर (जस्तै: \`PSC-WR-201\`) लेखेर सोध्नुहोस्!`;
  }

  return `### PSC Nepal Study Assistant Guide

I'm ready to help you navigate all study materials, syllabi, questions, and exam simulations available on PSC Nepal:

1. **Official Syllabi & Negative Marking**:
   - [Section Officer Syllabus](/syllabus/section-officer) (Pass gate: 45%, -20% negative marking)
   - [Nayab Subba Syllabus](/syllabus/nayab-subba) (Pass gate: 40%, 50% carried forward)
   - [Kharidar Syllabus](/syllabus/kharidar) (Pass gate: 40%, 50% carried forward)
2. **Objective MCQ Question Bank**:
   - Over 110+ verified MCQs with detailed statutory explanations in the [MCQ Quiz Arena](/quiz).
3. **Subjective Written Model Answers**:
   - Bilingual (English & नेपाली) structured answers for 5M and 10M questions in the [Written Question Studio](/written).
4. **Examination Hall Simulations**:
   - Launch an authentic OMR bubble-sheet sitting or timed written paper in the [Simulation Hall](/simulate).
5. **PDF Reading Materials & Flipbook**:
   - Constitution of Nepal 2072, Civil Service Act 2049, Good Governance Act 2064, and more in the [Study Materials Catalog](/materials).

Try asking a specific question, such as:
- *"What are the negative marking rules?"*
- *"Show me model answer for PSC-WR-201"*
- *"Practice 3 PSC MCQs"*
- *"Compare Section Officer and Nayab Subba syllabus"*
- *"How do I contact support or report an error?"*`;
}
