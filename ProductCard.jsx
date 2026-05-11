import React from "react";
import "./ProductCard.css";

const ProductCard = ({ name, price, image, description, onAddToCart }) => {
  return (
    <div className="card">
      <img src={image} alt={name} className="card-image" />

      <div className="card-content">
        <h2 className="card-name">{name}</h2>
        <p className="card-description">{description}</p>
        <h3 className="card-price">${price}</h3>

        <button className="card-button" onClick={onAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;