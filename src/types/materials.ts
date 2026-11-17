export interface ReadingMaterialItem {
  id: string;
  title: string;
  authority: string;
  codeOrEdition: string;
  pages: number;
  path: string;
  description: string;
  externalSourceUrl?: string;
}

export interface ReadingMaterialCategory {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  items: ReadingMaterialItem[];
}

export interface MaterialMutationInput {
  categoryId: string;
  categoryName?: string;
  categorySubtitle?: string;
  categoryDescription?: string;
  item: ReadingMaterialItem;
}

export interface FlatReadingMaterial extends ReadingMaterialItem {
  categoryId: string;
  categoryName: string;
}

export type CurriculumStatusFilter =
  | 'all'
  | 'in-progress'
  | 'completed'
  | 'unread';

export interface EnrichedCatalogMaterial {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  codeOrEdition: string;
  path: string;
  fullUrl: string;
  bookId: string;
  totalPages: number;
  lastPage: number;
  uniqueVisitedCount: number;
  readingSeconds: number;
  completionPct: number;
  status: 'unread' | 'in-progress' | 'completed';
  linkedQuestionCount: number;
  linkedWrittenCount: number;
  updatedAt: string | null;
}
