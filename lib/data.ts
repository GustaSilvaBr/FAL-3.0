import { getDocs, getDoc, collection, doc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase-server';
import type {
  Product,
  Folder,
  SectionNovidades,
  SectionPipoca,
  SectionBrands,
  SectionBanners,
  SectionInstagram,
  PipocaCategory,
  InstagramPost,
} from '../src/lib/types';

export type BannerSlide = { src: string; alt: string };

export type NovidadesDisplayItem = {
  image: string;
  tag?: string;
  title: string;
  description: string;
  product?: Product;
};

export type PageData = {
  bannerSlides: BannerSlide[];
  novidadesItems: NovidadesDisplayItem[];
  pipocaCategories: PipocaCategory[];
  pipocaProductMap: Record<string, Product>;
  brandsProducts: Product[];
  instagramPosts: InstagramPost[];
  products: Product[];
  folders: Folder[];
};

async function fetchBannerData(): Promise<BannerSlide[]> {
  const snap = await getDoc(doc(db, 'sections', 'banners'));
  if (!snap.exists()) return [];
  const data = snap.data() as SectionBanners;
  return (data.items ?? []).map((b) => ({ src: b.imageUrl, alt: b.alt || 'Banner FAL' }));
}

async function fetchNovidadesData(): Promise<NovidadesDisplayItem[]> {
  const sectionSnap = await getDoc(doc(db, 'sections', 'novidades'));
  if (!sectionSnap.exists()) return [];

  const section = sectionSnap.data() as SectionNovidades;
  if (!section.items?.length) return [];

  const productIds = [...new Set(section.items.map((i) => i.productId))];
  const productMap: Record<string, Product> = {};

  await Promise.all(
    productIds.map(async (pid) => {
      const pSnap = await getDoc(doc(db, 'products', pid));
      if (pSnap.exists()) productMap[pid] = { id: pSnap.id, ...pSnap.data() } as Product;
    }),
  );

  return section.items.map((item) => ({
    image: productMap[item.productId]?.imageUrl ?? '',
    tag: item.tag || undefined,
    title: productMap[item.productId]?.name ?? '',
    description: item.description,
    product: productMap[item.productId],
  }));
}

async function fetchPipocaData(): Promise<{ categories: PipocaCategory[]; productMap: Record<string, Product> }> {
  const snap = await getDoc(doc(db, 'sections', 'pipoca-gravata'));
  if (!snap.exists()) return { categories: [], productMap: {} };

  const data = snap.data() as SectionPipoca;
  const cats = data.categories ?? [];

  const allIds = [...new Set(cats.flatMap((c) => c.productIds))];
  const productMap: Record<string, Product> = {};
  await Promise.all(
    allIds.map(async (pid) => {
      const pSnap = await getDoc(doc(db, 'products', pid));
      if (pSnap.exists()) productMap[pid] = { id: pSnap.id, ...pSnap.data() } as Product;
    }),
  );

  return { categories: cats, productMap };
}

async function fetchBrandsData(): Promise<Product[]> {
  const snap = await getDoc(doc(db, 'sections', 'brands'));
  if (!snap.exists()) return [];

  const data = snap.data() as SectionBrands;
  const ids = data.productIds ?? [];

  const loaded = await Promise.all(
    ids.map(async (id) => {
      const pSnap = await getDoc(doc(db, 'products', id));
      return pSnap.exists() ? ({ id: pSnap.id, ...pSnap.data() } as Product) : null;
    }),
  );

  return loaded.filter(Boolean) as Product[];
}

async function fetchInstagramData(): Promise<InstagramPost[]> {
  const snap = await getDoc(doc(db, 'sections', 'instagram'));
  if (!snap.exists()) return [];
  return (snap.data() as SectionInstagram).posts ?? [];
}

async function fetchCatalogData(): Promise<{ folders: Folder[]; products: Product[] }> {
  const [foldersSnap, productsSnap] = await Promise.all([
    getDocs(query(collection(db, 'folders'), orderBy('name'))),
    getDocs(query(collection(db, 'products'), orderBy('name'))),
  ]);

  return {
    folders: foldersSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Folder)),
    products: productsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Product)),
  };
}

export async function fetchPageData(): Promise<PageData> {
  const [bannerSlides, novidadesItems, pipocaData, brandsProducts, instagramPosts, catalogData] =
    await Promise.all([
      fetchBannerData(),
      fetchNovidadesData(),
      fetchPipocaData(),
      fetchBrandsData(),
      fetchInstagramData(),
      fetchCatalogData(),
    ]);

  return {
    bannerSlides,
    novidadesItems,
    pipocaCategories: pipocaData.categories,
    pipocaProductMap: pipocaData.productMap,
    brandsProducts,
    instagramPosts,
    products: catalogData.products,
    folders: catalogData.folders,
  };
}
