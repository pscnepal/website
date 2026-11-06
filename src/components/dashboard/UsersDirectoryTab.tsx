import { useMemo, useState } from 'react';
import {
  Flame,
  LayoutGrid,
  List,
  Plus,
  RotateCcw,
  Search,
  UserCheck,
  X,
} from 'lucide-react';
import {
  INITIAL_CANDIDATE_USERS,
  type CandidateUser,
} from '../../data/candidateUsersData';
import { ActionButton } from '../common/ActionButton';
import { SharedTable, type ColumnDef } from '../common/SharedTable';

const LOCAL_USERS_KEY = 'psc_nepal_custom_candidates_v1';

export function UsersDirectoryTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cadreFilter, setCadreFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateUser | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Load custom candidates from localStorage
  const [customCandidates, setCustomCandidates] = useState<CandidateUser[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(LOCAL_USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Modal for adding a new aspirant
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formNameEn, setFormNameEn] = useState('');
  const [formNameNe, setFormNameNe] = useState('');
  const [formDistrict, setFormDistrict] = useState('Kathmandu');
  const [formCadre, setFormCadre] = useState<'section-officer' | 'nayab-subba' | 'kharidar'>('section-officer');
  const [formFocus, setFormFocus] = useState('Paper II: Governance & Law');
  const [formBio, setFormBio] = useState('');

  const allCandidates = useMemo(() => {
    return [...customCandidates, ...INITIAL_CANDIDATE_USERS];
  }, [customCandidates]);

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return allCandidates.filter((cand) => {
      if (cadreFilter !== 'all' && cand.targetCadre !== cadreFilter) {
        return false;
      }
      if (statusFilter !== 'all' && cand.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = cand.nameEn.toLowerCase().includes(query) || cand.nameNe.includes(query);
        const matchesDistrict = cand.district.toLowerCase().includes(query) || cand.province.toLowerCase().includes(query);
        const matchesRoll = cand.rollCode.toLowerCase().includes(query);
        const matchesFocus = cand.focusArea.toLowerCase().includes(query);
        return matchesName || matchesDistrict || matchesRoll || matchesFocus;
      }
      return true;
    });
  }, [allCandidates, cadreFilter, statusFilter, searchQuery]);

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameEn.trim()) return;

    const newCandidate: CandidateUser = {
      id: `cand-custom-${Date.now()}`,
      nameEn: formNameEn.trim(),
      nameNe: formNameNe.trim() || formNameEn.trim(),
      rollCode: `PSC-82-${formCadre === 'section-officer' ? 'SO' : formCadre === 'nayab-subba' ? 'NS' : 'KH'}-${Math.floor(1000 + Math.random() * 9000)}`,
      district: formDistrict,
      province: 'Bagmati',
      targetCadre: formCadre,
      targetCadreLabel:
        formCadre === 'section-officer'
          ? 'Section Officer (शाखा अधिकृत)'
          : formCadre === 'nayab-subba'
            ? 'Nayab Subba (नायब सुब्बा)'
            : 'Kharidar (खरिदार)',
      preparationStreakDays: 1,
      mockAverageScore: 70.0,
      mockPercentile: 90.0,
      questionsAttempted: 0,
      writtenMastered: 0,
      preferredLanguage: 'bilingual',
      status: 'active',
      focusArea: formFocus,
      joinedDate: new Date().toISOString().split('T')[0],
      avatarColor: 'from-blue-600 to-indigo-700',
      bio: formBio.trim() || 'New aspirant in the PSC Nepal study community.',
    };

    const updated = [newCandidate, ...customCandidates];
    setCustomCandidates(updated);
    try {
      window.localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage error
    }

    setIsAddModalOpen(false);
    setFormNameEn('');
    setFormNameNe('');
    setFormBio('');
  };

  const columns: ColumnDef<CandidateUser>[] = useMemo(
    () => [
      {
        id: 'candidate',
        header: 'Candidate & Roll Code',
        className: 'min-w-[220px]',
        render: (cand) => (
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-tr ${cand.avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}
            >
              {cand.nameEn[0]}
            </div>
            <div>
              <p className="font-serif font-bold text-zinc-950 dark:text-zinc-50 text-[13px] leading-tight">
                {cand.nameEn}
              </p>
              <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                {cand.rollCode} · <span lang="ne">{cand.nameNe}</span>
              </p>
            </div>
          </div>
        ),
      },
      {
        id: 'cadre',
        header: 'Target Cadre',
        width: 'w-48',
        render: (cand) => (
          <span className="font-medium text-zinc-800 dark:text-zinc-200 block text-xs">
            {cand.targetCadreLabel}
          </span>
        ),
      },
      {
        id: 'district',
        header: 'District',
        width: 'w-36',
        hideOnMobile: true,
        render: (cand) => (
          <span className="text-zinc-600 dark:text-zinc-400 text-xs">
            {cand.district}, {cand.province}
          </span>
        ),
      },
      {
        id: 'mockScore',
        header: 'Mock Avg',
        width: 'w-24',
        align: 'center',
        render: (cand) => (
          <span className="font-mono tabular-nums font-bold text-emerald-700 dark:text-emerald-400">
            {cand.mockAverageScore}%
          </span>
        ),
      },
      {
        id: 'streak',
        header: 'Streak',
        width: 'w-24',
        align: 'center',
        render: (cand) => (
          <span className="font-mono tabular-nums font-bold text-amber-600 dark:text-amber-400 inline-flex items-center gap-1">
            <Flame className="w-3 h-3 shrink-0" />
            <span>{cand.preparationStreakDays}d</span>
          </span>
        ),
      },
      {
        id: 'status',
        header: 'Standing',
        width: 'w-28',
        align: 'center',
        render: (cand) => (
          <span
            className={`font-mono text-[10.5px] font-semibold px-2 py-0.5 rounded border inline-block ${
              cand.status === 'ranker'
                ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                : cand.status === 'merit'
                  ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                  : cand.status === 'editor'
                    ? 'bg-purple-50 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
            }`}
          >
            {cand.status === 'ranker'
              ? 'Ranker'
              : cand.status === 'merit'
                ? 'Merit'
                : cand.status === 'editor'
                  ? 'Editor'
                  : 'Active'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        width: 'w-28',
        align: 'right',
        render: (cand) => (
          <div className="flex items-center justify-end">
            <ActionButton
              label="Dossier"
              title={`View detailed dossier for ${cand.nameEn}`}
              color="blue"
              variant="outline"
              size="xs"
              icon={UserCheck}
              onClick={() => setSelectedCandidate(cand)}
            />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50">
              Aspirants Directory &amp; Peer Cohort
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Active Lok Sewa candidates across Nepal preparing for Section Officer, Nayab Subba, and Kharidar
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* View Mode Toggle */}
            <div className="inline-flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-0.5">
              <ActionButton
                title="Table view"
                icon={List}
                variant={viewMode === 'table' ? 'solid' : 'ghost'}
                color="zinc"
                size="xs"
                onClick={() => setViewMode('table')}
              />
              <ActionButton
                title="Grid cards view"
                icon={LayoutGrid}
                variant={viewMode === 'cards' ? 'solid' : 'ghost'}
                color="zinc"
                size="xs"
                onClick={() => setViewMode('cards')}
              />
            </div>

            <ActionButton
              label="Register Candidate"
              title="Register a new aspirant or study partner"
              color="blue"
              variant="solid"
              size="sm"
              icon={Plus}
              onClick={() => setIsAddModalOpen(true)}
            />

            <span className="font-mono tabular-nums text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
              {filteredCandidates.length} Active Candidates
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, roll code, district (Kathmandu, Pokhara)..."
              className="w-full h-9 pl-8 pr-8 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Cadre Filter */}
          <div className="sm:col-span-3">
            <select
              value={cadreFilter}
              onChange={(e) => setCadreFilter(e.target.value)}
              aria-label="Filter by target cadre"
              className="w-full h-9 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="all">All Cadres</option>
              <option value="section-officer">Section Officer (शाखा अधिकृत)</option>
              <option value="nayab-subba">Nayab Subba (नायब सुब्बा)</option>
              <option value="kharidar">Kharidar (खरिदार)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by standing"
              className="w-full h-9 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="all">All Standings</option>
              <option value="ranker">Top Rankers (&gt;95th %ile)</option>
              <option value="merit">Merit Standings</option>
              <option value="active">Active Daily Aspirants</option>
              <option value="editor">Review Editors</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidate Display: Table or Cards */}
      {viewMode === 'table' ? (
        <SharedTable<CandidateUser>
          data={filteredCandidates}
          columns={columns}
          keyExtractor={(cand) => cand.id}
          emptyMessage="No candidates matched your search criteria"
          emptyDescription="Try clearing your search query or switching cadre filters."
          emptyAction={
            <ActionButton
              label="Reset Filters"
              title="Clear search query and cadre filters"
              color="blue"
              variant="solid"
              size="sm"
              icon={RotateCcw}
              onClick={() => {
                setSearchQuery('');
                setCadreFilter('all');
                setStatusFilter('all');
              }}
            />
          }
        />
      ) : filteredCandidates.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2 bg-white dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            No candidates matched your search criteria
          </p>
          <p className="text-xs text-zinc-500">
            Try resetting your search query or cadre filters.
          </p>
          <div className="pt-2">
            <ActionButton
              label="Reset Filters"
              title="Clear search query and cadre filters"
              color="blue"
              variant="solid"
              size="sm"
              icon={RotateCcw}
              onClick={() => {
                setSearchQuery('');
                setCadreFilter('all');
                setStatusFilter('all');
              }}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredCandidates.map((cand) => (
            <article
              key={cand.id}
              className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 space-y-4 hover:border-blue-600/50 dark:hover:border-blue-400/50 transition-colors shadow-2xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-11 h-11 rounded-full bg-gradient-to-tr ${cand.avatarColor} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs`}
                  >
                    {cand.nameEn[0]}
                  </div>
                  <span
                    className={`font-mono text-[10.5px] font-semibold px-2 py-0.5 rounded border ${
                      cand.status === 'ranker'
                        ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                        : cand.status === 'merit'
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                          : cand.status === 'editor'
                            ? 'bg-purple-50 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    {cand.status === 'ranker'
                      ? 'Ranker'
                      : cand.status === 'merit'
                        ? 'Merit'
                        : cand.status === 'editor'
                          ? 'Editor'
                          : 'Active'}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-zinc-950 dark:text-zinc-50 text-base leading-snug">
                    {cand.nameEn}
                  </h4>
                  <p lang="ne" className="text-xs text-zinc-500 font-medium">
                    {cand.nameNe}
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-500 font-mono">
                    {cand.rollCode} · {cand.district}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-mono font-semibold text-zinc-400 block">
                    Target Cadre
                  </span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200 block truncate">
                    {cand.targetCadreLabel}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {cand.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs font-mono tabular-nums">
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Mock Avg</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {cand.mockAverageScore}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Streak</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Flame className="w-3 h-3 shrink-0" />
                      <span>{cand.preparationStreakDays}d</span>
                    </span>
                  </div>
                </div>

                <ActionButton
                  label="View Dossier"
                  title={`View detailed dossier for ${cand.nameEn}`}
                  color="zinc"
                  variant="outline"
                  size="sm"
                  icon={UserCheck}
                  className="w-full"
                  onClick={() => setSelectedCandidate(cand)}
                />
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Candidate Detail Dossier Modal */}
      {selectedCandidate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="candidate-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-tr ${selectedCandidate.avatarColor} text-white flex items-center justify-center font-bold text-base shrink-0`}
                >
                  {selectedCandidate.nameEn[0]}
                </div>
                <div>
                  <h4 id="candidate-modal-title" className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50">
                    {selectedCandidate.nameEn}
                  </h4>
                  <p lang="ne" className="text-xs text-zinc-500 font-medium">
                    {selectedCandidate.nameNe} · {selectedCandidate.rollCode}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                aria-label="Close dossier"
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                <span className="font-mono text-[10px] text-zinc-400 uppercase">
                  Service &amp; Cadre Target
                </span>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                  {selectedCandidate.targetCadreLabel}
                </p>
                <p className="text-zinc-500">
                  District: {selectedCandidate.district}, {selectedCandidate.province} Province
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 font-mono tabular-nums text-center">
                <div className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <span className="text-[10px] text-zinc-400 block font-sans">
                    Mock Score
                  </span>
                  <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                    {selectedCandidate.mockAverageScore}%
                  </span>
                  <span className="text-[10px] text-zinc-500 block">
                    {selectedCandidate.mockPercentile}th %ile
                  </span>
                </div>

                <div className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <span className="text-[10px] text-zinc-400 block font-sans">
                    Questions
                  </span>
                  <span className="text-lg font-bold text-blue-700 dark:text-blue-400">
                    {selectedCandidate.questionsAttempted}
                  </span>
                  <span className="text-[10px] text-zinc-500 block">MCQs drilled</span>
                </div>

                <div className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <span className="text-[10px] text-zinc-400 block font-sans">
                    Streak
                  </span>
                  <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {selectedCandidate.preparationStreakDays}d
                  </span>
                  <span className="text-[10px] text-zinc-500 block">Active days</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  Focus Curriculum &amp; Specialization:
                </span>
                <p className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200">
                  {selectedCandidate.focusArea}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  Candidate Study Note:
                </span>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {selectedCandidate.bio}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <ActionButton
                label="Done"
                title="Close candidate dossier"
                color="zinc"
                variant="solid"
                size="sm"
                onClick={() => setSelectedCandidate(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add New Candidate Modal */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-candidate-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h4 id="add-candidate-title" className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50">
                Register Candidate / Study Buddy
              </h4>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                aria-label="Close form"
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCandidate} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
                    Full Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formNameEn}
                    onChange={(e) => setFormNameEn(e.target.value)}
                    placeholder="e.g. Suman Sharma"
                    className="w-full h-8 px-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
                    Name (नेपाली)
                  </label>
                  <input
                    type="text"
                    value={formNameNe}
                    onChange={(e) => setFormNameNe(e.target.value)}
                    placeholder="e.g. सुमन शर्मा"
                    className="w-full h-8 px-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
                    Target Cadre
                  </label>
                  <select
                    value={formCadre}
                    onChange={(e) => setFormCadre(e.target.value as any)}
                    className="w-full h-8 px-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="section-officer">Section Officer (शाखा अधिकृत)</option>
                    <option value="nayab-subba">Nayab Subba (नायब सुब्बा)</option>
                    <option value="kharidar">Kharidar (खरिदार)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
                    District
                  </label>
                  <input
                    type="text"
                    value={formDistrict}
                    onChange={(e) => setFormDistrict(e.target.value)}
                    placeholder="e.g. Pokhara, Lalitpur"
                    className="w-full h-8 px-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Focus Curriculum Area
                </label>
                <input
                  type="text"
                  value={formFocus}
                  onChange={(e) => setFormFocus(e.target.value)}
                  placeholder="e.g. Paper II Governance, Contemporary Issues"
                  className="w-full h-8 px-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Preparation Note / Bio
                </label>
                <textarea
                  rows={3}
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  placeholder="Goals, target year, or study routine..."
                  className="w-full p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <ActionButton
                  label="Cancel"
                  title="Cancel registration"
                  color="zinc"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                />
                <ActionButton
                  type="submit"
                  label="Save Candidate"
                  title="Save new candidate to study cohort"
                  color="blue"
                  variant="solid"
                  size="sm"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
