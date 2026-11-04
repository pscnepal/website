import {
  Award,
  BookOpen,
  Compass,
  FileText,
  GraduationCap,
  HeartHandshake,
  Layers,
  Lock,
  Mail,
  Scale,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';

export function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <PageTransition>
        <main className="flex-1">
          {/* Hero Banner Section */}
          <section className="relative overflow-hidden border-b border-zinc-200/90 dark:border-zinc-800/90 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xs py-12 sm:py-16">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-950/20"
            />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
              {/* Breadcrumb Navigation */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Home
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-zinc-900 dark:text-zinc-200 font-medium">About</span>
              </nav>

              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/50 text-xs font-semibold text-blue-800 dark:text-blue-300">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                  <span>About PSC Nepal (हाम्रो बारेमा)</span>
                </div>

                <h1 className="font-serif text-fluid-h1 font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                  Empowering Nepal&apos;s Civil Service Aspirants with Open, Structured &amp; Rigorous Digital Preparation
                </h1>

                <p className="text-fluid-lead text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  PSC Nepal is an independent educational workspace engineered to bridge the preparation gap for
                  Lok Sewa Aayog (लोक सेवा आयोग) candidates across all 7 Provinces and 77 districts of Nepal—offering
                  official syllabi, realistic OMR and written examination halls, bilingual model answers, and 3D
                  PDF flipbooks.
                </p>
              </div>
            </div>
          </section>

          {/* Main Content Body */}
          <article className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
            {/* Mission & Vision Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  Our Mission (हाम्रो उद्देश्य)
                </h2>
                <p className="text-fluid-body text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  To democratize access to authentic Lok Sewa study materials, official curriculum benchmarks,
                  and disciplined examination practice for every aspiring civil servant in Nepal, regardless of
                  geographic location or financial background. We believe that public administration talent flourishes
                  when learning tools are transparent, accessible, and grounded in constitutional merit.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-4">
                <div className="w-10 h-10 rounded-xl bg-crimson-100 dark:bg-crimson-950/70 text-crimson-700 dark:text-crimson-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  Our Vision (हाम्रो परिकल्पना)
                </h2>
                <p className="text-fluid-body text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  To cultivate a digitally equipped, ethically grounded, and policy-conscious next generation of
                  public service leaders for Nepal. By practicing under exact examination constraints—such as
                  strict time pacers, negative marking penalties, and structured rubric evaluations—candidates build
                  both competitive competence and public governance mindset.
                </p>
              </div>
            </section>

            {/* Core Pillars of the Platform */}
            <section className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  The Five Pillars of PSC Nepal
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
                  Every feature on PSC Nepal is built around the verified statutory requirements and question
                  formats published by the Public Service Commission of Nepal.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">
                    Official Syllabus Checklists
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Exhaustive phase, paper, unit, and chapter checklists for Section Officer (शाखा अधिकृत),
                    Nayab Subba (नायब सुब्बा), and Kharidar (खरिदार) with interactive completion checkmarks and marks allocations.
                  </p>
                  <Link
                    to="/syllabus"
                    className="inline-flex items-center text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline pt-1"
                  >
                    Explore Syllabi →
                  </Link>
                </div>

                <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-crimson-50 dark:bg-crimson-950 text-crimson-700 dark:text-crimson-400 flex items-center justify-center">
                    <Scale className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">
                    Realistic Examination Halls
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Authentic OMR bubble-sheet simulation with randomized booklet keys (A, B, C, D) and -20% negative
                    marking penalty, paired with a Phase II Timed Written Hall (1.8 mins/mark) and rubric self-scoring.
                  </p>
                  <Link
                    to="/simulate"
                    className="inline-flex items-center text-xs font-semibold text-crimson-700 dark:text-crimson-400 hover:underline pt-1"
                  >
                    Enter Exam Hall →
                  </Link>
                </div>

                <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">
                    Bilingual Model Answers
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Structured 5M and 10M subjective answers formatted side-by-side in English and नेपाली, featuring
                    introductory citations, numbered thematic analysis, and balanced conclusions.
                  </p>
                  <Link
                    to="/written"
                    className="inline-flex items-center text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline pt-1"
                  >
                    View Model Answers →
                  </Link>
                </div>

                <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">
                    3D Flipbook &amp; PDF Reader
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Read the Constitution of Nepal 2072, Civil Service Act 2049, Local Government Operation Act 2074,
                    and Nepal Parichaya in realistic two-page turn flipbook or continuous scroll mode with bookmarking.
                  </p>
                  <Link
                    to="/materials"
                    className="inline-flex items-center text-xs font-semibold text-purple-700 dark:text-purple-400 hover:underline pt-1"
                  >
                    Browse Materials →
                  </Link>
                </div>

                <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">
                    Verified MCQ Question Arena
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Practice across Constitution, Governance, Economy, Geography, History, and Aptitude in either
                    Exam Mode (strict countdown with locked submission) or Study Mode (instant statutory explanation).
                  </p>
                  <Link
                    to="/quiz"
                    className="inline-flex items-center text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline pt-1"
                  >
                    Practice Quizzes →
                  </Link>
                </div>

                <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">
                    Local-First Privacy
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Zero required user accounts, zero server databases, and no tracking telemetry. All quiz records,
                    written drafts, and bookmarks remain 100% private in your local browser storage.
                  </p>
                  <Link
                    to="/privacy"
                    className="inline-flex items-center text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline pt-1"
                  >
                    Privacy Policy →
                  </Link>
                </div>
              </div>
            </section>

            {/* Target Cadres Overview */}
            <section className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  Target Cadres &amp; Civil Service Levels
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
                  Comprehensive coverage of the three premier open-competition entry levels in Nepal&apos;s civil service:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 font-mono">
                      Class III Gazetted
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200">
                      Bachelor Degree
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                    Section Officer (शाखा अधिकृत)
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Nepal Administration, Foreign, Judicial, Audit &amp; Parliament services. 100M Phase I Screening
                    (GK + IQ) with 45% pass gate, followed by 3 core subjective papers (300M) and Stage III interview/skill test.
                  </p>
                  <Link
                    to="/syllabus/section-officer"
                    className="inline-flex items-center text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline pt-2"
                  >
                    Officer Blueprint &amp; PDF →
                  </Link>
                </div>

                <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-crimson-700 dark:text-crimson-400 font-mono">
                      Non-Gazetted 1st Class
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-crimson-100 dark:bg-crimson-950 text-crimson-800 dark:text-crimson-200">
                      10+2 / Higher Sec
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                    Nayab Subba (नायब सुब्बा)
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Key administrative supervision rank across General Administration, Accounts, and Revenue. 100M Phase I
                    (40% pass gate, 50% carried forward), 2 written papers (200M), and Computer Skill Test + Interview.
                  </p>
                  <Link
                    to="/syllabus/nayab-subba"
                    className="inline-flex items-center text-xs font-semibold text-crimson-700 dark:text-crimson-400 hover:underline pt-2"
                  >
                    Na. Su. Blueprint &amp; PDF →
                  </Link>
                </div>

                <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
                      Non-Gazetted 2nd Class
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200">
                      SEE / SLC
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                    Kharidar (खरिदार)
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Foundation civil service operational rank. 100M Phase I Basic Aptitude (40% pass gate, 50% carried forward),
                    2 written office administration papers (200M), and Computer Skill Test + Interview.
                  </p>
                  <Link
                    to="/syllabus/kharidar"
                    className="inline-flex items-center text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline pt-2"
                  >
                    Kharidar Blueprint &amp; PDF →
                  </Link>
                </div>
              </div>
            </section>

            {/* Academic & Editorial Integrity */}
            <section className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/40 space-y-4">
              <div className="flex items-center gap-2.5 text-zinc-900 dark:text-zinc-100 font-semibold">
                <ShieldCheck className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                <span>Statutory Grounding &amp; Continuous Errata Review</span>
              </div>
              <p className="text-fluid-body text-zinc-600 dark:text-zinc-400 leading-relaxed">
                All curricula, objective questions, and written model answers on PSC Nepal are strictly reconciled against
                official gazette publications of the Public Service Commission (<span className="font-mono text-zinc-800 dark:text-zinc-200">psc.gov.np</span>),
                authenticated acts published by the Nepal Law Commission, and periodic economic plans approved by the National
                Planning Commission. If any legislative revision occurs, our editorial desk rapidly reconciles citations
                and releases errata updates.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 text-blue-700 dark:text-blue-400 hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Report Question Errata / Suggest Syllabus Update</span>
                </Link>
                <span className="text-zinc-300 dark:text-zinc-700" aria-hidden="true">·</span>
                <Link
                  to="/terms"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:underline"
                >
                  Educational Terms &amp; Disclaimer
                </Link>
              </div>
            </section>

            {/* Connect & Contact Card */}
            <section className="p-6 sm:p-8 rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-semibold text-sm">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Get in Touch with the Editorial Desk</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  Have feedback, question corrections, or requests for additional statutory acts? Reach out directly.
                </p>
                <div className="pt-1">
                  <a
                    href="mailto:info.pscnepal@gmail.com"
                    className="font-mono text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300 hover:underline"
                  >
                    info.pscnepal@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center min-h-10 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-2xs"
                >
                  Submit Inquiry Ticket
                </Link>
                <Link
                  to="/simulate"
                  className="inline-flex items-center justify-center min-h-10 px-4 rounded-xl bg-crimson-700 hover:bg-crimson-800 dark:bg-crimson-600 dark:hover:bg-crimson-500 text-white text-xs font-semibold transition-colors shadow-2xs"
                >
                  Launch Mock Exam
                </Link>
              </div>
            </section>
          </article>
        </main>

        <Footer />
      </PageTransition>
    </div>
  );
}
