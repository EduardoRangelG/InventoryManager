import { createContext } from "react";
import type { Product } from "../types/product";
import type { SearchData } from "../components/search/ProductSearch";
import type { SortCriteria, GetProductsParams } from "../types/product";
import type { CategoryOption, InventoryData } from "../App";

// Define the shape of the context value
export interface ProductContextType {
  products: Product[];
  categories: CategoryOption[];
  searchParams: GetProductsParams;
  sortCriteria: SortCriteria[];
  totalPages: number;
  currentPage: number;
  metrics: InventoryData;
  loading: boolean;
  onCreateProduct: (product: Omit<Product, "id">) => Promise<void>;
  onEditProduct: (product: Product) => Promise<void>;
  onDeleteProduct: (productId: number) => Promise<void>;
  onSearch: (searchData: SearchData) => void;
  onPageChange: (newPage: number) => void;
  onSortingColumn: (columnName: string) => void;
  handleResetSorting: () => void;
  onSingleStockUpdate: (
    productId: number,
    makeOutOfStock: boolean
  ) => Promise<void>;
  onBulkStockUpdate: (makeOutOfStock: boolean) => Promise<void>;
}

// Default values for the context. For providing initial structure
export const defaultContextValue: ProductContextType = {
  products: [],
  categories: [],
  searchParams: {
    name: "",
    category: "",
    availability: "",
    page: 1,
    limit: 10,
    sort: ["name,asc"],
  },
  sortCriteria: [],
  totalPages: 0,
  currentPage: 1,
  metrics: {
    overall: { totalProducts: 0, totalValue: 0, averagePrice: 0 },
    byCategory: {},
  },
  loading: false,
  onCreateProduct: async () => {},
  onEditProduct: async () => {},
  onDeleteProduct: async () => {},
  onSearch: () => {},
  onPageChange: () => {},
  onSortingColumn: () => {},
  handleResetSorting: () => {},
  onSingleStockUpdate: async () => {},
  onBulkStockUpdate: async () => {},
};

export const ProductContext =
  createContext<ProductContextType>(defaultContextValue);
