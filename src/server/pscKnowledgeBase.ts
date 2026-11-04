import {
  PSC_CADRE_SYLLABI,
  type PscCadreSyllabus,
  type PscSyllabusPaper,
  type PscSyllabusTopic,
  type PscSyllabusUnit,
} from '../data/pscSyllabusData.ts';
import {
  ALL_QUIZ_QUESTIONS,
  QUIZ_DECKS,
  type QuizQuestion,
} from '../data/quizData.ts';
import { READING_MATERIAL_CATEGORIES } from '../data/readingMaterials.ts';
import { OMR_PRESETS, WRITTEN_PRESETS } from '../data/simulationPresets.ts';
import {
  WRITTEN_QUESTIONS,
  type WrittenQuestion,
} from '../data/writtenQuestionsData.ts';

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

export interface ChatTurnMessage {
  role: 'user' | 'assistant';
  content: string;
}

function formatDurationMinutes(seconds: number): string {
  const mins = Math.round((seconds / 60) * 10) / 10;
  return `${mins} min`;
}

function formatPaperSummary(paper: PscSyllabusPaper): string {
  const lines: string[] = [];
  const passText =
    paper.passMarks !== null ? `Pass: ${paper.passMarks}` : 'Pass: Combined/Viva';
  lines.push(
    `    - [${paper.code}] ${paper.title} (${paper.nepaliTitle}) | Format: ${paper.examFormat} | Full Marks: ${paper.fullMarks} (${passText}) | Duration: ${paper.durationLabel} | Final Merit: ${paper.countsTowardFinalMerit ? 'YES' : 'NO (Screening Only)'}`
  );
  lines.push(
    `      Breakdown: ${paper.questionBreakdown} | Rule: ${paper.scoringRule}`
  );

  for (const unit of paper.units) {
    lines.push(
      `      * Unit ${unit.unitCode}: ${unit.title} (${unit.nepaliTitle}) — ${unit.marksWeight}M`
    );
    for (const ch of unit.chapters) {
      const alloc = ch.marksAllocation ? ` [${ch.marksAllocation}]` : '';
      const topicSummaries = ch.topics
        .map((t) => {
          const subs =
            t.subtopics && t.subtopics.length > 0
              ? ` (${t.subtopics.map((s) => s.subtopic).join(', ')})`
              : '';
          return `${t.code} ${t.topic}${t.marksHint ? ` [${t.marksHint}]` : ''}${subs}`;
        })
        .join(' ; ');
      lines.push(
        `        - Ch ${ch.code}: ${ch.chapterName}${alloc} -> ${topicSummaries}`
      );
    }
  }
  return lines.join('\n');
}

function formatCadreBlueprint(cadre: PscCadreSyllabus): string {
  const lines: string[] = [];
  lines.push(
    `### CADRE: ${cadre.title} (${cadre.nepaliTitle}) [ID: ${cadre.id}] — Route: /syllabus/${cadre.id}`
  );
  lines.push(`- Rank: ${cadre.rankClassification}`);
  lines.push(`- Service Scope: ${cadre.serviceScope}`);
  lines.push(`- Eligibility & Age: ${cadre.eligibilitySummary}`);
  lines.push(`- Effective / Approved Date: ${cadre.effectiveFromBs}`);
  lines.push(
    `- Screening Pass Gate: ${cadre.screeningPassPercent}% | MCQ Negative Marking: -${cadre.negativeMarkingPercent}% per wrong answer`
  );
  lines.push(`- Merit Calculation Formula: ${cadre.meritCalculationNote}`);
  lines.push(`- General Exam Rules: ${cadre.generalExamRules.join(' | ')}`);
  lines.push(`- Official Authentic PSC PDFs:`);
  for (const pdf of cadre.officialPscPdfs) {
    const readerUrl = `/read?sample=${encodeURIComponent(pdf.localPdfPath)}`;
    lines.push(
      `  • ${pdf.title} (${pdf.nepaliTitle}) — ${pdf.pages}p, ${pdf.approvedDateBs} | Read in Flipbook: ${readerUrl} | Direct PDF: ${pdf.localPdfPath} | Official psc.gov.np URL: ${pdf.officialPscUrl}`
    );
  }

  for (const phase of cadre.phases) {
    lines.push(
      `  #### ${phase.title} (${phase.nepaliTitle}) — ${phase.summary}`
    );
    const commonPapers = phase.papers.filter((p) => !p.serviceStreamId);
    for (const paper of commonPapers) {
      lines.push(formatPaperSummary(paper));
    }
    if (phase.serviceStreams && phase.serviceStreams.length > 0) {
      for (const stream of phase.serviceStreams) {
        lines.push(
          `    [Service Stream: ${stream.serviceName} (${stream.nepaliServiceName})${stream.meritNote ? ` — ${stream.meritNote}` : ''}]`
        );
        for (const sPaper of stream.papers) {
          lines.push(formatPaperSummary(sPaper));
        }
      }
    }
  }

  return lines.join('\n');
}

function buildMasterStaticContext(): string {
  const sections: string[] = [];

  sections.push(`# PSC NEPAL — COMPLETE OFFICIAL PLATFORM KNOWLEDGE BASE

## 1. IDENTITY, LANGUAGE & RESPONSE GUIDELINES
- You are the **PSC Nepal Study Assistant** (लोक सेवा तयारी सहायक), the built-in academic and platform guide for **PSC Nepal**.
- **Scope**: You have complete knowledge of the PSC Nepal website: official Lok Sewa Aayog (लोक सेवा आयोग) syllabi (Section Officer, Nayab Subba, Kharidar), objective MCQ questions and verified answers, bilingual subjective written questions & model answers (English & नेपाली), OMR & Written Examination Hall simulations, Merit & Negative-Marking Lab, curated PDF reading materials, 3D PDF flipbook reader features, candidate progress tracking, privacy policy, and editorial contact details.
- **Language**: Reply in clear **English**, **नेपाली (Devanagari)**, or **Bilingual (English + नेपाली)** depending on the user's language or request. Preserve statutory accuracy (exact Constitutional Articles, Act years BS, negative marking math, pass gates, and question codes).
- **Navigation Links**: Whenever helpful, include clickable Markdown links to internal PSC Nepal routes starting with \`/\` (for example: \`[Section Officer Syllabus](/syllabus/section-officer)\`, \`[Launch Section Officer OMR Mock](/simulate?mode=omr-hall&preset=so-phase1-omr&launch=1)\`, \`[Practice Constitution Quiz](/quiz/laws-and-constitution)\`, \`[View Written Answer PSC-WR-201](/written/PSC-WR-201)\`, \`[Contact Editorial Desk](/contact)\`). The chat interface turns these directly into instant in-app navigation links.
- **Tone & Structure**: Authoritative, concise, supportive civic-academic tutor. Use clear headings, bullet points, bold statutory citations, and exact figures. Never fabricate PSC rules or non-existent routes.`);

  sections.push(`## 2. WEBSITE DIRECTORY, ROUTES, READER & CONTACT DETAILS
- **Home** (\`/\`): Overview of PSC Nepal, active target cadre switcher (Section Officer / Nayab Subba / Kharidar), quick access to Syllabus, Quiz, Written Q&A, Exam Simulator, and Official Materials.
- **PSC Syllabus Explorer** (\`/syllabus\`, \`/syllabus/section-officer\`, \`/syllabus/nayab-subba\`, \`/syllabus/kharidar\`): Complete phase-by-phase, service-stream, paper, unit, chapter, topic, and subtopic breakdown with study briefs, mark allocations, topic completion checkboxes, and embedded/downloadable original \`psc.gov.np\` PDFs.
- **Study Materials & Statutory PDFs** (\`/materials\`, \`/materials/official-psc-syllabi\`, \`/materials/psc-syllabus\`, \`/materials/constitution-and-laws\`, \`/materials/nepal-parichaya\`, \`/materials/governance-and-planning\`): Curated official syllabi, Constitution of Nepal 2072, Civil Service Act 2049, LGOA 2074, Corruption Prevention Act 2059, Good Governance Act 2064, RTI Act 2064, Fiscal Procedures Act 2076, Nepal Parichaya, and 16th Periodic Plan digests.
- **3D PDF Flipbook & Study Reader** (\`/read\`, e.g. \`/read?sample=/materials/constitution-of-nepal-2072.pdf\`): Interactive two-page spread flipbook and single-page precision reader powered by PDF.js. Supports keyboard arrows (\`←\` / \`→\`), zoom (\`+\` / \`-\` / \`0\`), fullscreen (\`F\`), local drag-and-drop PDF opening (kept 100% locally in browser memory via \`blob:\` URLs, never uploaded), external HTTPS PDF URLs, and automatic page-progress saving.
- **Personal Study Library** (\`/library\`): Recently opened PDFs, reading completion %, saved page bookmarks, and reading session statistics.
- **Objective MCQ Quiz Arena** (\`/quiz\`, \`/quiz/:deckId\`): Opens in a responsive interactive modal dialog. Supports:
  1. **Exam Mode**: Strict 1 question = 1 minute (60s) reverse countdown timer, answers locked until submission, PSC \`-20%\` negative marking (\`-0.20\` per wrong 1-mark MCQ), auto-submit on timeout.
  2. **Study Mode**: Immediate option verification and statutory explanation after each question.
  3. **Custom Multi-Filter Practice**: Filter \`ALL_QUIZ_QUESTIONS\` (${ALL_QUIZ_QUESTIONS.length} verified MCQs) by Subject, Topic, Subtopic, Difficulty (Easy/Medium/Hard), and custom question count.
- **Written Exam Answer Bank** (\`/written\`, \`/written/:questionId\`): ${WRITTEN_QUESTIONS.length} comprehensive subjective PSC questions (5-Mark Short Analytical, 10-Mark Long Analytical, and 10-Mark Case Studies) across Papers II, III, and IV. Features side-by-side **Bilingual (English + नेपाली)** model answers (Introduction, numbered body sections, Conclusion), timed answer-writing scratchpad with live word count, mastery status (\`unseen\` / \`practicing\` / \`mastered\`), and Examiner Evaluation Rubric checklists.
- **Examination Hall Simulator** (\`/simulate\`): Opens in an all-device responsive modal dialog with three specialized modes:
  1. **Phase I OMR Screening Hall** (\`/simulate?mode=omr-hall\`): Authentic OMR bubble sheet, shuffled Booklet Keys \`A\`, \`B\`, \`C\`, \`D\`, reverse countdown clock, \`-20%\` negative marking, and \`45%\` screening pass gate.
  2. **Phase II Timed Written Paper Hall** (\`/simulate?mode=written-hall\`): Timed subjective paper sittings at \`1.8 minutes/mark\`, bilingual prompt toggle, and post-submission rubric self-scoring (\`Full Credit 100%\`, \`Partial 55%\`, \`Missed 0%\`).
  3. **Aggregate Merit & Negative-Marking Strategy Lab** (\`/simulate?mode=merit-lab\`): Simulates expected OMR net marks from Confident Answers, 50/50 Educated Guesses, and Blind 4-Option Guesses, plus calculates full Stage II + Stage III Aggregate Merit (360M Section Officer / 470M Foreign Service / 240M Nayab Subba & Kharidar).
- **Candidate Progress Ledger** (\`/progress\`): Tracks syllabus topic coverage %, MCQ accuracy & net score history, written question mastery & timed writing minutes, simulation pass history, and reading stats (with local history reset controls).
- **Platform Features** (\`/features\`): Detailed breakdown of PSC Nepal's study tools.
- **Contact & Editorial Desk** (\`/contact\`):
  - **Direct Email**: \`alamayub85@gmail.com\`
  - **Categories**:
    1. \`Quiz / Written Q&A Errata\` — Report question/answer corrections citing Question ID (e.g., \`PSC-LANG-100\` or \`PSC-WR-201\`) and constitutional/statutory article.
    2. \`Reading Material / Syllabus Request\` — Request additional acts, regulations, or PSC syllabus PDFs.
    3. \`PDF Reader / Flipbook Support\` — Help with PDF rendering, flipbook controls, or CORS links.
    4. \`General Inquiry & Feedback\` — General suggestions for PSC Nepal.
  - **Workflow**: Generates a ticket code (\`PSC-YYYY-XXXX\`), saves locally in browser storage (up to 25 recent inquiries), and lets the user send directly via \`mailto:alamayub85@gmail.com\`.
- **Privacy & Terms** (\`/privacy\`, \`/terms\`): Local-first privacy architecture — study progress, quiz history, written drafts, and bookmarks stay in the user's browser \`localStorage\`; local PDF files stay in transient browser memory. Independent educational platform grounded in official \`psc.gov.np\` publications.`);

  // 3. Mock Tests, Hall Simulations & Quiz Decks
  const simLines: string[] = [
    '## 3. EXAMS, MOCK TESTS, HALL SIMULATIONS & QUIZ DECKS',
    '### A. Phase I OMR Screening Hall Presets (`/simulate?mode=omr-hall`)',
  ];
  for (const p of OMR_PRESETS) {
    const sampleIds = p
      .selectQuestions()
      .map((q) => q.id)
      .join(', ');
    simLines.push(
      `- **${p.title}** (${p.nepaliTitle}) [Preset ID: \`${p.id}\`] — Cadre: ${p.cadreLabel} | ${p.questionCount} MCQs × ${p.marksPerQuestion}M = ${p.questionCount * p.marksPerQuestion} Marks | Duration: ${formatDurationMinutes(p.allocatedSeconds)} | Wrong Penalty: -${p.negativeRate * p.marksPerQuestion}M (-20%) | Pass Gate: ${p.passPercent}% | Launch URL: \`/simulate?mode=omr-hall&preset=${p.id}&launch=1\`\n  Summary: ${p.blueprintSummary}\n  Question IDs in Sitting: ${sampleIds}`
    );
  }

  simLines.push(
    '\n### B. Phase II Timed Written Paper Hall Presets (`/simulate?mode=written-hall`)'
  );
  for (const w of WRITTEN_PRESETS) {
    simLines.push(
      `- **${w.title}** (${w.nepaliTitle}) [Preset ID: \`${w.id}\`] — ${w.paperCode} (${w.cadreId}) | Duration: ${formatDurationMinutes(w.allocatedSeconds)} | Questions: ${w.questionIds.join(', ')} | Launch URL: \`/simulate?mode=written-hall&preset=${w.id}&launch=1\`\n  Description: ${w.description}`
    );
  }

  simLines.push('\n### C. Curated Objective Quiz Decks (`/quiz/:deckId`)');
  for (const d of QUIZ_DECKS) {
    const totalMarks = d.questions.reduce((s, q) => s + q.marks, 0);
    simLines.push(
      `- **${d.title}** [Deck ID: \`${d.id}\`, Route: \`/quiz/${d.id}\`] — ${d.subtitle} | ${d.questions.length} Questions (${totalMarks} Marks) | Description: ${d.description}\n  Question IDs: ${d.questions.map((q) => q.id).join(', ')}`
    );
  }
  sections.push(simLines.join('\n'));

  // 4. Reading Materials Catalog
  const matLines: string[] = [
    '## 4. CURATED READING MATERIALS & PDF CATALOG (`/materials`)',
  ];
  for (const cat of READING_MATERIAL_CATEGORIES) {
    matLines.push(
      `### Category: ${cat.name} (\`/materials/${cat.id}\`) — ${cat.subtitle}\n${cat.description}`
    );
    for (const item of cat.items) {
      const readLink = `/read?sample=${encodeURIComponent(item.path)}`;
      matLines.push(
        `- **${item.title}** [ID: \`${item.id}\`] | Authority: ${item.authority} | Edition: ${item.codeOrEdition} | ${item.pages} pages | Read in Flipbook: \`${readLink}\`${item.externalSourceUrl ? ` | Official Source: ${item.externalSourceUrl}` : ''}\n  Summary: ${item.description}`
      );
    }
  }
  sections.push(matLines.join('\n'));

  // 5. Complete Official PSC Syllabi for All 3 Cadres
  const syllabusLines: string[] = [
    '## 5. COMPLETE OFFICIAL LOK SEWA AAYOG SYLLABI (ALL 3 CADRES)',
  ];
  for (const cadre of PSC_CADRE_SYLLABI) {
    syllabusLines.push(formatCadreBlueprint(cadre));
  }
  sections.push(syllabusLines.join('\n\n'));

  // 6. Complete Objective MCQ Question & Verified Answer Index
  const mcqLines: string[] = [
    `## 6. COMPLETE OBJECTIVE MCQ QUESTION & VERIFIED ANSWER INDEX (${ALL_QUIZ_QUESTIONS.length} QUESTIONS)`,
    'Every MCQ on PSC Nepal with its Question ID, Subject/Subtopic, Question text, and exact Verified Answer:',
  ];
  for (const q of ALL_QUIZ_QUESTIONS) {
    const correctTexts = q.options
      .filter((o) => q.correct_options.includes(o.key))
      .map((o) => `(${o.key}) ${o.text}`)
      .join(' + ');
    mcqLines.push(
      `- [${q.id}] (${q.subject} · ${q.subtopic} · ${q.difficulty}${q.is_multi_select ? ' · Multi-Select' : ''}) Q: ${q.question} => Answer: ${correctTexts}`
    );
  }
  sections.push(mcqLines.join('\n'));

  // 7. Complete Subjective Written Question & Bilingual Model Answer Index
  const wrLines: string[] = [
    `## 7. SUBJECTIVE WRITTEN EXAM QUESTIONS & BILINGUAL MODEL ANSWER INDEX (${WRITTEN_QUESTIONS.length} QUESTIONS)`,
    'All subjective written questions on `/written/:questionId`:',
  ];
  for (const wq of WRITTEN_QUESTIONS) {
    const enHeadings = wq.en.sections.map((s) => s.heading).join(' ; ');
    wrLines.push(
      `- [${wq.id}] (\`/written/${wq.id}\`) ${wq.paper} | ${wq.subject} | ${wq.postTarget} | ${wq.marks}M (${wq.en.marksAllocation}, ~${wq.recommendedMinutes}m)\n  EN: ${wq.en.question}\n  NE: ${wq.ne.question}\n  Sections: ${enHeadings}`
    );
  }
  sections.push(wrLines.join('\n'));

  return sections.join('\n\n');
}

const CACHED_MASTER_STATIC_CONTEXT = buildMasterStaticContext();

function extractKeywords(text: string): string[] {
  const normalized = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 3);
  return Array.from(new Set(normalized));
}

function scoreWrittenQuestion(wq: WrittenQuestion, rawText: string, keywords: string[]): number {
  let score = 0;
  const upper = rawText.toUpperCase();
  if (upper.includes(wq.id.toUpperCase())) {
    score += 100;
  }
  const searchable = `${wq.id} ${wq.paper} ${wq.subject} ${wq.postTarget} ${wq.en.title} ${wq.en.question} ${wq.ne.title} ${wq.ne.question}`.toLowerCase();
  for (const kw of keywords) {
    if (searchable.includes(kw)) {
      score += kw.length >= 6 ? 4 : 2;
    }
  }
  return score;
}

function scoreQuizQuestion(q: QuizQuestion, rawText: string, keywords: string[]): number {
  let score = 0;
  const upper = rawText.toUpperCase();
  if (upper.includes(q.id.toUpperCase())) {
    score += 100;
  }
  const searchable = `${q.id} ${q.subject} ${q.topic} ${q.subtopic} ${q.question} ${q.explanation}`.toLowerCase();
  for (const kw of keywords) {
    if (searchable.includes(kw)) {
      score += kw.length >= 6 ? 3 : 1.5;
    }
  }
  return score;
}

interface DetailedTopicHit {
  cadreTitle: string;
  cadreId: string;
  paperCode: string;
  unit: PscSyllabusUnit;
  topic: PscSyllabusTopic;
  score: number;
}

function findDetailedSyllabusTopics(rawText: string, keywords: string[]): DetailedTopicHit[] {
  if (keywords.length === 0) return [];
  const hits: DetailedTopicHit[] = [];

  for (const cadre of PSC_CADRE_SYLLABI) {
    for (const phase of cadre.phases) {
      const allPapers: PscSyllabusPaper[] = [
        ...phase.papers,
        ...(phase.serviceStreams?.flatMap((s) => s.papers) ?? []),
      ];
      for (const paper of allPapers) {
        for (const unit of paper.units) {
          for (const ch of unit.chapters) {
            for (const topic of ch.topics) {
              const searchable = `${cadre.shortTitle} ${paper.code} ${unit.title} ${ch.chapterName} ${topic.code} ${topic.topic} ${topic.nepaliTopic ?? ''} ${topic.brief} ${(
                topic.subtopics ?? []
              )
                .map((s) => `${s.subtopic} ${s.nepaliSubtopic ?? ''} ${s.brief}`)
                .join(' ')}`.toLowerCase();
              let score = 0;
              for (const kw of keywords) {
                if (searchable.includes(kw)) {
                  score += kw.length >= 6 ? 3 : 1;
                }
              }
              if (rawText.toUpperCase().includes(topic.code.toUpperCase())) {
                score += 40;
              }
              if (score >= 4) {
                hits.push({
                  cadreTitle: cadre.shortTitle,
                  cadreId: cadre.id,
                  paperCode: paper.code,
                  unit,
                  topic,
                  score,
                });
              }
            }
          }
        }
      }
    }
  }

  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, 8);
}

function formatFullWrittenQuestion(wq: WrittenQuestion): string {
  const enBody = wq.en.sections
    .map(
      (sec) =>
        `  ${sec.heading}\n${sec.points.map((pt) => `    - ${pt}`).join('\n')}`
    )
    .join('\n');
  const neBody = wq.ne.sections
    .map(
      (sec) =>
        `  ${sec.heading}\n${sec.points.map((pt) => `    - ${pt}`).join('\n')}`
    )
    .join('\n');
  const rubricLines = wq.rubric
    .map((r, i) => `  ${i + 1}. EN: ${r.en} | NE: ${r.ne}`)
    .join('\n');

  return `### FULL BILINGUAL WRITTEN MODEL ANSWER [${wq.id}] (/written/${wq.id})
- Paper: ${wq.paper} | Subject: ${wq.subject} | Marks: ${wq.marks} (${wq.en.marksAllocation}) | Recommended Time: ${wq.recommendedMinutes} min | Source: ${wq.sourceTitle} (${wq.sourcePath})
- **ENGLISH MODEL ANSWER (${wq.en.title})**:
  Question: ${wq.en.question}
  Introduction: ${wq.en.introduction}
${enBody}
  Conclusion: ${wq.en.conclusion}
- **नेपाली नमुना उत्तर (${wq.ne.title})**:
  प्रश्न: ${wq.ne.question}
  पृष्ठभूमि / परिचय: ${wq.ne.introduction}
${neBody}
  निष्कर्ष: ${wq.ne.conclusion}
- **Examiner Self-Evaluation Rubric**:
${rubricLines}`;
}

export function buildSystemInstructionForTurn(
  messages: ChatTurnMessage[],
  clientContext?: ClientStudyContext
): string {
  const recentText = messages
    .slice(-4)
    .map((m) => m.content)
    .join(' ');
  const keywords = extractKeywords(recentText);

  const dynamicBlocks: string[] = [];

  if (clientContext) {
    dynamicBlocks.push(
      `## 8. LIVE CANDIDATE SESSION CONTEXT (CURRENT USER IN BROWSER)
- Current Page Route: \`${clientContext.currentPath || '/'}\`
- Active Target Cadre: \`${clientContext.targetCadreId || 'section-officer'}\`
- Completed Syllabus Topics: ${clientContext.completedTopicsCount ?? 0} topics (${clientContext.completedUnitsCount ?? 0} units marked complete)
- Objective Quiz Attempts Logged: ${clientContext.quizAttemptsCount ?? 0}${clientContext.bestQuizAccuracy != null ? ` (Best Accuracy: ${clientContext.bestQuizAccuracy}%)` : ''}
- Written Questions Mastered: ${clientContext.writtenMasteredCount ?? 0} mastered, ${clientContext.writtenPracticingCount ?? 0} in practice
- Exam Hall Simulations Completed: ${clientContext.simulationRunsCount ?? 0}
- Personal Library Recent PDFs: ${clientContext.recentBooksCount ?? 0}`
    );
  }

  const wantsWritten =
    /written|essay|long question|model answer|rubric|लिखित|नमुना उत्तर|psc-wr/i.test(
      recentText
    );
  const scoredWritten = WRITTEN_QUESTIONS.map((wq) => ({
    wq,
    score: scoreWrittenQuestion(wq, recentText, keywords),
  }))
    .filter((item) => item.score > 0 || wantsWritten)
    .sort((a, b) => b.score - a.score)
    .slice(0, wantsWritten ? 4 : 2);

  if (scoredWritten.length > 0) {
    dynamicBlocks.push(
      `## 9. VERBATIM BILINGUAL WRITTEN MODEL ANSWERS FOR CURRENT QUERY\n${scoredWritten
        .map((item) => formatFullWrittenQuestion(item.wq))
        .join('\n\n')}`
    );
  }

  const topicHits = findDetailedSyllabusTopics(recentText, keywords);
  if (topicHits.length > 0) {
    const subLines = topicHits.map((hit) => {
      const subs = (hit.topic.subtopics ?? [])
        .map(
          (s) =>
            `    • [${s.code}] ${s.subtopic}${s.nepaliSubtopic ? ` (${s.nepaliSubtopic})` : ''}: ${s.brief}`
        )
        .join('\n');
      return `- **${hit.cadreTitle} (${hit.paperCode}) — ${hit.topic.code} ${hit.topic.topic}${hit.topic.nepaliTopic ? ` (${hit.topic.nepaliTopic})` : ''}** [Route: \`/syllabus/${hit.cadreId}\`] | Key References: ${hit.unit.keyReferences}\n  Detailed Brief: ${hit.topic.brief}${subs ? `\n${subs}` : ''}`;
    });
    dynamicBlocks.push(
      `## 10. DETAILED SYLLABUS TOPIC & SUBTOPIC BRIEFS FOR CURRENT QUERY\n${subLines.join('\n')}`
    );
  }

  const wantsQuiz = /quiz|mcq|multiple choice|options|question|प्रश्न|वस्तुगत|psc-/i.test(
    recentText
  );
  const topMcqs = ALL_QUIZ_QUESTIONS.map((q) => ({
    q,
    score: scoreQuizQuestion(q, recentText, keywords),
  }))
    .filter((item) => item.score >= 3 || wantsQuiz)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  if (topMcqs.length > 0) {
    const mcqDetail = topMcqs
      .map(({ q }) => {
        const allOpts = q.options
          .map((o) => `(${o.key}) ${o.text}`)
          .join(' | ');
        return `- [${q.id}] (${q.subject} > ${q.topic} > ${q.subtopic} | ${q.difficulty} | ${q.marks}M${q.is_multi_select ? ' | Multi-Select' : ''})\n  Question: ${q.question}\n  All 4 Options: ${allOpts}\n  Correct Key(s): ${q.correct_options.join(', ')}\n  Official Explanation: ${q.explanation}\n  Source: ${q.sourceTitle ?? 'Official PSC Curriculum'} (${q.sourcePath ?? '/materials'})`;
      })
      .join('\n');
    dynamicBlocks.push(
      `## 11. FULL 4-OPTION MCQ DETAILS & EXPLANATIONS FOR CURRENT QUERY\n${mcqDetail}`
    );
  }

  if (dynamicBlocks.length === 0) {
    return CACHED_MASTER_STATIC_CONTEXT;
  }

  return `${CACHED_MASTER_STATIC_CONTEXT}\n\n${dynamicBlocks.join('\n\n')}`;
}
