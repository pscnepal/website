import { KHARIDAR_SYLLABUS } from './syllabus/kharidarSyllabus.ts';
import {
  NAYAB_SUBBA_PHASE_1,
  NAYAB_SUBBA_PHASE_3,
} from './syllabus/nayabSubbaStage1And2Common.ts';
import { NAYAB_SUBBA_PHASE_2 } from './syllabus/nayabSubbaStage2Service.ts';
import {
  SECTION_OFFICER_PHASE_1,
  SECTION_OFFICER_PHASE_3,
} from './syllabus/sectionOfficerStage1And3.ts';
import { SECTION_OFFICER_PHASE_2 } from './syllabus/sectionOfficerStage2Service.ts';
import type {
  PscCadreSyllabus,
  PscExamPhase,
  PscSyllabusChapter,
  PscSyllabusPaper,
  PscSyllabusUnit,
} from './syllabus/types.ts';

export * from './syllabus/types.ts';

export const SECTION_OFFICER_SYLLABUS: PscCadreSyllabus = {
  id: 'section-officer',
  shortTitle: 'Section Officer',
  title: 'Gazetted Third Class (Section Officer)',
  nepaliTitle:
    'राजपत्रांकित तृतीय श्रेणी (अप्राविधिक) · शाखा अधिकृत वा सो सरह (संयुक्त र एकीकृत परीक्षा प्रणाली)',
  rankClassification: 'Gazetted Class III · Non-Technical',
  serviceScope:
    'Foreign Affairs, Administration (General Admin, Accounts, Revenue), Audit & Federal Parliament Service',
  eligibilitySummary:
    'Bachelor’s degree in any discipline from a recognized university (age 21–35 years; up to 40 years for women and persons with disabilities).',
  effectiveFromBs: 'Approved 2081/03/20 BS · Scheme Amended 2082/08/22 BS',
  negativeMarkingPercent: 20,
  screeningPassPercent: 45,
  meritCalculationNote:
    'Stage I (100 Marks) is strictly a qualifying screening test (minimum pass mark: 45, i.e., 45%; 0% of Stage I marks are added to Stage II). Final merit order combines Stage II Main Written Papers (300 Marks; 400 Marks for Foreign Service) + Final Stage IT Skill (10M), Group Test (10M) & Oral Interview (40M; 50M for Foreign Service) = 360 Marks (470 Marks for Foreign Service).',
  generalExamRules: [
    'Stage I Pass Marks: 45 out of 100 (45%) · 20% (-0.20 mark) deducted per wrong MCQ · Calculators prohibited.',
    'Stage I marks are strictly for preliminary screening and are NOT added to Main Examination merit.',
    'Separate answer booklets are used for each section (खण्ड) in Stage II Written Papers.',
    'Any Constitution, Act, Rule, or Policy enacted or amended up to 3 months before the exam date is included in the syllabus.',
  ],
  syllabusPdfPath:
    'https://psc.gov.np/site_uploads/course/202512091112156938040f1c8f0.pdf',
  officialPscPdfs: [
    {
      id: 'so-official-pdf-1',
      phaseLabel: 'Stage I & Exam Scheme (24p)',
      title: 'Official PSC Section Officer Syllabus — Phase I (AAT & Scheme)',
      nepaliTitle:
        'राजपत्रांकित तृतीय श्रेणी (अप्राविधिक) प्रथम चरण — लोक सेवा आयोगको मूल PDF',
      pages: 24,
      approvedDateBs: '2081/03/20 (Amended 2082/08/22)',
      localPdfPath:
        'https://psc.gov.np/site_uploads/course/202512091112156938040f1c8f0.pdf',
      officialPscUrl:
        'https://psc.gov.np/site_uploads/course/202512091112156938040f1c8f0.pdf',
    },
    {
      id: 'so-official-pdf-2',
      phaseLabel: 'Stage II Written Papers (31p)',
      title:
        'Official PSC Section Officer Syllabus — Phase II (Papers II, III, IV & Foreign Extra I/II)',
      nepaliTitle:
        'राजपत्रांकित तृतीय श्रेणी (अप्राविधिक) द्वितीय चरण — लोक सेवा आयोगको मूल PDF',
      pages: 31,
      approvedDateBs: '2081/03/20 (Effective 2081/82)',
      localPdfPath:
        'https://psc.gov.np/site_uploads/course/202512091043336937fd55e8f3c1.pdf',
      officialPscUrl:
        'https://psc.gov.np/site_uploads/course/202512091043336937fd55e8f3c1.pdf',
    },
  ],
  defaultSimulationPreset: 'so-phase1-omr',
  phases: [
    SECTION_OFFICER_PHASE_1,
    SECTION_OFFICER_PHASE_2,
    SECTION_OFFICER_PHASE_3,
  ],
};

export const NAYAB_SUBBA_SYLLABUS: PscCadreSyllabus = {
  id: 'nayab-subba',
  shortTitle: 'Nayab Subba',
  title: 'Non-Gazetted First Class (Nayab Subba)',
  nepaliTitle:
    'राजपत्र अनंकित प्रथम श्रेणी (अप्राविधिक) · नायब सुब्बा वा सो सरह (एकीकृत र संयुक्त परीक्षा प्रणाली)',
  rankClassification: 'Non-Gazetted Class I · Non-Technical',
  serviceScope:
    'Justice, Foreign Affairs, Administration (General Admin, Accounts, Revenue), Audit & Federal Parliament Service',
  eligibilitySummary:
    'Proficiency Certificate Level (10+2 / Intermediate) or equivalent from a recognized board (age 18–35 years; up to 40 years for women and persons with disabilities).',
  effectiveFromBs: 'Approved 2081/03/20 BS · Effective from FY 2081/82',
  negativeMarkingPercent: 20,
  screeningPassPercent: 45,
  meritCalculationNote:
    'Stage I (100 Marks: 50 MCQs × 2 Marks) is strictly a qualifying screening test (pass mark: 45, i.e., 45%; 0% of Stage I marks are carried forward into Stage II). Final selection merit combines Stage II Written Papers (Paper II 100M + Service-Group Paper III 100M = 200 Marks) + Final Stage Computer Skill Test (10M) & Oral Interview (30M) = 240 Marks.',
  generalExamRules: [
    'Stage I Pass Marks: 45 out of 100 (45%) · 20% (-0.40 mark) deducted for every wrong MCQ · Calculators prohibited.',
    'Stage I is strictly a screening examination; Stage I marks are NOT included in Main Examination or Final Merit.',
    'Papers II and III each carry 14 Short Questions × 5 Marks + 3 Long Questions × 10 Marks = 100 Marks (2 Hours 30 Minutes; Foreign Service Paper III carries 10×2M + 2×10M + 8×5M + 2×10M) with separate booklets per section.',
    'Any Act, Rule, or Policy amended up to 3 months before the exam date forms part of the syllabus.',
  ],
  syllabusPdfPath:
    'https://psc.gov.np/site_uploads/course/2024072511021066a230b2d30f6.pdf',
  officialPscPdfs: [
    {
      id: 'ns-official-pdf-1',
      phaseLabel: 'Stage I & Exam Scheme (11p)',
      title:
        'Official PSC Nayab Subba Syllabus — Phase I (GK, GMAT & Unified Scheme)',
      nepaliTitle:
        'राजपत्र अनंकित प्रथम श्रेणी (नायब सुब्बा) प्रथम चरण — लोक सेवा आयोगको मूल PDF',
      pages: 11,
      approvedDateBs: '2081/03/20 (Effective FY 2081/82)',
      localPdfPath:
        'https://psc.gov.np/site_uploads/course/2024072511021066a230b2d30f6.pdf',
      officialPscUrl:
        'https://psc.gov.np/site_uploads/course/2024072511021066a230b2d30f6.pdf',
    },
    {
      id: 'ns-official-pdf-2',
      phaseLabel: 'Stage II Written Papers (12p)',
      title:
        'Official PSC Nayab Subba Syllabus — Phase II (Paper II & All 5 Service-Group Paper IIIs)',
      nepaliTitle:
        'राजपत्र अनंकित प्रथम श्रेणी (नायब सुब्बा) द्वितीय चरण — लोक सेवा आयोगको मूल PDF',
      pages: 12,
      approvedDateBs: '2081/03/20 (Effective FY 2081/82)',
      localPdfPath:
        'https://psc.gov.np/site_uploads/course/2024072511021066a230b2d30f61.pdf',
      officialPscUrl:
        'https://psc.gov.np/site_uploads/course/2024072511021066a230b2d30f61.pdf',
    },
  ],
  defaultSimulationPreset: 'nasu-phase1-omr',
  phases: [NAYAB_SUBBA_PHASE_1, NAYAB_SUBBA_PHASE_2, NAYAB_SUBBA_PHASE_3],
};

export const PSC_CADRE_SYLLABI: PscCadreSyllabus[] = [
  SECTION_OFFICER_SYLLABUS,
  NAYAB_SUBBA_SYLLABUS,
  KHARIDAR_SYLLABUS,
];

export const ALL_SYLLABUS_UNITS: PscSyllabusUnit[] = PSC_CADRE_SYLLABI.flatMap(
  (cadre) =>
    cadre.phases.flatMap((phase) =>
      phase.papers.flatMap((paper) => paper.units)
    )
);

export function getCadreSyllabusById(
  cadreId: string | undefined
): PscCadreSyllabus | undefined {
  return PSC_CADRE_SYLLABI.find((c) => c.id === cadreId);
}

export function getCadreUnitIds(cadre: PscCadreSyllabus): string[] {
  return cadre.phases.flatMap((phase) =>
    phase.papers.flatMap((paper) => paper.units.map((u) => u.id))
  );
}

export function getActivePhasePapers(
  phase: PscExamPhase,
  selectedStreamId?: string
): PscSyllabusPaper[] {
  if (!phase.serviceStreams || phase.serviceStreams.length === 0) {
    return phase.papers;
  }
  const commonPapers = phase.papers.filter((p) => !p.serviceStreamId);
  const activeStream =
    phase.serviceStreams.find((s) => s.id === selectedStreamId) ??
    phase.serviceStreams[0];
  return [...commonPapers, ...activeStream.papers];
}

export function getChapterTopicIds(chapter: PscSyllabusChapter): string[] {
  return chapter.topics.map((t) => t.id);
}

export function getUnitTopicIds(unit: PscSyllabusUnit): string[] {
  return unit.chapters.flatMap((ch) => ch.topics.map((t) => t.id));
}

export function getPaperTopicIds(paper: PscSyllabusPaper): string[] {
  return paper.units.flatMap((u) => getUnitTopicIds(u));
}

export interface CadreSyllabusStats {
  totalPapers: number;
  totalStreams: number;
  totalUnits: number;
  totalChapters: number;
  totalTopics: number;
  totalSubtopics: number;
  topicIds: string[];
}

export function getCadreSyllabusStats(
  cadre: PscCadreSyllabus,
  selectedStreamByPhase?: Record<string, string>
): CadreSyllabusStats {
  let totalPapers = 0;
  let totalStreams = 0;
  let totalUnits = 0;
  let totalChapters = 0;
  let totalTopics = 0;
  let totalSubtopics = 0;
  const topicIds: string[] = [];

  for (const phase of cadre.phases) {
    if (phase.serviceStreams && phase.serviceStreams.length > 0) {
      totalStreams += phase.serviceStreams.length;
    }
    const papers = getActivePhasePapers(
      phase,
      selectedStreamByPhase?.[phase.id]
    );
    totalPapers += papers.length;
    for (const paper of papers) {
      totalUnits += paper.units.length;
      for (const unit of paper.units) {
        totalChapters += unit.chapters.length;
        for (const ch of unit.chapters) {
          totalTopics += ch.topics.length;
          for (const topic of ch.topics) {
            topicIds.push(topic.id);
            totalSubtopics += topic.subtopics?.length ?? 0;
          }
        }
      }
    }
  }

  return {
    totalPapers,
    totalStreams,
    totalUnits,
    totalChapters,
    totalTopics,
    totalSubtopics,
    topicIds,
  };
}
