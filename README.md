<div align="center">
  <img width="100%" alt="PSC Nepal — Nepal Civil Service Exam Preparation (Lok Sewa Aayog)" src="src/assets/images/psc_nepal_banner_1794559530385.jpg" />
</div>

# PSC Nepal (लोक सेवा तयारी नेपाल)

A comprehensive, bilingual web workspace designed for **Nepal Public Service Commission (Lok Sewa Aayog)** aspirants preparing for **Section Officer (शाखा अधिकृत)**, **Nayab Subba (नायब सुब्बा)**, and **Kharidar (खरिदार)** examinations.

Explore official syllabi, Phase I timed objective MCQs, OMR exam hall simulations, Phase II subjective model answers, rubric-based self-evaluation, interactive two-page PDF flipbooks, and a question-bank management dashboard.

---

## Key Features

- **Official PSC Syllabus Explorer (`/syllabus`)**: Detailed paper-by-paper, chapter, and topic checklists for Section Officer (Gazetted Class III), Nayab Subba (Non-Gazetted 1st Class), and Kharidar (Non-Gazetted 2nd Class).
- **Timed Objective Quiz Arena (`/quiz`)**:
  - Subject, topic, subtopic, and difficulty filtering across 100+ seed questions plus custom user-created MCQs.
  - Strict **1 minute per question** reverse countdown timer with automatic submission at `00:00` and official **-20% negative marking** calculation.
  - Bilingual English & Nepali presentation for General Knowledge, IQ, Governance, and Contemporary Affairs; English-only for `English`; Nepali-only for `Nepali`.
  - Two modes (**Real Quiz** and **Study Hints**), question flagging for later review, and keyboard shortcuts (`1–4` / `A–D`, `F`, arrow keys, `Esc`).
- **Realistic Examination Hall Simulator (`/simulate`)**:
  - **Phase I OMR Screening Hall**: Interactive OMR bubble sheet (`[A]–[D]`) with booklet key permutation (`Key A–D`), guessing-impact diagnostics, and cutoff qualification results.
  - **Phase II Written Examination Hall**: Structured answer writing environment with section timers and analytical rubric self-grading.
  - **Merit & Negative-Marking Lab**: Interactive strategy calculator for aggregate score planning.
- **Public Browsing + Google Sign-In Quiz Gate**:
  - All study guides, PDFs, dashboards, flashcards, written Q&As, and quiz decks are publicly accessible without login.
  - Starting any timed MCQ quiz or entering an OMR Phase I hall sitting prompts for **Google Sign-In** (via Firebase Auth), syncing aspirant profiles and completed scores cleanly to Cloud Firestore.
- **Written Q&A & Rubric Evaluator (`/written`, `/evaluator`)**: Bilingual English/Nepali Paper II, III, and IV model answers with structured scoring rubrics and personal draft persistence.
- **PDF Flipbook & HiDPI Document Reader (`/materials`, `/read`)**: Curated Lok Sewa study PDFs (Constitution of Nepal 2072, Nepal Parichaya, Civil Service Act, Governance notes) with a two-page flipbook mode, zoom, progress tracking, and local PDF upload support.
- **Command Dashboard (`/dashboard`)**:
  - Executive readiness overview and analytics.
  - Full **CRUD** (Create, Read, Update, Delete) management for both **MCQ** and **Written** question banks.
  - Dedicated **Flagged for Review** triage view with direct practice launches.
  - Study materials inventory, aspirant cohort directory, and JSON data backup/export/restore.
- **Study Assistant & Extras**: Icon-triggered offline bilingual study assistant chatbot, PSC Calendar & Notices (`/calendar`), Current Affairs (`/current-affairs`), Past Questions PYQ Archive (`/pyq`), and Flashcards (`/flashcards`).

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | React 19, TypeScript, Vite 8 |
| **Styling & Motion** | Tailwind CSS v4, Motion (`motion/react`), Lucide Icons |
| **State & Routing** | Redux Toolkit (`@reduxjs/toolkit`), React Router v7 |
| **Authentication & Database** | Firebase Authentication (Google Sign-In) & Cloud Firestore |
| **PDF & Flipbook Engine** | `pdfjs-dist`, StPageFlip (`page-flip`) |
| **Rule Linting & Typecheck** | ESLint (`@firebase/eslint-plugin-security-rules`), TypeScript (`tsc --noEmit`) |

---

## Getting Started

### Prerequisites

- **Node.js** `v20+` (or `v22+` recommended)
- **npm** `10+`
- A Firebase project with **Google Sign-In** enabled and **Cloud Firestore** provisioned (configured in `firebase-applet-config.json`)

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Verify Firebase configuration:**
   Ensure `firebase-applet-config.json` in the repository root contains your valid Firebase web app config and `firestoreDatabaseId`.

3. **Start the development server (runs on port `3000`):**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite development server on `0.0.0.0:3000` |
| `npm run build` | Builds production assets to `dist/` |
| `npm run preview` | Serves the production build locally on port `3000` |
| `npm run lint` | Runs TypeScript static verification (`tsc --noEmit`) |
| `npx eslint firestore.rules` | Validates Firestore security rules against `@firebase/eslint-plugin-security-rules` |

---

## Core Routes

| Route | Module |
| :--- | :--- |
| `/` | Landing Overview & Exam Tracks |
| `/syllabus` | Official Section Officer, Nayab Subba & Kharidar Syllabi |
| `/quiz` | Timed Practice Quizzes & Custom Filter Builder |
| `/simulate` | Phase I OMR Hall, Phase II Written Hall & Merit Lab |
| `/written` | Bilingual Written Q&A Bank (Papers II–IV) |
| `/evaluator` | Rubric Self-Assessment Workbench |
| `/materials` & `/read` | Study PDF Library & Two-Page Flipbook Reader |
| `/dashboard` | Executive Overview, MCQ/Written CRUD, Flagged Review & Backup |
| `/calendar`, `/current-affairs`, `/pyq`, `/flashcards` | Notices, Current Affairs, Past Questions & Flashcards |

---

## Project Documentation

- **[Requirements Specification (`requirement.md`)](./requirement.md)** — Functional, bilingual, authentication, assessment, and security requirements.
- **[Implementation Architecture (`implementation.md`)](./implementation.md)** — Codebase structure, Redux & localStorage sync, Firebase Auth & Firestore schema, security rules, and PDF/quiz engines.
- **[Security Specification (`security_spec.md`)](./security_spec.md)** — Firestore data invariants and adversarial test payloads.

---

## Project Structure

```text
├── public/                 # Static PDFs, audio cues, PWA icons, manifest & SEO assets
├── src/
│   ├── app/                # Redux store & typed hooks
│   ├── assets/             # Generated editorial assets
│   ├── components/         # UI modules (auth, chat, common, dashboard, home, layout, quiz, reader, simulation)
│   ├── context/            # AuthContext (Google Sign-In & Firestore user/attempt sync)
│   ├── data/               # Cadre syllabi, quiz banks, written Q&A, flashcards, PYQs & presets
│   ├── features/           # Redux Toolkit slices (quiz, written, psc, library, reader, settings, reactions)
│   ├── lib/                # Firebase SDK setup & structured Firestore error handler
│   ├── pages/              # Top-level route pages & dashboard sub-pages
│   ├── services/           # LocalStorage persistence, question CRUD events, PDF & offline chat engine
│   └── utils/              # URL, PDF, and formatting helpers
├── firebase-blueprint.json # Firestore entity & collection blueprint
├── firestore.rules         # Deployed Cloud Firestore security rules
├── requirement.md          # Product & system requirements
└── implementation.md       # Technical architecture & implementation details
```

---

## Contact & License

- **Contact**: `info.pscnepal@gmail.com`
- **License**: Apache-2.0
