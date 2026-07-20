export type NutritionRow = {
  per100g: string;
  per10g: string;
  vd: string;
};

export type NutritionTable = {
  energyKcal: NutritionRow;
  carbs: NutritionRow;
  totalSugars: NutritionRow;
  addedSugars: NutritionRow;
  proteins: NutritionRow;
  totalFat: NutritionRow;
  satFat: NutritionRow;
  transFat: NutritionRow;
  fiber: NutritionRow;
  sodium: NutritionRow;
};

export const EMPTY_NUTRITION: NutritionTable = {
  energyKcal: { per100g: '', per10g: '', vd: '' },
  carbs:       { per100g: '', per10g: '', vd: '' },
  totalSugars: { per100g: '', per10g: '', vd: '' },
  addedSugars: { per100g: '', per10g: '', vd: '—' },
  proteins:    { per100g: '', per10g: '', vd: '' },
  totalFat:    { per100g: '', per10g: '', vd: '' },
  satFat:      { per100g: '', per10g: '', vd: '' },
  transFat:    { per100g: '', per10g: '', vd: '' },
  fiber:       { per100g: '', per10g: '', vd: '' },
  sodium:      { per100g: '', per10g: '', vd: '' },
};

export type NutritionFieldMeta = {
  key: keyof NutritionTable;
  label: string;
  indent?: boolean;
  noVd?: boolean;
};

export const NUTRITION_FIELDS: NutritionFieldMeta[] = [
  { key: 'energyKcal', label: 'Valor energético (kcal)' },
  { key: 'carbs',      label: 'Carboidratos (g)' },
  { key: 'totalSugars', label: 'Açúcares totais (g)' },
  { key: 'addedSugars', label: 'Açúcares adicionados (g)', indent: true },
  { key: 'proteins',   label: 'Proteínas (g)' },
  { key: 'totalFat',   label: 'Gorduras totais (g)' },
  { key: 'satFat',     label: 'Gorduras saturadas (g)', indent: true },
  { key: 'transFat',   label: 'Gorduras trans (g)', indent: true },
  { key: 'fiber',      label: 'Fibras alimentares (g)' },
  { key: 'sodium',     label: 'Sódio (mg)' },
];

export type Folder = {
  id: string;
  name: string;
  order: number;
  parentId?: string;
  keywords?: string[];
};

export type Product = {
  id: string;
  name: string;
  weight: string;
  folderId: string;
  imageUrl: string;
  imagePath: string;
  nutrition: NutritionTable;
  servingsPerPackage: string;
  servingSize: string;
  servingMeasure: string;
  createdAt?: unknown;
};

// ── Section types ──────────────────────────────────────────────────────────────

export type BannerItem = {
  id: string;
  imageUrl: string;
  imagePath: string;
  alt: string;
};

export type NovidadesItem = {
  productId: string;
  tag?: string;
  description: string;
};

export type PipocaCategory = {
  id: string;
  label: string;
  subtitle: string;
  productIds: string[];
};

export type SectionNovidades = { items: NovidadesItem[] };
export type SectionPipoca    = { categories: PipocaCategory[] };
export type SectionBrands    = { productIds: string[] };
export type SectionBanners   = { items: BannerItem[] };

export type InstagramPost = {
  id: string;
  shortcode: string;
  url: string;
  type: 'post' | 'reel';
};

export type SectionInstagram = { posts: InstagramPost[] };
