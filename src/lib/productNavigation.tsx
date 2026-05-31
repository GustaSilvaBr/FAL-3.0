import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Product } from './types';

type ProductNavigationContextType = {
  navigateToProduct: (product: Product) => void;
  pendingProduct: Product | null;
  clearPendingProduct: () => void;
};

const ProductNavigationContext = createContext<ProductNavigationContextType>({
  navigateToProduct: () => {},
  pendingProduct: null,
  clearPendingProduct: () => {},
});

export function ProductNavigationProvider({ children }: { children: ReactNode }) {
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);

  return (
    <ProductNavigationContext.Provider
      value={{
        navigateToProduct: setPendingProduct,
        pendingProduct,
        clearPendingProduct: () => setPendingProduct(null),
      }}
    >
      {children}
    </ProductNavigationContext.Provider>
  );
}

export const useProductNavigation = () => useContext(ProductNavigationContext);
