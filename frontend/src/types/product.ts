export interface Product {
  id: number;
  name: string;
  category: string;
  unitPrice: number;
  stock: number;
  expirationDate?: string;
}

export interface GetProductsParams {
  name: string;
  category: string;
  availability: "in-stock" | "out-of-stock";
  page?: number;
  limit?: number;
  sort?: string[];
}

export interface GetProductsResponse {
  content: Product[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  numberOfElements: number;
  first: number;
  last: boolean;
  empty: boolean;
  totalProductsInStock: number;
  totalInventoryValue: number;
  averageInStockPrice: number;
  categoryMetrics: {
    [key: string]: {
      totalInStock: number;
      totalValue: number;
      averagePrice: number;
    };
  };
}

export interface SortCriteria {
  field: string;
  direction: "asc" | "desc";
}
