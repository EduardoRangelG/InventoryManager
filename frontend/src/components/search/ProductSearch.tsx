import { useState } from "react";
import "./ProductSearch.css";

export interface SearchData {
  name: string;
  category: string;
  availability: "in-stock" | "out-of-stock" | "";
}

interface CategoryOption {
  value: string;
  label: string;
}

interface ProductSearchProps {
  onSearch: (data: SearchData) => void;
  categories?: CategoryOption[];
}

function ProductSearch({ onSearch, categories = [] }: ProductSearchProps) {
  const [searchData, setSearchData] = useState<SearchData>({
    name: "",
    category: "",
    availability: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchData);
  };

  const handleClear = () => {
    setSearchData({
      name: "",
      category: "",
      availability: "",
    });
    onSearch({
      name: "",
      category: "",
      availability: "",
    });
  };

  return (
    <div className="product-search">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-fields">
          {/* Name and Buttons */}
          {/* Name */}
          <div className="input-field">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={searchData.name}
              onChange={handleInputChange}
              placeholder="Enter name..."
            />
          </div>

          {/* Select fields */}
          <div className="select-fields-container">
            {/* Category */}
            <div className="select-field">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={searchData.category}
                onChange={handleInputChange}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="select-buttons-row">
              {/* Availability */}
              <div className="select-field">
                <label htmlFor="availability">Availability</label>
                <select
                  id="availability"
                  name="availability"
                  value={searchData.availability}
                  onChange={handleInputChange}
                >
                  <option value="">All</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="search-buttons">
                <button type="submit" className="search-btn">
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="clear-btn"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProductSearch;
