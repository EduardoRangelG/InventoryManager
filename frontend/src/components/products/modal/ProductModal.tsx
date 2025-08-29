import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../../../contexts/ProductContext";
import type { Product } from "../../../types/product";
import { capitalizeFirstLetter } from "../../../utils/stringFormatter";
import "./ProductModal.css";

interface ProductModalProps {
  isOpen: boolean;
  modalContent: string;
  productToEdit: Product | null;
  productToDelete: Product | null;
  onClose: () => void;
}

function ProductModal({
  isOpen,
  modalContent,
  productToEdit,
  productToDelete,
  onClose,
}: ProductModalProps) {
  const { categories, onCreateProduct, onEditProduct, onDeleteProduct } =
    useContext(ProductContext);

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
  const [errors, setErrors] = useState({
    name: "",
    category: "",
    unitPrice: "",
    stock: "",
  });

  useEffect(() => {
    if (productToEdit) {
      setEditProductData(productToEdit);
    }
    setErrors({ name: "", category: "", unitPrice: "", stock: "" });
  }, [productToEdit, modalContent]);

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

  const validateForm = (data: Omit<Product, "id">) => {
    const newErrors = { name: "", category: "", unitPrice: "", stock: "" };
    let isValid = true;

    if (!data.name.trim()) {
      newErrors.name = "Product name is required.";
      isValid = false;
    }

    if (!data.category) {
      newErrors.category = "Category is required.";
      isValid = false;
    }

    if (isNaN(data.unitPrice) || data.unitPrice <= 0) {
      newErrors.unitPrice = "Unit price must be a positive number.";
      isValid = false;
    }

    if (isNaN(data.stock) || data.stock < 0) {
      newErrors.stock = "Stock must be a non-negative number.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

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
    setErrors((prev) => ({
      ...prev,
      [name]: "",
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
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSave = () => {
    if (modalContent === "create" && validateForm(newProductData)) {
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
    } else if (modalContent === "edit" && validateForm(editProductData)) {
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
    }
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
          {/* Create/Edit Modal */}
          {(modalContent === "create" || modalContent === "edit") && (
            <div className="modal-content-inner">
              <h2 className="modal-title">
                {modalContent === "create"
                  ? "Create New Product"
                  : "Edit Product"}
              </h2>
              {/* Name */}
              <div className="input-field">
                <label htmlFor="name" className="required">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={
                    modalContent === "create"
                      ? newProductData.name
                      : editProductData.name
                  }
                  onChange={
                    modalContent === "create"
                      ? handleNewProductInputChange
                      : handleEditProductInputChange
                  }
                  placeholder="Enter product name..."
                  className={errors.name ? "invalid-input" : ""}
                />
                {errors.name && (
                  <span className="error-text">{errors.name}</span>
                )}
              </div>

              {/* Category (Select) */}
              <div className="select-field">
                <label htmlFor="category" className="required">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={
                    modalContent === "create"
                      ? newProductData.category
                      : editProductData.category
                  }
                  onChange={
                    modalContent === "create"
                      ? handleNewProductInputChange
                      : handleEditProductInputChange
                  }
                  className={errors.category ? "invalid-input" : ""}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className="error-text">{errors.category}</span>
                )}
              </div>

              {/* Unit Price */}
              <div className="input-field">
                <label htmlFor="unitPrice" className="required">
                  Unit Price
                </label>
                <input
                  type="number"
                  id="unitPrice"
                  name="unitPrice"
                  value={
                    modalContent === "create"
                      ? newProductData.unitPrice
                      : editProductData.unitPrice
                  }
                  onChange={
                    modalContent === "create"
                      ? handleNewProductInputChange
                      : handleEditProductInputChange
                  }
                  onFocus={(e) => setTimeout(() => e.target.select(), 5)}
                  placeholder="Enter unit price..."
                  min="0"
                  className={errors.unitPrice ? "invalid-input" : ""}
                />
                {errors.unitPrice && (
                  <span className="error-text">{errors.unitPrice}</span>
                )}
              </div>

              {/* Stock */}
              <div className="input-field">
                <label htmlFor="stock" className="required">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={
                    modalContent === "create"
                      ? newProductData.stock
                      : editProductData.stock
                  }
                  onChange={
                    modalContent === "create"
                      ? handleNewProductInputChange
                      : handleEditProductInputChange
                  }
                  placeholder="Enter stock quantity..."
                  onFocus={(e) => setTimeout(() => e.target.select(), 5)}
                  min="0"
                  className={errors.stock ? "invalid-input" : ""}
                />
                {errors.stock && (
                  <span className="error-text">{errors.stock}</span>
                )}
              </div>

              {/* Expiration Date (Optional) */}
              <div className="input-field">
                <label htmlFor="expirationDate">Expiration Date</label>
                <input
                  type="date"
                  id="expirationDate"
                  name="expirationDate"
                  value={
                    modalContent === "create"
                      ? newProductData.expirationDate
                      : editProductData.expirationDate
                  }
                  onChange={
                    modalContent === "create"
                      ? handleNewProductInputChange
                      : handleEditProductInputChange
                  }
                />
              </div>

              <div className="modal-btns">
                <button
                  className="modal-save-btn"
                  onClick={handleSave}
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
