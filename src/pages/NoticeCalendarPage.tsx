import { useId, useMemo, useState } from 'react';
import {
  AlertCircle,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  FileCheck,
  Info,
  MapPin,
  Printer,
  Search,
  Sparkles,
  Timer,
  X,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { ActionButton } from '../components/common/ActionButton';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import {
  PSC_ANNUAL_CALENDAR_EVENTS,
  PSC_OFFICIAL_NOTICES,
  type NoticeCategory,
  type PscNotice,
} from '../data/pscCalendarData';

export type CalendarPageTab = 'calendar' | 'notices' | 'guidelines';

export function NoticeCalendarPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputId = useId();

  const activeTab: CalendarPageTab = (searchParams.get('tab') as CalendarPageTab) || 'calendar';

  const handleTabChange = (tab: CalendarPageTab) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', tab);
      return next;
    });
  };

  // Calendar tab filters
  const [selectedCadre, setSelectedCadre] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Notices tab filters
  const [noticeSearch, setNoticeSearch] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<NoticeCategory | 'all'>('all');
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);
  const [copiedNoticeId, setCopiedNoticeId] = useState<string | null>(null);

  // Exam hall checklist state (persisted in localStorage)
  const [checkedChecklistItems, setCheckedChecklistItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('psc_exam_hall_checklist_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleChecklistItem = (key: string) => {
    setCheckedChecklistItems((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('psc_exam_hall_checklist_v1', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleCopyNotice = (notice: PscNotice) => {
    const text = `[लोक सेवा आयोग सूचना] ${notice.titleNe}\n${notice.noticeNumber} | मिति: ${notice.publishedDateBS}\nस्रोत: ${notice.officialSource}\n\n${notice.summaryNe}`;
    navigator.clipboard.writeText(text);
    setCopiedNoticeId(notice.id);
    setTimeout(() => setCopiedNoticeId(null), 2000);
  };

  // Filtered Calendar Events
  const filteredEvents = useMemo(() => {
    return PSC_ANNUAL_CALENDAR_EVENTS.filter((ev) => {
      if (selectedCadre !== 'all' && ev.cadreId !== selectedCadre) {
        return false;
      }
      if (selectedStatus !== 'all' && ev.status !== selectedStatus) {
        return false;
      }
      return true;
    });
  }, [selectedCadre, selectedStatus]);

  // Filtered Notices
  const filteredNotices = useMemo(() => {
    return PSC_OFFICIAL_NOTICES.filter((n) => {
      if (noticeCategory !== 'all' && n.category !== noticeCategory) {
        return false;
      }
      if (noticeSearch.trim()) {
        const q = noticeSearch.toLowerCase();
        const inNe = n.titleNe.toLowerCase().includes(q) || n.summaryNe.toLowerCase().includes(q);
        const inEn = n.titleEn.toLowerCase().includes(q) || n.summaryEn.toLowerCase().includes(q);
        const inNum = n.noticeNumber.toLowerCase().includes(q);
        if (!inNe && !inEn && !inNum) {
          return false;
        }
      }
      return true;
    });
  }, [noticeCategory, noticeSearch]);

  // Find next highlighted exam event
  const primaryUpcomingEvent = PSC_ANNUAL_CALENDAR_EVENTS.find((e) => e.isHighPriority && e.status === 'exam-scheduled') || PSC_ANNUAL_CALENDAR_EVENTS[0];

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <Navbar />

        <main className="flex-1 pt-20 pb-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li>
                <Link to="/" className="hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-zinc-800 dark:text-zinc-200 font-medium">
                PSC Calendar &amp; Official Notices (वार्षिक कार्यतालिका तथा सूचना)
              </li>
            </ol>
          </nav>

          {/* Hero Banner with Countdown & Live Calendar Header */}
          <div className="relative rounded-2xl bg-gradient-to-br from-zinc-900 via-blue-950 to-zinc-950 text-white p-6 sm:p-8 mb-8 overflow-hidden border border-zinc-800 shadow-xl">
            <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute right-32 -top-12 w-64 h-64 bg-crimson-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-medium mb-3">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>आधिकारिक पदपूर्ति कार्यतालिका २०८१/८२</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
                  लोक सेवा आयोग परीक्षा तथा विज्ञापन कार्यतालिका
                </h1>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                  Official Nepal PSC annual recruitment timeline, application deadlines, examination routines,
                  hall venue notices, and OMR guidelines for Section Officer, Nayab Subba, and Kharidar.
                </p>
              </div>

              {/* Action Buttons in Hero */}
              <div className="flex flex-wrap sm:flex-nowrap md:flex-col gap-2.5 shrink-0">
                <ActionButton
                  icon={Printer}
                  label="Print Schedule"
                  title="Print clean annual calendar reference sheet"
                  color="blue"
                  variant="solid"
                  size="md"
                  onClick={() => window.print()}
                  className="w-full justify-center"
                />
                <ActionButton
                  icon={BookOpen}
                  label="Exam Hall Simulator"
                  title="Practice with digital OMR bubble sheet"
                  color="crimson"
                  variant="solid"
                  size="md"
                  to="/simulate"
                  className="w-full justify-center"
                />
              </div>
            </div>

            {/* Upcoming Milestone Highlight Box */}
            {primaryUpcomingEvent && (
              <div className="mt-6 pt-5 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5" />
                    <span>Next Key Examination Milestone:</span>
                  </div>
                  <div className="font-serif text-base font-bold text-white">
                    {primaryUpcomingEvent.cadreTitleNe} ({primaryUpcomingEvent.cadreTitleEn})
                  </div>
                  <div className="text-xs text-zinc-300">
                    प्रथम चरण परीक्षा: <strong className="text-white">{primaryUpcomingEvent.stage1ExamDateBS}</strong> ({primaryUpcomingEvent.stage1ExamDateAD})
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <ActionButton
                    label="View Syllabus"
                    title="View syllabus units for this post"
                    color="zinc"
                    variant="outline"
                    size="sm"
                    to={primaryUpcomingEvent.syllabusUrl}
                  />
                  <ActionButton
                    label="Launch Mock Test"
                    title="Simulate Paper I OMR exam"
                    color="blue"
                    variant="solid"
                    size="sm"
                    to={`/simulate?preset=${encodeURIComponent(primaryUpcomingEvent.simulationPreset)}&launch=1`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tab Navigation Navigation Bar */}
          <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 mb-8 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => handleTabChange('calendar')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'calendar'
                  ? 'border-blue-700 text-blue-700 dark:border-blue-400 dark:text-blue-300'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Annual Vacancy Calendar (वार्षिक कार्यतालिका)</span>
              <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                {PSC_ANNUAL_CALENDAR_EVENTS.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('notices')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'notices'
                  ? 'border-blue-700 text-blue-700 dark:border-blue-400 dark:text-blue-300'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Official Notices &amp; Results (ताजा सूचना तथा नतिजा)</span>
              <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                {PSC_OFFICIAL_NOTICES.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('guidelines')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'guidelines'
                  ? 'border-blue-700 text-blue-700 dark:border-blue-400 dark:text-blue-300'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>OMR &amp; Exam Hall Rules (परीक्षा हल निर्देशिका)</span>
            </button>
          </div>

          {/* TAB 1: Annual Vacancy Calendar */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              {/* Calendar Filters */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 sm:p-5 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-zinc-500 uppercase tracking-wider mr-1">Filter Cadre:</span>
                  {[
                    { id: 'all', label: 'All Cadres' },
                    { id: 'section-officer', label: 'Section Officer (अधिकृत)' },
                    { id: 'nayab-subba', label: 'Nayab Subba (ना.सु.)' },
                    { id: 'kharidar', label: 'Kharidar (खरिदार)' },
                    { id: 'technical-engineering', label: 'Engineering' },
                    { id: 'technical-health', label: 'Health Service' },
                  ].map((cadre) => (
                    <button
                      key={cadre.id}
                      type="button"
                      onClick={() => setSelectedCadre(cadre.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        selectedCadre === cadre.id
                          ? 'bg-blue-700 text-white dark:bg-blue-600'
                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {cadre.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs shrink-0">
                  <span className="font-semibold text-zinc-500">Status:</span>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-2.5 py-1 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="all">All Statuses</option>
                    <option value="exam-scheduled">Exam Scheduled</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Calendar Events List / Table Cards */}
              <div className="space-y-4">
                {filteredEvents.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white dark:bg-zinc-900 rounded-xl border transition-all ${
                      item.isHighPriority
                        ? 'border-blue-300 dark:border-blue-900/60 shadow-xs'
                        : 'border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    <div className="p-5 sm:p-6 space-y-4">
                      {/* Top Header Row: Cadre title, Rank, Status Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              {item.levelRankNe} ({item.levelRankEn})
                            </span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                              {item.competitionTypeLabel} · Est. {item.estimatedSeats} पदहरू
                            </span>
                          </div>
                          <h2 className="text-lg sm:text-xl font-serif font-bold text-zinc-950 dark:text-zinc-50">
                            {item.cadreTitleNe} <span className="text-sm font-sans font-normal text-zinc-500">({item.cadreTitleEn})</span>
                          </h2>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">{item.serviceGroup}</p>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              item.status === 'exam-scheduled'
                                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                                : item.status === 'upcoming'
                                  ? 'bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                                  : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
                            }`}
                          >
                            {item.statusLabelNe}
                          </span>
                        </div>
                      </div>

                      {/* Timeline Grid (4 steps) */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-50 dark:bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800/80 text-xs">
                        <div>
                          <div className="text-zinc-500 dark:text-zinc-400 font-medium">१. विज्ञापन प्रकाशन मिति</div>
                          <div className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">{item.adPublishDateBS}</div>
                          <div className="text-[11px] text-zinc-400">{item.adPublishDateAD}</div>
                        </div>
                        <div>
                          <div className="text-zinc-500 dark:text-zinc-400 font-medium">२. दरखास्त म्याद</div>
                          <div className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">{item.applicationDeadlineBS}</div>
                          <div className="text-[11px] text-zinc-400">अनलाइन दरखास्त प्रणाली</div>
                        </div>
                        <div>
                          <div className="text-zinc-500 dark:text-zinc-400 font-medium">३. प्रथम चरण परीक्षा (OMR)</div>
                          <div className="font-semibold text-blue-700 dark:text-blue-400 mt-0.5">{item.stage1ExamDateBS}</div>
                          <div className="text-[11px] text-zinc-400">{item.stage1ExamDateAD}</div>
                        </div>
                        <div>
                          <div className="text-zinc-500 dark:text-zinc-400 font-medium">४. द्वितीय चरण (लिखित)</div>
                          <div className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">{item.stage2ExamDateBS}</div>
                          <div className="text-[11px] text-zinc-400">{item.stage2ExamDateAD}</div>
                        </div>
                      </div>

                      {/* Eligibility & Exam Center Note */}
                      <div className="text-xs space-y-1.5 text-zinc-700 dark:text-zinc-300">
                        <div className="flex items-start gap-1.5">
                          <strong className="text-zinc-900 dark:text-zinc-100 shrink-0">शैक्षिक योग्यता तथा उमेर:</strong>
                          <span>{item.eligibilitySnippet}</span>
                        </div>
                        {item.examCenterNoticeSnippet && (
                          <div className="flex items-start gap-1.5 text-zinc-600 dark:text-zinc-400">
                            <strong className="text-zinc-800 dark:text-zinc-200 shrink-0">परीक्षा केन्द्र सूचना:</strong>
                            <span>{item.examCenterNoticeSnippet}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="text-zinc-500 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span>केन्द्रीय तथा प्रादेशिक कार्यालयहरू मार्फत सञ्चालन</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <ActionButton
                            icon={BookOpen}
                            label="View Syllabus"
                            title="Inspect official paper scheme & topics"
                            color="zinc"
                            variant="outline"
                            size="sm"
                            to={item.syllabusUrl}
                          />
                          <ActionButton
                            icon={Sparkles}
                            label="Simulate OMR Hall"
                            title="Take timed Paper I objective simulation"
                            color="blue"
                            variant="solid"
                            size="sm"
                            to={`/simulate?preset=${encodeURIComponent(item.simulationPreset)}&launch=1`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Official Notice Board & Results */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              {/* Notice Search & Filter */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 sm:p-5 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <label htmlFor={searchInputId} className="sr-only">
                    Search Notices
                  </label>
                  <input
                    id={searchInputId}
                    type="text"
                    value={noticeSearch}
                    onChange={(e) => setNoticeSearch(e.target.value)}
                    placeholder="Search notices by title, cadre, or notice number (e.g., २८२, परीक्षा भवन, नायब सुब्बा)..."
                    className="w-full pl-9 pr-9 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  {noticeSearch && (
                    <button
                      type="button"
                      onClick={() => setNoticeSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto shrink-0">
                  <span className="text-xs font-semibold text-zinc-500 uppercase mr-1">Category:</span>
                  {[
                    { id: 'all', label: 'All Notices' },
                    { id: 'exam-center', label: 'Exam Centers (भवन)' },
                    { id: 'vacancy-ad', label: 'Vacancy Ads (विज्ञापन)' },
                    { id: 'general-notice', label: 'Guidelines (निर्देशिका)' },
                    { id: 'written-result', label: 'Results (नतिजा)' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setNoticeCategory(cat.id as any)}
                      className={`px-3 py-1 text-xs rounded-full whitespace-nowrap font-medium transition-colors ${
                        noticeCategory === cat.id
                          ? 'bg-blue-700 text-white dark:bg-blue-600'
                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notice Feed */}
              <div className="space-y-4">
                {filteredNotices.map((notice) => {
                  const isExpanded = expandedNoticeId === notice.id;

                  return (
                    <div
                      key={notice.id}
                      className={`bg-white dark:bg-zinc-900 rounded-xl border transition-all ${
                        notice.isImportant
                          ? 'border-crimson-300 dark:border-crimson-900/60 shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      <div className="p-5 sm:p-6 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {notice.isImportant && (
                              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-crimson-50 text-crimson-700 dark:bg-crimson-950/60 dark:text-crimson-400 border border-crimson-200 dark:border-crimson-800">
                                अत्यावश्यक सूचना
                              </span>
                            )}
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              {notice.categoryLabelNe} ({notice.categoryLabelEn})
                            </span>
                            <span className="text-xs text-zinc-500 font-mono">{notice.noticeNumber}</span>
                          </div>

                          <div className="text-xs text-zinc-500 font-medium">
                            प्रकाशन: {notice.publishedDateBS} ({notice.publishedDateAD})
                          </div>
                        </div>

                        <div>
                          <h3 className="text-base sm:text-lg font-serif font-bold text-zinc-950 dark:text-zinc-50 leading-snug">
                            {notice.titleNe}
                          </h3>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{notice.titleEn}</p>
                        </div>

                        {/* Summary */}
                        <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950/50 p-3.5 rounded-lg border border-zinc-100 dark:border-zinc-800/80 leading-relaxed space-y-1.5">
                          <p>{notice.summaryNe}</p>
                          {isExpanded && <p className="text-zinc-500 dark:text-zinc-400 text-xs italic pt-1">{notice.summaryEn}</p>}
                        </div>

                        {/* Source stamp & actions */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="text-zinc-500 text-[11px] flex items-center gap-1.5">
                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">स्रोत:</span>
                            <span>{notice.officialSource}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <ActionButton
                              icon={Copy}
                              label={copiedNoticeId === notice.id ? 'Copied' : 'Copy'}
                              title="Copy notice citation and details"
                              color="zinc"
                              variant="outline"
                              size="xs"
                              onClick={() => handleCopyNotice(notice)}
                            />

                            {notice.actionUrl && (
                              <ActionButton
                                icon={ExternalLink}
                                label="Open Action"
                                title="Open related simulator or syllabus"
                                color="blue"
                                variant="outline"
                                size="xs"
                                to={notice.actionUrl}
                              />
                            )}

                            <ActionButton
                              icon={isExpanded ? ChevronUp : ChevronDown}
                              label={isExpanded ? 'Less' : 'More'}
                              title={isExpanded ? 'Show less' : 'View full notice translation'}
                              color="zinc"
                              variant="ghost"
                              size="xs"
                              onClick={() => setExpandedNoticeId(isExpanded ? null : notice.id)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: OMR & Exam Hall Rules & Interactive Checklist */}
          {activeTab === 'guidelines' && (
            <div className="space-y-8">
              {/* Exam Hall Protocols */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mandatory Items Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-emerald-200 dark:border-emerald-900/60 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-serif font-bold text-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h3>परीक्षा हलमा अनिवार्य रूपमा लैजानुपर्ने वस्तुहरू</h3>
                  </div>

                  <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                      <span>
                        <strong>सक्कल प्रवेशपत्र (Original Admit Card):</strong> अनलाइन दरखास्त प्रणालीबाट डाउनलोड गरी स्पष्ट फोटो तथा विवरण प्रिन्ट गरिएको।
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                      <span>
                        <strong>नागरिकता प्रमाणपत्र (Citizenship Card):</strong> वा नेपाल सरकारबाट जारी भएको सक्कल फोटोसहितको परिचयपत्र (पासपोर्ट/सवारी चालक अनुमतिपत्र/मतदाता परिचयपत्र)।
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                      <span>
                        <strong>कालो मसी भएको बलपेन (Black Ballpoint Pen):</strong> OMR सिटमा सिसाकलम (Pencil) वा नीलो/रातो मसी प्रयोग गर्न पाइँदैन।
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                      <span>
                        <strong>समय पालना:</strong> परीक्षा सुरु हुनुभन्दा कम्तीमा १ घण्टा अगावै परीक्षा केन्द्रमा अनिवार्य उपस्थित हुनुपर्नेछ। परीक्षा सुरु भएको १५ मिनेटपछि प्रवेश निषेध छ।
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Strictly Prohibited Items Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-crimson-200 dark:border-crimson-900/60 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-crimson-800 dark:text-crimson-400 font-serif font-bold text-lg">
                    <AlertCircle className="w-5 h-5 text-crimson-600 dark:text-crimson-400" />
                    <h3>परीक्षा हलभित्र पूर्ण रूपमा निषेधित वस्तुहरू</h3>
                  </div>

                  <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-crimson-600 mt-2 shrink-0" />
                      <span>
                        <strong>मोबाइल फोन तथा इलेक्ट्रोनिक डिभाइस:</strong> परीक्षा हलभित्र मोबाइल, स्मार्टवाच, ब्लुटुथ, वा कुनै पनि विद्युतीय उपकरण लैजान पूर्ण निषेध छ।
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-crimson-600 mt-2 shrink-0" />
                      <span>
                        <strong>क्यालकुलेटर (Calculators):</strong> सामान्य ज्ञान, बौद्धिक परीक्षण (IQ) तथा प्रथम चरणका कुनै पनि वस्तुगत परीक्षामा क्यालकुलेटर निषेध गरिएको छ।
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-crimson-600 mt-2 shrink-0" />
                      <span>
                        <strong>किताब, कापी तथा चिट:</strong> कुनै पनि प्रकारको कागज, फाराम वा अध्ययन सामग्री हलभित्र लैजान पाइँदैन।
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-crimson-600 mt-2 shrink-0" />
                      <span>
                        <strong>उत्तरपुस्तिका केरमेट:</strong> OMR सिटमा दुईवटा घेरा लगाउने, टिपेक्स (Fluid) प्रयोग गर्ने वा ब्लेडले कोर्ने कार्य गरेमा प्रश्न रद्द हुनेछ।
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* OMR Marking Rules & Scoring Math Card */}
              <div className="bg-blue-50/70 dark:bg-blue-950/40 rounded-xl p-6 border border-blue-200 dark:border-blue-900/60 space-y-4">
                <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-serif font-bold text-lg">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3>वस्तुगत OMR मार्किङ नियम तथा २०% नेगेटिभ मार्किङ विधि</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                  <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="font-semibold text-emerald-700 dark:text-emerald-400">सहि उत्तर बापत (Correct)</div>
                    <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">+२ वा +१ अङ्क</div>
                    <p className="text-zinc-500 mt-1">अधिकृत प्रथम पत्रमा प्रति प्रश्न २ अङ्क, खरिदारमा प्रति प्रश्न २ अङ्क।</p>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="font-semibold text-crimson-700 dark:text-crimson-400">गलत उत्तर बापत (-२०% कट्टा)</div>
                    <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">-०.४ वा -०.२ अङ्क</div>
                    <p className="text-zinc-500 mt-1">प्राप्त कुल प्राप्ताङ्कबाट २० प्रतिशत अङ्क स्वतः कट्टी गरिनेछ।</p>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="font-semibold text-zinc-700 dark:text-zinc-300">खाली छोडेमा (Unattempted)</div>
                    <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">० अङ्क (शून्य)</div>
                    <p className="text-zinc-500 mt-1">शंकास्पद प्रश्न खाली छोड्नु नेगेटिभ मार्किङबाट बच्ने उत्तम रणनीति हो।</p>
                  </div>
                </div>
              </div>

              {/* Interactive Exam Day Readiness Checklist */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-serif font-bold text-lg text-zinc-950 dark:text-zinc-50">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3>परीक्षार्थी व्यक्तिगत चेकलिस्ट (Exam Day Readiness Checklist)</h3>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">
                    {Object.values(checkedChecklistItems).filter(Boolean).length}/6 Prepared
                  </span>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Tick off each preparation checkpoint as you assemble your examination kit:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  {[
                    { id: 'admit-card', label: 'Admit Card Printed (सक्कल प्रवेशपत्र स्पष्ट छापिएको)' },
                    { id: 'citizenship', label: 'Original Citizenship Card (सक्कल नागरिकता प्रमाणपत्र)' },
                    { id: 'black-pens', label: 'Two Good Black Ballpoint Pens (२ वटा भरपर्दो कालो मसी बलपेन)' },
                    { id: 'venue-checked', label: 'Exam Center Location Verified (परीक्षा भवनको सही स्थान यकिन गरिएको)' },
                    { id: 'analog-watch', label: 'Standard Simple Analog Watch (सादा घडी, नो स्मार्टवाच)' },
                    { id: 'water-bottle', label: 'Clear Transparent Water Bottle (पारदर्शी पानीको बोतल)' },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-950 cursor-pointer select-none transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(checkedChecklistItems[item.id])}
                        onChange={() => toggleChecklistItem(item.id)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className={checkedChecklistItems[item.id] ? 'line-through text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
