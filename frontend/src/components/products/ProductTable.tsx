import { useEffect, useState } from "react";
import type { Product, SortCriteria } from "../../types/product";
import type { CategoryOption } from "../../App";
import { formatUTCDate } from "../../utils/dateFormatter";
import ProductModal from "./modal/ProductModal";
import "./ProductTable.css";

interface ProductTableProps {
  products: Product[];
  categories: CategoryOption[];
  onCreateProduct: (product: Omit<Product, "id">) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onSortingColumn: (columnName: string) => void;
  sortCriteria: SortCriteria[];
  onSingleStockUpdate: (productId: number, makeOutOfStock: boolean) => void;
  onBulkStockUpdate: (makeOutOfStock: boolean) => void;
  loading: boolean;
}

function ProductTable({
  products = [],
  categories = [],
  onCreateProduct,
  onEditProduct,
  onDeleteProduct,
  onSortingColumn,
  sortCriteria,
  onSingleStockUpdate,
  onBulkStockUpdate,
  loading,
}: ProductTableProps) {
  const [allSelected, setAllSelected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  // Modals logic

  const openCreateModal = () => {
    setModalContent("create");
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setModalContent("edit");
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const openDeleteModal = (product: Product) => {
    setModalContent("delete");
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);

    setModalContent("");
    setSelectedProduct(null);
  };

  // Stock logic
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
      <button className="create-product" onClick={openCreateModal}>
        New product
      </button>

      <table className="product-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                className="stock-handler"
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
            <th
              className="th-price"
              onClick={() => onSortingColumn("unitPrice")}
            >
              Price {getSortSymbol("unitPrice")}
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
                    className="stock-handler"
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
                  <button
                    className="edit-btn"
                    onClick={() => openEditModal(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => openDeleteModal(product)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ProductModal
        isOpen={isModalOpen}
        modalContent={modalContent}
        categories={categories}
        onCreateProduct={onCreateProduct}
        onEditProduct={onEditProduct}
        productToEdit={selectedProduct}
        onDeleteProduct={onDeleteProduct}
        productToDelete={selectedProduct}
        onClose={closeModal}
      ></ProductModal>
    </>
  );
}

export default ProductTable;
