import { useEffect, useState } from "react";
import type { Product, SortCriteria } from "../../types/product";
import { formatUTCDate } from "../../utils/dateFormatter";
import "./ProductTable.css";

interface ProductTableProps {
  products: Product[];
  onSortingColumn: (columnName: string) => void;
  sortCriteria: SortCriteria[];
  onSingleStockUpdate: (productId: number, makeOutOfStock: boolean) => void;
  onBulkStockUpdate: (makeOutOfStock: boolean) => void;
  loading: boolean;
}

function ProductTable({
  products = [],
  onSortingColumn,
  sortCriteria,
  onSingleStockUpdate,
  onBulkStockUpdate,
  loading,
}: ProductTableProps) {
  const [allSelected, setAllSelected] = useState(false);

  // Header checkbox logic
  useEffect(() => {
    if (products.length === 0) {
      setAllSelected(false);
    } else {
      // Verify if all products are out of stock
      const allOutOfStock = products.every((product) => product.stock === 0);
      setAllSelected(allOutOfStock);
    }
  }, [products]);

  const handleBulkStock = (isChecked: boolean) => {
    setAllSelected(isChecked);
    onBulkStockUpdate(isChecked);
  };

  // Single checkbox logic
  const handleSingleStock = (productId: number, isChecked: boolean) => {
    onSingleStockUpdate(productId, isChecked);
  };

  // Handle sorting symbol
  const getSortSymbol = (columnName: string) => {
    const criteria = sortCriteria.find((c) => c.field === columnName);

    if (criteria) {
      const orderIndex = sortCriteria.findIndex((c) => c.field === columnName);
      const symbol = criteria.direction === "asc" ? "↑" : "↓";

      return (
        <span className={`sort-symbol order-${orderIndex + 1}`}>{symbol}</span>
      );
    }
    return "↕";
  };

  return (
    <>
      <button className="create-product">New product</button>

      <table className="product-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                className="stockHandler"
                checked={allSelected}
                disabled={loading || products.length === 0}
                onChange={(e) => handleBulkStock(e.target.checked)}
              ></input>
            </th>
            <th
              className="th-category"
              onClick={() => onSortingColumn("category")}
            >
              Category {getSortSymbol("category")}
            </th>
            <th className="th-name" onClick={() => onSortingColumn("name")}>
              Name {getSortSymbol("name")}
            </th>
            <th className="th-price" onClick={() => onSortingColumn("price")}>
              Price {getSortSymbol("price")}
            </th>
            <th
              className="th-date"
              onClick={() => onSortingColumn("expirationDate")}
            >
              Expiration Date {getSortSymbol("expirationDate")}
            </th>
            <th className="th-stock" onClick={() => onSortingColumn("stock")}>
              Stock {getSortSymbol("stock")}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr className="no-products-row">
              <td colSpan={7}>
                {loading
                  ? "Loading products..."
                  : "No products to display. Add a new product to get started!"}
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} className="product-row">
                <td>
                  <input
                    type="checkbox"
                    className="stockHandler"
                    checked={product.stock === 0}
                    disabled={loading}
                    onChange={(e) =>
                      handleSingleStock(product.id, e.target.checked)
                    }
                  ></input>
                </td>
                <td>{product.category}</td>
                <td>{product.name}</td>
                <td>${product.unitPrice.toFixed(2)}</td>
                <td>
                  {product.expirationDate
                    ? formatUTCDate(product.expirationDate)
                    : ""}
                </td>
                <td
                  className={`stock-cell ${
                    product.stock === 0
                      ? "out-of-stock"
                      : product.stock < 5
                      ? "low-stock"
                      : product.stock <= 10
                      ? "medium-stock"
                      : "high-stock"
                  }`}
                >
                  {product.stock}
                </td>
                <td>
                  {/* Action buttons */}
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}

export default ProductTable;
