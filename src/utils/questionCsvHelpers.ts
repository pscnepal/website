import {
  isBilingualQuizQuestion,
  isLanguageOnlySubject,
  QUIZ_OPTION_KEYS,
} from '../data/quizData';
import { WRITTEN_PAPERS } from '../data/writtenQuestionsData';
import type {
  BilingualRubricPoint,
  BilingualSection,
  CsvImportParseResult,
  CsvImportRowError,
  LocalizedAnswerContent,
  QuizDifficulty,
  QuizOption,
  QuizOptionKey,
  QuizQuestion,
  WrittenPaperCode,
  WrittenQuestion,
  WrittenQuestionMarks,
  WrittenQuestionType,
} from '../types';

// ============================================================================
// RFC 4180 CSV SERIALIZER & PARSER (WITH UTF-8 BOM FOR DEVANAGARI EXCEL SUPPORT)
// ============================================================================

const UTF8_BOM = '\uFEFF';
const FIRESTORE_ID_REGEX = /^[a-zA-Z0-9_-]{1,128}$/;

export const QUIZ_CSV_HEADERS = [
  'id',
  'level',
  'service',
  'group',
  'post',
  'paper',
  'subject',
  'topicId',
  'topic',
  'subtopicId',
  'subtopic',
  'difficulty',
  'marks',
  'is_multi_select',
  'correct_options',
  'question',
  'questionNe',
  'optionA',
  'optionANe',
  'optionB',
  'optionBNe',
  'optionC',
  'optionCNe',
  'optionD',
  'optionDNe',
  'explanation',
  'explanationNe',
  'sourceTitle',
  'sourcePath',
] as const;

export const WRITTEN_CSV_HEADERS = [
  'id',
  'paper',
  'subject',
  'postTarget',
  'marks',
  'recommendedMinutes',
  'questionType',
  'sourceTitle',
  'sourcePath',
  'enTitle',
  'enQuestion',
  'enMarksAllocation',
  'enIntroduction',
  'enSectionsJson',
  'enConclusion',
  'neTitle',
  'neQuestion',
  'neMarksAllocation',
  'neIntroduction',
  'neSectionsJson',
  'neConclusion',
  'rubricJson',
] as const;

export function escapeCsvCell(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

export function buildCsvDocument(
  headers: readonly string[],
  rows: unknown[][]
): string {
  const headerLine = headers.map((h) => escapeCsvCell(h)).join(',');
  const bodyLines = rows.map((row) =>
    row.map((cell) => escapeCsvCell(cell)).join(',')
  );
  return [headerLine, ...bodyLines].join('\r\n');
}

export function triggerCsvDownload(csvBody: string, filename: string): void {
  const blob = new Blob([UTF8_BOM + csvBody], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function downloadCsvErrorsReport(
  errors: CsvImportRowError[],
  filename = 'psc-csv-import-errors.csv'
): void {
  const rows = errors.map((err) => [
    err.rowNumber,
    err.questionId ?? '',
    err.message,
  ]);
  const csv = buildCsvDocument(['rowNumber', 'questionId', 'error'], rows);
  triggerCsvDownload(csv, filename);
}

/**
 * RFC 4180 compliant CSV parser handling UTF-8 BOM, CRLF/LF/CR newlines,
 * quoted commas, quoted multiline cells, and escaped double quotes ("").
 */
export function parseCsvText(rawText: string): string[][] {
  const text = rawText.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        const next = text[i + 1];
        if (next === '"') {
          currentCell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        currentCell += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      currentRow.push(currentCell);
      currentCell = '';
    } else if (ch === '\r') {
      if (text[i + 1] === '\n') {
        i++;
      }
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = '';
    } else if (ch === '\n') {
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += ch;
    }
  }

  // Push trailing cell / row unless completely empty trailing newline
  if (inQuotes || currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows.filter((row) => row.some((cell) => cell.trim() !== ''));
}

function normalizeHeaderKey(header: string): string {
  return header
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function slugifyId(raw: string, fallback: string): string {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
  return cleaned || fallback;
}

function normalizeBoolean(raw: string, defaultValue: boolean): boolean | null {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return defaultValue;
  if (['true', '1', 'yes', 'y'].includes(trimmed)) return true;
  if (['false', '0', 'no', 'n'].includes(trimmed)) return false;
  return null;
}

// ============================================================================
// OBJECTIVE QUIZ CSV EXPORT & IMPORT
// ============================================================================

export function serializeQuizQuestionsToCsv(questions: QuizQuestion[]): string {
  const rows = questions.map((q) => {
    const showBilingual = isBilingualQuizQuestion(q);
    const optMap = new Map<QuizOptionKey, QuizOption>(
      q.options.map((o) => [o.key, o])
    );

    const optA = optMap.get('A');
    const optB = optMap.get('B');
    const optC = optMap.get('C');
    const optD = optMap.get('D');

    return [
      q.id,
      q.level,
      q.service,
      q.group,
      q.post,
      q.paper,
      q.subject,
      q.topicId,
      q.topic,
      q.subtopicId,
      q.subtopic,
      q.difficulty,
      q.marks,
      q.is_multi_select ? 'true' : 'false',
      q.correct_options.join('|'),
      q.question,
      showBilingual ? (q.questionNe ?? '') : '',
      optA?.text ?? '',
      showBilingual ? (optA?.textNe ?? '') : '',
      optB?.text ?? '',
      showBilingual ? (optB?.textNe ?? '') : '',
      optC?.text ?? '',
      showBilingual ? (optC?.textNe ?? '') : '',
      optD?.text ?? '',
      showBilingual ? (optD?.textNe ?? '') : '',
      q.explanation,
      showBilingual ? (q.explanationNe ?? '') : '',
      q.sourceTitle ?? '',
      q.sourcePath ?? '',
    ];
  });

  return buildCsvDocument(QUIZ_CSV_HEADERS, rows);
}

export function downloadQuizQuestionsCsv(
  questions: QuizQuestion[],
  filename = 'psc-objective-mcq-question-bank.csv'
): void {
  const csv = serializeQuizQuestionsToCsv(questions);
  triggerCsvDownload(csv, filename);
}

export function downloadQuizCsvTemplate(): void {
  const sampleRow: QuizQuestion = {
    id: 'PSC-MCQ-SAMPLE-001',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge',
    subject: 'Constitution & Governance',
    topicId: 'constitution-fundamentals',
    topic: 'Constitution of Nepal (2072)',
    subtopicId: 'fundamental-rights',
    subtopic: 'Fundamental Rights & Duties',
    difficulty: 'Medium',
    marks: 1,
    is_multi_select: false,
    correct_options: ['B'],
    question:
      'Under which Part of the Constitution of Nepal (2072) are Fundamental Rights and Duties guaranteed?',
    questionNe:
      'नेपालको संविधान (२०७२) को कुन भागमा मौलिक हक र कर्तव्यको व्यवस्था गरिएको छ ?',
    options: [
      { key: 'A', text: 'Part 2 (Citizenship)', textNe: 'भाग २ (नागरिकता)' },
      {
        key: 'B',
        text: 'Part 3 (Articles 16–48)',
        textNe: 'भाग ३ (धारा १६–४८)',
      },
      {
        key: 'C',
        text: 'Part 4 (Directive Principles)',
        textNe: 'भाग ४ (निर्देशक सिद्धान्त)',
      },
      {
        key: 'D',
        text: 'Part 5 (Structure of State)',
        textNe: 'भाग ५ (राज्यको संरचना)',
      },
    ],
    explanation:
      'Part 3 (Articles 16 to 48) of the Constitution of Nepal (2072) enshrines 31 Fundamental Rights (Articles 16–46), remedies (Article 47), and Citizens Duties (Article 48).',
    explanationNe:
      'नेपालको संविधान (२०७२) को भाग ३ (धारा १६ देखि ४८) मा ३१ मौलिक हक र नागरिकका कर्तव्य (धारा ४८) उल्लेख छन् ।',
    sourceTitle: 'Constitution of Nepal (2072) — Part 3',
    sourcePath: '/materials/constitution-of-nepal-2072.pdf',
  };

  triggerCsvDownload(
    serializeQuizQuestionsToCsv([sampleRow]),
    'psc-mcq-import-template.csv'
  );
}

const QUIZ_DIFFICULTY_MAP = new Map<string, QuizDifficulty>([
  ['easy', 'Easy'],
  ['medium', 'Medium'],
  ['hard', 'Hard'],
]);

export function parseQuizQuestionsCsv(
  csvText: string,
  existingIds: Set<string> = new Set()
): CsvImportParseResult<QuizQuestion> {
  const parsedRows = parseCsvText(csvText);
  if (parsedRows.length < 2) {
    return {
      validItems: [],
      errors: [
        {
          rowNumber: 1,
          message:
            'CSV must include a header row and at least one question data row.',
        },
      ],
      totalRows: 0,
      newCount: 0,
      updateCount: 0,
    };
  }

  const rawHeaders = parsedRows[0];
  const headerIndex = new Map<string, number>();
  rawHeaders.forEach((h, idx) => {
    const norm = normalizeHeaderKey(h);
    if (norm && !headerIndex.has(norm)) {
      headerIndex.set(norm, idx);
    }
  });

  // Detect wrong CSV schema (Written uploaded into MCQ bank)
  if (
    headerIndex.has('entitle') &&
    headerIndex.has('rubricjson') &&
    !headerIndex.has('optiona')
  ) {
    return {
      validItems: [],
      errors: [
        {
          rowNumber: 1,
          message:
            'This file appears to be a Written Question Bank CSV (enTitle, rubricJson). Please upload an Objective MCQ CSV instead.',
        },
      ],
      totalRows: parsedRows.length - 1,
      newCount: 0,
      updateCount: 0,
    };
  }

  const requiredCols = ['question', 'optiona', 'optionb', 'correctoptions'];
  const missingCols = requiredCols.filter((c) => !headerIndex.has(c));
  if (missingCols.length > 0) {
    return {
      validItems: [],
      errors: [
        {
          rowNumber: 1,
          message: `Missing required CSV columns: ${missingCols
            .map((c) =>
              c === 'optiona'
                ? 'optionA'
                : c === 'optionb'
                  ? 'optionB'
                  : c === 'correctoptions'
                    ? 'correct_options'
                    : c
            )
            .join(', ')}. Download the CSV template to see the exact schema.`,
        },
      ],
      totalRows: parsedRows.length - 1,
      newCount: 0,
      updateCount: 0,
    };
  }

  const getCell = (row: string[], ...aliases: string[]): string => {
    for (const alias of aliases) {
      const idx = headerIndex.get(normalizeHeaderKey(alias));
      if (idx !== undefined && idx < row.length) {
        return row[idx].trim();
      }
    }
    return '';
  };

  const validItems: QuizQuestion[] = [];
  const errors: CsvImportRowError[] = [];
  const seenIdsInFile = new Map<string, number>();
  let newCount = 0;
  let updateCount = 0;

  const batchTimestamp = Date.now().toString().slice(-6);
  const generateUniqueQuizId = (rowIndex: number): string => {
    let suffix = 0;
    let candidate = `PSC-MCQ-CSV-${batchTimestamp}-${String(rowIndex).padStart(3, '0')}`;
    while (existingIds.has(candidate) || seenIdsInFile.has(candidate)) {
      suffix++;
      candidate = `PSC-MCQ-CSV-${batchTimestamp}-${String(rowIndex).padStart(3, '0')}-${suffix}`;
    }
    return candidate;
  };

  for (let i = 1; i < parsedRows.length; i++) {
    const row = parsedRows[i];
    const rowNumber = i + 1;

    const rawId = getCell(row, 'id', 'code');
    const id = rawId || generateUniqueQuizId(i);

    const pushErr = (message: string) => {
      errors.push({ rowNumber, questionId: id, message });
    };

    if (!FIRESTORE_ID_REGEX.test(id)) {
      pushErr(
        `Invalid ID "${id}". ID must be 1–128 chars using only letters, numbers, hyphens (-), or underscores (_).`
      );
      continue;
    }

    const prevRow = seenIdsInFile.get(id);
    if (prevRow !== undefined) {
      pushErr(`Duplicate ID "${id}" (already defined on row ${prevRow}).`);
      continue;
    }
    seenIdsInFile.set(id, rowNumber);

    const questionText = getCell(row, 'question', 'questionen', 'prompt');
    if (!questionText) {
      pushErr('Missing required "question" text.');
      continue;
    }
    if (questionText.length > 3000) {
      pushErr(
        `"question" exceeds Firestore max length (${questionText.length}/3000 chars).`
      );
      continue;
    }

    const questionNe = getCell(row, 'questionNe', 'question_ne');
    if (questionNe.length > 3000) {
      pushErr(
        `"questionNe" exceeds Firestore max length (${questionNe.length}/3000 chars).`
      );
      continue;
    }

    // Build options A-D
    const options: QuizOption[] = [];
    let optionLenError = false;
    for (const key of QUIZ_OPTION_KEYS) {
      const optText = getCell(row, `option${key}`, `option_${key}`);
      const optTextNe = getCell(row, `option${key}Ne`, `option_${key}_ne`);
      if (optText) {
        if (optText.length > 500 || optTextNe.length > 500) {
          pushErr(`Option ${key} text exceeds 500-character limit.`);
          optionLenError = true;
          break;
        }
        options.push({
          key,
          text: optText,
          ...(optTextNe ? { textNe: optTextNe } : {}),
        });
      }
    }
    if (optionLenError) continue;

    if (options.length < 2) {
      pushErr('At least 2 non-empty options (e.g. optionA and optionB) are required.');
      continue;
    }

    const availableKeys = new Set(options.map((o) => o.key));
    const rawCorrect = getCell(row, 'correct_options', 'correctoptions', 'correct');
    if (!rawCorrect) {
      pushErr('Missing required "correct_options" (e.g. "A" or "A|C").');
      continue;
    }

    const parsedCorrectTokens = rawCorrect
      .split(/[|,;\s]+/)
      .map((t) => t.trim().toUpperCase())
      .filter(Boolean);

    const invalidKey = parsedCorrectTokens.find(
      (k) => !QUIZ_OPTION_KEYS.includes(k as QuizOptionKey)
    );
    if (invalidKey || parsedCorrectTokens.length === 0) {
      pushErr(
        `Invalid "correct_options" value "${rawCorrect}". Use option letters A, B, C, or D (e.g. "A" or "A|C").`
      );
      continue;
    }

    const uniqueCorrect = Array.from(new Set(parsedCorrectTokens)) as QuizOptionKey[];
    const missingOptionKey = uniqueCorrect.find((k) => !availableKeys.has(k));
    if (missingOptionKey) {
      pushErr(
        `Correct option "${missingOptionKey}" has empty option${missingOptionKey} text.`
      );
      continue;
    }

    const rawMulti = getCell(row, 'is_multi_select', 'ismultiselect');
    const parsedMulti = normalizeBoolean(rawMulti, uniqueCorrect.length > 1);
    if (parsedMulti === null) {
      pushErr(
        `Invalid "is_multi_select" value "${rawMulti}". Expected true or false.`
      );
      continue;
    }
    const isMultiSelect = parsedMulti || uniqueCorrect.length > 1;

    const rawDifficulty = getCell(row, 'difficulty') || 'Medium';
    const difficulty = QUIZ_DIFFICULTY_MAP.get(rawDifficulty.toLowerCase());
    if (!difficulty) {
      pushErr(
        `Invalid "difficulty" "${rawDifficulty}". Must be Easy, Medium, or Hard.`
      );
      continue;
    }

    const rawMarks = getCell(row, 'marks');
    const marks = rawMarks ? Number(rawMarks) : 1;
    if (!Number.isFinite(marks) || marks < 0.5 || marks > 20) {
      pushErr(`Invalid "marks" "${rawMarks}". Must be a number between 0.5 and 20.`);
      continue;
    }

    const level = getCell(row, 'level') || 'Gazetted Third Class';
    const service = getCell(row, 'service') || 'Federal Civil Service preparation';
    const group = getCell(row, 'group') || 'General Administration';
    const post = getCell(row, 'post') || 'Section Officer / Nayab Subba target';
    const paper = getCell(row, 'paper') || 'Paper I: General Knowledge';
    const subject = getCell(row, 'subject') || 'General Knowledge';
    const topic = getCell(row, 'topic') || subject;
    const topicId =
      getCell(row, 'topicId', 'topic_id') || slugifyId(topic, 'general-topic');
    const subtopic = getCell(row, 'subtopic') || topic;
    const subtopicId =
      getCell(row, 'subtopicId', 'subtopic_id') ||
      slugifyId(subtopic, 'core-subtopic');

    if (
      level.length > 160 ||
      service.length > 160 ||
      group.length > 160 ||
      paper.length > 160 ||
      subject.length > 160
    ) {
      pushErr(
        'Metadata field (level, service, group, paper, or subject) exceeds 160-character Firestore limit.'
      );
      continue;
    }
    if (post.length > 200 || topic.length > 200 || subtopic.length > 200) {
      pushErr(
        'Metadata field (post, topic, or subtopic) exceeds 200-character Firestore limit.'
      );
      continue;
    }
    if (topicId.length > 128 || subtopicId.length > 128) {
      pushErr('topicId or subtopicId exceeds 128-character Firestore limit.');
      continue;
    }

    const explanation =
      getCell(row, 'explanation', 'rationale') ||
      'Official PSC syllabus rationale.';
    if (explanation.length > 5000) {
      pushErr(
        `"explanation" exceeds Firestore max length (${explanation.length}/5000 chars).`
      );
      continue;
    }

    const explanationNe = getCell(row, 'explanationNe', 'explanation_ne');
    if (explanationNe.length > 5000) {
      pushErr(
        `"explanationNe" exceeds Firestore max length (${explanationNe.length}/5000 chars).`
      );
      continue;
    }

    const sourceTitle = getCell(row, 'sourceTitle', 'source_title');
    if (sourceTitle.length > 300) {
      pushErr(
        `"sourceTitle" exceeds Firestore max length (${sourceTitle.length}/300 chars).`
      );
      continue;
    }

    const sourcePath = getCell(row, 'sourcePath', 'source_path');
    if (sourcePath.length > 512) {
      pushErr(
        `"sourcePath" exceeds Firestore max length (${sourcePath.length}/512 chars).`
      );
      continue;
    }

    const langMode = isLanguageOnlySubject(subject);
    const keepBilingual = langMode === null;

    const item: QuizQuestion = {
      id,
      level,
      service,
      group,
      post,
      paper,
      subject,
      topicId,
      topic,
      subtopicId,
      subtopic,
      question: questionText,
      ...(keepBilingual && questionNe ? { questionNe } : {}),
      options: options.map((opt) => ({
        key: opt.key,
        text: opt.text,
        ...(keepBilingual && opt.textNe ? { textNe: opt.textNe } : {}),
      })),
      correct_options: uniqueCorrect,
      is_multi_select: isMultiSelect,
      explanation,
      ...(keepBilingual && explanationNe ? { explanationNe } : {}),
      difficulty,
      marks,
      ...(sourceTitle ? { sourceTitle } : {}),
      ...(sourcePath ? { sourcePath } : {}),
    };

    if (existingIds.has(id)) {
      updateCount++;
    } else {
      newCount++;
    }
    validItems.push(item);
  }

  return {
    validItems,
    errors,
    totalRows: parsedRows.length - 1,
    newCount,
    updateCount,
  };
}

// ============================================================================
// WRITTEN QUESTION BANK CSV EXPORT & IMPORT
// ============================================================================

export function serializeWrittenQuestionsToCsv(
  questions: WrittenQuestion[]
): string {
  const rows = questions.map((q) => [
    q.id,
    q.paper,
    q.subject,
    q.postTarget,
    q.marks,
    q.recommendedMinutes,
    q.questionType,
    q.sourceTitle,
    q.sourcePath,
    q.en.title,
    q.en.question,
    q.en.marksAllocation,
    q.en.introduction,
    JSON.stringify(q.en.sections),
    q.en.conclusion,
    q.ne.title,
    q.ne.question,
    q.ne.marksAllocation,
    q.ne.introduction,
    JSON.stringify(q.ne.sections),
    q.ne.conclusion,
    JSON.stringify(q.rubric),
  ]);

  return buildCsvDocument(WRITTEN_CSV_HEADERS, rows);
}

export function downloadWrittenQuestionsCsv(
  questions: WrittenQuestion[],
  filename = 'psc-written-question-bank.csv'
): void {
  const csv = serializeWrittenQuestionsToCsv(questions);
  triggerCsvDownload(csv, filename);
}

export function downloadWrittenCsvTemplate(): void {
  const sampleRow: WrittenQuestion = {
    id: 'PSC-WR-SAMPLE-001',
    paper: 'Paper II: Governance Systems',
    subject: 'Constitution & Rule of Law',
    postTarget: 'Section Officer / Nayab Subba',
    marks: 10,
    recommendedMinutes: 18,
    questionType: 'Long Analytical',
    sourceTitle: 'Constitution of Nepal (2072) — Part 3 & Part 5',
    sourcePath: '/materials/constitution-of-nepal-2072.pdf',
    en: {
      title: 'Cooperative Federalism in Nepal',
      question:
        'Discuss the constitutional basis of cooperative federalism in Nepal under Article 232 and identify major inter-governmental coordination challenges.',
      marksAllocation: '4 + 6 = 10 Marks',
      introduction:
        'Article 232 of the Constitution of Nepal (2072) establishes relations among the Federation, Provinces, and Local Levels on the principles of cooperation, coexistence, and coordination.',
      sections: [
        {
          heading: '1. Constitutional Mechanisms for Coordination',
          points: [
            'Inter-Provincial Council chaired by the Prime Minister (Article 234).',
            'National Natural Resources and Fiscal Commission (Article 250) for equitable revenue sharing.',
          ],
        },
        {
          heading: '2. Implementation Challenges',
          points: [
            'Overlapping concurrent powers across Schedules 7 and 9.',
            'Sub-national administrative capacity and delayed federal umbrella laws.',
          ],
        },
      ],
      conclusion:
        'Institutionalizing regular Inter-Governmental Council meetings and enacting clear concurrent-list standards will strengthen Nepal’s federal governance.',
    },
    ne: {
      title: 'नेपालमा सहकारितामूलक सङ्घीयता',
      question:
        'नेपालको संविधानको धारा २३२ बमोजिम सहकारितामूलक सङ्घीयताको संवैधानिक आधार चर्चा गर्दै अन्तर-सरकारी समन्वयका प्रमुख चुनौतीहरू उल्लेख गर्नुहोस् ।',
      marksAllocation: '४ + ६ = १० अङ्क',
      introduction:
        'नेपालको संविधान (२०७२) को धारा २३२ ले सङ्घ, प्रदेश र स्थानीय तहबीचको सम्बन्ध सहकारिता, सहअस्तित्व र समन्वयको सिद्धान्तमा आधारित हुने स्पष्ट व्यवस्था गरेको छ ।',
      sections: [
        {
          heading: '१. समन्वयका संवैधानिक संयन्त्रहरू',
          points: [
            'प्रधानमन्त्रीको अध्यक्षतामा रहने अन्तरप्रदेश परिषद् (धारा २३४) ।',
            'वित्तीय हस्तान्तरणका लागि राष्ट्रिय प्राकृतिक स्रोत तथा वित्त आयोग (धारा २५०) ।',
          ],
        },
        {
          heading: '२. कार्यान्वयनका प्रमुख चुनौतीहरू',
          points: [
            'अनुसूची ७ र ९ का साझा अधिकारको स्पष्ट कार्यविभाजनमा अन्योल ।',
            'प्रदेश तथा स्थानीय तहमा प्रशासनिक क्षमता र छाता कानुनको अभाव ।',
          ],
        },
      ],
      conclusion:
        'अन्तर-तह समन्वय संयन्त्रलाई नियमित र संस्थागत बनाउँदै साझा अधिकारसम्बन्धी सङ्घीय मापदण्ड समयमै निर्माण गर्नु आवश्यक छ ।',
    },
    rubric: [
      {
        en: 'Accurate citation of Articles 232, 234, 235, and 250 (2 Marks)',
        ne: 'धारा २३२, २३४, २३५ र २५० को सटीक संवैधानिक उल्लेख (२ अङ्क)',
      },
      {
        en: 'Balanced analysis of coordination challenges and practical reforms (6 Marks)',
        ne: 'समन्वयका चुनौती र व्यावहारिक सुधारका उपायको सन्तुलित विश्लेषण (६ अङ्क)',
      },
      {
        en: 'Structured introduction and forward-looking conclusion (2 Marks)',
        ne: 'प्रभावकारी परिचय र समाधानमुखी निष्कर्ष (२ अङ्क)',
      },
    ],
  };

  triggerCsvDownload(
    serializeWrittenQuestionsToCsv([sampleRow]),
    'psc-written-import-template.csv'
  );
}

function normalizeWrittenPaper(raw: string): WrittenPaperCode | null {
  const trimmed = raw.trim();
  if ((WRITTEN_PAPERS as readonly string[]).includes(trimmed)) {
    return trimmed as WrittenPaperCode;
  }
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('paper ii:') || lower === 'paper ii' || lower === 'paper 2') {
    return 'Paper II: Governance Systems';
  }
  if (
    lower.startsWith('paper iii:') ||
    lower === 'paper iii' ||
    lower === 'paper 3'
  ) {
    return 'Paper III: Contemporary Issues & Development';
  }
  if (lower.startsWith('paper iv:') || lower === 'paper iv' || lower === 'paper 4') {
    return 'Paper IV: Service Delivery & Case Analysis';
  }
  if (lower.startsWith('ntc') || lower.includes('computer engineering')) {
    return 'NTC Paper II: Computer Engineering';
  }
  return null;
}

function normalizeWrittenQuestionType(
  raw: string,
  marks: WrittenQuestionMarks
): WrittenQuestionType | null {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) {
    return marks === 5 ? 'Short Analytical' : 'Long Analytical';
  }
  if (trimmed === 'short analytical' || trimmed === 'short') {
    return 'Short Analytical';
  }
  if (trimmed === 'long analytical' || trimmed === 'long') {
    return 'Long Analytical';
  }
  if (trimmed === 'case study' || trimmed === 'case') {
    return 'Case Study';
  }
  return null;
}

function parseSectionsCell(
  raw: string,
  fallbackHeading: string,
  fallbackBody: string
): { sections: BilingualSection[]; error?: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      sections: [
        {
          heading: fallbackHeading,
          points: [fallbackBody || fallbackHeading],
        },
      ],
    };
  }

  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (!Array.isArray(parsed)) {
        return { sections: [], error: 'Sections JSON must be an array.' };
      }
      const sections: BilingualSection[] = parsed
        .slice(0, 20)
        .map((entry) => {
          const heading =
            typeof entry?.heading === 'string' && entry.heading.trim()
              ? entry.heading.trim().slice(0, 300)
              : fallbackHeading;
          const rawPoints = Array.isArray(entry?.points) ? entry.points : [];
          const points = rawPoints
            .map((p: unknown) => (typeof p === 'string' ? p.trim().slice(0, 1200) : ''))
            .filter(Boolean);
          return {
            heading,
            points: points.length > 0 ? points : [heading],
          };
        });

      if (sections.length === 0) {
        return {
          sections: [],
          error: 'Sections JSON array must contain at least 1 section.',
        };
      }
      return { sections };
    } catch {
      return { sections: [], error: 'Invalid JSON syntax in sections column.' };
    }
  }

  // Human-friendly text fallback: "Heading :: Point 1 | Point 2" per line or ";;"
  const blocks = trimmed
    .split(/;;|\r?\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .slice(0, 20);

  const sections: BilingualSection[] = blocks.map((block) => {
    const [headPart, ptsPart] = block.split('::');
    if (ptsPart !== undefined) {
      const heading = headPart.trim().slice(0, 300) || fallbackHeading;
      const points = ptsPart
        .split('|')
        .map((p) => p.trim().slice(0, 1200))
        .filter(Boolean);
      return { heading, points: points.length > 0 ? points : [heading] };
    }
    return {
      heading: fallbackHeading,
      points: [block.slice(0, 1200)],
    };
  });

  return {
    sections:
      sections.length > 0
        ? sections
        : [{ heading: fallbackHeading, points: [fallbackBody || fallbackHeading] }],
  };
}

function parseRubricCell(raw: string): {
  rubric: BilingualRubricPoint[];
  error?: string;
} {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      rubric: [
        {
          en: 'Core statutory, conceptual, and analytical points covered.',
          ne: 'मुख्य कानुनी, सैद्धान्तिक तथा विश्लेषणात्मक बुँदाहरू समेटिएको ।',
        },
      ],
    };
  }

  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (!Array.isArray(parsed)) {
        return { rubric: [], error: 'rubricJson must be a JSON array.' };
      }
      const rubric: BilingualRubricPoint[] = parsed
        .slice(0, 30)
        .map((entry) => {
          if (typeof entry === 'string') {
            const text = entry.trim().slice(0, 800);
            return { en: text, ne: text };
          }
          const en = typeof entry?.en === 'string' ? entry.en.trim().slice(0, 800) : '';
          const ne = typeof entry?.ne === 'string' ? entry.ne.trim().slice(0, 800) : '';
          return {
            en: en || ne || 'Core analytical criteria',
            ne: ne || en || 'मुख्य विश्लेषणात्मक आधार',
          };
        })
        .filter((r) => Boolean(r.en && r.ne));

      if (rubric.length === 0) {
        return {
          rubric: [],
          error: 'rubricJson must contain at least 1 valid rubric item.',
        };
      }
      return { rubric };
    } catch {
      return { rubric: [], error: 'Invalid JSON syntax in rubricJson column.' };
    }
  }

  // Human-friendly text fallback: "EN criteria :: NE criteria" per line or ";"
  const items = trimmed
    .split(/\r?\n|;/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 30)
    .map((line) => {
      const [enPart, nePart] = line.split('::');
      const en = (enPart || '').trim().slice(0, 800);
      const ne = (nePart || '').trim().slice(0, 800);
      return {
        en: en || ne || 'Core analytical criteria',
        ne: ne || en || 'मुख्य विश्लेषणात्मक आधार',
      };
    });

  return {
    rubric:
      items.length > 0
        ? items
        : [
            {
              en: 'Core statutory and analytical points covered.',
              ne: 'मुख्य कानुनी तथा विश्लेषणात्मक पक्ष समेटिएको ।',
            },
          ],
  };
}

export function parseWrittenQuestionsCsv(
  csvText: string,
  existingIds: Set<string> = new Set()
): CsvImportParseResult<WrittenQuestion> {
  const parsedRows = parseCsvText(csvText);
  if (parsedRows.length < 2) {
    return {
      validItems: [],
      errors: [
        {
          rowNumber: 1,
          message:
            'CSV must include a header row and at least one written question row.',
        },
      ],
      totalRows: 0,
      newCount: 0,
      updateCount: 0,
    };
  }

  const rawHeaders = parsedRows[0];
  const headerIndex = new Map<string, number>();
  rawHeaders.forEach((h, idx) => {
    const norm = normalizeHeaderKey(h);
    if (norm && !headerIndex.has(norm)) {
      headerIndex.set(norm, idx);
    }
  });

  // Detect wrong CSV schema (MCQ uploaded into Written bank)
  if (headerIndex.has('optiona') && headerIndex.has('correctoptions')) {
    return {
      validItems: [],
      errors: [
        {
          rowNumber: 1,
          message:
            'This file appears to be an Objective MCQ CSV (optionA, correct_options). Please upload a Written Question Bank CSV instead.',
        },
      ],
      totalRows: parsedRows.length - 1,
      newCount: 0,
      updateCount: 0,
    };
  }

  const hasPromptCols =
    headerIndex.has('entitle') && headerIndex.has('enquestion');
  if (!hasPromptCols) {
    return {
      validItems: [],
      errors: [
        {
          rowNumber: 1,
          message:
            'Missing required Written CSV columns (enTitle, enQuestion). Download the Written CSV template to view the exact schema.',
        },
      ],
      totalRows: parsedRows.length - 1,
      newCount: 0,
      updateCount: 0,
    };
  }

  const getCell = (row: string[], ...aliases: string[]): string => {
    for (const alias of aliases) {
      const idx = headerIndex.get(normalizeHeaderKey(alias));
      if (idx !== undefined && idx < row.length) {
        return row[idx].trim();
      }
    }
    return '';
  };

  const validItems: WrittenQuestion[] = [];
  const errors: CsvImportRowError[] = [];
  const seenIdsInFile = new Map<string, number>();
  let newCount = 0;
  let updateCount = 0;
  const batchTimestamp = Date.now().toString().slice(-5);
  const generateUniqueWrittenId = (rowIndex: number): string => {
    let suffix = 0;
    let candidate = `PSC-WR-CSV-${batchTimestamp}-${String(rowIndex).padStart(3, '0')}`;
    while (existingIds.has(candidate) || seenIdsInFile.has(candidate)) {
      suffix++;
      candidate = `PSC-WR-CSV-${batchTimestamp}-${String(rowIndex).padStart(3, '0')}-${suffix}`;
    }
    return candidate;
  };

  for (let i = 1; i < parsedRows.length; i++) {
    const row = parsedRows[i];
    const rowNumber = i + 1;

    const rawId = getCell(row, 'id', 'code');
    const id = rawId || generateUniqueWrittenId(i);

    const pushErr = (message: string) => {
      errors.push({ rowNumber, questionId: id, message });
    };

    if (!FIRESTORE_ID_REGEX.test(id)) {
      pushErr(
        `Invalid ID "${id}". ID must be 1–128 chars using only letters, numbers, hyphens (-), or underscores (_).`
      );
      continue;
    }

    const prevRow = seenIdsInFile.get(id);
    if (prevRow !== undefined) {
      pushErr(`Duplicate ID "${id}" (already defined on row ${prevRow}).`);
      continue;
    }
    seenIdsInFile.set(id, rowNumber);

    const rawPaper = getCell(row, 'paper') || 'Paper II: Governance Systems';
    const paper = normalizeWrittenPaper(rawPaper);
    if (!paper) {
      pushErr(
        `Invalid "paper" "${rawPaper}". Must be one of: ${WRITTEN_PAPERS.join(' | ')}.`
      );
      continue;
    }

    const rawMarks = getCell(row, 'marks');
    const numericMarks = rawMarks ? Number(rawMarks) : 10;
    if (numericMarks !== 5 && numericMarks !== 10) {
      pushErr(`Invalid "marks" "${rawMarks}". Written questions must be 5 or 10 marks.`);
      continue;
    }
    const marks: WrittenQuestionMarks = numericMarks;

    const rawMinutes = getCell(row, 'recommendedMinutes', 'recommended_minutes');
    const recommendedMinutes = rawMinutes
      ? Math.round(Number(rawMinutes))
      : marks === 5
        ? 9
        : 18;
    if (
      !Number.isFinite(recommendedMinutes) ||
      recommendedMinutes < 1 ||
      recommendedMinutes > 120
    ) {
      pushErr(
        `Invalid "recommendedMinutes" "${rawMinutes}". Must be a number between 1 and 120.`
      );
      continue;
    }

    const rawType = getCell(row, 'questionType', 'question_type');
    const questionType = normalizeWrittenQuestionType(rawType, marks);
    if (!questionType) {
      pushErr(
        `Invalid "questionType" "${rawType}". Must be Short Analytical, Long Analytical, or Case Study.`
      );
      continue;
    }

    const subject = getCell(row, 'subject') || 'Governance & Public Management';
    const postTarget =
      getCell(row, 'postTarget', 'post_target') || 'Section Officer / Nayab Subba';
    const sourceTitle =
      getCell(row, 'sourceTitle', 'source_title') ||
      'Official PSC Nepal Syllabus & Statutes';
    const sourcePath =
      getCell(row, 'sourcePath', 'source_path') ||
      '/materials/constitution-of-nepal-2072.pdf';

    if (subject.length > 200 || postTarget.length > 200) {
      pushErr('"subject" or "postTarget" exceeds 200-character Firestore limit.');
      continue;
    }
    if (sourceTitle.length > 300) {
      pushErr(
        `"sourceTitle" exceeds Firestore max length (${sourceTitle.length}/300 chars).`
      );
      continue;
    }
    if (sourcePath.length > 512) {
      pushErr(
        `"sourcePath" exceeds Firestore max length (${sourcePath.length}/512 chars).`
      );
      continue;
    }

    const enTitle = getCell(row, 'enTitle', 'en_title');
    const enQuestion = getCell(row, 'enQuestion', 'en_question');
    if (!enTitle || !enQuestion) {
      pushErr('Missing required "enTitle" or "enQuestion".');
      continue;
    }
    if (enTitle.length > 400 || enQuestion.length > 3000) {
      pushErr('"enTitle" (max 400) or "enQuestion" (max 3000) exceeds Firestore limits.');
      continue;
    }

    const enMarksAllocation = (
      getCell(row, 'enMarksAllocation', 'en_marks_allocation') ||
      `${marks} Marks`
    ).slice(0, 120);
    const enIntroduction =
      getCell(row, 'enIntroduction', 'en_introduction') || enQuestion;
    if (enIntroduction.length > 5000) {
      pushErr('"enIntroduction" exceeds 5000-character limit.');
      continue;
    }
    const enConclusion =
      getCell(row, 'enConclusion', 'en_conclusion') ||
      'Effective statutory enforcement and institutional accountability remain essential.';
    if (enConclusion.length > 3000) {
      pushErr('"enConclusion" exceeds 3000-character limit.');
      continue;
    }

    const enSectionsParsed = parseSectionsCell(
      getCell(row, 'enSectionsJson', 'en_sections_json', 'enSections'),
      'Key Analytical Points',
      enQuestion
    );
    if (enSectionsParsed.error) {
      pushErr(`English sections error: ${enSectionsParsed.error}`);
      continue;
    }

    const neTitle = getCell(row, 'neTitle', 'ne_title') || enTitle;
    const neQuestion = getCell(row, 'neQuestion', 'ne_question') || enQuestion;
    if (neTitle.length > 400 || neQuestion.length > 3000) {
      pushErr('"neTitle" (max 400) or "neQuestion" (max 3000) exceeds Firestore limits.');
      continue;
    }

    const neMarksAllocation = (
      getCell(row, 'neMarksAllocation', 'ne_marks_allocation') ||
      `${marks === 5 ? '५' : '१०'} अङ्क`
    ).slice(0, 120);
    const neIntroduction =
      getCell(row, 'neIntroduction', 'ne_introduction') || neQuestion;
    if (neIntroduction.length > 5000) {
      pushErr('"neIntroduction" exceeds 5000-character limit.');
      continue;
    }
    const neConclusion =
      getCell(row, 'neConclusion', 'ne_conclusion') ||
      'प्रभावकारी कानुनी कार्यान्वयन र संस्थागत जवाफदेहिता अपरिहार्य छ ।';
    if (neConclusion.length > 3000) {
      pushErr('"neConclusion" exceeds 3000-character limit.');
      continue;
    }

    const neSectionsParsed = parseSectionsCell(
      getCell(row, 'neSectionsJson', 'ne_sections_json', 'neSections'),
      'मुख्य विश्लेषणात्मक बुँदाहरू',
      neQuestion
    );
    if (neSectionsParsed.error) {
      pushErr(`Nepali sections error: ${neSectionsParsed.error}`);
      continue;
    }

    const rubricParsed = parseRubricCell(
      getCell(row, 'rubricJson', 'rubric_json', 'rubric')
    );
    if (rubricParsed.error) {
      pushErr(`Rubric error: ${rubricParsed.error}`);
      continue;
    }

    const enBlock: LocalizedAnswerContent = {
      title: enTitle,
      question: enQuestion,
      marksAllocation: enMarksAllocation,
      introduction: enIntroduction,
      sections: enSectionsParsed.sections,
      conclusion: enConclusion,
    };

    const neBlock: LocalizedAnswerContent = {
      title: neTitle,
      question: neQuestion,
      marksAllocation: neMarksAllocation,
      introduction: neIntroduction,
      sections: neSectionsParsed.sections,
      conclusion: neConclusion,
    };

    const item: WrittenQuestion = {
      id,
      paper,
      subject,
      postTarget,
      marks,
      recommendedMinutes,
      questionType,
      sourceTitle,
      sourcePath,
      en: enBlock,
      ne: neBlock,
      rubric: rubricParsed.rubric,
    };

    if (existingIds.has(id)) {
      updateCount++;
    } else {
      newCount++;
    }
    validItems.push(item);
  }

  return {
    validItems,
    errors,
    totalRows: parsedRows.length - 1,
    newCount,
    updateCount,
  };
}
