import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Checkout.css";

function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null") || {};
  } catch {
    return {};
  }
}

function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => {
    const user = getSavedUser();
    return {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    };
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setMessage("Cart is empty");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        },

        products: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),

        totalAmount: total,
      };

      await api.post("/orders", orderData);
      clearCart();
      alert("Your order has been placed successfully and will reach you soon.");
      navigate("/");
    } catch (error) {
      console.error("Order error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-empty">
        <h1>Checkout</h1>

        <p>Your cart is empty.</p>

        <button onClick={() => navigate("/products")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">

      <h1>Checkout</h1>

      <div className="checkout-container">

        {/* ORDER SUMMARY */}

        <div className="order-summary">

          <h2>Order Summary</h2>

          {cart.map((item) => (
            <div
              className="summary-item"
              key={item._id}
            >
              <div>
                <h3>{item.name}</h3>

                <p>
                  ₹{item.price} × {item.quantity}
                </p>
              </div>

              <strong>
                ₹{item.price * item.quantity}
              </strong>
            </div>
          ))}

          <div className="total-section">
            <h2>Total</h2>

            <h2>₹{total}</h2>
          </div>

        </div>


        {/* DELIVERY DETAILS */}

        <div className="customer-details">

          <h2>Delivery Details</h2>

          <form onSubmit={handleOrder}>

            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />


            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />


            <label>Phone Number</label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <label>Delivery Address</label>

            <textarea
              name="address"
              placeholder="Enter your delivery address"
              value={formData.address}
              onChange={handleChange}
              required
            />


            <button
              className="place-order-btn"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Placing Order..."
                : "Place Order"}
            </button>

          </form>

          {message && (
            <p className="checkout-message">
              {message}
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

export default Checkout;
