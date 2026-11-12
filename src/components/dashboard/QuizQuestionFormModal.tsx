import React, { useEffect, useState } from 'react';
import { Check, CheckCircle2, HelpCircle, X } from 'lucide-react';
import type { QuizDifficulty, QuizOptionKey, QuizQuestion } from '../../data/quizData';
import { QUIZ_OPTION_KEYS } from '../../data/quizData';
import { ActionButton } from '../common/ActionButton';
import { SharedSearchSelect } from '../common/SharedSearchSelect';

export interface QuizQuestionFormModalProps {
  isOpen: boolean;
  questionToEdit?: QuizQuestion | null;
  onClose: () => void;
  onSave: (question: QuizQuestion) => void;
}

const SUBJECT_OPTIONS = [
  { value: 'General Knowledge', label: 'General Knowledge (GK)' },
  { value: 'IQ & Analytical', label: 'IQ & Analytical Ability' },
  { value: 'Public Administration', label: 'Public Administration & Management' },
  { value: 'Governance & Law', label: 'Governance & Administrative Law' },
  { value: 'Constitution & Rights', label: 'Constitution & Fundamental Rights' },
  { value: 'Economic Affairs', label: 'Economic Planning & Fiscal Governance' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'Easy', label: 'Easy (Recall & Direct Statutes)' },
  { value: 'Medium', label: 'Medium (Standard Examination Level)' },
  { value: 'Hard', label: 'Hard (Deep Analytical / Tricky)' },
];

export function QuizQuestionFormModal({
  isOpen,
  questionToEdit,
  onClose,
  onSave,
}: QuizQuestionFormModalProps) {
  const isEditing = Boolean(questionToEdit);

  const [subject, setSubject] = useState('General Knowledge');
  const [topic, setTopic] = useState('');
  const [subtopic, setSubtopic] = useState('');
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('Medium');
  const [marks, setMarks] = useState<number>(2);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<Record<QuizOptionKey, string>>({
    A: '',
    B: '',
    C: '',
    D: '',
  });
  const [correctOptions, setCorrectOptions] = useState<QuizOptionKey[]>(['A']);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [sourceTitle, setSourceTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Populate on open or question change
  useEffect(() => {
    if (questionToEdit) {
      setSubject(questionToEdit.subject || 'General Knowledge');
      setTopic(questionToEdit.topic || '');
      setSubtopic(questionToEdit.subtopic || '');
      setDifficulty(questionToEdit.difficulty || 'Medium');
      setMarks(questionToEdit.marks || 2);
      setQuestionText(questionToEdit.question || '');

      const optMap: Record<QuizOptionKey, string> = { A: '', B: '', C: '', D: '' };
      questionToEdit.options.forEach((opt) => {
        if (opt.key in optMap) optMap[opt.key] = opt.text;
      });
      setOptions(optMap);
      setCorrectOptions(
        questionToEdit.correct_options.length > 0 ? questionToEdit.correct_options : ['A']
      );
      setIsMultiSelect(Boolean(questionToEdit.is_multi_select));
      setExplanation(questionToEdit.explanation || '');
      setSourceTitle(questionToEdit.sourceTitle || '');
    } else {
      // Default blank template
      setSubject('General Knowledge');
      setTopic('General Overview');
      setSubtopic('Constitutional Context');
      setDifficulty('Medium');
      setMarks(2);
      setQuestionText('');
      setOptions({
        A: '',
        B: '',
        C: '',
        D: '',
      });
      setCorrectOptions(['A']);
      setIsMultiSelect(false);
      setExplanation('');
      setSourceTitle('Constitution of Nepal / Official Gazette');
    }
    setErrorMsg(null);
  }, [questionToEdit, isOpen]);

  if (!isOpen) return null;

  const handleToggleCorrectOption = (key: QuizOptionKey) => {
    if (isMultiSelect) {
      if (correctOptions.includes(key)) {
        if (correctOptions.length > 1) {
          setCorrectOptions(correctOptions.filter((k) => k !== key));
        }
      } else {
        setCorrectOptions([...correctOptions, key]);
      }
    } else {
      setCorrectOptions([key]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!questionText.trim()) {
      setErrorMsg('Question prompt cannot be empty.');
      return;
    }

    const filledOptions = QUIZ_OPTION_KEYS.filter((k) => options[k].trim().length > 0);
    if (filledOptions.length < 2) {
      setErrorMsg('Please provide at least 2 options for the question.');
      return;
    }

    if (correctOptions.length === 0) {
      setErrorMsg('Please select at least one correct answer option.');
      return;
    }

    for (const corr of correctOptions) {
      if (!options[corr].trim()) {
        setErrorMsg(`Selected correct option (${corr}) has no text.`);
        return;
      }
    }

    if (!explanation.trim()) {
      setErrorMsg('Please provide an official rationale or explanation.');
      return;
    }

    const compiledOptions = QUIZ_OPTION_KEYS.map((k) => ({
      key: k,
      text: options[k].trim() || `Option ${k}`,
    }));

    const finalQuestion: QuizQuestion = {
      id: questionToEdit ? questionToEdit.id : `PSC-MCQ-${Date.now().toString().slice(-6)}`,
      level: questionToEdit?.level || 'Gazetted Third Class',
      service: questionToEdit?.service || 'Nepal Administration Service',
      group: questionToEdit?.group || 'General Administration',
      post: questionToEdit?.post || 'Section Officer (Sakha Adhikrit)',
      paper: questionToEdit?.paper || 'Paper I: General Studies & IQ',
      subject: subject.trim(),
      topicId: questionToEdit?.topicId || 'custom-topic',
      topic: topic.trim() || 'General Overview',
      subtopicId: questionToEdit?.subtopicId || 'custom-subtopic',
      subtopic: subtopic.trim() || 'Core Analysis',
      question: questionText.trim(),
      options: compiledOptions,
      correct_options: correctOptions,
      is_multi_select: isMultiSelect,
      explanation: explanation.trim(),
      difficulty,
      marks: Number(marks) || 2,
      sourceTitle: sourceTitle.trim() || undefined,
    };

    onSave(finalQuestion);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-form-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 z-10 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3
                id="quiz-form-modal-title"
                className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50"
              >
                {isEditing ? `Edit MCQ Question (${questionToEdit?.id})` : 'Create New MCQ Question'}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Stage I Objective Preliminary Examination Question Database
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Subject
              </label>
              <SharedSearchSelect
                options={SUBJECT_OPTIONS}
                value={subject}
                onChange={setSubject}
                size="sm"
                searchPlaceholder="Search subjects..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Difficulty Level
              </label>
              <SharedSearchSelect
                options={DIFFICULTY_OPTIONS}
                value={difficulty}
                onChange={(val) => setDifficulty(val as QuizDifficulty)}
                size="sm"
                searchPlaceholder="Search difficulty..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Marks
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
                className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Topic
              </label>
              <input
                type="text"
                placeholder="e.g. Constitutional Law"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Subtopic
              </label>
              <input
                type="text"
                placeholder="e.g. Fundamental Rights"
                value={subtopic}
                onChange={(e) => setSubtopic(e.target.value)}
                className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Question Prompt <span className="text-crimson-600">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Enter official objective question stem..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
            />
          </div>

          {/* Options & Key Selector */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Options &amp; Correct Answer Key <span className="text-crimson-600">*</span>
              </label>
              <label className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMultiSelect}
                  onChange={(e) => {
                    setIsMultiSelect(e.target.checked);
                    if (!e.target.checked && correctOptions.length > 1) {
                      setCorrectOptions([correctOptions[0]]);
                    }
                  }}
                  className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                />
                Multiple correct options
              </label>
            </div>

            <div className="space-y-2">
              {QUIZ_OPTION_KEYS.map((k) => {
                const isSelected = correctOptions.includes(k);
                return (
                  <div
                    key={k}
                    className={`flex items-center gap-2 p-1.5 rounded-lg border transition-colors ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleCorrectOption(k)}
                      title={`Mark Option ${k} as ${isSelected ? 'incorrect' : 'correct'}`}
                      className={`w-7 h-7 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : k}
                    </button>
                    <input
                      type="text"
                      placeholder={`Text for Option ${k}...`}
                      value={options[k]}
                      onChange={(e) =>
                        setOptions({ ...options, [k]: e.target.value })
                      }
                      className="flex-1 text-xs bg-transparent border-0 px-2 py-1 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                    <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 pr-2">
                      {isSelected ? 'Correct Key' : 'Distractor'}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Click the letter badge on the left to set which option is the official answer key.
            </p>
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Official Rationale &amp; Explanation <span className="text-crimson-600">*</span>
            </label>
            <textarea
              required
              rows={2}
              placeholder="Cite the statutory article, Act section, or factual background that proves the correct answer..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Citation Source */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Source Document / Citation (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Nepal Parichaya 13th Edition, Page 142"
              value={sourceTitle}
              onChange={(e) => setSourceTitle(e.target.value)}
              className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
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
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isEditing ? 'Save Changes' : 'Create Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
