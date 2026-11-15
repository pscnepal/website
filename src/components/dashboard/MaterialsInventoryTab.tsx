import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Check,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { useAppDispatch } from '../../app/hooks';
import { recordView } from '../../features/reactions/reactionsSlice';
import type {
  ReadingMaterialCategory,
  ReadingMaterialItem,
} from '../../data/readingMaterials';
import {
  MATERIAL_EVENTS,
  materialStorageService,
} from '../../services/materialStorageService';
import { resolveSampleUrl } from '../../utils/urlHelpers';
import { ActionButton } from '../common/ActionButton';
import { ConfirmDialog } from '../common/ConfirmDialog';
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
import {
  MaterialFormModal,
  type MaterialFormSavePayload,
} from './MaterialFormModal';
import { useDashboardSearch } from './DashboardLayout';
import { toast } from '../../services/toastService';
import { copyWithToast } from '../../utils/clipboardHelpers';
import { formatUserFriendlyError } from '../../utils/errorHelpers';

type MaterialTableRow = ReadingMaterialItem & {
  categoryName: string;
  categoryId: string;
};

export function MaterialsInventoryTab() {
  const dispatch = useAppDispatch();
  const { searchQuery, setSearchQuery } = useDashboardSearch();
  const [categories, setCategories] = useState<ReadingMaterialCategory[]>(() =>
    materialStorageService.loadMaterialCategories()
  );
  const [selectedCat, setSelectedCat] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // CRUD State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [materialToEdit, setMaterialToEdit] =
    useState<MaterialTableRow | null>(null);
  const [materialToDelete, setMaterialToDelete] =
    useState<MaterialTableRow | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  useEffect(() => {
    const syncMaterials = () => {
      setCategories(materialStorageService.loadMaterialCategories());
    };
    window.addEventListener(MATERIAL_EVENTS.CHANGED, syncMaterials);
    window.addEventListener('storage', syncMaterials);
    return () => {
      window.removeEventListener(MATERIAL_EVENTS.CHANGED, syncMaterials);
      window.removeEventListener('storage', syncMaterials);
    };
  }, []);

  const allItems = useMemo(() => {
    const list: MaterialTableRow[] = [];
    categories.forEach((cat) => {
      cat.items.forEach((it) => {
        list.push({ ...it, categoryName: cat.name, categoryId: cat.id });
      });
    });
    return list;
  }, [categories]);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      if (selectedCat !== 'all' && item.categoryId !== selectedCat) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCode = item.codeOrEdition.toLowerCase().includes(query);
        const matchesAuth = item.authority.toLowerCase().includes(query);
        const matchesCat = item.categoryName.toLowerCase().includes(query);
        return (
          matchesTitle ||
          matchesDesc ||
          matchesCode ||
          matchesAuth ||
          matchesCat
        );
      }
      return true;
    });
  }, [allItems, selectedCat, searchQuery]);

  const handleCopy = (fullUrl: string, id: string) => {
    void copyWithToast(fullUrl, 'Material link copied to clipboard.').then(
      (ok) => {
        if (ok) {
          setCopiedId(id);
          setTimeout(() => setCopiedId(null), 2000);
        }
      }
    );
  };

  const handleSaveMaterial = (payload: MaterialFormSavePayload) => {
    try {
      if (materialToEdit) {
        materialStorageService.updateMaterial(payload);
        toast.success(`Updated material "${payload.item.title}".`);
      } else {
        materialStorageService.createMaterial(payload);
        toast.success(`Added "${payload.item.title}" to reading catalog.`);
      }
      setCategories(materialStorageService.loadMaterialCategories());
    } catch (err) {
      toast.error(
        formatUserFriendlyError(err, 'Failed to save reading material.')
      );
    }
  };

  const handleDeleteMaterial = () => {
    if (!materialToDelete) return;
    try {
      const targetTitle = materialToDelete.title;
      materialStorageService.deleteMaterial(materialToDelete.id);
      setCategories(materialStorageService.loadMaterialCategories());
      setMaterialToDelete(null);
      toast.success(`Deleted "${targetTitle}" from reading catalog.`);
    } catch (err) {
      toast.error(
        formatUserFriendlyError(err, 'Failed to delete reading material.')
      );
    }
  };

  const handleResetToDefault = () => {
    try {
      materialStorageService.resetMaterialsToDefault();
      setCategories(materialStorageService.loadMaterialCategories());
      setSelectedCat('all');
      setIsResetConfirmOpen(false);
      toast.info('Reading materials catalog restored to defaults.');
    } catch (err) {
      toast.error(
        formatUserFriendlyError(err, 'Failed to reset reading materials catalog.')
      );
    }
  };

  const handleExportJson = () => {
    try {
      const dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(categories, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', 'psc-nepal-reading-materials.json');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success(
        `Exported ${allItems.length} reading materials across ${categories.length} collections.`
      );
    } catch (err) {
      toast.error(
        formatUserFriendlyError(err, 'Failed to export reading materials JSON.')
      );
    }
  };

  const columns: ColumnDef<MaterialTableRow>[] = useMemo(
    () => [
      {
        id: 'codeOrEdition',
        header: 'Edition / Code',
        width: 'w-28',
        sortable: true,
        sortKey: (item) => item.codeOrEdition,
        className:
          'font-mono font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap',
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
        header: 'Views & Counts',
        width: 'w-44',
        render: (item) => (
          <ReactionButtons
            itemId={item.id}
            itemType="material"
            size="xs"
            readOnly
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
              onClick: () =>
                dispatch(recordView({ itemId: item.id, itemType: 'material' })),
            },
            {
              id: 'edit-material',
              label: 'Edit Material',
              description: 'Modify title, collection, pages, or PDF link',
              icon: Edit3,
              color: 'amber',
              onClick: () => {
                setMaterialToEdit(item);
                setIsFormModalOpen(true);
              },
            },
            {
              id: 'delete-material',
              label: 'Delete Material',
              description: 'Remove from public catalog & inventory',
              icon: Trash2,
              color: 'crimson',
              danger: true,
              onClick: () => setMaterialToDelete(item),
            },
            {
              id: 'pdf-download',
              label: 'Download Official PDF',
              description: `${item.pages} pages archived document`,
              icon: Download,
              color: 'emerald',
              href: fullUrl,
              download: true,
              divider: true,
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
          ...categories.map((cat) => ({
            label: `${cat.name} (${cat.items.length})`,
            value: cat.id,
          })),
        ],
      },
    ],
    [selectedCat, allItems.length, categories]
  );

  const isFiltered =
    selectedCat !== 'all' || Boolean(searchQuery.trim());

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCat('all');
  };

  return (
    <div className="space-y-6">
      {/* Integrated Shared Data Table with CRUD Tools, Search, Filters, CSV Export, and Pagination */}
      <SharedDataTable<MaterialTableRow>
        title="Official Study Materials & Parichaya Archives"
        subtitle="Manage study PDF collections, Nepal Parichaya editions, Constitution, and Statutory Acts"
        totalCount={allItems.length}
        data={filteredItems}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search document title, edition (13th, २०८२), authority, or keyword..."
        filters={tableFilters}
        isFiltered={isFiltered}
        onResetFilters={handleResetFilters}
        actions={
          <div className="flex items-center gap-2">
            <ActionButton
              label="Add Material"
              title="Add a new PDF or study document to the catalog"
              icon={Plus}
              color="emerald"
              variant="solid"
              size="sm"
              onClick={() => {
                setMaterialToEdit(null);
                setIsFormModalOpen(true);
              }}
            />
            <SharedActionMenu
              items={[
                {
                  id: 'export-json',
                  label: 'Export Catalog (JSON)',
                  description: 'Download JSON backup of all study materials',
                  icon: Download,
                  color: 'emerald',
                  onClick: handleExportJson,
                },
                {
                  id: 'reset-default',
                  label: 'Restore Default Materials',
                  description:
                    'Reset all additions, edits & deletions to official seed catalog',
                  icon: RotateCcw,
                  color: 'crimson',
                  danger: true,
                  onClick: () => setIsResetConfirmOpen(true),
                },
              ]}
              label="Catalog Tools"
              title="Reading Materials Catalog Administration"
              color="zinc"
              variant="outline"
              size="sm"
            />
          </div>
        }
        enableCsvExport={true}
        csvFilename="psc-materials-inventory.csv"
        pagination={true}
        defaultPageSize={15}
        pageSizeOptions={[10, 15, 25, 50]}
        emptyMessage="No documents match your query"
        emptyDescription="Try clearing your search query or switching to All Collections."
      />

      {/* Create / Edit Material Modal */}
      <MaterialFormModal
        isOpen={isFormModalOpen}
        materialToEdit={materialToEdit}
        onClose={() => {
          setIsFormModalOpen(false);
          setMaterialToEdit(null);
        }}
        onSave={handleSaveMaterial}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(materialToDelete)}
        title="Delete Reading Material?"
        description={
          <div>
            <p>
              Are you sure you want to remove this document from the public
              reading catalog and inventory?
            </p>
            {materialToDelete && (
              <p className="mt-2 p-2 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[11px] line-clamp-2">
                {materialToDelete.title} ({materialToDelete.codeOrEdition})
              </p>
            )}
          </div>
        }
        confirmLabel="Delete Material"
        confirmColor="crimson"
        onConfirm={handleDeleteMaterial}
        onClose={() => setMaterialToDelete(null)}
      />

      {/* Reset Defaults Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Restore Official Reading Catalog?"
        description="This will restore the original Nepal Parichaya, Constitution, and PSC syllabus PDFs and remove any custom materials or edits."
        confirmLabel="Restore Defaults"
        confirmColor="crimson"
        onConfirm={handleResetToDefault}
        onClose={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
}
