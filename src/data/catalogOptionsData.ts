import type { SearchSelectOption } from '../components/common/SharedSearchSelect';
import type { WrittenLanguageMode } from '../features/written/writtenSlice';

export const DEFAULT_MATERIAL_AUTHORITIES: ReadonlyArray<string> = [
  'Public Service Commission, Nepal (लोक सेवा आयोग)',
  'Department of Information and Broadcasting (सूचना तथा प्रसारण विभाग)',
  'Nepal Law Commission (नेपाल कानुन आयोग)',
  'National Planning Commission (राष्ट्रिय योजना आयोग)',
  'Ministry of Federal Affairs & General Administration (MoFAGA)',
];

export const QUIZ_DIFFICULTY_OPTIONS: SearchSelectOption[] = [
  { value: 'Easy', label: 'Easy (Recall & Direct Statutes)' },
  { value: 'Medium', label: 'Medium (Standard Examination Level)' },
  { value: 'Hard', label: 'Hard (Deep Analytical / Tricky)' },
];

export const WRITTEN_QUESTION_TYPE_OPTIONS: SearchSelectOption[] = [
  { value: 'Short Analytical', label: 'Short Analytical (5 Marks)' },
  { value: 'Long Analytical', label: 'Long Analytical (10 Marks)' },
  { value: 'Case Study', label: 'Case Study Analysis (10 Marks)' },
];

export const WRITTEN_MARKS_OPTIONS: SearchSelectOption[] = [
  { value: '5', label: '5 Marks (Short Note / Analytical Concept)' },
  { value: '10', label: '10 Marks (Comprehensive Broad Case / Problem)' },
];

export const WRITTEN_LANGUAGE_OPTIONS: ReadonlyArray<{
  id: WrittenLanguageMode;
  label: string;
}> = [
  { id: 'bilingual', label: 'EN + नेपाली' },
  { id: 'en', label: 'English' },
  { id: 'ne', label: 'नेपाली' },
];
