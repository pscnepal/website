import type { LucideIcon } from 'lucide-react';
import type { PscCadreId } from './syllabus';
import type { InquiryCategory } from './workspace';

// ============================================================================
// CURRENT AFFAIRS (SAMASAMAYIK)
// ============================================================================

export type CurrentAffairCadence = 'daily' | 'weekly' | 'monthly';

export type CurrentAffairCategory =
  | 'national'
  | 'economy'
  | 'international'
  | 'science-environment'
  | 'governance'
  | 'sports-awards';

export interface CurrentAffairItem {
  id: string;
  cadence: CurrentAffairCadence;
  periodLabelEn?: string;
  periodLabelNe?: string;
  titleEn: string;
  titleNe: string;
  dateBS: string;
  dateAD: string;
  monthBS: string;
  category: CurrentAffairCategory;
  categoryLabelEn: string;
  categoryLabelNe: string;
  cadreRelevance: PscCadreId[];
  paperRelevance: string;
  summaryEn: string;
  summaryNe: string;
  keyFacts: string[];
  examTip: string;
  likes: number;
  dislikes: number;
  views: number;
  pinned?: boolean;
  source: string;
  linkedQuizIds?: string[];
  linkedWrittenIds?: string[];
  linkedMaterialIds?: string[];
}

// ============================================================================
// PSC CALENDAR & NOTICES
// ============================================================================

export type PscCadreType =
  | PscCadreId
  | 'joint-secretary'
  | 'under-secretary'
  | 'technical-health'
  | 'technical-engineering';

export type EventStatus =
  | 'application-open'
  | 'exam-scheduled'
  | 'ad-published'
  | 'upcoming'
  | 'completed';

export interface CalendarEvent {
  id: string;
  cadreId: PscCadreType;
  cadreTitleEn: string;
  cadreTitleNe: string;
  levelRankEn: string;
  levelRankNe: string;
  serviceGroup: string;
  competitionType: 'open-inclusive' | 'internal' | 'both';
  competitionTypeLabel: string;
  adPublishDateBS: string;
  adPublishDateAD: string;
  applicationDeadlineBS: string;
  stage1ExamDateBS: string;
  stage1ExamDateAD: string;
  stage2ExamDateBS: string;
  stage2ExamDateAD: string;
  status: EventStatus;
  statusLabelNe: string;
  estimatedSeats: number;
  syllabusUrl: string;
  simulationPreset: string;
  eligibilitySnippet: string;
  examCenterNoticeSnippet?: string;
  isHighPriority?: boolean;
}

export type NoticeCategory =
  | 'vacancy-ad'
  | 'exam-center'
  | 'written-result'
  | 'syllabus-revision'
  | 'general-notice';

export interface PscNotice {
  id: string;
  noticeNumber: string;
  titleNe: string;
  titleEn: string;
  category: NoticeCategory;
  categoryLabelNe: string;
  categoryLabelEn: string;
  publishedDateBS: string;
  publishedDateAD: string;
  targetCadres: PscCadreType[];
  summaryNe: string;
  summaryEn: string;
  isImportant?: boolean;
  officialSource: string;
  actionUrl?: string;
}

export interface HallRuleItem {
  id: string;
  titleNe: string;
  detailNe: string;
}

export interface OmrScoringRuleCard {
  id: string;
  titleNe: string;
  headlineNe: string;
  descriptionNe: string;
  tone: 'emerald' | 'crimson' | 'zinc';
}

export interface ExamDayChecklistItem {
  id: string;
  label: string;
}

// ============================================================================
// PREVIOUS YEARS' QUESTIONS (PYQ)
// ============================================================================

export interface PyqRecurringTopic {
  id: string;
  topicNameNe: string;
  topicNameEn: string;
  cadreFocus: PscCadreId[];
  frequencyScore: number;
  recurrencePercentage: number;
  trend: 'rising' | 'evergreen' | 'stable';
  corePapers: string[];
  whyItRepeatsNe: string;
  whyItRepeatsEn: string;
  rankerTipNe: string;
  suggestedStatutes: string[];
}

export interface PyqQuestion {
  id: string;
  yearBS: string;
  cadre: PscCadreId;
  cadreLabelNe: string;
  cadreLabelEn: string;
  paper: 'Paper I (OMR)' | 'Paper II' | 'Paper III' | 'Paper IV';
  paperNameNe: string;
  paperNameEn: string;
  marks: 5 | 10;
  questionType: 'subjective-short' | 'subjective-long' | 'case-study';
  questionNe: string;
  questionEn: string;
  topicCategory:
    | 'governance'
    | 'constitution-law'
    | 'economy-budget'
    | 'foreign-affairs'
    | 'social-development'
    | 'environment-disaster';
  topicCategoryLabelNe: string;
  topicCategoryLabelEn: string;
  recurringFrequencyBadge:
    | 'Tested 7+ Times'
    | 'Tested 5+ Times'
    | 'Tested 3+ Times'
    | 'Standard Frequency';
  outlineHintsNe: string[];
  outlineHintsEn: string[];
  linkedWrittenQuestionId?: string;
}

// ============================================================================
// STATIC & EDITORIAL CONTENT MODELS
// ============================================================================

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
  getPlainAnswer: (counts: {
    totalSyllabusUnits: number;
    totalWrittenQuestions: number;
  }) => string;
}

export interface ReaderFeatureItem {
  index: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface ReaderShortcutItem {
  id: string;
  keys: string;
  dialogKey: string;
  action: string;
  dialogDescription: string;
  showInGuide: boolean;
  showInDialog: boolean;
}

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

export interface ContactCategoryOption {
  value: InquiryCategory;
  label: string;
  placeholder: string;
}

export interface ContactSupportTopic {
  title: string;
  description: string;
}

export interface ChatbotStarterPrompt {
  label: string;
  prompt: string;
}
