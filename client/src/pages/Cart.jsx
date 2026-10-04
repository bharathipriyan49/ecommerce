import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  // Cart empty
  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h1>Shopping Cart 🛒</h1>
        <p>Your cart is empty.</p>

        <button
          className="checkout-btn"
          onClick={() => navigate("/products")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // Calculate total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <h1>Shopping Cart 🛒</h1>

      {/* Cart Items */}
      {cart.map((item) => (
        <div className="cart-item" key={item._id}>
          <img
            src={item.image}
            alt={item.name}
          />

          <div className="cart-item-details">
            <h2>{item.name}</h2>

            <p>Price: ₹{item.price}</p>

            {/* Quantity */}
            <div className="quantity-control">
              <button
                onClick={() =>
                  updateQuantity(item._id, -1)
                }
              >
                −
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() =>
                  updateQuantity(item._id, 1)
                }
              >
                +
              </button>
            </div>

            <p>
              Subtotal: ₹
              {item.price * item.quantity}
            </p>

            {/* Remove */}
            <button
              className="remove-btn"
              onClick={() =>
                removeFromCart(item._id)
              }
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* Cart Total */}
      <div className="cart-total">
        <h2>Total: ₹{total}</h2>

        <button
          className="clear-cart"
          onClick={clearCart}
        >
          Clear Cart
        </button>

        <button
          className="checkout-btn"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </button>
        
      </div>
    </div>
  );
}

export default Cart;