import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

// Mock the child components
vi.mock("./components/search/ProductSearch", () => ({
  default: vi.fn(() => <div data-testid="mock-search">Search Component</div>),
}));

vi.mock("./components/products/ProductTable", () => ({
  default: vi.fn(() => <div data-testid="mock-table">Table Component</div>),
}));

vi.mock("./components/metrics/ProductMetrics", () => ({
  default: vi.fn(() => <div data-testid="mock-metrics">Metrics Component</div>),
}));

describe("App", () => {
  it("should render all child components within ProductProvider", () => {
    render(<App />);

    expect(screen.getByTestId("mock-search")).toBeInTheDocument();
    expect(screen.getByTestId("mock-table")).toBeInTheDocument();
    expect(screen.getByTestId("mock-metrics")).toBeInTheDocument();
  });
});
