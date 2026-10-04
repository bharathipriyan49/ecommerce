import { useState } from "react";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setShowAddedFeedback(false);
    requestAnimationFrame(() => setShowAddedFeedback(true));
  };

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />

      <div className="product-info">
        <h2>{product.name}</h2>

        <p>{product.description}</p>

        <h3>₹{product.price}</h3>

        <p>Category: {product.category}</p>

        <p>⭐ {product.rating}</p>

        <p>Stock: {product.stock}</p>

        <button
          className={showAddedFeedback ? "add-to-cart-feedback" : ""}
          onClick={handleAddToCart}
          onAnimationEnd={() => setShowAddedFeedback(false)}
        >
          {showAddedFeedback ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;