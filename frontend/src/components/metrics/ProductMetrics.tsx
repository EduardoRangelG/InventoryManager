import type { CategoryOption, InventoryData } from "../../App";
import "./ProductMetrics.css";

interface ProductMetricsProps {
  categories: CategoryOption[];
  metrics: InventoryData;
}

function ProductMetrics({ categories, metrics }: ProductMetricsProps) {
  return (
    <>
      <div className="product-metrics">
        <table className="metrics-table">
          <thead>
            <tr>
              <th></th>
              <th>Total products in Stock</th>
              <th>Total value in Stock</th>
              <th>Average price in Stock</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const categoryMetric = metrics.byCategory[category.value] || {
                totalProducts: 0,
                totalValue: 0,
                averagePrice: 0,
              };

              return (
                <tr key={category.value} className="category-row">
                  <td>{category.label}</td>
                  <td>{categoryMetric.totalProducts}</td>
                  <td>${categoryMetric.totalValue}</td>
                  <td>${categoryMetric.averagePrice}</td>
                </tr>
              );
            })}
            <tr className="overall-row">
              <td>
                <strong>Overall</strong>
              </td>
              <td>
                <strong>{metrics.overall.totalProducts}</strong>
              </td>
              <td>
                <strong>${metrics.overall.totalValue}</strong>
              </td>
              <td>
                <strong>${metrics.overall.averagePrice}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ProductMetrics;
