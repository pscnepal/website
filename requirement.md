# Requirements Specification — PSC Nepal

## 1. Purpose & Project Overview
**PSC Nepal (लोक सेवा तयारी नेपाल)** is an integrated exam preparation platform built for candidates appearing in Nepal Public Service Commission (Lok Sewa Aayog) competitive examinations. It brings official syllabi, bilingual objective MCQ drills, realistic OMR and subjective exam simulations, reference study PDFs, flashcard memory drills, and question bank authoring into a unified web application.

---

## 2. Target Users & Cadres
| Persona / Track | Description |
| :--- | :--- |
| **Section Officer (शाखा अधिकृत)** | Gazetted Class III aspirants preparing for Paper I Screening (GK + IQ), Papers II–IV Written, and Stage III interviews. |
| **Nayab Subba (नायब सुब्बा)** | Non-Gazetted First Class aspirants preparing for Paper I Screening (50% merit carry-forward), Paper II & III Written, and skill tests. |
| **Kharidar (खरिदार)** | Non-Gazetted Second Class aspirants preparing for Phase I GK/Aptitude and Phase II Office Management & Job-Oriented Knowledge. |
| **Educators / Curators** | Contributors managing custom MCQ and written questions, reviewing flagged items, and exporting/importing study banks via the Command Dashboard. |

---

## 3. Functional Requirements

### FR-1: Public Catalog & Open Study Access
- Every primary route—including home, official syllabi, study materials library, PDF flipbook reader, written Q&A, rubric evaluator, flashcards, past question archive, calendar notices, current affairs, dashboard tools, and quiz catalog/filters—must remain **publicly accessible without requiring login**.

### FR-2: Authenticated Quiz-Taking Gate (Firebase Auth + Google Login)
- Viewing quiz decks, building custom subject/topic filters, and configuring exam presets must work without an account.
- **Taking any timed objective quiz** (`QuizSessionDialog`) or **entering an OMR MCQ Phase I exam sitting** (`ExamSimulationDialog` in `omr-hall` mode) must require the user to be signed in via **Google Sign-In** (`signInWithPopup`).
- If an unauthenticated user launches a quiz, the system must display an inline authentication gate inside the dialog before starting any countdown timer; once Google login succeeds, the quiz session must begin immediately.
- Authenticated users must have access to account status and sign-out controls from the navigation header on both desktop and mobile viewports.

### FR-3: Bilingual Content Rules (English & Nepali)
- **All non-language quiz categories** (General Knowledge, Governance, Public Management, IQ/Aptitude, Constitution, Geography, Contemporary Affairs, etc.) must present questions, options, explanations, and written solutions in **both English and Nepali**.
- **`English` language category** must render questions, options, and explanations **exclusively in English**.
- **`Nepali` language category** must render questions, options, and explanations **exclusively in Nepali**.

### FR-4: Objective MCQ Assessment Engine
- Enforce a strict **1 minute per question** reverse countdown (`N:00` down to `00:00`) with visual radial/progress urgency states (`>2m`, `<=2m`, `<=1m`) and automated submission upon expiry.
- Support both **Real Quiz** mode (feedback withheld until submission) and **Study Hints** mode (immediate explanation reveal).
- Score responses according to Lok Sewa Aayog **-20% negative marking** (`+marks` for correct, `-0.2 × marks` for wrong, `0` for skipped/blank).
- Support both single-select and multi-select questions with flexible responsive option spacing that adapts cleanly to short single-word answers as well as multi-sentence options.
- Allow candidates to flag any question for review during a quiz or simulation run, clear choices, navigate via numbered palette or keyboard shortcuts (`1–4` / `A–D`, `F`, Left/Right arrows, `Esc`), and filter post-submission review by All, Incorrect, Unanswered, Correct, or Flagged.

### FR-5: Exam Hall Simulator & Merit Strategy Lab
- **Phase I OMR Hall**: Provide split Question Paper & interactive OMR Bubble Sheet views, deterministic booklet key permutation (`Key A`, `Key B`, `Key C`, `Key D`), guessing-impact comparison, and official screening pass/fail qualification badges.
- **Phase II Written Hall**: Provide timed written answer drafting with live word-count indicators and post-sitting rubric self-evaluation.
- **Merit Lab**: Allow candidates to simulate accuracy, attempt count, and negative-marking trade-offs toward final merit cutoffs.

### FR-6: Command Dashboard & Question CRUD
- Provide a dedicated multi-page dashboard (`/dashboard/*`) without redundant practice views or duplicate action buttons.
- Support full **Create, Read, Update, and Delete (CRUD)** operations for both:
  - **MCQ Question Bank** (including bilingual fields respecting the `English`/`Nepali`/bilingual category rules, multi-select options, marks, source PDF linking, and difficulty).
  - **Written Question Bank** (Papers II–IV subjective prompts, English/Nepali model points, rubric criteria, marks, and word guidance).
- Provide a **Flagged for Review** tab listing every flagged MCQ with deck context, notes/metadata, unflagging controls, and direct launch into a focused Flagged Practice Quiz.
- Provide Materials inventory, Aspirant cohort directory, and full JSON Export / Import / Reset data management.

### FR-7: Document Library & PDF Flipbook Reader
- Support browsing categorized official reference PDFs and uploading custom local PDFs.
- Render documents in a realistic **two-page Flipbook mode** (`page-flip`) with optional page-turn sound cues as well as a **Standard HiDPI continuous scroll mode** (`pdfjs-dist`), tracking per-book reading progress and time statistics.

### FR-8: Bilingual Study Assistant Chatbot
- Provide a clean **icon-only floating launcher button** (without cluttered text labels beside the icon) that toggles a responsive study assistant panel.
- Answer common Lok Sewa preparation queries offline (negative marking rules, cadre comparisons, exam routines, direct navigation links to quizzes, written answers, and PDFs).

---

## 4. Non-Functional Requirements

| Category | Requirement |
| :--- | :--- |
| **Responsive UX** | Full usability from `360px` mobile screens through wide desktop monitors, including mobile drawers, collapsible dashboard sidebar, and flexible responsive option grids. |
| **Cloud & Offline Persistence** | Client preferences, custom question CRUD banks, flagged questions, drafts, and study progress persist locally (`localStorage`). Signed-in users sync profile metadata and completed quiz/OMR attempts to Cloud Firestore. |
| **Security & Privacy** | Firestore rules enforce default-deny, verified Google email ownership (`request.auth.token.email_verified == true`), strict field/type/size allowlists, server-enforced timestamps (`request.time`), PII isolation under `/users/{userId}`, and immutable attempt outcomes. |
| **Accessibility & SEO** | Keyboard-navigable dialogs and controls, semantic ARIA roles, light/dark theme persistence, OpenGraph/Twitter meta tags, and Schema.org JSON-LD structured data. |
| **Browser Constraints** | No reliance on blocking native `window.alert` or `window.open` popups; Google login uses `signInWithPopup` compatible with embedded preview iframes. |
