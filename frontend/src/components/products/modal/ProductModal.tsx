import { useEffect, useState } from "react";
import type { Product } from "../../../types/product";
import type { CategoryOption } from "../../../App";
import { capitalizeFirstLetter } from "../../../utils/stringFormatter";
import "./ProductModal.css";

interface ProductModalProps {
  isOpen: boolean;
  modalContent: string;
  categories: CategoryOption[];
  onCreateProduct: (product: Omit<Product, "id">) => void;
  onEditProduct: (product: Product) => void;
  productToEdit: Product | null;
  onDeleteProduct: (productId: number) => void;
  productToDelete: Product | null;
  onClose: () => void;
}

function ProductModal({
  isOpen,
  modalContent,
  categories,
  onCreateProduct,
  onEditProduct,
  productToEdit,
  onDeleteProduct,
  productToDelete,
  onClose,
}: ProductModalProps) {
  const [newProductData, setNewProductData] = useState<Omit<Product, "id">>({
    name: "",
    category: "",
    unitPrice: 0,
    stock: 0,
    expirationDate: "",
  });
  const [editProductData, setEditProductData] = useState<Product>({
    id: 0,
    name: "",
    category: "",
    unitPrice: 0,
    stock: 0,
    expirationDate: "",
  });

  useEffect(() => {
    if (productToEdit) {
      setEditProductData(productToEdit);
    }
  }, [productToEdit]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleNewProductInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const parsedValue =
      type === "stock" || name === "unitPrice" ? parseInt(value) : value;
    setNewProductData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleEditProductInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const parsedValue =
      type === "stock" || name === "unitPrice" ? parseInt(value) : value;
    setEditProductData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleCreateProduct = () => {
    const productToCreate: Omit<Product, "id"> = {
      name: capitalizeFirstLetter(newProductData.name),
      category: newProductData.category,
      unitPrice: newProductData.unitPrice,
      stock: newProductData.stock,
      expirationDate: newProductData.expirationDate,
    };
    onCreateProduct(productToCreate);
    setNewProductData({
      name: "",
      category: "",
      unitPrice: 0,
      stock: 0,
      expirationDate: "",
    });
    onClose();
  };

  const handleEditProduct = () => {
    const productToUpdate: Product = {
      id: editProductData.id,
      name: capitalizeFirstLetter(editProductData.name),
      category: editProductData.category,
      unitPrice: editProductData.unitPrice,
      stock: editProductData.stock,
      expirationDate: editProductData.expirationDate,
    };
    onEditProduct(productToUpdate);
    setEditProductData({
      id: 0,
      name: "",
      category: "",
      unitPrice: 0,
      stock: 0,
      expirationDate: "",
    });
    onClose();
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete.id);
    }
    onClose();
  };

  if (!isOpen) {
    return null;
  }
  return (
    <>
      <div
        className={`modal-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Create Modal */}
          {modalContent === "create" && (
            <div className="modal-content-inner">
              <h2 className="modal-title">Create New Product</h2>
              {/* Name */}
              <div className="input-field">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newProductData.name}
                  onChange={handleNewProductInputChange}
                  placeholder="Enter product name..."
                />
              </div>

              {/* Category (Select) */}
              <div className="select-field">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={newProductData.category}
                  onChange={handleNewProductInputChange}
                >
                  <option value="" disabled>
                    Existing categories or create a new one
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit Price */}
              <div className="input-field">
                <label htmlFor="unitPrice">Unit Price</label>
                <input
                  type="number"
                  id="unitPrice"
                  name="unitPrice"
                  value={newProductData.unitPrice}
                  onChange={handleNewProductInputChange}
                  onFocus={(e) => setTimeout(() => e.target.select(), 5)}
                  placeholder="Enter unit price..."
                  min="0"
                />
              </div>

              {/* Stock */}
              <div className="input-field">
                <label htmlFor="stock">Stock</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={newProductData.stock}
                  onChange={handleNewProductInputChange}
                  placeholder="Enter stock quantity..."
                  onFocus={(e) => setTimeout(() => e.target.select(), 5)}
                  min="0"
                />
              </div>

              {/* Expiration Date (Optional) */}
              <div className="input-field">
                <label htmlFor="expirationDate">Expiration Date</label>
                <input
                  type="date"
                  id="expirationDate"
                  name="expirationDate"
                  value={newProductData.expirationDate}
                  onChange={handleNewProductInputChange}
                />
              </div>

              <div className="modal-btns">
                <button
                  className="modal-save-btn"
                  onClick={handleCreateProduct}
                  aria-label="Save Product"
                >
                  Save
                </button>
                <button
                  className="modal-cancel-btn"
                  onClick={onClose}
                  aria-label="Close Modal"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {modalContent === "edit" && (
            <div className="modal-content-inner">
              <h2 className="modal-title">Edit Product</h2>
              {/* Name */}
              <div className="input-field">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editProductData.name}
                  onChange={handleEditProductInputChange}
                  placeholder="Enter product name..."
                />
              </div>

              {/* Category (Select) */}
              <div className="select-field">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={editProductData.category}
                  onChange={handleEditProductInputChange}
                >
                  <option value="" disabled>
                    Existing categories or create a new one
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit Price */}
              <div className="input-field">
                <label htmlFor="unitPrice">Unit Price</label>
                <input
                  type="number"
                  id="unitPrice"
                  name="unitPrice"
                  value={editProductData.unitPrice}
                  onChange={handleEditProductInputChange}
                  onFocus={(e) => setTimeout(() => e.target.select(), 5)}
                  placeholder="Enter unit price..."
                  min="0"
                />
              </div>

              {/* Stock */}
              <div className="input-field">
                <label htmlFor="stock">Stock</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={editProductData.stock}
                  onChange={handleEditProductInputChange}
                  placeholder="Enter stock quantity..."
                  onFocus={(e) => setTimeout(() => e.target.select(), 5)}
                  min="0"
                />
              </div>

              {/* Expiration Date (Opcional) */}
              <div className="input-field">
                <label htmlFor="expirationDate">Expiration Date</label>
                <input
                  type="date"
                  id="expirationDate"
                  name="expirationDate"
                  value={editProductData.expirationDate}
                  onChange={handleEditProductInputChange}
                />
              </div>
              <div className="modal-btns">
                <button
                  className="modal-save-btn"
                  onClick={handleEditProduct}
                  aria-label="Save Product"
                >
                  Save
                </button>
                <button
                  className="modal-cancel-btn"
                  onClick={onClose}
                  aria-label="Close Modal"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Delete Modal */}
          {modalContent === "delete" && (
            <div className="modal-content-inner">
              <h2 className="modal-title">Delete Product</h2>
              <p className="modal-text">
                Are you sure you want to delete this product? This action cannot
                be undone.
              </p>
              <div className="modal-btns">
                <button
                  className="modal-delete-btn"
                  onClick={handleDeleteProduct}
                  aria-label="Delete Product"
                >
                  Delete
                </button>
                <button
                  className="modal-cancel-btn"
                  onClick={onClose}
                  aria-label="Close Modal"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductModal;
