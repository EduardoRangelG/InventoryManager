import { ProductProvider } from "./contexts/ProductProvider";
import ProductSearch from "./components/search/ProductSearch";
import ProductTable from "./components/products/ProductTable";
import ProductMetrics from "./components/metrics/ProductMetrics";
import "./App.css";

export interface InventoryMetrics {
  totalProducts: number;
  totalValue: number;
  averagePrice: number;
}

export interface CategoryMetrics {
  [category: string]: InventoryMetrics;
}

export interface InventoryData {
  overall: InventoryMetrics;
  byCategory: CategoryMetrics;
}

export interface CategoryOption {
  value: string;
  label: string;
}

function App() {
  return (
    <ProductProvider>
      <ProductSearch />
      <ProductTable />
      <ProductMetrics />
    </ProductProvider>
  );
}

export default App;
