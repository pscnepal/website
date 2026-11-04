export type PscCadreId = 'section-officer' | 'nayab-subba' | 'kharidar';

export type PscExamFormat =
  | 'Objective MCQ (OMR)'
  | 'Subjective Analytical & Case'
  | 'Practical & Oral Viva';

export interface OfficialPscPdfAttachment {
  id: string;
  phaseLabel: string;
  title: string;
  nepaliTitle: string;
  pages: number;
  approvedDateBs: string;
  localPdfPath: string;
  officialPscUrl: string;
}

export interface PscSyllabusSubtopic {
  id: string;
  subtopicNumber: number;
  code: string;
  subtopic: string;
  nepaliSubtopic?: string;
  brief: string;
}

export interface PscSyllabusTopic {
  id: string;
  topicNumber: number;
  code: string;
  topic: string;
  nepaliTopic?: string;
  marksHint?: string;
  brief: string;
  subtopics?: PscSyllabusSubtopic[];
}

export interface PscSyllabusChapter {
  id: string;
  chapterNumber: number;
  code: string;
  chapterName: string;
  nepaliChapterName?: string;
  marksAllocation?: string;
  chapterBrief?: string;
  topics: PscSyllabusTopic[];
}

export interface PscSyllabusUnit {
  id: string;
  branchNumber?: number;
  unitCode: string;
  title: string;
  nepaliTitle: string;
  marksWeight: number;
  branchSummary?: string;
  subtopics: string[];
  chapters: PscSyllabusChapter[];
  keyReferences: string;
  materialPath?: string;
  materialTitle?: string;
  quizHref?: string;
  quizLabel?: string;
  writtenHref?: string;
  writtenLabel?: string;
  simulatePresetId?: string;
}

export interface PscServiceStreamGroup {
  id: string;
  shortLabel: string;
  serviceName: string;
  nepaliServiceName: string;
  meritNote?: string;
  papers: PscSyllabusPaper[];
}

export interface PscSyllabusPaper {
  id: string;
  code: string;
  title: string;
  nepaliTitle: string;
  serviceStreamId?: string;
  examFormat: PscExamFormat;
  fullMarks: number;
  passMarks: number | null;
  durationLabel: string;
  questionBreakdown: string;
  scoringRule: string;
  countsTowardFinalMerit: boolean;
  units: PscSyllabusUnit[];
}

export interface PscExamPhase {
  id: string;
  phaseNumber: 1 | 2 | 3;
  title: string;
  nepaliTitle: string;
  summary: string;
  officialPdfPath?: string;
  officialPscUrl?: string;
  papers: PscSyllabusPaper[];
  serviceStreams?: PscServiceStreamGroup[];
}

export interface PscCadreSyllabus {
  id: PscCadreId;
  shortTitle: string;
  title: string;
  nepaliTitle: string;
  rankClassification: string;
  serviceScope: string;
  eligibilitySummary: string;
  effectiveFromBs: string;
  negativeMarkingPercent: number;
  screeningPassPercent: number;
  meritCalculationNote: string;
  generalExamRules: string[];
  syllabusPdfPath: string;
  officialPscPdfs: OfficialPscPdfAttachment[];
  defaultSimulationPreset: string;
  phases: PscExamPhase[];
}
