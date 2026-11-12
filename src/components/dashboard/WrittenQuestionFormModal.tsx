import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  FileText,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import type {
  BilingualRubricPoint,
  WrittenPaperCode,
  WrittenQuestion,
  WrittenQuestionMarks,
  WrittenQuestionType,
} from '../../data/writtenQuestionsData';
import { WRITTEN_PAPERS } from '../../data/writtenQuestionsData';
import { ActionButton } from '../common/ActionButton';
import { SharedSearchSelect } from '../common/SharedSearchSelect';

export interface WrittenQuestionFormModalProps {
  isOpen: boolean;
  questionToEdit?: WrittenQuestion | null;
  onClose: () => void;
  onSave: (question: WrittenQuestion) => void;
}

const PAPER_OPTIONS = WRITTEN_PAPERS.map((p) => ({ value: p, label: p }));

const QUESTION_TYPE_OPTIONS = [
  { value: 'Short Analytical', label: 'Short Analytical (5 Marks)' },
  { value: 'Long Analytical', label: 'Long Analytical (10 Marks)' },
  { value: 'Case Study', label: 'Case Study Analysis (10 Marks)' },
];

const MARKS_OPTIONS = [
  { value: '5', label: '5 Marks (Short Note / Analytical Concept)' },
  { value: '10', label: '10 Marks (Comprehensive Broad Case / Problem)' },
];

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
  const [subject, setSubject] = useState('');
  const [postTarget, setPostTarget] = useState('Section Officer / Nayab Subba');
  const [marks, setMarks] = useState<WrittenQuestionMarks>(10);
  const [recommendedMinutes, setRecommendedMinutes] = useState<number>(18);
  const [questionType, setQuestionType] = useState<WrittenQuestionType>('Long Analytical');
  const [sourceTitle, setSourceTitle] = useState('');

  // English Content
  const [enTitle, setEnTitle] = useState('');
  const [enQuestion, setEnQuestion] = useState('');
  const [enIntroduction, setEnIntroduction] = useState('');
  const [enConclusion, setEnConclusion] = useState('');

  // Nepali Content
  const [neTitle, setNeTitle] = useState('');
  const [neQuestion, setNeQuestion] = useState('');
  const [neIntroduction, setNeIntroduction] = useState('');
  const [neConclusion, setNeConclusion] = useState('');

  // Rubric
  const [rubrics, setRubrics] = useState<BilingualRubricPoint[]>([
    { en: '', ne: '' },
  ]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (questionToEdit) {
      setPaper(questionToEdit.paper || 'Paper II: Governance Systems');
      setSubject(questionToEdit.subject || '');
      setPostTarget(questionToEdit.postTarget || 'Section Officer / Nayab Subba');
      setMarks(questionToEdit.marks || 10);
      setRecommendedMinutes(questionToEdit.recommendedMinutes || (questionToEdit.marks === 5 ? 9 : 18));
      setQuestionType(questionToEdit.questionType || 'Long Analytical');
      setSourceTitle(questionToEdit.sourceTitle || '');

      setEnTitle(questionToEdit.en?.title || '');
      setEnQuestion(questionToEdit.en?.question || '');
      setEnIntroduction(questionToEdit.en?.introduction || '');
      setEnConclusion(questionToEdit.en?.conclusion || '');

      setNeTitle(questionToEdit.ne?.title || '');
      setNeQuestion(questionToEdit.ne?.question || '');
      setNeIntroduction(questionToEdit.ne?.introduction || '');
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
      setPaper('Paper II: Governance Systems');
      setSubject('Good Governance & Public Management');
      setPostTarget('Section Officer / Nayab Subba');
      setMarks(10);
      setRecommendedMinutes(18);
      setQuestionType('Long Analytical');
      setSourceTitle('Civil Service Act (2049) & Governance Regulations');

      setEnTitle('');
      setEnQuestion('');
      setEnIntroduction('');
      setEnConclusion('');

      setNeTitle('');
      setNeQuestion('');
      setNeIntroduction('');
      setNeConclusion('');

      setRubrics([
        { en: 'Clearly state statutory definitions and foundational concept.', ne: 'कानुनी तथा सैद्धान्तिक परिभाषा स्पष्ट रूपमा प्रस्तुत गरिएको ।' },
        { en: 'Analyze key institutional and policy bottlenecks with examples.', ne: 'व्यावहारिक समस्या र संस्थागत कमजोरीहरूको वस्तुपरक विश्लेषण ।' },
        { en: 'Offer concrete and actionable forward-looking recommendations.', ne: 'व्यावहारिक र कार्यान्वयनयोग्य सुधारका उपायहरू प्रस्तुत गरिएको ।' },
      ]);
    }
    setErrorMsg(null);
  }, [questionToEdit, isOpen]);

  if (!isOpen) return null;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!enTitle.trim() && !neTitle.trim()) {
      setErrorMsg('Please provide a title for the written question.');
      return;
    }

    if (!enQuestion.trim() && !neQuestion.trim()) {
      setErrorMsg('Please provide the problem statement or prompt for the question.');
      return;
    }

    const filteredRubrics = rubrics.filter((r) => r.en.trim() || r.ne.trim());
    if (filteredRubrics.length === 0) {
      setErrorMsg('Please specify at least one rubric point.');
      return;
    }

    const titleEn = enTitle.trim() || neTitle.trim();
    const titleNe = neTitle.trim() || enTitle.trim();
    const qTextEn = enQuestion.trim() || neQuestion.trim();
    const qTextNe = neQuestion.trim() || enQuestion.trim();

    const finalQuestion: WrittenQuestion = {
      id: questionToEdit ? questionToEdit.id : `PSC-WR-${Date.now().toString().slice(-5)}`,
      paper,
      subject: subject.trim() || 'General Lok Sewa Subject',
      postTarget: postTarget.trim(),
      marks,
      recommendedMinutes: Number(recommendedMinutes) || (marks === 5 ? 9 : 18),
      questionType,
      sourceTitle: sourceTitle.trim() || 'Official PSC Nepal Syllabus & Statutes',
      sourcePath: questionToEdit?.sourcePath || '/materials/constitution-of-nepal-2072.pdf',
      en: {
        title: titleEn,
        question: qTextEn,
        marksAllocation: `${marks} Marks`,
        introduction: enIntroduction.trim() || qTextEn,
        sections: questionToEdit?.en?.sections || [
          {
            heading: 'Key Analytical Points & Breakdown',
            points: filteredRubrics.map((r) => r.en || r.ne),
          },
        ],
        conclusion: enConclusion.trim() || 'Holistic reform and institutional accountability are essential.',
      },
      ne: {
        title: titleNe,
        question: qTextNe,
        marksAllocation: `${marks} अङ्क`,
        introduction: neIntroduction.trim() || qTextNe,
        sections: questionToEdit?.ne?.sections || [
          {
            heading: 'मुख्य विश्लेषण तथा बुँदागत विवेचना',
            points: filteredRubrics.map((r) => r.ne || r.en),
          },
        ],
        conclusion: neConclusion.trim() || 'संस्थागत सुदृढीकरण र कानुनको प्रभावकारी कार्यान्वयन आजको आवश्यकता हो ।',
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

      <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 z-10 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
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
                {isEditing ? `Edit Written Question (${questionToEdit?.id})` : 'Create New Written Question'}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Stage II Subjective Papers &amp; Analytical Rubrics
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Paper <span className="text-crimson-600">*</span>
              </label>
              <SharedSearchSelect
                options={PAPER_OPTIONS}
                value={paper}
                onChange={(val) => setPaper(val as WrittenPaperCode)}
                size="sm"
                searchPlaceholder="Search paper..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Subject / Syllabus Domain
              </label>
              <input
                type="text"
                placeholder="e.g. Constitutional Law & Public Policy"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-crimson-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Marks Weightage
              </label>
              <SharedSearchSelect
                options={MARKS_OPTIONS}
                value={String(marks)}
                onChange={(val) => {
                  const m = Number(val) as WrittenQuestionMarks;
                  setMarks(m);
                  setRecommendedMinutes(m === 5 ? 9 : 18);
                }}
                size="sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Question Type
              </label>
              <SharedSearchSelect
                options={QUESTION_TYPE_OPTIONS}
                value={questionType}
                onChange={(val) => setQuestionType(val as WrittenQuestionType)}
                size="sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Target Cadre
              </label>
              <input
                type="text"
                placeholder="e.g. Section Officer"
                value={postTarget}
                onChange={(e) => setPostTarget(e.target.value)}
                className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-crimson-600"
              />
            </div>
          </div>

          {/* Language Toggle Tab */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pt-1 pb-2">
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Bilingual Content (English &amp; नेपाली)
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
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
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

          {/* Bilingual Question Prompts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(activeLangTab === 'both' || activeLangTab === 'en') && (
              <div
                className={`space-y-3 ${
                  activeLangTab === 'en' ? 'md:col-span-2' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
                    English Section
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">EN</span>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    English Title
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
                    English Introduction Note (Model Rationale)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Key concepts, statutory context..."
                    value={enIntroduction}
                    onChange={(e) => setEnIntroduction(e.target.value)}
                    className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            )}

            {(activeLangTab === 'both' || activeLangTab === 'ne') && (
              <div
                className={`space-y-3 ${
                  activeLangTab === 'ne' ? 'md:col-span-2' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-crimson-700 dark:text-crimson-400">
                    नेपाली खण्ड (Nepali Section)
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">ने</span>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    नेपाली शीर्षक (Title)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. सुशासन र सार्वजनिक सेवा प्रवाहका आयामहरू"
                    value={neTitle}
                    onChange={(e) => setNeTitle(e.target.value)}
                    className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-crimson-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    नेपाली प्रश्न व्यहोरा (Question Prompt)
                  </label>
                  <textarea
                    rows={3}
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
                    placeholder="संवैधानिक वा कानुनी पृष्ठभूमि..."
                    value={neIntroduction}
                    onChange={(e) => setNeIntroduction(e.target.value)}
                    className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-crimson-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Rubric Points Builder */}
          <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Scoring Rubric Points ({rubrics.length}) <span className="text-crimson-600">*</span>
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
