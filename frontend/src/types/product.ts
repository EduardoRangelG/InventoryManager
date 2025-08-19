export interface Product {
    id?: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    expirationDate?: Date;
}

export interface GetProductsParams {
    name: string;
    category: string;
    availability: 'in-stock' | 'out-of-stock';
    page?: number;
    limit?: number;
    sort?: string[];
}

export interface GetProductsResponse {
    content: Product[];
    totalPages: number;
    totalElements: number;
    totalProductsInStock: number;
    totalInventoryValue: number;
    averageInStockPrice: number;
    categoryMetrics: {
        [key: string]: {
            totalInStock: number;
            totalValue: number;
            averagePrice: number;
        }
    }
}