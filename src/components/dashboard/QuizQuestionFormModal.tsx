import React, { useEffect, useMemo, useState } from 'react';
import { Check, CheckCircle2, HelpCircle, Languages, X } from 'lucide-react';
import {
  isLanguageOnlySubject,
  QUIZ_OPTION_KEYS,
  type QuizDifficulty,
  type QuizOptionKey,
  type QuizQuestion,
} from '../../data/quizData';
import { ActionButton } from '../common/ActionButton';
import { SharedSearchSelect } from '../common/SharedSearchSelect';

export interface QuizQuestionFormModalProps {
  isOpen: boolean;
  questionToEdit?: QuizQuestion | null;
  onClose: () => void;
  onSave: (question: QuizQuestion) => void;
}

const BASE_SUBJECT_OPTIONS = [
  { value: 'Geography of Nepal', label: 'Geography of Nepal (Bilingual EN/NE)' },
  { value: 'History & Culture of Nepal', label: 'History & Culture of Nepal (Bilingual EN/NE)' },
  { value: 'Constitution & Governance', label: 'Constitution & Governance (Bilingual EN/NE)' },
  { value: 'Public Administration & Law', label: 'Public Administration & Law (Bilingual EN/NE)' },
  { value: 'Development Planning', label: 'Development Planning (Bilingual EN/NE)' },
  { value: 'General Mental Ability (IQ)', label: 'General Mental Ability / IQ (Bilingual EN/NE)' },
  { value: 'English', label: 'English (English Only)' },
  { value: 'Nepali', label: 'Nepali / नेपाली (Nepali Only)' },
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

  const [subject, setSubject] = useState('Geography of Nepal');
  const [topic, setTopic] = useState('');
  const [subtopic, setSubtopic] = useState('');
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('Medium');
  const [marks, setMarks] = useState<number>(2);
  const [questionText, setQuestionText] = useState('');
  const [questionNe, setQuestionNe] = useState('');
  const [options, setOptions] = useState<Record<QuizOptionKey, string>>({
    A: '',
    B: '',
    C: '',
    D: '',
  });
  const [optionsNe, setOptionsNe] = useState<Record<QuizOptionKey, string>>({
    A: '',
    B: '',
    C: '',
    D: '',
  });
  const [correctOptions, setCorrectOptions] = useState<QuizOptionKey[]>(['A']);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [explanationNe, setExplanationNe] = useState('');
  const [sourceTitle, setSourceTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const languageOnlyMode = isLanguageOnlySubject(subject); // 'en' | 'ne' | null
  const isBilingualSubject = languageOnlyMode === null;

  const subjectOptions = useMemo(() => {
    if (
      questionToEdit?.subject &&
      !BASE_SUBJECT_OPTIONS.some((opt) => opt.value === questionToEdit.subject)
    ) {
      return [
        {
          value: questionToEdit.subject,
          label: `${questionToEdit.subject} (Bilingual EN/NE)`,
        },
        ...BASE_SUBJECT_OPTIONS,
      ];
    }
    return BASE_SUBJECT_OPTIONS;
  }, [questionToEdit?.subject]);

  // Populate on open or question change
  useEffect(() => {
    if (questionToEdit) {
      setSubject(questionToEdit.subject || 'Geography of Nepal');
      setTopic(questionToEdit.topic || '');
      setSubtopic(questionToEdit.subtopic || '');
      setDifficulty(questionToEdit.difficulty || 'Medium');
      setMarks(questionToEdit.marks || 2);
      setQuestionText(questionToEdit.question || '');
      setQuestionNe(questionToEdit.questionNe || '');

      const optMap: Record<QuizOptionKey, string> = { A: '', B: '', C: '', D: '' };
      const optNeMap: Record<QuizOptionKey, string> = { A: '', B: '', C: '', D: '' };
      questionToEdit.options.forEach((opt) => {
        if (opt.key in optMap) {
          optMap[opt.key] = opt.text;
          optNeMap[opt.key] = opt.textNe || '';
        }
      });
      setOptions(optMap);
      setOptionsNe(optNeMap);
      setCorrectOptions(
        questionToEdit.correct_options.length > 0 ? questionToEdit.correct_options : ['A']
      );
      setIsMultiSelect(Boolean(questionToEdit.is_multi_select));
      setExplanation(questionToEdit.explanation || '');
      setExplanationNe(questionToEdit.explanationNe || '');
      setSourceTitle(questionToEdit.sourceTitle || '');
    } else {
      // Default blank template
      setSubject('Geography of Nepal');
      setTopic('General Overview');
      setSubtopic('Core Context');
      setDifficulty('Medium');
      setMarks(1);
      setQuestionText('');
      setQuestionNe('');
      setOptions({ A: '', B: '', C: '', D: '' });
      setOptionsNe({ A: '', B: '', C: '', D: '' });
      setCorrectOptions(['A']);
      setIsMultiSelect(false);
      setExplanation('');
      setExplanationNe('');
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
      setErrorMsg(
        languageOnlyMode === 'ne'
          ? 'Nepali question prompt cannot be empty.'
          : 'Question prompt cannot be empty.'
      );
      return;
    }

    if (isBilingualSubject && !questionNe.trim()) {
      setErrorMsg(
        'Nepali translation of the question prompt (प्रश्न नेपालीमा) is required for non-language categories.'
      );
      return;
    }

    const filledOptions = QUIZ_OPTION_KEYS.filter((k) => options[k].trim().length > 0);
    if (filledOptions.length < 2) {
      setErrorMsg('Please provide at least 2 options for the question.');
      return;
    }

    if (isBilingualSubject) {
      for (const k of filledOptions) {
        if (!optionsNe[k].trim()) {
          setErrorMsg(
            `Please provide the Nepali translation for Option ${k} (विकल्प ${k}).`
          );
          return;
        }
      }
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

    if (isBilingualSubject && !explanationNe.trim()) {
      setErrorMsg(
        'Please provide the Nepali rationale/explanation (व्याख्या नेपालीमा) for this bilingual category.'
      );
      return;
    }

    const compiledOptions = QUIZ_OPTION_KEYS.map((k) => ({
      key: k,
      text: options[k].trim() || (languageOnlyMode === 'ne' ? `विकल्प ${k}` : `Option ${k}`),
      ...(isBilingualSubject && optionsNe[k].trim()
        ? { textNe: optionsNe[k].trim() }
        : {}),
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
      ...(isBilingualSubject ? { questionNe: questionNe.trim() } : {}),
      options: compiledOptions,
      correct_options: correctOptions,
      is_multi_select: isMultiSelect,
      explanation: explanation.trim(),
      ...(isBilingualSubject ? { explanationNe: explanationNe.trim() } : {}),
      difficulty,
      marks: Number(marks) || 1,
      sourceTitle: sourceTitle.trim() || undefined,
      sourcePath: questionToEdit?.sourcePath,
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

        {/* Language Rule Notice */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 text-xs text-blue-900 dark:text-blue-200">
          <Languages className="w-4 h-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
          <div>
            {languageOnlyMode === 'en' ? (
              <span>
                <strong>English Category Mode:</strong> Questions, answer options, and explanations are stored and displayed <strong>exclusively in English</strong>.
              </span>
            ) : languageOnlyMode === 'ne' ? (
              <span lang="ne">
                <strong>नेपाली विषय मोड:</strong> यस श्रेणीका प्रश्न, विकल्प र व्याख्या <strong>नेपाली भाषामा मात्र</strong> राखिन्छन् र देखाइन्छन्।
              </span>
            ) : (
              <span>
                <strong>Bilingual Mode (English &amp; नेपाली):</strong> Provide questions, options, and explanations in <strong>both English and Nepali</strong>.
              </span>
            )}
          </div>
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
                options={subjectOptions}
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
          <div className={isBilingualSubject ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'space-y-2'}>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                {languageOnlyMode === 'ne'
                  ? 'Question Prompt (नेपालीमा मात्र)'
                  : isBilingualSubject
                    ? 'Question Prompt (English)'
                    : 'Question Prompt (English Only)'}{' '}
                <span className="text-crimson-600">*</span>
              </label>
              <textarea
                required
                rows={3}
                lang={languageOnlyMode === 'ne' ? 'ne' : undefined}
                placeholder={
                  languageOnlyMode === 'ne'
                    ? 'नेपाली भाषामा आधिकारिक वस्तुगत प्रश्न लेख्नुहोस्...'
                    : 'Enter official objective question stem in English...'
                }
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
              />
            </div>

            {isBilingualSubject && (
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Question Prompt (नेपाली) <span className="text-crimson-600">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  lang="ne"
                  placeholder="नेपालीमा वस्तुगत प्रश्न लेख्नुहोस्..."
                  value={questionNe}
                  onChange={(e) => setQuestionNe(e.target.value)}
                  className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
                />
              </div>
            )}
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
                    className={`flex items-start gap-2.5 p-2 rounded-lg border transition-colors ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleCorrectOption(k)}
                      title={`Mark Option ${k} as ${isSelected ? 'incorrect' : 'correct'}`}
                      className={`mt-0.5 w-7 h-7 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : k}
                    </button>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <input
                        type="text"
                        lang={languageOnlyMode === 'ne' ? 'ne' : undefined}
                        placeholder={
                          languageOnlyMode === 'ne'
                            ? `विकल्प ${k} (नेपालीमा)...`
                            : isBilingualSubject
                              ? `Option ${k} (English)...`
                              : `Text for Option ${k}...`
                        }
                        value={options[k]}
                        onChange={(e) =>
                          setOptions({ ...options, [k]: e.target.value })
                        }
                        className="w-full text-xs bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 rounded px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />

                      {isBilingualSubject && (
                        <input
                          type="text"
                          lang="ne"
                          placeholder={`विकल्प ${k} (नेपालीमा)...`}
                          value={optionsNe[k]}
                          onChange={(e) =>
                            setOptionsNe({ ...optionsNe, [k]: e.target.value })
                          }
                          className="w-full text-xs bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-700/80 rounded px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 pt-1.5 pr-1 shrink-0">
                      {isSelected ? 'Correct' : 'Distractor'}
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
          <div className={isBilingualSubject ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'space-y-2'}>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                {languageOnlyMode === 'ne'
                  ? 'आधिकारिक व्याख्या (नेपालीमा मात्र)'
                  : isBilingualSubject
                    ? 'Official Rationale & Explanation (English)'
                    : 'Official Rationale & Explanation (English Only)'}{' '}
                <span className="text-crimson-600">*</span>
              </label>
              <textarea
                required
                rows={3}
                lang={languageOnlyMode === 'ne' ? 'ne' : undefined}
                placeholder={
                  languageOnlyMode === 'ne'
                    ? 'व्याकरणिक नियम वा सन्दर्भ सहित नेपालीमा व्याख्या लेख्नुहोस्...'
                    : 'Cite the statutory article, Act section, or factual background in English...'
                }
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {isBilingualSubject && (
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  आधिकारिक व्याख्या (नेपाली) <span className="text-crimson-600">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  lang="ne"
                  placeholder="संवैधानिक धारा, ऐन वा तथ्यसहित नेपालीमा व्याख्या लेख्नुहोस्..."
                  value={explanationNe}
                  onChange={(e) => setExplanationNe(e.target.value)}
                  className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            )}
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
