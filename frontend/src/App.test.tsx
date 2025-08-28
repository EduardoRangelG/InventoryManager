import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import App from "./App";
import * as productService from "./services/products";

vi.mock("./services/products", () => ({
  getProducts: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
  markProductInStock: vi.fn(),
  markProductOutOfStock: vi.fn(),
}));

vi.mock("./components/search/ProductSearch", () => ({
  default: vi.fn(({ onSearch }) => (
    <div data-testid="mock-search">
      Mock Search
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
    </div>
  )),
}));

vi.mock("./components/products/ProductTable", () => ({
  default: vi.fn(
    ({
      products,
      onCreateProduct,
      onDeleteProduct,
      onSingleStockUpdate,
      onBulkStockUpdate,
    }) => (
      <div data-testid="mock-product-table">
        Mock Product Table
        <span data-testid="product-count">{products.length}</span>
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
          <button onClick={() => onSingleStockUpdate(products[0].id, true)}>
            Update Single Stock
          </button>
        )}
        <button onClick={() => onBulkStockUpdate(true)}>Bulk Update</button>
      </div>
    )
  ),
}));

vi.mock("./components/metrics/ProductMetrics", () => ({
  default: vi.fn(() => <div data-testid="mock-metrics">Mock Metrics</div>),
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

describe("App", () => {
  it("should render child components and fetch products on mount", async () => {
    render(<App />);

    expect(screen.getByTestId("mock-search")).toBeInTheDocument();
    expect(screen.getByTestId("mock-product-table")).toBeInTheDocument();
    expect(screen.getByTestId("mock-metrics")).toBeInTheDocument();

    await waitFor(() => {
      expect(productService.getProducts).toHaveBeenCalledTimes(1);
      expect(productService.getProducts).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1 })
      );
    });
  });

  it("should call getProducts with updated search parameters", async () => {
    render(<App />);
    await waitFor(() =>
      expect(productService.getProducts).toHaveBeenCalledTimes(1)
    );

    const searchButton = screen.getByRole("button", { name: /search button/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(productService.getProducts).toHaveBeenCalledTimes(2);
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
    render(<App />);
    await waitFor(() =>
      expect(productService.getProducts).toHaveBeenCalledTimes(1)
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
      expect(productService.getProducts).toHaveBeenCalledTimes(2);
    });
  });

  it("should call deleteProduct and refetch data when a product is deleted", async () => {
    render(<App />);
    await waitFor(() =>
      expect(screen.getByTestId("product-count")).toHaveTextContent("4")
    );

    const deleteButton = screen.getByRole("button", {
      name: /delete product/i,
    });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(productService.deleteProduct).toHaveBeenCalledWith(
        mockProducts[0].id
      );
      expect(productService.getProducts).toHaveBeenCalledTimes(2);
    });
  });

  it("should update stock for a single product and then re-render", async () => {
    (productService.markProductInStock as Mock).mockResolvedValue({
      id: 1,
      name: "Laptop",
      category: "Electronics",
      unitPrice: 1500,
      stock: 10,
    });
    render(<App />);
    await waitFor(() =>
      expect(productService.getProducts).toHaveBeenCalledTimes(1)
    );

    const updateButton = screen.getByRole("button", {
      name: /update single stock/i,
    });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(productService.markProductInStock).toHaveBeenCalledWith(1, 10);
    });
  });

  it("should handle a bulk stock update and call the API for each product", async () => {
    render(<App />);
    await waitFor(() =>
      expect(productService.getProducts).toHaveBeenCalledTimes(1)
    );

    const bulkUpdateButton = screen.getByRole("button", {
      name: /bulk update/i,
    });
    fireEvent.click(bulkUpdateButton);

    await waitFor(() => {
      expect(productService.markProductOutOfStock).toHaveBeenCalledTimes(
        mockProducts.length
      );
      expect(productService.markProductOutOfStock).toHaveBeenCalledWith(1);
      expect(productService.markProductOutOfStock).toHaveBeenCalledWith(2);
      expect(productService.markProductOutOfStock).toHaveBeenCalledWith(3);
      expect(productService.markProductOutOfStock).toHaveBeenCalledWith(4);
    });
  });
});
