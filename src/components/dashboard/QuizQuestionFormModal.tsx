import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  HelpCircle,
  Languages,
  X,
} from 'lucide-react';
import {
  isLanguageOnlySubject,
  QUIZ_OPTION_KEYS,
  type QuizDifficulty,
  type QuizOptionKey,
  type QuizQuestion,
} from '../../data/quizData';
import { materialStorageService } from '../../services/materialStorageService';
import { questionStorageService } from '../../services/questionStorageService';
import { ActionButton } from '../common/ActionButton';
import {
  SharedSearchSelect,
  type SearchSelectOption,
} from '../common/SharedSearchSelect';
import { SelectOrCustomField } from './SelectOrCustomField';

export interface QuizQuestionFormModalProps {
  isOpen: boolean;
  questionToEdit?: QuizQuestion | null;
  onClose: () => void;
  onSave: (question: QuizQuestion) => void;
}

const DIFFICULTY_OPTIONS: SearchSelectOption[] = [
  { value: 'Easy', label: 'Easy (Recall & Direct Statutes)' },
  { value: 'Medium', label: 'Medium (Standard Examination Level)' },
  { value: 'Hard', label: 'Hard (Deep Analytical / Tricky)' },
];

const CUSTOM_SOURCE_SENTINEL = '__CUSTOM_SOURCE_PATH__';

function slugifyId(raw: string, fallback: string): string {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
  return cleaned || fallback;
}

export function QuizQuestionFormModal({
  isOpen,
  questionToEdit,
  onClose,
  onSave,
}: QuizQuestionFormModalProps) {
  const isEditing = Boolean(questionToEdit);

  // Taxonomy & Classification
  const [subject, setSubject] = useState('Geography of Nepal');
  const [topic, setTopic] = useState('');
  const [topicId, setTopicId] = useState('');
  const [subtopic, setSubtopic] = useState('');
  const [subtopicId, setSubtopicId] = useState('');
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('Medium');
  const [marks, setMarks] = useState<number>(1);
  const [paper, setPaper] = useState('Paper I: General Knowledge');
  const [level, setLevel] = useState('Gazetted Third Class');
  const [service, setService] = useState('Federal Civil Service preparation');
  const [group, setGroup] = useState('General Administration');
  const [post, setPost] = useState('Section Officer / Nayab Subba target');

  // Content
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

  // Citation & PDF Linkage
  const [sourcePath, setSourcePath] = useState('');
  const [sourceTitle, setSourceTitle] = useState('');
  const [forceCustomSourcePath, setForceCustomSourcePath] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Snapshot live question bank whenever modal opens so options reflect latest website taxonomy
  const liveBank = useMemo(() => {
    if (!isOpen) return [];
    return questionStorageService.loadQuizQuestions();
  }, [isOpen]);

  const languageOnlyMode = isLanguageOnlySubject(subject); // 'en' | 'ne' | null
  const isBilingualSubject = languageOnlyMode === null;

  // Dynamic taxonomy options extracted from live website question bank
  const subjectOptions = useMemo<SearchSelectOption[]>(() => {
    const counts = new Map<string, number>();
    for (const q of liveBank) {
      if (q.subject) {
        counts.set(q.subject, (counts.get(q.subject) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries()).map(([subj, count]) => {
      const mode = isLanguageOnlySubject(subj);
      const langBadge =
        mode === 'en' ? 'EN Only' : mode === 'ne' ? 'NE Only' : 'EN / ने';
      return {
        value: subj,
        label: subj,
        badge: `${count} Qs · ${langBadge}`,
      };
    });
  }, [liveBank]);

  const topicOptions = useMemo<SearchSelectOption[]>(() => {
    const map = new Map<string, { id: string; count: number }>();
    for (const q of liveBank) {
      if (q.subject === subject && q.topic) {
        const existing = map.get(q.topic);
        map.set(q.topic, {
          id: existing?.id || q.topicId,
          count: (existing?.count ?? 0) + 1,
        });
      }
    }
    return Array.from(map.entries()).map(([name, info]) => ({
      value: name,
      label: name,
      badge: `${info.count} Qs`,
      description: info.id ? `ID: ${info.id}` : undefined,
    }));
  }, [liveBank, subject]);

  const subtopicOptions = useMemo<SearchSelectOption[]>(() => {
    const map = new Map<string, { id: string; count: number }>();
    for (const q of liveBank) {
      if (q.subject === subject && (!topic || q.topic === topic) && q.subtopic) {
        const existing = map.get(q.subtopic);
        map.set(q.subtopic, {
          id: existing?.id || q.subtopicId,
          count: (existing?.count ?? 0) + 1,
        });
      }
    }
    return Array.from(map.entries()).map(([name, info]) => ({
      value: name,
      label: name,
      badge: `${info.count} Qs`,
      description: info.id ? `ID: ${info.id}` : undefined,
    }));
  }, [liveBank, subject, topic]);

  const paperOptions = useMemo<SearchSelectOption[]>(() => {
    const vals = Array.from(new Set(liveBank.map((q) => q.paper).filter(Boolean)));
    return vals.map((v) => ({ value: v, label: v }));
  }, [liveBank]);

  const levelOptions = useMemo<SearchSelectOption[]>(() => {
    const vals = Array.from(new Set(liveBank.map((q) => q.level).filter(Boolean)));
    return vals.map((v) => ({ value: v, label: v }));
  }, [liveBank]);

  const serviceOptions = useMemo<SearchSelectOption[]>(() => {
    const vals = Array.from(
      new Set([
        'Federal Civil Service preparation',
        ...liveBank.map((q) => q.service).filter(Boolean),
      ])
    );
    return vals.map((v) => ({ value: v, label: v }));
  }, [liveBank]);

  const groupOptions = useMemo<SearchSelectOption[]>(() => {
    const vals = Array.from(new Set(liveBank.map((q) => q.group).filter(Boolean)));
    return vals.map((v) => ({ value: v, label: v }));
  }, [liveBank]);

  const postOptions = useMemo<SearchSelectOption[]>(() => {
    const vals = Array.from(new Set(liveBank.map((q) => q.post).filter(Boolean)));
    return vals.map((v) => ({ value: v, label: v }));
  }, [liveBank]);

  const liveMaterials = useMemo(() => {
    if (!isOpen) return [];
    return materialStorageService.loadMaterialCategories();
  }, [isOpen]);

  const materialOptions = useMemo<SearchSelectOption[]>(() => {
    const items: SearchSelectOption[] = [
      { value: '', label: 'None (No linked source PDF)' },
    ];
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
    if (!sourcePath) return true;
    return liveMaterials.some((c) =>
      c.items.some((i) => i.path === sourcePath)
    );
  }, [sourcePath, liveMaterials]);

  const showCustomSourceInput =
    forceCustomSourcePath || (Boolean(sourcePath.trim()) && !isKnownMaterialPath);

  // Populate on open or question change
  useEffect(() => {
    if (!isOpen) return;

    if (questionToEdit) {
      setSubject(questionToEdit.subject || 'Geography of Nepal');
      setTopic(questionToEdit.topic || '');
      setTopicId(questionToEdit.topicId || '');
      setSubtopic(questionToEdit.subtopic || '');
      setSubtopicId(questionToEdit.subtopicId || '');
      setDifficulty(questionToEdit.difficulty || 'Medium');
      setMarks(questionToEdit.marks || 1);
      setPaper(questionToEdit.paper || 'Paper I: General Knowledge');
      setLevel(questionToEdit.level || 'Gazetted Third Class');
      setService(questionToEdit.service || 'Federal Civil Service preparation');
      setGroup(questionToEdit.group || 'General Administration');
      setPost(questionToEdit.post || 'Section Officer / Nayab Subba target');
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
        questionToEdit.correct_options.length > 0
          ? questionToEdit.correct_options
          : ['A']
      );
      setIsMultiSelect(Boolean(questionToEdit.is_multi_select));
      setExplanation(questionToEdit.explanation || '');
      setExplanationNe(questionToEdit.explanationNe || '');
      setSourceTitle(questionToEdit.sourceTitle || '');
      setSourcePath(questionToEdit.sourcePath || '');
      setForceCustomSourcePath(false);
    } else {
      const defaultSubject = 'Geography of Nepal';
      const firstMatch = liveBank.find((q) => q.subject === defaultSubject);
      const firstMat = liveMaterials.flatMap((c) => c.items).find(
        (m) => m.id === 'nepal-parichaya-13th-edition-2082'
      );

      setSubject(defaultSubject);
      setTopic(firstMatch?.topic || 'Physical Geography & Ecological Belts');
      setTopicId(firstMatch?.topicId || 'geo-physical');
      setSubtopic(firstMatch?.subtopic || 'Area & Physiographic Divisions');
      setSubtopicId(firstMatch?.subtopicId || 'geo-area-belts');
      setDifficulty('Medium');
      setMarks(1);
      setPaper(firstMatch?.paper || 'Paper I: General Knowledge');
      setLevel(firstMatch?.level || 'General PSC practice');
      setService(firstMatch?.service || 'Federal Civil Service preparation');
      setGroup(firstMatch?.group || 'General Administration');
      setPost(
        firstMatch?.post ||
          'Section Officer / general competitive examination target'
      );
      setQuestionText('');
      setQuestionNe('');
      setOptions({ A: '', B: '', C: '', D: '' });
      setOptionsNe({ A: '', B: '', C: '', D: '' });
      setCorrectOptions(['A']);
      setIsMultiSelect(false);
      setExplanation('');
      setExplanationNe('');
      setSourcePath(firstMat?.path || '');
      setSourceTitle(firstMat?.title || '');
      setForceCustomSourcePath(false);
    }
    setErrorMsg(null);
  }, [questionToEdit, isOpen, liveBank]);

  if (!isOpen) return null;

  const handleSubjectSelect = (nextSubject: string) => {
    setSubject(nextSubject);
    // Cascade matching Topic / Subtopic / Paper / Group if current topic doesn't exist under nextSubject
    const matchingQuestions = liveBank.filter((q) => q.subject === nextSubject);
    if (matchingQuestions.length > 0) {
      const stillMatchesTopic = matchingQuestions.some((q) => q.topic === topic);
      if (!stillMatchesTopic) {
        const first = matchingQuestions[0];
        setTopic(first.topic);
        setTopicId(first.topicId);
        setSubtopic(first.subtopic);
        setSubtopicId(first.subtopicId);
        if (!isEditing) {
          setPaper(first.paper);
          setGroup(first.group);
        }
      }
    } else if (!isEditing) {
      setTopic('');
      setTopicId('');
      setSubtopic('');
      setSubtopicId('');
    }
  };

  const handleTopicSelect = (nextTopic: string) => {
    setTopic(nextTopic);
    const matchedQ = liveBank.find(
      (q) => q.subject === subject && q.topic === nextTopic
    );
    if (matchedQ) {
      setTopicId(matchedQ.topicId);
      const stillMatchesSub = liveBank.some(
        (q) =>
          q.subject === subject &&
          q.topic === nextTopic &&
          q.subtopic === subtopic
      );
      if (!stillMatchesSub) {
        setSubtopic(matchedQ.subtopic);
        setSubtopicId(matchedQ.subtopicId);
      }
    } else {
      setTopicId(slugifyId(nextTopic, 'custom-topic'));
    }
  };

  const handleSubtopicSelect = (nextSubtopic: string) => {
    setSubtopic(nextSubtopic);
    const matchedQ = liveBank.find(
      (q) =>
        q.subject === subject &&
        (!topic || q.topic === topic) &&
        q.subtopic === nextSubtopic
    );
    if (matchedQ) {
      setSubtopicId(matchedQ.subtopicId);
    } else {
      setSubtopicId(slugifyId(nextSubtopic, 'custom-subtopic'));
    }
  };

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
    if (!nextVal) {
      return;
    }
    const matchedItem = liveMaterials.flatMap((c) => c.items).find(
      (i) => i.path === nextVal
    );
    if (matchedItem) {
      setSourceTitle(matchedItem.title);
    }
  };

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

    const cleanSubject = subject.trim();
    const cleanTopic = topic.trim();
    const cleanSubtopic = subtopic.trim();

    if (!cleanSubject) {
      setErrorMsg('Please select or enter a Subject.');
      return;
    }
    if (!cleanTopic) {
      setErrorMsg('Please select or enter a Topic.');
      return;
    }
    if (!cleanSubtopic) {
      setErrorMsg('Please select or enter a Subtopic.');
      return;
    }

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
        'Nepali translation of the question prompt (प्रश्न नेपालीमा) is required for bilingual categories.'
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

    const compiledOptions = filledOptions.map((k) => ({
      key: k,
      text: options[k].trim(),
      ...(isBilingualSubject && optionsNe[k].trim()
        ? { textNe: optionsNe[k].trim() }
        : {}),
    }));

    const resolvedTopicId =
      topicId.trim() || slugifyId(cleanTopic, 'custom-topic');
    const resolvedSubtopicId =
      subtopicId.trim() || slugifyId(cleanSubtopic, 'custom-subtopic');

    const finalQuestion: QuizQuestion = {
      id: questionToEdit
        ? questionToEdit.id
        : `PSC-MCQ-${Date.now().toString().slice(-6)}`,
      level: level.trim() || 'Gazetted Third Class',
      service: service.trim() || 'Federal Civil Service preparation',
      group: group.trim() || 'General Administration',
      post: post.trim() || 'Section Officer / Nayab Subba target',
      paper: paper.trim() || 'Paper I: General Knowledge',
      subject: cleanSubject,
      topicId: resolvedTopicId,
      topic: cleanTopic,
      subtopicId: resolvedSubtopicId,
      subtopic: cleanSubtopic,
      question: questionText.trim(),
      ...(isBilingualSubject ? { questionNe: questionNe.trim() } : {}),
      options: compiledOptions,
      correct_options: correctOptions,
      is_multi_select: isMultiSelect,
      explanation: explanation.trim(),
      ...(isBilingualSubject ? { explanationNe: explanationNe.trim() } : {}),
      difficulty,
      marks: Math.min(20, Math.max(0.5, Number(marks) || 1)),
      ...(sourceTitle.trim() ? { sourceTitle: sourceTitle.trim() } : {}),
      ...(sourcePath.trim() ? { sourcePath: sourcePath.trim() } : {}),
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

      <div className="relative w-full max-w-3xl min-w-0 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 z-10 space-y-5 my-8 max-h-[90vh] overflow-y-auto overflow-x-hidden">
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
                {isEditing
                  ? `Edit MCQ Question (${questionToEdit?.id})`
                  : 'Create New MCQ Question'}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Full PSC Paper I schema synced directly with website quiz filters &amp; study cards
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
                <strong>English Category Mode:</strong> Questions, options, and
                explanations are displayed <strong>exclusively in English</strong>.
              </span>
            ) : languageOnlyMode === 'ne' ? (
              <span lang="ne">
                <strong>नेपाली विषय मोड:</strong> यस श्रेणीका प्रश्न, विकल्प र
                व्याख्या <strong>नेपाली भाषामा मात्र</strong> देखाइन्छन्।
              </span>
            ) : (
              <span>
                <strong>Bilingual Mode (English &amp; नेपाली):</strong> Provide
                questions, options, and explanations in{' '}
                <strong>both English and Nepali</strong> for complete website
                parity.
              </span>
            )}
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Cascading Subject, Topic & Subtopic */}
          <div className="space-y-3 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              1. Subject, Topic &amp; Subtopic Taxonomy (Matched on /quiz Filters)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <SelectOrCustomField
                label="Subject"
                required
                value={subject}
                onChange={handleSubjectSelect}
                options={subjectOptions}
                placeholder="Select subject..."
                customPlaceholder="Enter subject name..."
                searchPlaceholder="Search subjects..."
                customOptionLabel="+ Add custom subject..."
              />

              <SelectOrCustomField
                label="Topic"
                required
                value={topic}
                onChange={handleTopicSelect}
                options={topicOptions}
                placeholder="Select topic..."
                customPlaceholder="e.g. Constitutional Law"
                searchPlaceholder="Search topics..."
                customOptionLabel="+ Add custom topic..."
              />

              <SelectOrCustomField
                label="Subtopic"
                required
                value={subtopic}
                onChange={handleSubtopicSelect}
                options={subtopicOptions}
                placeholder="Select subtopic..."
                customPlaceholder="e.g. Fundamental Rights"
                searchPlaceholder="Search subtopics..."
                customOptionLabel="+ Add custom subtopic..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
              <div className="min-w-0">
                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1 truncate">
                  Topic Slug ID
                </label>
                <input
                  type="text"
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                  placeholder="auto-generated"
                  className="w-full text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="min-w-0">
                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1 truncate">
                  Subtopic Slug ID
                </label>
                <input
                  type="text"
                  value={subtopicId}
                  onChange={(e) => setSubtopicId(e.target.value)}
                  placeholder="auto-generated"
                  className="w-full text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="min-w-0">
                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1 truncate">
                  Difficulty <span className="text-crimson-600">*</span>
                </label>
                <SharedSearchSelect
                  options={DIFFICULTY_OPTIONS}
                  value={difficulty}
                  onChange={(val) => setDifficulty(val as QuizDifficulty)}
                  size="sm"
                  enableSearch={false}
                  className="w-full"
                  popoverWidth="w-full"
                />
              </div>
              <div className="min-w-0">
                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1 truncate">
                  Marks Weightage <span className="text-crimson-600">*</span>
                </label>
                <input
                  type="number"
                  min={0.5}
                  max={20}
                  step={0.5}
                  value={marks}
                  onChange={(e) => setMarks(Number(e.target.value))}
                  className="w-full h-8 sm:h-9 text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* 2. PSC Exam Item Classification (Displayed inside Quiz Dialog Sidebar) */}
          <div className="space-y-3 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              2. PSC Item Classification (Displayed on Quiz Question Card)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <SelectOrCustomField
                label="Paper"
                required
                value={paper}
                onChange={setPaper}
                options={paperOptions}
                searchPlaceholder="Search papers..."
                customOptionLabel="+ Custom paper..."
              />
              <SelectOrCustomField
                label="Cadre / Level"
                required
                value={level}
                onChange={setLevel}
                options={levelOptions}
                searchPlaceholder="Search levels..."
                customOptionLabel="+ Custom level..."
              />
              <SelectOrCustomField
                label="Service Branch"
                required
                value={service}
                onChange={setService}
                options={serviceOptions}
                searchPlaceholder="Search services..."
                customOptionLabel="+ Custom service..."
              />
              <SelectOrCustomField
                label="Service Group"
                required
                value={group}
                onChange={setGroup}
                options={groupOptions}
                searchPlaceholder="Search groups..."
                customOptionLabel="+ Custom group..."
              />
              <div className="sm:col-span-2 min-w-0">
                <SelectOrCustomField
                  label="Target Post"
                  required
                  value={post}
                  onChange={setPost}
                  options={postOptions}
                  searchPlaceholder="Search target posts..."
                  customOptionLabel="+ Custom target post..."
                />
              </div>
            </div>
          </div>

          {/* 3. Question Stem & Options */}
          <div className="space-y-4">
            <div
              className={
                isBilingualSubject
                  ? 'grid grid-cols-1 sm:grid-cols-2 gap-3'
                  : 'space-y-2'
              }
            >
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
                  Options &amp; Correct Answer Key{' '}
                  <span className="text-crimson-600">*</span>
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
                        className={`mt-0.5 w-7 h-7 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
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
                Click the letter badge on the left to set which option is the
                official answer key.
              </p>
            </div>

            {/* Explanation */}
            <div
              className={
                isBilingualSubject
                  ? 'grid grid-cols-1 sm:grid-cols-2 gap-3'
                  : 'space-y-2'
              }
            >
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
          </div>

          {/* 4. Linked Source Material & Citation */}
          <div className="space-y-3 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              4. Linked Study Document &amp; Citation (Read Source PDF Link)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="min-w-0 space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Source Reading Material PDF
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
                    className="w-full text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                )}
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Source Citation Label (Displayed on PDF Link)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nepal Parichaya 13th Edition, Page 142"
                  value={sourceTitle}
                  onChange={(e) => setSourceTitle(e.target.value)}
                  className="w-full h-8 sm:h-9 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
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
