import { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Copy,
  LayoutGrid,
  List,
  Plus,
  UserCheck,
  X,
} from 'lucide-react';
import {
  INITIAL_CANDIDATE_USERS,
  type CandidateUser,
} from '../../data/candidateUsersData';
import { ActionButton } from '../common/ActionButton';
import {
  SharedActionMenu,
  type ActionMenuItem,
} from '../common/SharedActionMenu';
import {
  SharedDataTable,
  type ColumnDef,
  type TableFilterDef,
} from '../common/SharedDataTable';

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
        sortable: true,
        sortKey: (cand) => cand.nameEn,
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
        sortable: true,
        sortKey: (cand) => cand.targetCadre,
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
        sortable: true,
        sortKey: (cand) => cand.district,
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
        sortable: true,
        sortKey: (cand) => cand.mockAverageScore,
        render: (cand) => (
          <span className="font-mono tabular-nums font-bold text-emerald-700 dark:text-emerald-400">
            {cand.mockAverageScore}%
          </span>
        ),
      },
      {
        id: 'percentile',
        header: 'Percentile',
        width: 'w-24',
        align: 'center',
        sortable: true,
        sortKey: (cand) => cand.mockPercentile,
        render: (cand) => (
          <span className="font-mono tabular-nums font-semibold text-blue-700 dark:text-blue-400">
            {cand.mockPercentile}th %ile
          </span>
        ),
      },
      {
        id: 'status',
        header: 'Standing',
        width: 'w-28',
        align: 'center',
        sortable: true,
        sortKey: (cand) => cand.status,
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
        width: 'w-32',
        align: 'right',
        render: (cand) => {
          const actionMenuItems: ActionMenuItem[] = [
            {
              id: 'dossier',
              label: 'View Detailed Dossier',
              description: `${cand.province} · ${cand.district}`,
              icon: UserCheck,
              color: 'blue',
              onClick: () => setSelectedCandidate(cand),
            },
            {
              id: 'scores',
              label: 'Mock Test Metrics',
              description: `${cand.mockAverageScore}% Average · ${cand.mockPercentile}th %ile`,
              icon: Award,
              color: 'emerald',
              onClick: () => setSelectedCandidate(cand),
            },
            {
              id: 'focus',
              label: 'Target Cadre & Syllabus',
              description: cand.targetCadreLabel,
              icon: BookOpen,
              color: 'purple',
              onClick: () => setSelectedCandidate(cand),
            },
            {
              id: 'copy-roll',
              label: `Copy Roll (${cand.rollCode})`,
              icon: Copy,
              color: 'zinc',
              divider: true,
              onClick: () => {
                navigator.clipboard.writeText(cand.rollCode);
              },
            },
          ];

          return (
            <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
              <ActionButton
                label="Dossier"
                title={`View detailed dossier for ${cand.nameEn}`}
                color="blue"
                variant="outline"
                size="xs"
                icon={UserCheck}
                onClick={() => setSelectedCandidate(cand)}
              />
              <SharedActionMenu
                items={actionMenuItems}
                title={`Actions for ${cand.nameEn}`}
                color="zinc"
                variant="outline"
                size="xs"
                width="w-60"
                header={cand.rollCode}
              />
            </div>
          );
        },
      },
    ],
    []
  );

  const tableFilters: TableFilterDef[] = useMemo(
    () => [
      {
        id: 'cadre',
        label: 'Cadre',
        value: cadreFilter,
        onChange: setCadreFilter,
        options: [
          { label: 'All Cadres', value: 'all' },
          { label: 'Section Officer (शाखा अधिकृत)', value: 'section-officer' },
          { label: 'Nayab Subba (नायब सुब्बा)', value: 'nayab-subba' },
          { label: 'Kharidar (खरिदार)', value: 'kharidar' },
        ],
      },
      {
        id: 'status',
        label: 'Standing',
        value: statusFilter,
        onChange: setStatusFilter,
        options: [
          { label: 'All Standings', value: 'all' },
          { label: 'Top Rankers (>95th %ile)', value: 'ranker' },
          { label: 'Merit Standings', value: 'merit' },
          { label: 'Active Daily Aspirants', value: 'active' },
          { label: 'Review Editors', value: 'editor' },
        ],
      },
    ],
    [cadreFilter, statusFilter]
  );

  const isFiltered =
    cadreFilter !== 'all' ||
    statusFilter !== 'all' ||
    Boolean(searchQuery.trim());

  const handleResetFilters = () => {
    setSearchQuery('');
    setCadreFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Integrated Shared Data Table with Table/Card Modes, CSV Export, Filters, & Pagination */}
      <SharedDataTable<CandidateUser>
        title="Aspirants Directory & Peer Cohort"
        subtitle="Active Lok Sewa candidates across Nepal preparing for Section Officer, Nayab Subba, and Kharidar"
        totalCount={allCandidates.length}
        data={filteredCandidates}
        columns={columns}
        keyExtractor={(cand) => cand.id}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search candidate name, roll code, district (Kathmandu, Pokhara)..."
        filters={tableFilters}
        isFiltered={isFiltered}
        onResetFilters={handleResetFilters}
        enableCsvExport={true}
        csvFilename="psc-aspirants-directory.csv"
        pagination={true}
        defaultPageSize={12}
        pageSizeOptions={[12, 24, 48]}
        viewMode={viewMode}
        actions={
          <div className="flex items-center gap-2">
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
          </div>
        }
        renderCard={(cand) => (
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
                  <span className="text-[10px] text-zinc-400 block">Percentile</span>
                  <span className="font-bold text-blue-700 dark:text-blue-400">
                    {cand.mockPercentile}th %ile
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <ActionButton
                  label="View Dossier"
                  title={`View detailed dossier for ${cand.nameEn}`}
                  color="blue"
                  variant="outline"
                  size="sm"
                  icon={UserCheck}
                  className="flex-1"
                  onClick={() => setSelectedCandidate(cand)}
                />
                <SharedActionMenu
                  items={[
                    {
                      id: 'dossier',
                      label: 'Candidate Dossier',
                      description: `${cand.district}, ${cand.province}`,
                      icon: UserCheck,
                      color: 'blue',
                      onClick: () => setSelectedCandidate(cand),
                    },
                    {
                      id: 'scores',
                      label: 'Mock Exam Scorecard',
                      description: `${cand.mockAverageScore}% · ${cand.mockPercentile}th Percentile`,
                      icon: Award,
                      color: 'emerald',
                      onClick: () => setSelectedCandidate(cand),
                    },
                    {
                      id: 'syllabus',
                      label: 'Target Syllabus Area',
                      description: cand.focusArea,
                      icon: BookOpen,
                      color: 'purple',
                      onClick: () => setSelectedCandidate(cand),
                    },
                    {
                      id: 'copy-roll',
                      label: `Copy Roll (${cand.rollCode})`,
                      icon: Copy,
                      color: 'zinc',
                      divider: true,
                      onClick: () => {
                        navigator.clipboard.writeText(cand.rollCode);
                      },
                    },
                  ]}
                  title={`Actions for ${cand.nameEn}`}
                  color="zinc"
                  variant="outline"
                  size="sm"
                  width="w-60"
                  header={cand.rollCode}
                />
              </div>
            </div>
          </article>
        )}
        emptyMessage="No candidates matched your search criteria"
        emptyDescription="Try clearing your search query or switching cadre filters."
      />

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
              <ActionButton
                title="Close dossier"
                icon={X}
                color="zinc"
                variant="ghost"
                size="xs"
                onClick={() => setSelectedCandidate(null)}
              />
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
                    Written
                  </span>
                  <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {selectedCandidate.writtenMastered}
                  </span>
                  <span className="text-[10px] text-zinc-500 block">Mastered sets</span>
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
              <ActionButton
                title="Close form"
                icon={X}
                color="zinc"
                variant="ghost"
                size="xs"
                onClick={() => setIsAddModalOpen(false)}
              />
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
