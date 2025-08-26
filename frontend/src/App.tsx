import ProductSearch from "./components/search/ProductSearch";
import type { SearchData } from "./components/search/ProductSearch";
import ProductTable from "./components/products/ProductTable";
import {
  getProducts,
  deleteProduct,
  markProductInStock,
  markProductOutOfStock,
  createProduct,
  updateProduct,
} from "./services/products";
import "./App.css";
import { useState, useEffect } from "react";
import {
  type SortCriteria,
  type GetProductsParams,
  type GetProductsResponse,
} from "./types/product";
import type { Product } from "./types/product";

export interface CategoryOption {
  value: string;
  label: string;
}

const stockQuantity: number = 10;

const categories = [
  { value: "Food", label: "Food" },
  { value: "Clothing", label: "Clothing" },
  { value: "Electronics", label: "Electronics" },
];

function App() {
  const [searchParams, setSearchParams] = useState<GetProductsParams>({
    name: "",
    category: "",
    availability: "in-stock",
    page: 1,
    limit: 10,
    sort: ["name,asc"],
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [sortCriteria, setSortCriteria] = useState<SortCriteria[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleCreateProduct = async (product: Omit<Product, "id">) => {
    try {
      await createProduct(product);

      setSearchParams((prev) => ({ ...prev, page: 1 }));
      handleResetSorting();
      console.log("Successfuly created product");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleEditProduct = async (product: Product) => {
    try {
      const { id, ...productData } = product;
      await updateProduct(id, productData);

      fetchProducts();
      handleResetSorting();
      console.log(`Successfuly updated product with ID ${product.id}`);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await deleteProduct(productId);

      fetchProducts();
      handleResetSorting();
      console.log(`Successfuly deleted product with ID ${productId}`);
    } catch (error) {
      console.error(`Error deleting product with ID ${productId}:`, error);
    }
  };

  const handleSearch = (searchData: SearchData) => {
    setSearchParams({
      ...searchParams,
      name: searchData.name,
      category: searchData.category,
      availability:
        searchData.availability === "" ? "in-stock" : searchData.availability,
      page: 1,
    });
  };

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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams((prev) => ({ ...prev, page: newPage }));
      setCurrentPage(newPage);
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

  const handleSortingColumn = (columnName: string) => {
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

  const handleResetSorting = () => {
    setSortCriteria([]);
  };

  const handleSingleStock = async (
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
    } catch (error) {
      console.error("Error updating product stock:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkStock = async (makeOutOfStock: boolean) => {
    setLoading(true);
    try {
      const updatedPromises = products.map((product) =>
        makeOutOfStock
          ? markProductOutOfStock(product.id)
          : markProductInStock(product.id, stockQuantity)
      );

      const updatedProducts = await Promise.all(updatedPromises);

      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error updating bulk stock:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ProductSearch onSearch={handleSearch} categories={categories} />
      <ProductTable
        products={products}
        categories={categories}
        onCreateProduct={handleCreateProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSortingColumn={handleSortingColumn}
        sortCriteria={sortCriteria}
        onSingleStockUpdate={handleSingleStock}
        onBulkStockUpdate={handleBulkStock}
        loading={loading}
      />
    </>
  );
}

export default App;
