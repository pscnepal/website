import { READING_MATERIAL_CATEGORIES } from '../data/readingMaterials';
import { auth } from '../lib/firebase';
import type {
  CloudMaterialOverride,
  FlatReadingMaterial,
  MaterialMutationInput,
  ReadingMaterialCategory,
  ReadingMaterialItem,
} from '../types';
import {
  resetAllMaterialOverridesInFirestore,
  upsertReadingMaterialInFirestore,
} from './cloudSyncService';
import { SITE_CONFIG } from '../data/siteConfig';
import { offlineDbService } from './offlineDbService';
import { toast } from './toastService';
import { formatUserFriendlyError } from '../utils/errorHelpers';

export type { FlatReadingMaterial, MaterialMutationInput };

const MATERIALS_STORAGE_KEY = 'psc_nepal_reading_materials_custom_v1';
const ADMIN_EMAIL = SITE_CONFIG.supportEmail;

export const MATERIAL_EVENTS = {
  CHANGED: 'psc_reading_materials_changed',
} as const;

const SEED_CATEGORY_BY_ID = new Map<string, ReadingMaterialCategory>(
  READING_MATERIAL_CATEGORIES.map((c) => [c.id, c])
);

const SEED_MATERIAL_META = new Map<
  string,
  { categoryId: string; item: ReadingMaterialItem }
>();

for (const cat of READING_MATERIAL_CATEGORIES) {
  for (const item of cat.items) {
    SEED_MATERIAL_META.set(item.id, { categoryId: cat.id, item });
  }
}

const pendingMaterialMutations = new Set<string>();
let pendingMaterialReset = false;

function isAuthenticatedAdmin(): boolean {
  const user = auth.currentUser;
  return Boolean(
    user &&
      user.emailVerified &&
      user.email?.trim().toLowerCase() === ADMIN_EMAIL
  );
}

function slugifyId(raw: string, fallback: string): string {
  const cleaned = (raw || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
  return cleaned || fallback;
}

function cloneSeedCategories(): ReadingMaterialCategory[] {
  return READING_MATERIAL_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.map((item) => ({ ...item })),
  }));
}

function safeReadCategories(): ReadingMaterialCategory[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(MATERIALS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed
      .filter(
        (cat): cat is ReadingMaterialCategory =>
          Boolean(cat && typeof cat.id === 'string' && Array.isArray(cat.items))
      )
      .map((cat) => ({
        id: String(cat.id),
        name: String(cat.name || cat.id),
        subtitle: String(cat.subtitle || 'Curated Study Documents & PDFs'),
        description: String(
          cat.description || 'Admin-curated Nepal PSC reading material collection.'
        ),
        items: cat.items
          .filter(
            (it): it is ReadingMaterialItem =>
              Boolean(it && typeof it.id === 'string' && typeof it.path === 'string')
          )
          .map((it) => ({
            id: String(it.id),
            title: String(it.title || 'Untitled Material'),
            authority: String(it.authority || 'Public Service Commission, Nepal'),
            codeOrEdition: String(it.codeOrEdition || 'Official Release'),
            pages: Math.min(5000, Math.max(1, Math.round(Number(it.pages) || 1))),
            path: String(it.path),
            description: String(it.description || ''),
            ...(typeof it.externalSourceUrl === 'string' && it.externalSourceUrl.trim()
              ? { externalSourceUrl: it.externalSourceUrl.trim() }
              : {}),
          })),
      }));
  } catch {
    return null;
  }
}

function safeWriteCategories(categories: ReadingMaterialCategory[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      MATERIALS_STORAGE_KEY,
      JSON.stringify(categories)
    );
  } catch {
    // Graceful fallback if storage quota exceeded
  }
}

function resolveCategoryMeta(
  categoryId: string,
  overrideName?: string,
  overrideSubtitle?: string,
  overrideDescription?: string
): Omit<ReadingMaterialCategory, 'items'> {
  const seedCat = SEED_CATEGORY_BY_ID.get(categoryId);
  if (seedCat) {
    return {
      id: seedCat.id,
      name: overrideName?.trim() || seedCat.name,
      subtitle: overrideSubtitle?.trim() || seedCat.subtitle,
      description: overrideDescription?.trim() || seedCat.description,
    };
  }

  const fallbackName =
    overrideName?.trim() ||
    categoryId
      .split(/[-_]+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') ||
    'Custom Study Collection';

  return {
    id: categoryId,
    name: fallbackName,
    subtitle:
      overrideSubtitle?.trim() || 'Admin-Curated Lok Sewa Study Collection',
    description:
      overrideDescription?.trim() ||
      `Custom Nepal PSC study collection containing verified reference documents for ${fallbackName}.`,
  };
}

let cachedCategories: ReadingMaterialCategory[] | null = null;
let cachedFlatMaterials: FlatReadingMaterial[] | null = null;

function invalidateMaterialCache(): void {
  cachedCategories = null;
  cachedFlatMaterials = null;
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (!event.key || event.key === MATERIALS_STORAGE_KEY) {
      invalidateMaterialCache();
    }
  });
}

export const materialStorageService = {
  loadMaterialCategories(): ReadingMaterialCategory[] {
    if (cachedCategories !== null) {
      return cachedCategories;
    }
    const custom = safeReadCategories();
    if (custom !== null) {
      cachedCategories = custom;
      return cachedCategories;
    }
    cachedCategories = cloneSeedCategories();
    return cachedCategories;
  },

  loadAllMaterialsFlat(): FlatReadingMaterial[] {
    if (cachedFlatMaterials !== null) {
      return cachedFlatMaterials;
    }
    const categories = this.loadMaterialCategories();
    const list: FlatReadingMaterial[] = [];
    for (const cat of categories) {
      for (const item of cat.items) {
        list.push({
          ...item,
          categoryId: cat.id,
          categoryName: cat.name,
        });
      }
    }
    cachedFlatMaterials = list;
    return cachedFlatMaterials;
  },

  findMaterialById(materialId: string): FlatReadingMaterial | undefined {
    return this.loadAllMaterialsFlat().find((m) => m.id === materialId);
  },

  findMaterialByPathOrUrl(rawUrl: string): FlatReadingMaterial | undefined {
    const trimmed = rawUrl.trim();
    if (!trimmed) return undefined;
    const all = this.loadAllMaterialsFlat();
    return all.find(
      (item) =>
        item.path === trimmed ||
        item.externalSourceUrl === trimmed ||
        item.id === trimmed ||
        trimmed.endsWith(item.path)
    );
  },

  saveMaterialCategories(categories: ReadingMaterialCategory[]): void {
    cachedCategories = categories;
    cachedFlatMaterials = null;
    safeWriteCategories(categories);
    void offlineDbService.putStudyBank('material_categories', categories);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(MATERIAL_EVENTS.CHANGED, { detail: categories })
      );
    }
  },

  applyCloudMaterialOverrides(overrides: CloudMaterialOverride[]): void {
    if (pendingMaterialReset) return;

    if (!overrides || overrides.length === 0) {
      if (pendingMaterialMutations.size > 0) {
        return;
      }
      if (
        typeof window !== 'undefined' &&
        window.localStorage.getItem(MATERIALS_STORAGE_KEY)
      ) {
        window.localStorage.removeItem(MATERIALS_STORAGE_KEY);
        invalidateMaterialCache();
        window.dispatchEvent(
          new CustomEvent(MATERIAL_EVENTS.CHANGED, {
            detail: this.loadMaterialCategories(),
          })
        );
      }
      return;
    }

    // Snapshot local materials by ID before merging so pending mutations are preserved
    const localFlat = this.loadAllMaterialsFlat();
    const localCatsById = new Map(
      this.loadMaterialCategories().map((c) => [c.id, c])
    );
    const localById = new Map<string, MaterialMutationInput>();
    for (const entry of localFlat) {
      const cat = localCatsById.get(entry.categoryId);
      const { categoryId, categoryName, ...itemOnly } = entry;
      localById.set(entry.id, {
        categoryId,
        categoryName: categoryName || cat?.name,
        categorySubtitle: cat?.subtitle,
        categoryDescription: cat?.description,
        item: itemOnly,
      });
    }

    const overrideMap = new Map<string, CloudMaterialOverride>();
    for (const ov of overrides) {
      overrideMap.set(ov.material.id, ov);
    }

    // Start with the official seed categories
    const categoryBuckets = new Map<string, ReadingMaterialCategory>();
    for (const seedCat of READING_MATERIAL_CATEGORIES) {
      categoryBuckets.set(seedCat.id, {
        ...seedCat,
        items: [],
      });
    }

    const ensureBucket = (
      categoryId: string,
      name?: string,
      subtitle?: string,
      description?: string
    ): ReadingMaterialCategory => {
      const existing = categoryBuckets.get(categoryId);
      if (existing) {
        if (!SEED_CATEGORY_BY_ID.has(categoryId)) {
          if (name?.trim()) existing.name = name.trim();
          if (subtitle?.trim()) existing.subtitle = subtitle.trim();
          if (description?.trim()) existing.description = description.trim();
        }
        return existing;
      }
      const meta = resolveCategoryMeta(categoryId, name, subtitle, description);
      const created: ReadingMaterialCategory = {
        ...meta,
        items: [],
      };
      categoryBuckets.set(categoryId, created);
      return created;
    };

    // 1. Place custom additions and moved seed items first (newest overrides first)
    const customAdditions: CloudMaterialOverride[] = [];
    for (const ov of overrides) {
      if (ov.isDeleted) continue;
      const seedMeta = SEED_MATERIAL_META.get(ov.material.id);
      if (!seedMeta || seedMeta.categoryId !== ov.categoryId) {
        customAdditions.push(ov);
      }
    }

    for (const ov of customAdditions) {
      const bucket = ensureBucket(
        ov.categoryId,
        ov.categoryName,
        ov.categorySubtitle,
        ov.categoryDescription
      );
      if (!bucket.items.some((i) => i.id === ov.material.id)) {
        bucket.items.push(ov.material);
      }
    }

    // 2. Place remaining seed items (keeping canonical seed order per category)
    for (const seedCat of READING_MATERIAL_CATEGORIES) {
      const bucket = ensureBucket(seedCat.id);
      for (const seedItem of seedCat.items) {
        const ov = overrideMap.get(seedItem.id);
        if (ov) {
          if (!ov.isDeleted && ov.categoryId === seedCat.id) {
            if (!bucket.items.some((i) => i.id === ov.material.id)) {
              bucket.items.push(ov.material);
            }
          }
        } else {
          if (!bucket.items.some((i) => i.id === seedItem.id)) {
            bucket.items.push({ ...seedItem });
          }
        }
      }
    }

    // 3. Reconcile in-flight local mutations so optimistic UI stays consistent
    for (const pendingId of pendingMaterialMutations) {
      for (const cat of categoryBuckets.values()) {
        cat.items = cat.items.filter((it) => it.id !== pendingId);
      }
      const localEntry = localById.get(pendingId);
      if (localEntry) {
        const bucket = ensureBucket(
          localEntry.categoryId,
          localEntry.categoryName,
          localEntry.categorySubtitle,
          localEntry.categoryDescription
        );
        bucket.items.unshift(localEntry.item);
      }
    }

    const merged = Array.from(categoryBuckets.values()).filter(
      (cat) => SEED_CATEGORY_BY_ID.has(cat.id) || cat.items.length > 0
    );
    this.saveMaterialCategories(merged);
  },

  createMaterial(input: {
    categoryId: string;
    categoryName?: string;
    categorySubtitle?: string;
    categoryDescription?: string;
    item: Omit<ReadingMaterialItem, 'id'> & { id?: string };
  }): ReadingMaterialItem {
    const categories = this.loadMaterialCategories();
    const rawCatId =
      input.categoryId.trim() ||
      slugifyId(input.categoryName || '', 'custom-collection');
    const cleanCatId = slugifyId(rawCatId, 'custom-collection');

    const id =
      input.item.id?.trim() ||
      `psc-mat-${slugifyId(input.item.title, 'doc').slice(0, 24)}-${Date.now()
        .toString()
        .slice(-5)}`;

    const fullItem: ReadingMaterialItem = {
      id,
      title: input.item.title.trim(),
      authority: input.item.authority.trim(),
      codeOrEdition: input.item.codeOrEdition.trim(),
      pages: Math.min(5000, Math.max(1, Math.round(Number(input.item.pages) || 1))),
      path: input.item.path.trim(),
      description: input.item.description.trim(),
      ...(input.item.externalSourceUrl?.trim()
        ? { externalSourceUrl: input.item.externalSourceUrl.trim() }
        : {}),
    };

    const existingCatIndex = categories.findIndex((c) => c.id === cleanCatId);
    const cleanedCategories = categories.map((cat) => ({
      ...cat,
      items: cat.items.filter((i) => i.id !== id),
    }));

    let resolvedCategoryMeta: Omit<ReadingMaterialCategory, 'items'>;
    if (existingCatIndex >= 0) {
      const target = cleanedCategories[existingCatIndex];
      resolvedCategoryMeta = {
        id: target.id,
        name: target.name,
        subtitle: target.subtitle,
        description: target.description,
      };
      cleanedCategories[existingCatIndex] = {
        ...target,
        items: [fullItem, ...target.items],
      };
    } else {
      resolvedCategoryMeta = resolveCategoryMeta(
        cleanCatId,
        input.categoryName,
        input.categorySubtitle,
        input.categoryDescription
      );
      cleanedCategories.push({
        ...resolvedCategoryMeta,
        items: [fullItem],
      });
    }

    this.saveMaterialCategories(cleanedCategories);

    if (isAuthenticatedAdmin()) {
      pendingMaterialMutations.add(id);
      void upsertReadingMaterialInFirestore(
        {
          item: fullItem,
          categoryId: cleanCatId,
          categoryName: resolvedCategoryMeta.name,
          categorySubtitle: resolvedCategoryMeta.subtitle,
          categoryDescription: resolvedCategoryMeta.description,
        },
        false
      )
        .catch((err) => {
          toast.error(
            formatUserFriendlyError(
              err,
              `Saved "${fullItem.title}" locally, but cloud sync failed.`
            ),
            { id: `cloud-mat-save-${fullItem.id}` }
          );
        })
        .finally(() => {
          pendingMaterialMutations.delete(id);
        });
    }

    return fullItem;
  },

  updateMaterial(input: MaterialMutationInput): ReadingMaterialItem {
    const categories = this.loadMaterialCategories();
    const cleanCatId =
      slugifyId(
        input.categoryId.trim() || input.categoryName || '',
        'official-psc-syllabi'
      ) || 'official-psc-syllabi';

    const sanitizedItem: ReadingMaterialItem = {
      id: input.item.id.trim(),
      title: input.item.title.trim(),
      authority: input.item.authority.trim(),
      codeOrEdition: input.item.codeOrEdition.trim(),
      pages: Math.min(5000, Math.max(1, Math.round(Number(input.item.pages) || 1))),
      path: input.item.path.trim(),
      description: input.item.description.trim(),
      ...(input.item.externalSourceUrl?.trim()
        ? { externalSourceUrl: input.item.externalSourceUrl.trim() }
        : {}),
    };

    // Remember position if staying in same category
    let sameCatItemIndex = -1;
    const prevCategory = categories.find((c) => c.id === cleanCatId);
    if (prevCategory) {
      sameCatItemIndex = prevCategory.items.findIndex(
        (it) => it.id === sanitizedItem.id
      );
    }

    // Remove from any category currently holding this ID
    const updated = categories.map((cat) => ({
      ...cat,
      items: cat.items.filter((it) => it.id !== sanitizedItem.id),
    }));

    const targetIndex = updated.findIndex((c) => c.id === cleanCatId);
    let resolvedCategoryMeta: Omit<ReadingMaterialCategory, 'items'>;

    if (targetIndex >= 0) {
      const target = updated[targetIndex];
      const nextItems = [...target.items];
      if (sameCatItemIndex >= 0 && sameCatItemIndex <= nextItems.length) {
        nextItems.splice(sameCatItemIndex, 0, sanitizedItem);
      } else {
        nextItems.unshift(sanitizedItem);
      }
      resolvedCategoryMeta = {
        id: target.id,
        name: target.name,
        subtitle: target.subtitle,
        description: target.description,
      };
      updated[targetIndex] = {
        ...target,
        items: nextItems,
      };
    } else {
      resolvedCategoryMeta = resolveCategoryMeta(
        cleanCatId,
        input.categoryName,
        input.categorySubtitle,
        input.categoryDescription
      );
      updated.push({
        ...resolvedCategoryMeta,
        items: [sanitizedItem],
      });
    }

    const pruned = updated.filter(
      (cat) => SEED_CATEGORY_BY_ID.has(cat.id) || cat.items.length > 0
    );
    this.saveMaterialCategories(pruned);

    if (isAuthenticatedAdmin()) {
      pendingMaterialMutations.add(sanitizedItem.id);
      void upsertReadingMaterialInFirestore(
        {
          item: sanitizedItem,
          categoryId: cleanCatId,
          categoryName: resolvedCategoryMeta.name,
          categorySubtitle: resolvedCategoryMeta.subtitle,
          categoryDescription: resolvedCategoryMeta.description,
        },
        false
      )
        .catch((err) => {
          toast.error(
            formatUserFriendlyError(
              err,
              `Updated "${sanitizedItem.title}" locally, but cloud sync failed.`
            ),
            { id: `cloud-mat-save-${sanitizedItem.id}` }
          );
        })
        .finally(() => {
          pendingMaterialMutations.delete(sanitizedItem.id);
        });
    }

    return sanitizedItem;
  },

  deleteMaterial(materialId: string): boolean {
    const categories = this.loadMaterialCategories();
    let targetCategory: ReadingMaterialCategory | null = null;
    let targetItem: ReadingMaterialItem | null = null;

    for (const cat of categories) {
      const found = cat.items.find((it) => it.id === materialId);
      if (found) {
        targetCategory = cat;
        targetItem = found;
        break;
      }
    }

    if (!targetItem || !targetCategory) return false;

    const updated = categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((it) => it.id !== materialId),
      }))
      .filter((cat) => SEED_CATEGORY_BY_ID.has(cat.id) || cat.items.length > 0);

    this.saveMaterialCategories(updated);

    if (isAuthenticatedAdmin()) {
      pendingMaterialMutations.add(materialId);
      void upsertReadingMaterialInFirestore(
        {
          item: targetItem,
          categoryId: targetCategory.id,
          categoryName: targetCategory.name,
          categorySubtitle: targetCategory.subtitle,
          categoryDescription: targetCategory.description,
        },
        true
      )
        .catch((err) => {
          toast.error(
            formatUserFriendlyError(
              err,
              `Deleted "${targetItem.title}" locally, but cloud sync failed.`
            ),
            { id: `cloud-mat-del-${materialId}` }
          );
        })
        .finally(() => {
          pendingMaterialMutations.delete(materialId);
        });
    }

    return true;
  },

  resetMaterialsToDefault(): void {
    pendingMaterialMutations.clear();
    const defaults = cloneSeedCategories();
    cachedCategories = defaults;
    cachedFlatMaterials = null;
    void offlineDbService.putStudyBank('material_categories', defaults);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(MATERIALS_STORAGE_KEY);
      window.dispatchEvent(
        new CustomEvent(MATERIAL_EVENTS.CHANGED, {
          detail: defaults,
        })
      );
    }

    if (isAuthenticatedAdmin()) {
      pendingMaterialReset = true;
      void resetAllMaterialOverridesInFirestore()
        .catch((err) => {
          toast.error(
            formatUserFriendlyError(
              err,
              'Restored default materials locally, but failed to clear cloud overrides.'
            ),
            { id: 'cloud-mat-reset' }
          );
        })
        .finally(() => {
          pendingMaterialReset = false;
        });
    }
  },

  hasCustomMaterials(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(window.localStorage.getItem(MATERIALS_STORAGE_KEY));
  },
};
