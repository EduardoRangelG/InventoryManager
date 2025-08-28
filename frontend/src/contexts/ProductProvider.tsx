import React, { useState, useEffect } from "react";
import type { Product } from "../types/product";
import type { SearchData } from "../components/search/ProductSearch";
import {
  getProducts,
  deleteProduct,
  markProductInStock,
  markProductOutOfStock,
  createProduct,
  updateProduct,
} from "../services/products";
import type {
  SortCriteria,
  GetProductsParams,
  GetProductsResponse,
} from "../types/product";
import type { CategoryOption, InventoryData, CategoryMetrics } from "../App";
import { ProductContext, type ProductContextType } from "./ProductContext";

const stockQuantity: number = 10;
const metricsParams: GetProductsParams = {
  name: "",
  category: "",
  availability: "in-stock",
  page: 1,
  limit: 100,
  sort: ["name,asc"],
};

const categories: CategoryOption[] = [
  { value: "Food", label: "Food" },
  { value: "Clothing", label: "Clothing" },
  { value: "Electronics", label: "Electronics" },
];

interface ProductProviderProps {
  children: React.ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}) => {
  const [searchParams, setSearchParams] = useState<GetProductsParams>({
    name: "",
    category: "",
    availability: "",
    page: 1,
    limit: 10,
    sort: ["name,asc"],
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [sortCriteria, setSortCriteria] = useState<SortCriteria[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [metrics, setMetrics] = useState<InventoryData>({
    overall: {
      totalProducts: 0,
      totalValue: 0,
      averagePrice: 0,
    },
    byCategory: {},
  });
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const paramsForApi = { ...searchParams, page: searchParams.page };
      const response: GetProductsResponse = await getProducts(paramsForApi);
      setProducts(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(response.number + 1);
      console.log("Fetched products:", response.content);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setTotalPages(0);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  const handleMetrics = async () => {
    setLoading(true);
    try {
      const categoryMetrics: CategoryMetrics = {};

      // Get metrics for each category
      for (const category of categories) {
        const paramsForApi = {
          ...metricsParams,
          category: category.value,
          availability: "in-stock" as const,
        };

        const response: GetProductsResponse = await getProducts(paramsForApi);

        let totalProducts = 0;
        let totalValue = 0;

        response.content.forEach((product) => {
          totalProducts++;
          totalValue += product.unitPrice;
        });

        const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;

        categoryMetrics[category.value] = {
          totalProducts,
          totalValue: parseFloat(totalValue.toFixed(2)),
          averagePrice: parseFloat(averagePrice.toFixed(2)),
        };
      }

      // Calculate overall metrics
      let overallTotalProducts = 0;
      let overallTotalValue = 0;

      Object.values(categoryMetrics).forEach((categoryMetric) => {
        overallTotalProducts += categoryMetric.totalProducts;
        overallTotalValue += categoryMetric.totalValue;
      });

      const overallAveragePrice =
        overallTotalProducts > 0 ? overallTotalValue / overallTotalProducts : 0;

      setMetrics({
        overall: {
          totalProducts: overallTotalProducts,
          totalValue: parseFloat(overallTotalValue.toFixed(2)),
          averagePrice: parseFloat(overallAveragePrice.toFixed(2)),
        },
        byCategory: categoryMetrics,
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSorting = () => {
    setSortCriteria([]);
  };

  const onCreateProduct = async (product: Omit<Product, "id">) => {
    try {
      await createProduct(product);
      setSearchParams((prev) => ({ ...prev, page: 1 }));
      await fetchProducts();
      await handleMetrics();
      handleResetSorting();
      console.log("Successfully created product");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const onEditProduct = async (product: Product) => {
    try {
      const { id, ...productData } = product;
      await updateProduct(id, productData);
      await fetchProducts();
      await handleMetrics();
      handleResetSorting();
      console.log(`Successfully updated product with ID ${product.id}`);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const onDeleteProduct = async (productId: number) => {
    try {
      await deleteProduct(productId);
      setSearchParams((prev) => ({ ...prev, page: 1 }));
      await fetchProducts();
      await handleMetrics();
      handleResetSorting();
      console.log(`Successfully deleted product with ID ${productId}`);
    } catch (error) {
      console.error(`Error deleting product with ID ${productId}:`, error);
    }
  };

  const onSearch = (searchData: SearchData) => {
    setSearchParams((prev) => ({
      ...prev,
      name: searchData.name,
      category: searchData.category,
      availability: searchData.availability,
      page: 1,
    }));
  };

  const onPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams((prev) => ({ ...prev, page: newPage }));
      setCurrentPage(newPage);
    }
  };

  const onSortingColumn = (columnName: string) => {
    setSortCriteria((prev) => {
      const existingIndex = prev.findIndex(
        (criteria) => criteria.field === columnName
      );

      if (existingIndex >= 0) {
        const newCriteria = [...prev];
        if (newCriteria[existingIndex].direction === "asc") {
          newCriteria[existingIndex] = { field: columnName, direction: "desc" };
        } else {
          newCriteria.splice(existingIndex, 1);
        }
        return newCriteria;
      } else {
        if (prev.length >= 2) {
          return [...prev.slice(1), { field: columnName, direction: "asc" }];
        } else {
          return [...prev, { field: columnName, direction: "asc" }];
        }
      }
    });
  };

  const onSingleStockUpdate = async (
    productId: number,
    makeOutOfStock: boolean
  ) => {
    setLoading(true);
    try {
      let updatedProduct: Product;

      if (makeOutOfStock) {
        updatedProduct = await markProductOutOfStock(productId);
      } else {
        updatedProduct = await markProductInStock(productId, stockQuantity);
      }

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? updatedProduct : product
        )
      );
      await handleMetrics();
    } catch (error) {
      console.error("Error updating product stock:", error);
    } finally {
      setLoading(false);
    }
  };

  const onBulkStockUpdate = async (makeOutOfStock: boolean) => {
    setLoading(true);
    try {
      const updatedPromises = products.map((product) =>
        makeOutOfStock
          ? markProductOutOfStock(product.id)
          : markProductInStock(product.id, stockQuantity)
      );

      const updatedProducts = await Promise.all(updatedPromises);

      setProducts(updatedProducts);
      await handleMetrics();
    } catch (error) {
      console.error("Error updating bulk stock:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const sortParams = sortCriteria.map(
      (criteria) => `${criteria.field},${criteria.direction}`
    );

    setSearchParams((prev) => ({
      ...prev,
      sort: sortParams,
      page: 1,
    }));
  }, [sortCriteria]);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  useEffect(() => {
    handleMetrics();
  }, [products]);

  const contextValue: ProductContextType = {
    products,
    categories,
    searchParams,
    sortCriteria,
    totalPages,
    currentPage,
    metrics,
    loading,
    onCreateProduct,
    onEditProduct,
    onDeleteProduct,
    onSearch,
    onPageChange,
    onSortingColumn,
    handleResetSorting,
    onSingleStockUpdate,
    onBulkStockUpdate,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
