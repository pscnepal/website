import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  FileText,
  Layers,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import {
  WRITTEN_MARKS_OPTIONS as MARKS_OPTIONS,
  WRITTEN_QUESTION_TYPE_OPTIONS as QUESTION_TYPE_OPTIONS,
} from '../../data/catalogOptionsData';
import type {
  BilingualRubricPoint,
  BilingualSection,
  WrittenPaperCode,
  WrittenQuestion,
  WrittenQuestionMarks,
  WrittenQuestionType,
} from '../../data/writtenQuestionsData';
import { WRITTEN_PAPERS } from '../../data/writtenQuestionsData';
import { materialStorageService } from '../../services/materialStorageService';
import { questionStorageService } from '../../services/questionStorageService';
import { ActionButton } from '../common/ActionButton';
import {
  SharedSearchSelect,
  type SearchSelectOption,
} from '../common/SharedSearchSelect';
import { SelectOrCustomField } from './SelectOrCustomField';

export interface WrittenQuestionFormModalProps {
  isOpen: boolean;
  questionToEdit?: WrittenQuestion | null;
  onClose: () => void;
  onSave: (question: WrittenQuestion) => void;
}

const PAPER_OPTIONS: SearchSelectOption[] = WRITTEN_PAPERS.map((p) => ({
  value: p,
  label: p,
}));

const CUSTOM_SOURCE_SENTINEL = '__CUSTOM_WRITTEN_SOURCE__';

function cloneSections(sections: BilingualSection[] | undefined, fallbackHeading: string): BilingualSection[] {
  if (!sections || sections.length === 0) {
    return [{ heading: fallbackHeading, points: [''] }];
  }
  return sections.map((sec) => ({
    heading: sec.heading || '',
    points: sec.points && sec.points.length > 0 ? [...sec.points] : [''],
  }));
}

export function WrittenQuestionFormModal({
  isOpen,
  questionToEdit,
  onClose,
  onSave,
}: WrittenQuestionFormModalProps) {
  const isEditing = Boolean(questionToEdit);
  const [activeLangTab, setActiveLangTab] = useState<'both' | 'en' | 'ne'>('both');

  // Metadata
  const [paper, setPaper] = useState<WrittenPaperCode>('Paper II: Governance Systems');
  const [subject, setSubject] = useState('Constitution & Fundamental Rights');
  const [postTarget, setPostTarget] = useState('Section Officer / Nayab Subba');
  const [marks, setMarks] = useState<WrittenQuestionMarks>(10);
  const [recommendedMinutes, setRecommendedMinutes] = useState<number>(18);
  const [questionType, setQuestionType] = useState<WrittenQuestionType>('Long Analytical');
  const [sourcePath, setSourcePath] = useState('');
  const [sourceTitle, setSourceTitle] = useState('');
  const [forceCustomSourcePath, setForceCustomSourcePath] = useState(false);

  // English Content
  const [enTitle, setEnTitle] = useState('');
  const [enMarksAllocation, setEnMarksAllocation] = useState('10 Marks');
  const [enQuestion, setEnQuestion] = useState('');
  const [enIntroduction, setEnIntroduction] = useState('');
  const [enSections, setEnSections] = useState<BilingualSection[]>([
    { heading: 'Key Analytical Points & Statutory Breakdown', points: [''] },
  ]);
  const [enConclusion, setEnConclusion] = useState('');

  // Nepali Content
  const [neTitle, setNeTitle] = useState('');
  const [neMarksAllocation, setNeMarksAllocation] = useState('१० अङ्क');
  const [neQuestion, setNeQuestion] = useState('');
  const [neIntroduction, setNeIntroduction] = useState('');
  const [neSections, setNeSections] = useState<BilingualSection[]>([
    { heading: 'मुख्य विश्लेषण तथा बुँदागत विवेचना', points: [''] },
  ]);
  const [neConclusion, setNeConclusion] = useState('');

  // Rubric
  const [rubrics, setRubrics] = useState<BilingualRubricPoint[]>([
    { en: '', ne: '' },
  ]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Snapshot live written question bank when modal opens
  const liveBank = useMemo(() => {
    if (!isOpen) return [];
    return questionStorageService.loadWrittenQuestions();
  }, [isOpen]);

  const subjectOptions = useMemo<SearchSelectOption[]>(() => {
    const counts = new Map<string, number>();
    for (const q of liveBank) {
      if (q.subject) {
        counts.set(q.subject, (counts.get(q.subject) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries()).map(([subj, count]) => ({
      value: subj,
      label: subj,
      badge: `${count} Qs`,
    }));
  }, [liveBank]);

  const postTargetOptions = useMemo<SearchSelectOption[]>(() => {
    const vals = Array.from(
      new Set([
        'Section Officer / Nayab Subba',
        'Section Officer / Nayab Subba / Kharidar',
        'Nayab Subba / Kharidar / Section Officer',
        'Section Officer (Gazetted III)',
        ...liveBank.map((q) => q.postTarget).filter(Boolean),
      ])
    );
    return vals.map((v) => ({ value: v, label: v }));
  }, [liveBank]);

  const liveMaterials = useMemo(() => {
    if (!isOpen) return [];
    return materialStorageService.loadMaterialCategories();
  }, [isOpen]);

  const materialOptions = useMemo<SearchSelectOption[]>(() => {
    const items: SearchSelectOption[] = [];
    const seenPaths = new Set<string>();
    for (const cat of liveMaterials) {
      for (const item of cat.items) {
        if (!item.path || seenPaths.has(item.path)) continue;
        seenPaths.add(item.path);
        items.push({
          value: item.path,
          label: item.title,
          description: `${cat.name} · ${item.codeOrEdition}`,
        });
      }
    }
    items.push({
      value: CUSTOM_SOURCE_SENTINEL,
      label: '+ Custom Source PDF URL / Path...',
      description: 'Link to an external official PDF or custom /materials/ path',
    });
    return items;
  }, [liveMaterials]);

  const isKnownMaterialPath = useMemo(() => {
    if (!sourcePath) return false;
    return liveMaterials.some((c) =>
      c.items.some((i) => i.path === sourcePath)
    );
  }, [sourcePath, liveMaterials]);

  const showCustomSourceInput =
    forceCustomSourcePath || (Boolean(sourcePath.trim()) && !isKnownMaterialPath);

  useEffect(() => {
    if (!isOpen) return;

    if (questionToEdit) {
      setPaper(questionToEdit.paper || 'Paper II: Governance Systems');
      setSubject(questionToEdit.subject || 'Constitution & Fundamental Rights');
      setPostTarget(questionToEdit.postTarget || 'Section Officer / Nayab Subba');
      setMarks(questionToEdit.marks || 10);
      setRecommendedMinutes(
        questionToEdit.recommendedMinutes || (questionToEdit.marks === 5 ? 9 : 18)
      );
      setQuestionType(questionToEdit.questionType || 'Long Analytical');
      setSourcePath(questionToEdit.sourcePath || '');
      setSourceTitle(questionToEdit.sourceTitle || '');
      setForceCustomSourcePath(false);

      setEnTitle(questionToEdit.en?.title || '');
      setEnMarksAllocation(
        questionToEdit.en?.marksAllocation || `${questionToEdit.marks || 10} Marks`
      );
      setEnQuestion(questionToEdit.en?.question || '');
      setEnIntroduction(questionToEdit.en?.introduction || '');
      setEnSections(
        cloneSections(
          questionToEdit.en?.sections,
          'Key Analytical Points & Statutory Breakdown'
        )
      );
      setEnConclusion(questionToEdit.en?.conclusion || '');

      setNeTitle(questionToEdit.ne?.title || '');
      setNeMarksAllocation(
        questionToEdit.ne?.marksAllocation ||
          `${questionToEdit.marks === 5 ? '५' : '१०'} अङ्क`
      );
      setNeQuestion(questionToEdit.ne?.question || '');
      setNeIntroduction(questionToEdit.ne?.introduction || '');
      setNeSections(
        cloneSections(
          questionToEdit.ne?.sections,
          'मुख्य विश्लेषण तथा बुँदागत विवेचना'
        )
      );
      setNeConclusion(questionToEdit.ne?.conclusion || '');

      if (questionToEdit.rubric && questionToEdit.rubric.length > 0) {
        setRubrics(
          questionToEdit.rubric.map((r) =>
            typeof r === 'string'
              ? { en: r, ne: '' }
              : { en: r.en || '', ne: r.ne || '' }
          )
        );
      } else {
        setRubrics([{ en: '', ne: '' }]);
      }
    } else {
      const defaultMat =
        liveMaterials.flatMap((c) => c.items).find(
          (i) => i.id === 'law-constitution-2072'
        ) || liveMaterials[0]?.items[0];

      setPaper('Paper II: Governance Systems');
      setSubject('Constitution & Fundamental Rights');
      setPostTarget('Section Officer / Nayab Subba');
      setMarks(10);
      setRecommendedMinutes(18);
      setQuestionType('Long Analytical');
      setSourcePath(defaultMat?.path || '/materials/constitution-of-nepal-2072.pdf');
      setSourceTitle(
        defaultMat?.title || 'Constitution of Nepal (2072) — Core Articles & Rights'
      );
      setForceCustomSourcePath(false);

      setEnTitle('');
      setEnMarksAllocation('10 Marks');
      setEnQuestion('');
      setEnIntroduction('');
      setEnSections([
        {
          heading: 'Core Constitutional & Statutory Provisions',
          points: [''],
        },
        {
          heading: 'Practical Challenges & Reform Measures',
          points: [''],
        },
      ]);
      setEnConclusion('');

      setNeTitle('');
      setNeMarksAllocation('१० अङ्क');
      setNeQuestion('');
      setNeIntroduction('');
      setNeSections([
        {
          heading: 'संवैधानिक तथा कानुनी व्यवस्थाहरू',
          points: [''],
        },
        {
          heading: 'व्यावहारिक चुनौती र सुधारका उपायहरू',
          points: [''],
        },
      ]);
      setNeConclusion('');

      setRubrics([
        {
          en: 'Clearly state statutory definitions and foundational concept.',
          ne: 'कानुनी तथा सैद्धान्तिक परिभाषा स्पष्ट रूपमा प्रस्तुत गरिएको ।',
        },
        {
          en: 'Analyze key institutional and policy bottlenecks with examples.',
          ne: 'व्यावहारिक समस्या र संस्थागत कमजोरीहरूको वस्तुपरक विश्लेषण ।',
        },
        {
          en: 'Offer concrete and actionable forward-looking recommendations.',
          ne: 'व्यावहारिक र कार्यान्वयनयोग्य सुधारका उपायहरू प्रस्तुत गरिएको ।',
        },
      ]);
    }
    setErrorMsg(null);
  }, [questionToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSourceSelect = (nextVal: string) => {
    if (nextVal === CUSTOM_SOURCE_SENTINEL) {
      setForceCustomSourcePath(true);
      if (isKnownMaterialPath) {
        setSourcePath('');
      }
      return;
    }
    setForceCustomSourcePath(false);
    setSourcePath(nextVal);
    const matched = liveMaterials.flatMap((c) => c.items).find(
      (i) => i.path === nextVal
    );
    if (matched) {
      setSourceTitle(matched.title);
    }
  };

  // Section Builder Helpers
  const handleAddSection = (lang: 'en' | 'ne') => {
    const updater = lang === 'en' ? setEnSections : setNeSections;
    updater((prev) => [
      ...prev,
      {
        heading:
          lang === 'en'
            ? `Analytical Section ${prev.length + 1}`
            : `विश्लेषण खण्ड ${prev.length + 1}`,
        points: [''],
      },
    ]);
  };

  const handleRemoveSection = (lang: 'en' | 'ne', sIdx: number) => {
    const updater = lang === 'en' ? setEnSections : setNeSections;
    updater((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== sIdx)));
  };

  const handleUpdateSectionHeading = (
    lang: 'en' | 'ne',
    sIdx: number,
    heading: string
  ) => {
    const updater = lang === 'en' ? setEnSections : setNeSections;
    updater((prev) =>
      prev.map((sec, idx) => (idx === sIdx ? { ...sec, heading } : sec))
    );
  };

  const handleAddSectionPoint = (lang: 'en' | 'ne', sIdx: number) => {
    const updater = lang === 'en' ? setEnSections : setNeSections;
    updater((prev) =>
      prev.map((sec, idx) =>
        idx === sIdx ? { ...sec, points: [...sec.points, ''] } : sec
      )
    );
  };

  const handleUpdateSectionPoint = (
    lang: 'en' | 'ne',
    sIdx: number,
    pIdx: number,
    value: string
  ) => {
    const updater = lang === 'en' ? setEnSections : setNeSections;
    updater((prev) =>
      prev.map((sec, idx) =>
        idx === sIdx
          ? {
              ...sec,
              points: sec.points.map((pt, i) => (i === pIdx ? value : pt)),
            }
          : sec
      )
    );
  };

  const handleRemoveSectionPoint = (
    lang: 'en' | 'ne',
    sIdx: number,
    pIdx: number
  ) => {
    const updater = lang === 'en' ? setEnSections : setNeSections;
    updater((prev) =>
      prev.map((sec, idx) => {
        if (idx !== sIdx || sec.points.length <= 1) return sec;
        return { ...sec, points: sec.points.filter((_, i) => i !== pIdx) };
      })
    );
  };

  const handleAddRubric = () => {
    setRubrics([...rubrics, { en: '', ne: '' }]);
  };

  const handleRemoveRubric = (index: number) => {
    if (rubrics.length <= 1) return;
    setRubrics(rubrics.filter((_, i) => i !== index));
  };

  const handleUpdateRubric = (index: number, lang: 'en' | 'ne', value: string) => {
    const next = [...rubrics];
    next[index] = { ...next[index], [lang]: value };
    setRubrics(next);
  };

  const normalizeSections = (
    raw: BilingualSection[],
    fallbackHeading: string,
    fallbackPoints: string[]
  ): BilingualSection[] => {
    const valid = raw
      .map((sec) => ({
        heading: sec.heading.trim(),
        points: sec.points.map((p) => p.trim()).filter(Boolean),
      }))
      .filter((sec) => sec.heading.length > 0 && sec.points.length > 0);

    if (valid.length > 0) return valid;
    return [
      {
        heading: fallbackHeading,
        points:
          fallbackPoints.filter(Boolean).length > 0
            ? fallbackPoints.filter(Boolean)
            : [fallbackHeading],
      },
    ];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!subject.trim()) {
      setErrorMsg('Please select or enter a Subject.');
      return;
    }

    if (!postTarget.trim()) {
      setErrorMsg('Please select or enter a Target Cadre.');
      return;
    }

    if (!enTitle.trim() && !neTitle.trim()) {
      setErrorMsg('Please provide a title for the written question.');
      return;
    }

    if (!enQuestion.trim() && !neQuestion.trim()) {
      setErrorMsg('Please provide the problem statement or prompt for the question.');
      return;
    }

    if (!sourcePath.trim()) {
      setErrorMsg('Please select a source PDF or enter a valid custom PDF path.');
      return;
    }

    if (!sourceTitle.trim()) {
      setErrorMsg('Please provide a Source Citation Label for this written question.');
      return;
    }

    const filteredRubrics = rubrics
      .filter((r) => r.en.trim() || r.ne.trim())
      .map((r) => ({
        en: r.en.trim() || r.ne.trim(),
        ne: r.ne.trim() || r.en.trim(),
      }));

    if (filteredRubrics.length === 0) {
      setErrorMsg('Please specify at least one rubric point.');
      return;
    }

    const titleEn = enTitle.trim() || neTitle.trim();
    const titleNe = neTitle.trim() || enTitle.trim();
    const qTextEn = enQuestion.trim() || neQuestion.trim();
    const qTextNe = neQuestion.trim() || enQuestion.trim();

    const cleanEnSections = normalizeSections(
      enSections,
      'Key Analytical Points & Breakdown',
      filteredRubrics.map((r) => r.en)
    );
    const cleanNeSections = normalizeSections(
      neSections,
      'मुख्य विश्लेषण तथा बुँदागत विवेचना',
      filteredRubrics.map((r) => r.ne)
    );

    const finalQuestion: WrittenQuestion = {
      id: questionToEdit
        ? questionToEdit.id
        : `PSC-WR-${Date.now().toString().slice(-5)}`,
      paper,
      subject: subject.trim(),
      postTarget: postTarget.trim(),
      marks,
      recommendedMinutes: Math.min(
        120,
        Math.max(1, Math.round(Number(recommendedMinutes) || (marks === 5 ? 9 : 18)))
      ),
      questionType,
      sourceTitle: sourceTitle.trim(),
      sourcePath: sourcePath.trim(),
      en: {
        title: titleEn,
        question: qTextEn,
        marksAllocation: enMarksAllocation.trim() || `${marks} Marks`,
        introduction: enIntroduction.trim() || qTextEn,
        sections: cleanEnSections,
        conclusion:
          enConclusion.trim() ||
          'Holistic reform and institutional accountability are essential for constitutional service delivery.',
      },
      ne: {
        title: titleNe,
        question: qTextNe,
        marksAllocation:
          neMarksAllocation.trim() || `${marks === 5 ? '५' : '१०'} अङ्क`,
        introduction: neIntroduction.trim() || qTextNe,
        sections: cleanNeSections,
        conclusion:
          neConclusion.trim() ||
          'संस्थागत सुदृढीकरण र कानुनको प्रभावकारी कार्यान्वयन आजको आवश्यकता हो ।',
      },
      rubric: filteredRubrics,
    };

    onSave(finalQuestion);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="written-form-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-4xl min-w-0 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 z-10 space-y-5 my-8 max-h-[90vh] overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-crimson-50 dark:bg-crimson-950/60 text-crimson-600 dark:text-crimson-400 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3
                id="written-form-modal-title"
                className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50"
              >
                {isEditing
                  ? `Edit Written Question (${questionToEdit?.id})`
                  : 'Create New Written Question'}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Full Stage II Subjective Schema synced directly with /written catalog, timed studio &amp; evaluator
              </p>
            </div>
          </div>
          <ActionButton
            icon={X}
            title="Close modal"
            color="zinc"
            variant="ghost"
            size="xs"
            onClick={onClose}
          />
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Classification & Timing Metadata */}
          <div className="space-y-3 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              1. Paper, Subject, Target Cadre &amp; Exam Pacing
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 truncate">
                  PSC Written Paper <span className="text-crimson-600">*</span>
                </label>
                <SharedSearchSelect
                  options={PAPER_OPTIONS}
                  value={paper}
                  onChange={(val) => setPaper(val as WrittenPaperCode)}
                  size="sm"
                  className="w-full"
                  popoverWidth="w-full"
                  searchPlaceholder="Search paper..."
                />
              </div>

              <SelectOrCustomField
                label="Subject / Syllabus Domain"
                required
                value={subject}
                onChange={setSubject}
                options={subjectOptions}
                placeholder="Select subject..."
                customPlaceholder="e.g. Constitutional Law & Public Policy"
                searchPlaceholder="Search written subjects..."
                customOptionLabel="+ Add custom subject..."
                focusRingClass="focus:ring-crimson-600"
              />

              <SelectOrCustomField
                label="Target Cadre (postTarget)"
                required
                value={postTarget}
                onChange={setPostTarget}
                options={postTargetOptions}
                placeholder="Select target cadre..."
                customPlaceholder="e.g. Section Officer / Nayab Subba"
                searchPlaceholder="Search target cadres..."
                customOptionLabel="+ Add custom cadre..."
                focusRingClass="focus:ring-crimson-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 truncate">
                  Marks Weightage <span className="text-crimson-600">*</span>
                </label>
                <SharedSearchSelect
                  options={MARKS_OPTIONS}
                  value={String(marks)}
                  onChange={(val) => {
                    const m = Number(val) as WrittenQuestionMarks;
                    setMarks(m);
                    setRecommendedMinutes(m === 5 ? 9 : 18);
                    setEnMarksAllocation(`${m} Marks`);
                    setNeMarksAllocation(`${m === 5 ? '५' : '१०'} अङ्क`);
                  }}
                  size="sm"
                  enableSearch={false}
                  className="w-full"
                  popoverWidth="w-full"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 truncate">
                  Question Type <span className="text-crimson-600">*</span>
                </label>
                <SharedSearchSelect
                  options={QUESTION_TYPE_OPTIONS}
                  value={questionType}
                  onChange={(val) => setQuestionType(val as WrittenQuestionType)}
                  size="sm"
                  enableSearch={false}
                  className="w-full"
                  popoverWidth="w-full"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 truncate">
                  Recommended Time (Minutes) <span className="text-crimson-600">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={recommendedMinutes}
                  onChange={(e) => setRecommendedMinutes(Number(e.target.value))}
                  className="w-full h-8 sm:h-9 text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-crimson-600"
                />
              </div>
            </div>
          </div>

          {/* 2. Linked Study Document & Citation */}
          <div className="space-y-3 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              2. Linked Source PDF &amp; Citation (Read Source PDF Button)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="min-w-0 space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Source Reading Material PDF <span className="text-crimson-600">*</span>
                </label>
                <SharedSearchSelect
                  options={materialOptions}
                  value={
                    showCustomSourceInput ? CUSTOM_SOURCE_SENTINEL : sourcePath
                  }
                  onChange={handleSourceSelect}
                  size="sm"
                  className="w-full"
                  popoverWidth="w-full"
                  searchPlaceholder="Search reading materials..."
                />
                {showCustomSourceInput && (
                  <input
                    type="text"
                    placeholder="https://... or /materials/document.pdf"
                    value={sourcePath}
                    onChange={(e) => setSourcePath(e.target.value)}
                    className="w-full text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-crimson-600"
                  />
                )}
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Source Citation Label <span className="text-crimson-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Constitution of Nepal (2072) — Part 3"
                  value={sourceTitle}
                  onChange={(e) => setSourceTitle(e.target.value)}
                  className="w-full h-8 sm:h-9 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-crimson-600"
                />
              </div>
            </div>
          </div>

          {/* Language Toggle Tab */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pt-1 pb-2">
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              3. Bilingual Question, Model Answer Structure &amp; Conclusion (EN &amp; नेपाली)
            </span>
            <div className="inline-flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs">
              {(
                [
                  { id: 'both', label: 'Side-by-Side (Both)' },
                  { id: 'en', label: 'English Only' },
                  { id: 'ne', label: 'नेपाली Only' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveLangTab(tab.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    activeLangTab === tab.id
                      ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bilingual Question Prompts & Model Answers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(activeLangTab === 'both' || activeLangTab === 'en') && (
              <div
                className={`space-y-3 p-3.5 rounded-xl border border-blue-200/70 dark:border-blue-900/40 bg-blue-50/20 dark:bg-blue-950/10 ${
                  activeLangTab === 'en' ? 'md:col-span-2' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
                    English Content &amp; Model Solution
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">EN</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      English Title <span className="text-crimson-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Good Governance and Public Service Delivery"
                      value={enTitle}
                      onChange={(e) => setEnTitle(e.target.value)}
                      className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      Marks Split Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3 + 4 + 3 = 10 Marks"
                      value={enMarksAllocation}
                      onChange={(e) => setEnMarksAllocation(e.target.value)}
                      className="w-full text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    English Problem Statement / Question Prompt <span className="text-crimson-600">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="State the analytical question..."
                    value={enQuestion}
                    onChange={(e) => setEnQuestion(e.target.value)}
                    className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    English Introduction (Model Framing)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Key concepts, constitutional articles, statutory context..."
                    value={enIntroduction}
                    onChange={(e) => setEnIntroduction(e.target.value)}
                    className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* English Model Sections Builder */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                      Body Analytical Sections ({enSections.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddSection('en')}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-blue-200 dark:border-blue-900 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      Add Section
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {enSections.map((sec, sIdx) => (
                      <div
                        key={`en-sec-${sIdx}`}
                        className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder={`Section ${sIdx + 1} Heading...`}
                            value={sec.heading}
                            onChange={(e) =>
                              handleUpdateSectionHeading('en', sIdx, e.target.value)
                            }
                            className="flex-1 text-xs font-semibold rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
                          />
                          {enSections.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSection('en', sIdx)}
                              title="Remove section"
                              className="p-1 rounded text-zinc-400 hover:text-red-600 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-1.5 pl-2 border-l-2 border-blue-200 dark:border-blue-900">
                          {sec.points.map((pt, pIdx) => (
                            <div key={`en-sec-${sIdx}-pt-${pIdx}`} className="flex items-start gap-1.5">
                              <textarea
                                rows={2}
                                placeholder={`Bullet point #${pIdx + 1}...`}
                                value={pt}
                                onChange={(e) =>
                                  handleUpdateSectionPoint('en', sIdx, pIdx, e.target.value)
                                }
                                className="flex-1 text-xs rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2 py-1 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
                              />
                              {sec.points.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSectionPoint('en', sIdx, pIdx)}
                                  title="Remove point"
                                  className="p-1 text-zinc-400 hover:text-red-600 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleAddSectionPoint('en', sIdx)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            Add Bullet Point
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    English Conclusion &amp; Way Forward
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Balanced policy synthesis and administrative way forward..."
                    value={enConclusion}
                    onChange={(e) => setEnConclusion(e.target.value)}
                    className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            )}

            {(activeLangTab === 'both' || activeLangTab === 'ne') && (
              <div
                className={`space-y-3 p-3.5 rounded-xl border border-crimson-200/70 dark:border-crimson-900/40 bg-crimson-50/20 dark:bg-crimson-950/10 ${
                  activeLangTab === 'ne' ? 'md:col-span-2' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-crimson-700 dark:text-crimson-400">
                    नेपाली खण्ड (Nepali Content &amp; Model Solution)
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">ने</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      नेपाली शीर्षक (Title)
                    </label>
                    <input
                      type="text"
                      lang="ne"
                      placeholder="उदा. सुशासन र सार्वजनिक सेवा प्रवाहका आयामहरू"
                      value={neTitle}
                      onChange={(e) => setNeTitle(e.target.value)}
                      className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-crimson-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      अङ्क विभाजन (Marks)
                    </label>
                    <input
                      type="text"
                      lang="ne"
                      placeholder="उदा. ३ + ४ + ३ = १० अङ्क"
                      value={neMarksAllocation}
                      onChange={(e) => setNeMarksAllocation(e.target.value)}
                      className="w-full text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-crimson-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    नेपाली प्रश्न व्यहोरा (Question Prompt)
                  </label>
                  <textarea
                    rows={3}
                    lang="ne"
                    placeholder="प्रश्न स्पष्ट रूपमा लेख्नुहोस्..."
                    value={neQuestion}
                    onChange={(e) => setNeQuestion(e.target.value)}
                    className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-crimson-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    नेपाली परिचय / सैद्धान्तिक अवधारणा
                  </label>
                  <textarea
                    rows={2}
                    lang="ne"
                    placeholder="संवैधानिक वा कानुनी पृष्ठभूमि..."
                    value={neIntroduction}
                    onChange={(e) => setNeIntroduction(e.target.value)}
                    className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-crimson-600"
                  />
                </div>

                {/* Nepali Model Sections Builder */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-crimson-600" />
                      मुख्य विश्लेषणात्मक खण्डहरू ({neSections.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddSection('ne')}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-crimson-700 dark:text-crimson-400 hover:bg-crimson-50 dark:hover:bg-crimson-950/40 border border-crimson-200 dark:border-crimson-900 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      खण्ड थप्नुहोस्
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {neSections.map((sec, sIdx) => (
                      <div
                        key={`ne-sec-${sIdx}`}
                        className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            lang="ne"
                            placeholder={`खण्ड ${sIdx + 1} शीर्षक...`}
                            value={sec.heading}
                            onChange={(e) =>
                              handleUpdateSectionHeading('ne', sIdx, e.target.value)
                            }
                            className="flex-1 text-xs font-semibold rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-crimson-600"
                          />
                          {neSections.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSection('ne', sIdx)}
                              title="Remove section"
                              className="p-1 rounded text-zinc-400 hover:text-red-600 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-1.5 pl-2 border-l-2 border-crimson-200 dark:border-crimson-900">
                          {sec.points.map((pt, pIdx) => (
                            <div key={`ne-sec-${sIdx}-pt-${pIdx}`} className="flex items-start gap-1.5">
                              <textarea
                                rows={2}
                                lang="ne"
                                placeholder={`बुँदा #${pIdx + 1}...`}
                                value={pt}
                                onChange={(e) =>
                                  handleUpdateSectionPoint('ne', sIdx, pIdx, e.target.value)
                                }
                                className="flex-1 text-xs rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2 py-1 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-crimson-600"
                              />
                              {sec.points.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSectionPoint('ne', sIdx, pIdx)}
                                  title="Remove point"
                                  className="p-1 text-zinc-400 hover:text-red-600 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleAddSectionPoint('ne', sIdx)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-crimson-600 dark:text-crimson-400 hover:underline cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            बुँदा थप्नुहोस्
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    नेपाली निष्कर्ष र आगामी बाटो (Conclusion)
                  </label>
                  <textarea
                    rows={2}
                    lang="ne"
                    placeholder="सन्तुलित निष्कर्ष र सुधारका व्यावहारिक मार्गचित्र..."
                    value={neConclusion}
                    onChange={(e) => setNeConclusion(e.target.value)}
                    className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-crimson-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 4. Rubric Points Builder */}
          <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  4. Scoring Rubric Points ({rubrics.length}) <span className="text-crimson-600">*</span>
                </label>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                  Key criteria examiners check when grading subjective answers.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddRubric}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-blue-200 dark:border-blue-900 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Rubric Point
              </button>
            </div>

            <div className="space-y-2.5">
              {rubrics.map((r, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40"
                >
                  <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-1">
                    {idx + 1}
                  </span>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder={`English point #${idx + 1}...`}
                      value={r.en}
                      onChange={(e) => handleUpdateRubric(idx, 'en', e.target.value)}
                      className="text-xs rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                    <input
                      type="text"
                      lang="ne"
                      placeholder={`नेपाली बुँदा #${idx + 1}...`}
                      value={r.ne}
                      onChange={(e) => handleUpdateRubric(idx, 'ne', e.target.value)}
                      className="text-xs rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-crimson-600"
                    />
                  </div>
                  {rubrics.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRubric(idx)}
                      title="Remove rubric point"
                      className="p-1 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer mt-0.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <ActionButton
              label="Cancel"
              title="Cancel changes and close"
              color="zinc"
              variant="outline"
              size="sm"
              onClick={onClose}
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-crimson-600 hover:bg-crimson-700 text-white shadow-xs cursor-pointer transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isEditing ? 'Save Changes' : 'Create Written Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
