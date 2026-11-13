# Implementation Architecture — PSC Nepal

This document explains how **PSC Nepal** is structured and implemented across the frontend, state management, local storage engines, PDF reader pipeline, Firebase Authentication, and Cloud Firestore security layer.

---

## 1. High-Level Architecture

PSC Nepal is a client-rendered Single Page Application (SPA) built with **React 19**, **TypeScript**, and **Vite 8** (with Tailwind CSS v4), paired with **Firebase Authentication** and **Cloud Firestore** for user identity and attempt persistence.

```text
┌──────────────────────────────────────────────────────────────────────┐
│                         React 19 + Router v7                         │
│   Public Pages (/syllabus, /quiz, /simulate, /materials, /dashboard) │
└───────────────┬───────────────────────────────────┬──────────────────┘
                │                                   │
   ┌────────────▼──────────────┐       ┌────────────▼──────────────┐
   │    AuthContext + Gate     │       │   Redux Toolkit Store     │
   │  Google signInWithPopup   │       │  quiz | written | psc     │
   │  QuizAuthGate on Quiz/OMR │       │  library | reader | ui    │
   └────────────┬──────────────┘       └────────────┬──────────────┘
                │                                   │
   ┌────────────▼──────────────┐       ┌────────────▼──────────────┐
   │ Cloud Firestore (Named DB)│       │  localStorage Services    │
   │ users/{uid}               │       │  storageService.ts        │
   │ users/{uid}/quizAttempts  │       │  questionStorageService.ts│
   └───────────────────────────┘       └───────────────────────────┘
```

---

## 2. Bootstrapping & Build Configuration

- **Entry Point (`src/main.tsx`)**: Wraps `<App />` inside Redux `<Provider store={store}>` and `<AuthProvider>`.
- **Routing & Scroll Management (`src/App.tsx`)**:
  - Uses `BrowserRouter` with `LayoutGroup` (`motion/react`) and a custom `<ScrollManager />` that handles hash anchors and preserves scroll position when opening or closing quiz/simulation modal routes (`/quiz/:deckId`, `/simulate?launch=1`).
  - Syncs dark/light theme classes onto `document.documentElement`.
- **Vite Configuration (`vite.config.ts`)**:
  - Serves dev and preview on `0.0.0.0:3000`.
  - Includes `pageFlipCompatPlugin()`, a custom pre-transform Vite plugin that converts `export const enum` declarations inside `node_modules/page-flip/src/*.ts` to standard `export enum` so Vite/esbuild transpiles `StPageFlip` cleanly.

---

## 3. Authentication & Cloud Firestore Integration

### 3.1 Firebase Initialization (`src/lib/firebase.ts`)
- Loads configuration from `firebase-applet-config.json`.
- Explicitly binds Firestore to the provisioned named database:
  `getFirestore(app, firebaseConfig.firestoreDatabaseId)` (`ai-studio-pscnepal-fbea784f-6460-4275-9b3a-b45a55f84310`).
- Runs a startup `getDocFromServer(doc(db, 'test', 'connection'))` connectivity check.
- Exports `OperationType` and `handleFirestoreError(error, operationType, path)` to emit structured `FirestoreErrorInfo` JSON diagnostics whenever a Firestore operation fails.

### 3.2 Google Auth & Hybrid Cloud Sync (`src/context/AuthContext.tsx` & `src/services/cloudSyncService.ts`)
- Subscribes to `onAuthStateChanged(auth, ...)` and exposes `{ user, isAuthReady, isSigningIn, authError, clearAuthError, signInWithGoogle, signOutUser }` via `useAuth()`.
- Uses `signInWithPopup(auth, googleProvider)` with `prompt: 'select_account'` and user-friendly error mapping (closed popup, blocked popup, unauthorized domain, network errors).
- On startup (including guest visits), `fetchAllCloudItemStats()` hydrates public community view, like, and dislike counters from `/itemStats/{itemId}`.
- On sign-in:
  1. `ensureUserProfileDoc(user)` creates or updates `/users/{uid}` with sanitized `displayName`, `email`, `photoURL`, and `serverTimestamp()` values.
  2. `fetchUserQuizAttempts(user.uid)` queries `users/{uid}/quizAttempts` (scoped with `where('userId', '==', uid)` to satisfy query security rules) and merges cloud records into Redux via `mergeRemoteQuizAttempts`.
  3. `fetchUserFlaggedQuestions(user.uid)` two-way merges flagged questions and personal revision notes with `localStorage` via `storageService.mergeCloudFlaggedQuestions()`, pushing any offline flags/notes to `/users/{uid}/flaggedQuestions/{questionId}`.
  4. `fetchUserCloudReactions(user.uid)` hydrates personal likes, dislikes, and recorded view counts from `/users/{uid}/itemReactions/{itemId}` and reconciles any offline/guest local reactions or views atomically via `syncReactionAndStatsToFirestore()`.
- Whenever a signed-in user finishes a quiz or OMR hall sitting, `saveQuizAttemptToFirestore(user, attemptRecord)` ensures `/users/{uid}` exists and writes the bounded attempt summary to `/users/{uid}/quizAttempts/{attemptId}`.
- Realtime mutations on likes, dislikes, debounced views, and quiz history clearing flow through Redux `cloudSyncMiddleware` (`src/app/store.ts`), while `storageService` mirrors flagged-question toggles, note edits, and clears directly to Firestore in the background.

### 3.3 Public Browse vs. Quiz Auth Gate (`src/components/auth/QuizAuthGate.tsx`)
- All public routes and quiz browsing UI remain accessible without login.
- **Gated Entry Points**:
  - `QuizSessionDialog` (`src/components/quiz/QuizSessionDialog.tsx`): Checks `useAuth()`. While `!user`, renders `<QuizAuthGate>` instead of mounting `<QuizDialogInner>`, preventing the countdown timer from starting until Google Sign-In completes.
  - `ExamSimulationDialog` (`src/components/simulation/ExamSimulationDialog.tsx`): Gates `simulationType === 'omr-hall'` behind `user`, rendering `<QuizAuthGate>` with the selected OMR preset details before mounting `<OmrHallDialogInner>`.
- **Header Controls (`src/components/layout/Navbar.tsx`)**: Renders a compact Google **Sign in** button or user avatar menu (profile details + **Sign out**) across both desktop header and mobile navigation drawer.

### 3.4 Firestore Schema & Hardened Security Rules
- **Blueprint (`firebase-blueprint.json`)**: Defines `UserProfile` (`/users/{userId}`), `QuizAttempt` (`/users/{userId}/quizAttempts/{attemptId}`), `FlaggedQuestion` (`/users/{userId}/flaggedQuestions/{questionId}`), `UserItemReaction` (`/users/{userId}/itemReactions/{itemId}`), and `ItemStats` (`/itemStats/{itemId}`) with explicit field types, enums, and length/regex constraints.
- **Rules (`firestore.rules`)**:
  - Enforces default-deny (`match /{document=**} { allow read, write: if false; }`).
  - Requires `request.auth != null && request.auth.token.email_verified == true && request.auth.uid == userId` for all private user subcollections.
  - Validates document IDs with `isValidId()`, key allowlists via `hasAll`/`hasOnly` and `affectedKeys().hasOnly()`, string `.size()` bounds, numeric range bounds, immutable `uid`/`createdAt`, server-verified timestamps (`== request.time`), parent existence (`exists(/databases/$(database)/documents/users/$(userId))`), and immutable completed quiz attempts (`allow update: if false`).
  - Allows public non-PII reads on `/itemStats/{itemId}` and requires verified users executing paired transactional writes (`existsAfter(...)` on `/users/{uid}/itemReactions/{itemId}`) with bounded single-step like/dislike deltas (`[-1, 1]`) and monotonic bounded view increments (`[0, 100]`).
  - Enforces `allow list: if isOwner(userId) && existing().userId == request.auth.uid;` on user subcollections and `allow list: if false;` on `/users`.
- **Linting (`eslint.config.mjs`)**: Validated cleanly with `@firebase/eslint-plugin-security-rules` via `npx eslint firestore.rules`.

---

## 4. State Management & Storage Architecture

### 4.1 Redux Toolkit Slices (`src/features/` + `src/app/store.ts`)
- `quizSlice`: Stores `preferredMode` (`'exam' | 'study'`) and up to 30 `attempts`, including per-question outcomes for weak-question practice generation and remote Firestore merge support.
- `writtenSlice`: Tracks subjective draft responses, status (`mastered`, `practicing`), cumulative writing seconds, and language display mode (`bilingual | en | ne`).
- `pscSlice`: Tracks target cadre (`section-officer`, `nayab-subba`, `kharidar`), syllabus checklist completion, and OMR/written simulation run history.
- `librarySlice` & `readerSlice`: Tracks recent books, per-page progress, cumulative reading time, and PDF zoom/mode state.
- `settingsSlice` & `reactionsSlice`: Persists light/dark theme, default reader mode, sound cues, and per-item view/helpful counts using zero-double-count reconciliation (`base + cloudStats + pendingLocalDelta`).
- `store.subscribe()` persists changed slices automatically to `localStorage` via `src/services/storageService.ts`, while `cloudSyncMiddleware` synchronizes reactions, views, and quiz history clears to Firestore for signed-in verified accounts.

### 4.2 Question Bank CRUD & Bilingual Engine
- **`src/data/quizData.ts`**: Holds typed `QuizQuestion` datasets, curated `QuizDeck` bundles, `-20%` PSC scoring helpers, and `isBilingualQuizQuestion(question)` (`subject !== 'English' && subject !== 'Nepali'`).
- **`src/services/questionStorageService.ts`**:
  - Manages custom and modified MCQ & Written question banks in `localStorage`.
  - Emits DOM `CustomEvent` notifications (`psc_quiz_questions_changed`, `psc_written_questions_changed`) so Dashboard CRUD edits reflect immediately across `/quiz`, `/written`, `/simulate`, and `/dashboard/flagged`.
  - Applies `sanitizeQuizQuestionLanguage()` and `hydrateQuizSeedBilingualFields()` on load/save to guarantee language consistency (`English` = English only, `Nepali` = Nepali only, all other categories = bilingual English + Nepali).
- **Dashboard Modules (`src/components/dashboard/` & `src/pages/dashboard/`)**:
  - Modular sidebar layout (`DashboardLayout`) routing cleanly across `overview`, `quiz-bank`, `flagged`, `written-bank`, `materials`, `users`, and `data`.
  - Modal CRUD editors (`QuizQuestionFormModal`, `WrittenQuestionFormModal`) dynamically toggle Nepali input fields based on selected subject.

---

## 5. Assessment, Reader & Assistant Subsystems

- **Quiz & OMR Countdown Timing**: Uses wall-clock target timestamps (`Date.now() + deadlineSeconds * 1000`) polled every `250ms` rather than naive tick decrements, keeping countdowns accurate across background tabs and triggering automatic submission when remaining time reaches `0`.
- **Responsive Option Grid (`QuizSessionDialog`, `ExamSimulationDialog`)**: Dynamically adapts option layout so concise options do not waste excessive vertical/horizontal space while multi-sentence options wrap comfortably without clipping.
- **PDF & Flipbook Pipeline (`src/services/pdfService.ts`, `src/components/reader/`)**: Integrates `pdfjs-dist` worker rendering onto HiDPI canvases, powers two-page spread animations via `page-flip`, and plays optional subtle page-turn audio cues via `soundService.ts`.
- **Offline Bilingual Study Assistant (`src/services/pscChatEngine.ts`, `src/components/chat/PscChatbot.tsx`)**: Deterministic keyword/Devanagari-aware engine querying syllabi, negative marking rules, cadre comparison tables, and seeded MCQ/written records with instant deep-links—launched via a compact icon-only floating action button.
