import axios from "axios";
import type {
  Product,
  GetProductsParams,
  GetProductsResponse,
} from "../types/product";

const API_BASE_URL = "http://localhost:9090";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// GET all products /products
export const getProducts = async (
  params: GetProductsParams
): Promise<GetProductsResponse> => {
  try {
    const searchParams = new URLSearchParams();

    if (params.name) searchParams.append("name", params.name);
    if (params.category) searchParams.append("category", params.category);
    if (params.availability) {
      searchParams.append(
        "inStock",
        params.availability === "out-of-stock" ? "false" : "true"
      );
    }
    if (params.page) searchParams.append("page", (params.page - 1).toString());
    if (params.limit) searchParams.append("size", params.limit.toString());

    // Add sorting parameters
    if (params.sort && params.sort.length > 0) {
      params.sort.forEach((sortParam) => {
        searchParams.append("sort", sortParam);
      });
    }

    const response = await api.get<GetProductsResponse>(
      `/products?${searchParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
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
export const createProduct = async (
  newProductData: Omit<Product, "id">
): Promise<Product> => {
  try {
    const response = await api.post<Product>("/products", newProductData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// PUT product by ID /products/{id}
export const updateProduct = async (
  productId: number,
  updatedProductData: Product
): Promise<Product> => {
  try {
    const response = await api.put<Product>(
      `/products/${productId}`,
      updatedProductData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating product with ID ${productId}:`, error);
    throw error;
  }
};

// DELETE product by ID /products/{id}
export const deleteProduct = async (productId: number): Promise<void> => {
  try {
    await api.delete<Product>(`/products/${productId}`);
  } catch (error) {
    console.error(`Error updating product with ID ${productId}:`, error);
    throw error;
  }
};

// POST product outofstock by ID /products/{id}/outofstock
export const markProductOutOfStock = async (
  productId: number
): Promise<Product> => {
  try {
    const response = await api.post<Product>(
      `/products/${productId}/outofstock`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error marking product out of stock with ID ${productId}:`,
      error
    );
    throw error;
  }
};

// PUT product instock by ID /products/{id}/instock
export const markProductInStock = async (
  productId: number,
  quantity: number
): Promise<Product> => {
  try {
    const response = await api.put<Product>(
      `/products/${productId}/instock?quantity=${quantity}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error marking product in stock with ID ${productId}:`,
      error
    );
    throw error;
  }
};
