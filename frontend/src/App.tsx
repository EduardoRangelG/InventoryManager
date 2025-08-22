import ProductSearch from "./components/search/ProductSearch";
import type { SearchData } from "./components/search/ProductSearch";
import ProductTable from "./components/products/ProductTable";
import {
  getProducts,
  markProductInStock,
  markProductOutOfStock,
} from "./services/products";
import "./App.css";
import { useState, useEffect } from "react";
import {
  type SortCriteria,
  type GetProductsParams,
  type GetProductsResponse,
} from "./types/product";
import type { Product } from "./types/product";

const stockQuantity: number = 10;

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
  const [sortCriteria, setSortCriteria] = useState<SortCriteria[]>([
    { field: "name", direction: "asc" },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (searchData: SearchData) => {
    setSearchParams({
      name: searchData.name,
      category: searchData.category,
      availability:
        searchData.availability === "" ? "in-stock" : searchData.availability,
    });
  };

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
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response: GetProductsResponse = await getProducts(searchParams);
        setProducts(response.content);
        console.log("Fetched products:", response.content);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

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

  const categories = [
    { value: "food", label: "Food" },
    { value: "clothing", label: "Clothing" },
    { value: "electronics", label: "Electronics" },
  ];

  return (
    <>
      <ProductSearch onSearch={handleSearch} categories={categories} />
      <ProductTable
        products={products}
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
