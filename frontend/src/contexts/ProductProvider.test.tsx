import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { useContext } from "react";
import { ProductProvider } from "../contexts/ProductProvider";
import { ProductContext } from "../contexts/ProductContext";
import * as productService from "../services/products";

// Mock child component that consumes the context
const TestConsumer = () => {
  const {
    products,
    currentPage,
    totalPages,
    onSearch,
    onCreateProduct,
    onDeleteProduct,
    onSingleStockUpdate,
    onBulkStockUpdate,
    onPageChange,
    loading,
  } = useContext(ProductContext);

  return (
    <div>
      <span data-testid="product-count">{products.length}</span>
      <span data-testid="current-page">{currentPage}</span>
      <span data-testid="total-pages">{totalPages}</span>
      <span data-testid="loading">{loading.toString()}</span>
      <button
        onClick={() =>
          onSearch({
            name: "mocked-name",
            category: "Food",
            availability: "in-stock",
          })
        }
      >
        Search Button
      </button>
      <button
        onClick={() =>
          onCreateProduct({
            name: "New Test",
            category: "Food",
            unitPrice: 10,
            stock: 5,
          })
        }
      >
        Create Product
      </button>
      {products.length > 0 && (
        <button onClick={() => onDeleteProduct(products[0].id)}>
          Delete Product
        </button>
      )}
      {products.length > 0 && (
        <button onClick={() => onSingleStockUpdate(products[0].id, false)}>
          Update Single Stock
        </button>
      )}
      <button onClick={() => onBulkStockUpdate(true)}>Bulk Update</button>
      <button onClick={() => onPageChange(2)}>Go to Page 2</button>
    </div>
  );
};

vi.mock("../services/products", () => ({
  getProducts: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
  markProductInStock: vi.fn(),
  markProductOutOfStock: vi.fn(),
}));

const mockProducts = [
  {
    id: 1,
    name: "Laptop",
    category: "Electronics",
    unitPrice: 1500,
    stock: 10,
  },
  {
    id: 2,
    name: "Keyboard",
    category: "Electronics",
    unitPrice: 50,
    stock: 20,
  },
  { id: 3, name: "Bread", category: "Food", unitPrice: 2, stock: 50 },
  { id: 4, name: "Shirt", category: "Clothing", unitPrice: 30, stock: 0 },
];

beforeEach(() => {
  vi.clearAllMocks();
  (productService.getProducts as Mock).mockResolvedValue({
    content: mockProducts,
    totalPages: 1,
    number: 0,
  });
});

describe("ProductProvider", () => {
  it("should provide products and fetch on mount", async () => {
    render(
      <ProductProvider>
        <TestConsumer />
      </ProductProvider>
    );

    // Should show loading initially
    expect(screen.getByTestId("loading")).toHaveTextContent("true");

    await waitFor(() => {
      expect(productService.getProducts).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1 })
      );
    });

    // Loading should be false after fetch
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
    expect(screen.getByTestId("product-count")).toHaveTextContent("4");
  });

  it("should call getProducts with search parameters", async () => {
    render(
      <ProductProvider>
        <TestConsumer />
      </ProductProvider>
    );

    const searchButton = screen.getByRole("button", { name: /search button/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(productService.getProducts).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "mocked-name",
          category: "Food",
          availability: "in-stock",
          page: 1,
        })
      );
    });
  });

  it("should call createProduct and refetch data when a product is created", async () => {
    (productService.createProduct as Mock).mockResolvedValue({});

    render(
      <ProductProvider>
        <TestConsumer />
      </ProductProvider>
    );

    const createButton = screen.getByRole("button", {
      name: /create product/i,
    });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(productService.createProduct).toHaveBeenCalledWith({
        name: "New Test",
        category: "Food",
        unitPrice: 10,
        stock: 5,
      });
    });
  });

  it("should call deleteProduct and refetch data when a product is deleted", async () => {
    (productService.deleteProduct as Mock).mockResolvedValue({});

    render(
      <ProductProvider>
        <TestConsumer />
      </ProductProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("product-count")).toHaveTextContent("4");
    });

    const deleteButton = screen.getByRole("button", {
      name: /delete product/i,
    });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(productService.deleteProduct).toHaveBeenCalledWith(
        mockProducts[0].id
      );
    });
  });

  it("should update stock for a single product", async () => {
    (productService.markProductInStock as Mock).mockResolvedValue({
      ...mockProducts[0],
      stock: 15,
    });

    render(
      <ProductProvider>
        <TestConsumer />
      </ProductProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("product-count")).toHaveTextContent("4");
    });

    const updateButton = screen.getByRole("button", {
      name: /update single stock/i,
    });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(productService.markProductInStock).toHaveBeenCalledWith(1, 10);
    });
  });

  it("should handle a bulk stock update and call the API for each product", async () => {
    (productService.markProductOutOfStock as Mock).mockResolvedValue({});

    render(
      <ProductProvider>
        <TestConsumer />
      </ProductProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("product-count")).toHaveTextContent("4");
    });

    const bulkUpdateButton = screen.getByRole("button", {
      name: /bulk update/i,
    });
    fireEvent.click(bulkUpdateButton);

    await waitFor(() => {
      expect(productService.markProductOutOfStock).toHaveBeenCalledWith(1);
      expect(productService.markProductOutOfStock).toHaveBeenCalledWith(2);
      expect(productService.markProductOutOfStock).toHaveBeenCalledWith(3);
      expect(productService.markProductOutOfStock).toHaveBeenCalledWith(4);
    });
  });

  it("should handle API errors gracefully", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (productService.getProducts as Mock).mockRejectedValue(
      new Error("API Error")
    );

    render(
      <ProductProvider>
        <TestConsumer />
      </ProductProvider>
    );

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Error fetching products:",
        expect.any(Error)
      );
    });

    // Should still render with empty products
    expect(screen.getByTestId("product-count")).toHaveTextContent("0");
    expect(screen.getByTestId("loading")).toHaveTextContent("false");

    consoleError.mockRestore();
  });

  it("should handle pagination changes", async () => {
    (productService.getProducts as Mock).mockResolvedValue({
      content: mockProducts,
      totalPages: 3, // Multiple pages for testing
      number: 0,
    });

    render(
      <ProductProvider>
        <TestConsumer />
      </ProductProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("current-page")).toHaveTextContent("1");
    });

    // Click pagination button
    const pageButton = screen.getByRole("button", { name: /go to page 2/i });
    fireEvent.click(pageButton);

    await waitFor(() => {
      expect(productService.getProducts).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 })
      );
      expect(screen.getByTestId("current-page")).toHaveTextContent("2");
    });
  });
});
