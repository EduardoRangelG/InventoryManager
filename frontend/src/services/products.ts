import axios from 'axios';
import type { Product, GetProductsParams, GetProductsResponse } from '../types/product';

const API_BASE_URL = 'http://localhost:9090';

const api = axios.create({
    baseURL: API_BASE_URL,
});


// GET all products /products
export const getProducts = async (params: GetProductsParams): Promise<GetProductsResponse> => {
    try {
        const requestParams = {
            name: params.name || '',
            category: params.category || '',
            availability: params.availability || 'in-stock',
            page: params.page || 0,
            limit: params.limit || 0,
            sort: params.sort?.join(',')
        };

        const response = await api.get<GetProductsResponse>('/products', {
            params: requestParams,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;  
    }
};

// GET product by ID /products/{id}
export const getProductById = async (productId: number): Promise<Product> => {
    try {
        const response = await api.get<Product>(`/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with ID ${productId}:`, error);
        throw error;  
    }
};

// POST product /products
export const createProduct = async (newProductData: Omit<Product, 'id'>): Promise<Product> => {
    try {
        const response = await api.post<Product>('/products', newProductData);
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error; 
    }
}

// PUT product by ID /products/{id}
export const updateProduct = async (productId: number, updatedProductData: Product):  Promise<Product> => {
    try {
        const response = await api.put<Product>(`/products/${productId}`, updatedProductData);
        return response.data;
    } catch (error) {
        console.error(`Error updating product with ID ${productId}:`, error);
        throw error; 
    }
}

// DELETE product by ID /products/{id}
export const deleteProduct = async (productId: number): Promise<void> => {
    try {
        await api.delete<Product>(`/products/${productId}`);
    } catch (error) {
        console.error(`Error updating product with ID ${productId}:`, error);
        throw error; 
    }
}

// POST product outofstock by ID /products/{id}/outofstock
export const markProductOutOfStock = async (productId: number): Promise<Product> => {
    try {
        const response = await api.put<Product>(`/products/${productId}/outofstock`);
        return response.data;
    } catch (error) {
        console.error(`Error marking product out of stock with ID ${productId}:`, error);
        throw error; 
    }
}

// PUT product instock by ID /products/{id}/instock
export const markProductInStock = async (productId: number): Promise<Product> => {
    try {
        const response = await api.put<Product>(`/products/${productId}/instock`);
        return response.data;
    } catch (error) {
        console.error(`Error marking product in stock with ID ${productId}:`, error);
        throw error; 
    }
}