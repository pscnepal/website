import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, FileText, X } from 'lucide-react';
import { DEFAULT_MATERIAL_AUTHORITIES as DEFAULT_AUTHORITIES } from '../../data/catalogOptionsData';
import type {
  ReadingMaterialCategory,
  ReadingMaterialItem,
} from '../../data/readingMaterials';
import { materialStorageService } from '../../services/materialStorageService';
import { ActionButton } from '../common/ActionButton';
import type { SearchSelectOption } from '../common/SharedSearchSelect';
import { SelectOrCustomField } from './SelectOrCustomField';

export interface MaterialFormSavePayload {
  categoryId: string;
  categoryName?: string;
  categorySubtitle?: string;
  categoryDescription?: string;
  item: ReadingMaterialItem;
}

export interface MaterialFormModalProps {
  isOpen: boolean;
  materialToEdit?: (ReadingMaterialItem & { categoryId: string }) | null;
  onClose: () => void;
  onSave: (payload: MaterialFormSavePayload) => void;
}

function slugifyId(raw: string, fallback: string): string {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
  return cleaned || fallback;
}

function isValidMaterialPathOrUrl(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('/')) return trimmed.length > 1;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function MaterialFormModal({
  isOpen,
  materialToEdit,
  onClose,
  onSave,
}: MaterialFormModalProps) {
  const isEditing = Boolean(materialToEdit);

  const [categoryValue, setCategoryValue] = useState('official-psc-syllabi');
  const [customCategorySubtitle, setCustomCategorySubtitle] = useState('');
  const [customCategoryDescription, setCustomCategoryDescription] = useState('');

  const [title, setTitle] = useState('');
  const [authority, setAuthority] = useState(DEFAULT_AUTHORITIES[0]);
  const [codeOrEdition, setCodeOrEdition] = useState('');
  const [pages, setPages] = useState<number>(10);
  const [path, setPath] = useState('');
  const [externalSourceUrl, setExternalSourceUrl] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const liveCategories = useMemo<ReadingMaterialCategory[]>(() => {
    if (!isOpen) return [];
    return materialStorageService.loadMaterialCategories();
  }, [isOpen]);

  const categoryOptions = useMemo<SearchSelectOption[]>(() => {
    return liveCategories.map((cat) => ({
      value: cat.id,
      label: cat.name,
      badge: `${cat.items.length} docs`,
      description: cat.subtitle,
    }));
  }, [liveCategories]);

  const authorityOptions = useMemo<SearchSelectOption[]>(() => {
    const seen = new Set<string>(DEFAULT_AUTHORITIES);
    for (const cat of liveCategories) {
      for (const item of cat.items) {
        if (item.authority) seen.add(item.authority);
      }
    }
    return Array.from(seen).map((authName) => ({
      value: authName,
      label: authName,
    }));
  }, [liveCategories]);

  const matchedExistingCategory = useMemo(
    () => liveCategories.find((c) => c.id === categoryValue) ?? null,
    [liveCategories, categoryValue]
  );

  const isCreatingNewCategory =
    Boolean(categoryValue.trim()) && !matchedExistingCategory;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    if (materialToEdit) {
      setCategoryValue(materialToEdit.categoryId || 'official-psc-syllabi');
      setCustomCategorySubtitle('');
      setCustomCategoryDescription('');
      setTitle(materialToEdit.title || '');
      setAuthority(materialToEdit.authority || DEFAULT_AUTHORITIES[0]);
      setCodeOrEdition(materialToEdit.codeOrEdition || '');
      setPages(materialToEdit.pages || 1);
      setPath(materialToEdit.path || '');
      setExternalSourceUrl(materialToEdit.externalSourceUrl || '');
      setDescription(materialToEdit.description || '');
    } else {
      setCategoryValue('official-psc-syllabi');
      setCustomCategorySubtitle('');
      setCustomCategoryDescription('');
      setTitle('');
      setAuthority(DEFAULT_AUTHORITIES[0]);
      setCodeOrEdition('');
      setPages(12);
      setPath('');
      setExternalSourceUrl('');
      setDescription('');
    }
    setErrorMsg(null);
  }, [materialToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const rawCat = categoryValue.trim();
    const cleanTitle = title.trim();
    const cleanAuthority = authority.trim();
    const cleanCode = codeOrEdition.trim();
    const cleanPath = path.trim();
    const cleanExternal = externalSourceUrl.trim();
    const cleanDesc = description.trim();
    const numericPages = Math.round(Number(pages) || 0);

    if (!rawCat) {
      setErrorMsg('Please select an existing collection or enter a new collection name.');
      return;
    }
    if (!cleanTitle) {
      setErrorMsg('Document title is required.');
      return;
    }
    if (cleanTitle.length > 300) {
      setErrorMsg('Document title must be 300 characters or fewer.');
      return;
    }
    if (!cleanAuthority) {
      setErrorMsg('Publishing authority / institution is required.');
      return;
    }
    if (!cleanCode) {
      setErrorMsg('Edition, statute code, or approval date is required.');
      return;
    }
    if (numericPages < 1 || numericPages > 5000) {
      setErrorMsg('Page count must be between 1 and 5000.');
      return;
    }
    if (!isValidMaterialPathOrUrl(cleanPath)) {
      setErrorMsg(
        'Enter a valid HTTPS/HTTP PDF URL (e.g. https://psc.gov.np/...pdf) or a relative path starting with /.'
      );
      return;
    }
    if (cleanPath.length > 1000) {
      setErrorMsg('PDF URL or path must be 1000 characters or fewer.');
      return;
    }
    if (cleanExternal && !isValidMaterialPathOrUrl(cleanExternal)) {
      setErrorMsg(
        'Official external source URL must be a valid https:// or http:// link.'
      );
      return;
    }
    if (!cleanDesc) {
      setErrorMsg('Document summary & coverage description is required.');
      return;
    }
    if (cleanDesc.length > 2000) {
      setErrorMsg('Description must be 2000 characters or fewer.');
      return;
    }

    const resolvedCatId = matchedExistingCategory
      ? matchedExistingCategory.id
      : slugifyId(rawCat, 'custom-collection');

    const resolvedCatName = matchedExistingCategory
      ? matchedExistingCategory.name
      : rawCat.slice(0, 200);

    const id =
      materialToEdit?.id ||
      `psc-mat-${slugifyId(cleanTitle, 'doc').slice(0, 24)}-${Date.now()
        .toString()
        .slice(-5)}`;

    const item: ReadingMaterialItem = {
      id,
      title: cleanTitle,
      authority: cleanAuthority.slice(0, 240),
      codeOrEdition: cleanCode.slice(0, 160),
      pages: numericPages,
      path: cleanPath,
      description: cleanDesc,
      ...(cleanExternal ? { externalSourceUrl: cleanExternal } : {}),
    };

    onSave({
      categoryId: resolvedCatId,
      categoryName: resolvedCatName,
      categorySubtitle:
        isCreatingNewCategory && customCategorySubtitle.trim()
          ? customCategorySubtitle.trim().slice(0, 240)
          : matchedExistingCategory?.subtitle,
      categoryDescription:
        isCreatingNewCategory && customCategoryDescription.trim()
          ? customCategoryDescription.trim().slice(0, 800)
          : matchedExistingCategory?.description,
      item,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="material-form-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl min-w-0 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 z-10 space-y-5 my-8 max-h-[90vh] overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3
                id="material-form-modal-title"
                className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50"
              >
                {isEditing
                  ? 'Edit Reading Material'
                  : 'Add New Reading Material'}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Synced directly across Browse Materials, Flipbook Reader &amp; Dashboard
              </p>
            </div>
          </div>
          <ActionButton
            icon={X}
            title="Close modal"
            color="zinc"
            variant="ghost"
            size="xs"
            onClick={onClose}
          />
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Collection / Category Selection */}
          <div className="space-y-3 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              1. Reading Collection &amp; Document Identity
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectOrCustomField
                label="Study Collection"
                required
                value={categoryValue}
                onChange={setCategoryValue}
                options={categoryOptions}
                placeholder="Select collection..."
                customPlaceholder="e.g. Current Affairs & Budget Digests"
                searchPlaceholder="Search collections..."
                customOptionLabel="+ Create new collection..."
                focusRingClass="focus:ring-emerald-600"
              />

              <SelectOrCustomField
                label="Publishing Authority"
                required
                value={authority}
                onChange={setAuthority}
                options={authorityOptions}
                placeholder="Select authority..."
                customPlaceholder="e.g. Supreme Court of Nepal"
                searchPlaceholder="Search institutions..."
                customOptionLabel="+ Custom institution / author..."
                focusRingClass="focus:ring-emerald-600"
              />
            </div>

            {isCreatingNewCategory && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-zinc-200/70 dark:border-zinc-800">
                <div className="min-w-0">
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    New Collection Subtitle (Optional)
                  </label>
                  <input
                    type="text"
                    value={customCategorySubtitle}
                    onChange={(e) => setCustomCategorySubtitle(e.target.value)}
                    placeholder="e.g. Annual Economic Survey & Budget Releases"
                    className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div className="min-w-0">
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    New Collection Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={customCategoryDescription}
                    onChange={(e) =>
                      setCustomCategoryDescription(e.target.value)
                    }
                    placeholder="Short overview shown on collection card..."
                    className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 min-w-0">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Document Title <span className="text-crimson-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Economic Survey 2081/82 — Ministry of Finance"
                  className="w-full h-9 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Page Count <span className="text-crimson-600">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={5000}
                  value={pages}
                  onChange={(e) => setPages(Number(e.target.value))}
                  className="w-full h-9 text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Edition / Act Code / Approval Date{' '}
                <span className="text-crimson-600">*</span>
              </label>
              <input
                type="text"
                required
                value={codeOrEdition}
                onChange={(e) => setCodeOrEdition(e.target.value)}
                placeholder="e.g. Approved 2081/03/20 · 13th Edition (२०८२)"
                className="w-full h-9 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* 2. PDF Links & Summary */}
          <div className="space-y-3 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              2. PDF Source URL &amp; Study Summary
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  PDF Document URL or Local Path{' '}
                  <span className="text-crimson-600">*</span>
                </label>
                <div className="relative">
                  <FileText className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    placeholder="https://psc.gov.np/...pdf or /materials/doc.pdf"
                    className="w-full h-9 pl-8 pr-3 text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Official Gov Source Link (Optional)
                </label>
                <input
                  type="url"
                  value={externalSourceUrl}
                  onChange={(e) => setExternalSourceUrl(e.target.value)}
                  placeholder="https://psc.gov.np/... or https://doib.gov.np/..."
                  className="w-full h-9 text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Syllabus Coverage &amp; Summary{' '}
                <span className="text-crimson-600">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Summarize key chapters, statutory provisions, and Lok Sewa papers covered by this PDF..."
                className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-600 leading-relaxed"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <ActionButton
              label="Cancel"
              title="Cancel and close"
              color="zinc"
              variant="outline"
              size="sm"
              onClick={onClose}
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isEditing ? 'Save Material Changes' : 'Add Material to Catalog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
