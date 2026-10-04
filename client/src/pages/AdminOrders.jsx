import { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      const response = await api.put(
        `/orders/${orderId}/status`,
        {
          status: newStatus,
        }
      );

      console.log(response.data);

      // Update UI immediately
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );

      alert("Order status updated successfully");
    } catch (error) {
      console.error("Status update error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-orders">
        <h1>Loading Orders...</h1>
      </div>
    );
  }

  return (
    <div className="admin-orders">

      <h1>Admin Orders</h1>

      {orders.length === 0 ? (
        <p className="no-orders">
          No orders found.
        </p>
      ) : (
        <div className="orders-container">

          {orders.map((order) => (
            <div
              className="order-card"
              key={order._id}
            >

              {/* ORDER HEADER */}

              <div className="order-header">

                <div>
                  <h2>
                    Order #{order._id.slice(-6)}
                  </h2>

                  <p>
                    {new Date(
                      order.createdAt
                    ).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`status ${order.status.toLowerCase()}`}
                >
                  {order.status}
                </span>

              </div>


              {/* CUSTOMER */}

              <div className="customer-info">

                <h3>Customer Details</h3>

                <p>
                  <strong>Name:</strong>{" "}
                  {order.customer.name}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {order.customer.email}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {order.customer.phone}
                </p>

                <p>
                  <strong>Address:</strong>{" "}
                  {order.customer.address}
                </p>

              </div>


              {/* PRODUCTS */}

              <div className="product-info">

                <h3>Products</h3>

                {order.products.map((item) => (
                  <div
                    className="product-row"
                    key={item._id}
                  >

                    <div>
                      <strong>
                        {item.product?.name ||
                          "Product unavailable"}
                      </strong>

                      <p>
                        ₹{item.price} ×{" "}
                        {item.quantity}
                      </p>
                    </div>

                    <strong>
                      ₹
                      {item.price *
                        item.quantity}
                    </strong>

                  </div>
                ))}

              </div>


              {/* TOTAL */}

              <div className="order-footer">

                <h2>
                  Total: ₹{order.totalAmount}
                </h2>

              </div>


              {/* STATUS UPDATE */}

              <div className="status-update">

                <label>
                  Update Status
                </label>

                <select
                  value={order.status}
                  disabled={
                    updatingId === order._id
                  }
                  onChange={(e) =>
                    updateStatus(
                      order._id,
                      e.target.value
                    )
                  }
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Shipped">
                    Shipped
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>

                {updatingId === order._id && (
                  <span className="updating">
                    Updating...
                  </span>
                )}

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default AdminOrders;