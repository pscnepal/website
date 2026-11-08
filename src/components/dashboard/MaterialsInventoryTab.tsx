import { useMemo, useState } from 'react';
import {
  BookOpen,
  Check,
  Copy,
  Download,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { recordView } from '../../features/reactions/reactionsSlice';
import {
  READING_MATERIAL_CATEGORIES,
  type ReadingMaterialItem,
} from '../../data/readingMaterials';
import { resolveSampleUrl } from '../../utils/urlHelpers';
import { ActionButton } from '../common/ActionButton';
import { ReactionButtons } from '../common/ReactionButtons';
import { SharedTable, type ColumnDef } from '../common/SharedTable';

type MaterialTableRow = ReadingMaterialItem & {
  categoryName: string;
  categoryId: string;
};

export function MaterialsInventoryTab() {
  const dispatch = useAppDispatch();
  const userReactions = useAppSelector((state) => state.reactions.userReactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [reactionFilter, setReactionFilter] = useState<'all' | 'liked' | 'disliked' | 'unrated'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const allItems = useMemo(() => {
    const list: MaterialTableRow[] = [];
    READING_MATERIAL_CATEGORIES.forEach((cat) => {
      cat.items.forEach((it) => {
        list.push({ ...it, categoryName: cat.name, categoryId: cat.id });
      });
    });
    return list;
  }, []);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      if (selectedCat !== 'all' && item.categoryId !== selectedCat) {
        return false;
      }
      if (reactionFilter === 'liked' && userReactions[item.id] !== 'like') {
        return false;
      }
      if (reactionFilter === 'disliked' && userReactions[item.id] !== 'dislike') {
        return false;
      }
      if (reactionFilter === 'unrated' && userReactions[item.id]) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCode = item.codeOrEdition.toLowerCase().includes(query);
        const matchesAuth = item.authority.toLowerCase().includes(query);
        return matchesTitle || matchesDesc || matchesCode || matchesAuth;
      }
      return true;
    });
  }, [allItems, selectedCat, reactionFilter, userReactions, searchQuery]);

  const handleCopy = (fullUrl: string, id: string) => {
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const columns: ColumnDef<MaterialTableRow>[] = useMemo(
    () => [
      {
        id: 'codeOrEdition',
        header: 'Edition / Code',
        width: 'w-28',
        sortable: true,
        sortKey: (item) => item.codeOrEdition,
        className: 'font-mono font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap',
        render: (item) => item.codeOrEdition,
      },
      {
        id: 'titleAndAuthority',
        header: 'Document Title & Authority',
        className: 'min-w-[260px]',
        sortable: true,
        sortKey: (item) => item.title,
        render: (item) => (
          <div>
            <p className="font-serif text-[13px] font-semibold text-zinc-950 dark:text-zinc-100">
              {item.title}
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
              {item.authority}
            </p>
          </div>
        ),
      },
      {
        id: 'category',
        header: 'Category',
        width: 'w-40',
        hideOnMobile: true,
        sortable: true,
        sortKey: (item) => item.categoryName,
        render: (item) => (
          <span className="font-medium text-zinc-800 dark:text-zinc-200 block text-xs">
            {item.categoryName}
          </span>
        ),
      },
      {
        id: 'pages',
        header: 'Pages',
        width: 'w-20',
        align: 'center',
        sortable: true,
        sortKey: (item) => item.pages,
        render: (item) => (
          <span className="font-mono tabular-nums font-bold text-zinc-900 dark:text-zinc-100">
            {item.pages}
          </span>
        ),
      },
      {
        id: 'ratings',
        header: 'Views & Ratings',
        width: 'w-44',
        render: (item) => (
          <ReactionButtons
            itemId={item.id}
            itemType="material"
            size="xs"
          />
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        width: 'w-36',
        align: 'right',
        render: (item) => {
          const fullUrl = resolveSampleUrl(item.path);
          const isCopied = copiedId === item.id;
          return (
            <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
              <ActionButton
                to={`/read?url=${encodeURIComponent(fullUrl)}`}
                onClick={() => dispatch(recordView({ itemId: item.id }))}
                title="Open 3D Flipbook or PDF Reader"
                label="Read"
                color="blue"
                variant="solid"
                size="xs"
                icon={BookOpen}
              />
              <ActionButton
                href={fullUrl}
                download
                title="Download PDF"
                color="zinc"
                variant="outline"
                size="xs"
                icon={Download}
              />
              <ActionButton
                onClick={() => handleCopy(fullUrl, item.id)}
                title={isCopied ? 'Direct URL copied!' : 'Copy direct document URL'}
                color={isCopied ? 'emerald' : 'zinc'}
                variant="outline"
                size="xs"
                icon={isCopied ? Check : Copy}
              />
            </div>
          );
        },
      },
    ],
    [copiedId]
  );

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50">
              Official Study Materials &amp; Parichaya Archives
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Complete inventory of 13 official editions of Nepal Parichaya (२०६९—२०८२), Constitution, and Statutory Acts
            </p>
          </div>
          <span className="font-mono tabular-nums text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
            {filteredItems.length} Documents Indexed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search document title, edition (13th, 12th, २०८२), publisher, or keyword..."
              className="w-full h-9 pl-8 pr-8 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {searchQuery && (
              <span className="absolute right-1.5 top-1/2 -translate-y-1/2">
                <ActionButton
                  title="Clear search"
                  icon={X}
                  color="zinc"
                  variant="ghost"
                  size="xs"
                  onClick={() => setSearchQuery('')}
                />
              </span>
            )}
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              aria-label="Filter by material category"
              className="w-full h-9 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {READING_MATERIAL_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.items.length})
                </option>
              ))}
            </select>
          </div>

          {/* Reaction / Bookmark Filter */}
          <div className="sm:col-span-3">
            <select
              value={reactionFilter}
              onChange={(e) => setReactionFilter(e.target.value as any)}
              aria-label="Filter by material rating"
              className="w-full h-9 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer font-medium"
            >
              <option value="all">All Document Ratings</option>
              <option value="liked">Liked (★ Saved)</option>
              <option value="disliked">Disliked</option>
              <option value="unrated">Unrated Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shared Materials Inventory Table */}
      <SharedTable<MaterialTableRow>
        data={filteredItems}
        columns={columns}
        keyExtractor={(item) => item.id}
        pagination={true}
        defaultPageSize={15}
        pageSizeOptions={[10, 15, 25]}
        emptyMessage="No documents match your query"
        emptyDescription="Try clearing your search query or switching to All Categories."
        emptyAction={
          <ActionButton
            label="Reset Filters"
            title="Reset filters and search query"
            color="blue"
            variant="solid"
            size="sm"
            icon={RotateCcw}
            onClick={() => {
              setSearchQuery('');
              setSelectedCat('all');
              setReactionFilter('all');
            }}
          />
        }
      />
    </div>
  );
}
