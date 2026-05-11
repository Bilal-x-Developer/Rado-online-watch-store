import React, { useEffect, useState } from "react";
import "./SearchModal.css";

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sample items based on the SmartSearch implementation and App.jsx products
  const items = [
    { name: "Anatom Automatic Skeleton", price: "$559.99", image: "https://www.rado.com/media/catalog/product/a/n/anatom_r10206109_sld_web_1.png?im=Resize=(0,0),aspect=fit;Crop=(0,0,0,0),gravity=Center,allowExpansion" },
    { name: "Ceramic Watch", price: "$8889.99", image: "https://www.rado.com/media/catalog/product/i/n/integral_r20256162_sld_web.png?im=Resize=(0,0),aspect=fit;Crop=(0,0,0,0),gravity=Center,allowExpansion" },
    { name: "Integeral", price: "$3933.99", image: "https://www.rado.com/media/catalog/product/i/n/integral_r20255162_sld_web.png?im=Resize=(0,0),aspect=fit;Crop=(0,0,0,0),gravity=Center,allowExpansion" },
    { name: "Anatom Watch", price: "$59.99", image: "https://www.rado.com/media/catalog/product/a/n/anatom_r10203102_sld_web_1.png?im=AspectCrop=(0,0),allowExpansion,location=(0.5,0.5);Resize=(0,0),aspect=fill;Crop=(0,0,0,0),gravity=Center" },
    { name: "The Square", price: "$933.99", image: "https://www.rado.com/media/catalog/product/t/r/truesquare_r27174712_sld_web.png?im=AspectCrop=(0,0),allowExpansion,location=(0.5,0.5);Resize=(0,0),aspect=fill;Crop=(0,0,0,0),gravity=Center" },
    { name: "Blal's", price: "$5900000.99", image: "https://www.rado.com/media/catalog/product/a/n/anatom_r10204712_sld_web_1.png?im=AspectCrop=(0,0),allowExpansion,location=(0.5,0.5);Resize=(0,0),aspect=fill;Crop=(0,0,0,0),gravity=Center" }
  ];

  useEffect(() => {
    if (!query) {
      setFiltered([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      const result = items.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFiltered(result);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery(""); // clear on close
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`search-modal-overlay \${isOpen ? "open" : ""}`} onClick={onClose}>
      <div
        className={`search-modal-content \${isOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>&times;</button>
        <div className="search-header">
          <h2>Find Products</h2>
          <div className="search-input-wrapper">
            <input
              autoFocus
              type="text"
              placeholder="Start typing to search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="search-results">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Searching...</p>
            </div>
          ) : query && filtered.length === 0 ? (
            <p className="no-results">No products found for "{query}".</p>
          ) : (
            <ul className="results-list">
              {filtered.map((item, index) => (
                <li key={index} className="result-item">
                  <img src={item.image} alt={item.name} className="result-img" />
                  <div className="result-info">
                    <h4>{item.name}</h4>
                    <span className="result-price">{item.price}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
