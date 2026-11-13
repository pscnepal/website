import { useMemo, useState } from 'react';
import {
  BookOpen,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { recordView } from '../../features/reactions/reactionsSlice';
import {
  READING_MATERIAL_CATEGORIES,
  type ReadingMaterialItem,
} from '../../data/readingMaterials';
import { resolveSampleUrl } from '../../utils/urlHelpers';
import {
  SharedActionMenu,
  type ActionMenuItem,
} from '../common/SharedActionMenu';
import { ReactionButtons } from '../common/ReactionButtons';
import {
  SharedDataTable,
  type ColumnDef,
  type TableFilterDef,
} from '../common/SharedDataTable';

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
        width: 'w-32',
        align: 'right',
        render: (item) => {
          const fullUrl = resolveSampleUrl(item.path);
          const isCopied = copiedId === item.id;

          const actionMenuItems: ActionMenuItem[] = [
            {
              id: 'flipbook-read',
              label: 'Read Document',
              description: '3D Flipbook or PDF Reader',
              icon: BookOpen,
              color: 'blue',
              to: `/read?url=${encodeURIComponent(fullUrl)}`,
              onClick: () => dispatch(recordView({ itemId: item.id, itemType: 'material' })),
            },
            {
              id: 'pdf-download',
              label: 'Download Official PDF',
              description: `${item.pages} pages archived document`,
              icon: Download,
              color: 'emerald',
              href: fullUrl,
              download: true,
            },
            ...(item.externalSourceUrl
              ? [
                  {
                    id: 'gov-source',
                    label: 'Official Gov Portal',
                    description: item.authority,
                    icon: ExternalLink,
                    color: 'purple' as const,
                    href: item.externalSourceUrl,
                    target: '_blank',
                  },
                ]
              : []),
            {
              id: 'copy-url',
              label: isCopied ? 'URL Copied!' : 'Copy Direct URL',
              description: 'Shareable PDF link',
              icon: isCopied ? Check : Copy,
              color: isCopied ? 'emerald' : 'zinc',
              onClick: () => handleCopy(fullUrl, item.id),
              divider: true,
            },
            {
              id: 'doc-meta',
              label: `${item.codeOrEdition} Archive`,
              description: `${item.pages} pages · ${item.authority}`,
              icon: FileText,
              color: 'zinc',
            },
          ];

          return (
            <div className="flex items-center justify-end whitespace-nowrap">
              <SharedActionMenu
                items={actionMenuItems}
                label="Actions"
                title={`Document actions for ${item.title}`}
                color="zinc"
                variant="outline"
                size="xs"
                width="w-64"
                header={item.codeOrEdition}
              />
            </div>
          );
        },
      },
    ],
    [copiedId, dispatch]
  );

  const tableFilters: TableFilterDef[] = useMemo(
    () => [
      {
        id: 'category',
        label: 'Category',
        value: selectedCat,
        onChange: setSelectedCat,
        options: [
          { label: `All Collections (${allItems.length})`, value: 'all' },
          ...READING_MATERIAL_CATEGORIES.map((cat) => ({
            label: `${cat.name} (${cat.items.length})`,
            value: cat.id,
          })),
        ],
      },
      {
        id: 'rating',
        label: 'Rating',
        value: reactionFilter,
        onChange: (val) => setReactionFilter(val as any),
        options: [
          { label: 'All Document Ratings', value: 'all' },
          { label: 'Liked (★ Saved)', value: 'liked' },
          { label: 'Disliked', value: 'disliked' },
          { label: 'Unrated Only', value: 'unrated' },
        ],
      },
    ],
    [selectedCat, reactionFilter, allItems.length]
  );

  const isFiltered =
    selectedCat !== 'all' ||
    reactionFilter !== 'all' ||
    Boolean(searchQuery.trim());

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCat('all');
    setReactionFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Integrated Shared Data Table with Search, Filters, CSV Export, and Pagination */}
      <SharedDataTable<MaterialTableRow>
        title="Official Study Materials & Parichaya Archives"
        subtitle="Complete inventory of 13 official editions of Nepal Parichaya (२०६९—२०८२), Constitution, and Statutory Acts"
        totalCount={allItems.length}
        data={filteredItems}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search document title, edition (13th, 12th, २०८२), publisher, or keyword..."
        filters={tableFilters}
        isFiltered={isFiltered}
        onResetFilters={handleResetFilters}
        enableCsvExport={true}
        csvFilename="psc-materials-inventory.csv"
        pagination={true}
        defaultPageSize={15}
        pageSizeOptions={[10, 15, 25, 50]}
        emptyMessage="No documents match your query"
        emptyDescription="Try clearing your search query or switching to All Collections."
      />
    </div>
  );
}

