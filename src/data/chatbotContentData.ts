import type { ChatbotStarterPrompt } from '../types/content';
import { SITE_CONFIG } from './siteConfig';

export type { ChatbotStarterPrompt };

export const CHATBOT_WELCOME_CONTENT = `Namaste! I am the **PSC Nepal Study Assistant** (लोक सेवा तयारी सहायक). Ask me anything in **English** or **नेपाली** about:

- **Official Syllabi**: Section Officer, Nayab Subba, Kharidar & NTC Computer Engineer (Level 7) phases, papers, chapters, marks & \`-20%\` negative marking
- **Questions & Answers**: Objective MCQs, verified answers, explanations & bilingual (\`EN\` / \`नेपाली\`) 5M/10M written model answers
- **Mock Exams & Simulator**: Phase I OMR Screening Hall, Phase II Timed Written Hall & Merit Strategy Lab
- **Materials & Contact**: Authentic \`psc.gov.np\` PDFs, 3D Flipbook Reader shortcuts & editorial support (\`${SITE_CONFIG.supportEmail}\`)`;

export const CHATBOT_STARTER_PROMPTS: ReadonlyArray<ChatbotStarterPrompt> = [
  {
    label: 'Syllabus & -20% Rules',
    prompt:
      'Compare the Section Officer, Nayab Subba, Kharidar, and NTC Computer Engineer Level 7 exam schemes, pass marks, and -20% negative marking rules.',
  },
  {
    label: 'Practice 3 PSC MCQs',
    prompt:
      'Give me 3 PSC Constitution & Public Law MCQs from the question bank along with their verified answers and explanations.',
  },
  {
    label: 'Bilingual 10M Answer',
    prompt:
      'Show the structured bilingual (English and नेपाली) 10-mark written model answer and rubric for PSC-WR-201.',
  },
  {
    label: 'Mock Exams & Simulator',
    prompt:
      'Which OMR Screening Hall and Written Paper Hall mock simulations can I launch right now, and how are they scored?',
  },
  {
    label: 'PDFs & Contact Info',
    prompt:
      'List the official PSC syllabus PDFs available in the flipbook reader and explain how to contact PSC Nepal support.',
  },
];
