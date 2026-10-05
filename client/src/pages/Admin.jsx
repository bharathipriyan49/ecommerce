import React, { useState } from "react";
import api from "../services/api";

const Admin = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    rating: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(`📝 Field changed: ${name} =`, value);

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    console.log("🖼️ Image selected:", selectedImage);

    if (selectedImage) {
      console.log("Image Name:", selectedImage.name);
      console.log("Image Type:", selectedImage.type);
      console.log("Image Size:", selectedImage.size, "bytes");
    }

    setImage(selectedImage || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("=================================");
    console.log("🚀 ADD PRODUCT STARTED");
    console.log("=================================");

    setMessage("");

    // Check form data
    console.log("📦 Form Data:", formData);
    console.log("🖼️ Image:", image);

    if (!image) {
      console.error("❌ No product image selected");
      setMessage("Please select a product image");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("stock", formData.stock);
      data.append("rating", formData.rating);
      data.append("image", image);

      // Check FormData
      console.log("📤 FormData contents:");

      for (let pair of data.entries()) {
        if (pair[0] === "image") {
          console.log(
            "image:",
            pair[1].name,
            pair[1].type,
            pair[1].size + " bytes"
          );
        } else {
          console.log(`${pair[0]}:`, pair[1]);
        }
      }

      console.log("🌐 API Request:");
      console.log("Method: POST");
      console.log("URL: /admin/mohan");

      const response = await api.post(
        "/admin/mohan",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("=================================");
      console.log("✅ PRODUCT ADDED SUCCESSFULLY");
      console.log("=================================");

      console.log("📥 Response Status:", response.status);
      console.log("📥 Response Data:", response.data);
      console.log("📥 Full Response:", response);

      setMessage(
        response.data.message || "Product added successfully!"
      );

      // Clear form
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        rating: "",
      });

      setImage(null);

      const imageInput = document.getElementById("productImage");

      if (imageInput) {
        imageInput.value = "";
      }

      console.log("🧹 Form cleared successfully");

    } catch (error) {
      console.log("=================================");
      console.error("❌ ADD PRODUCT ERROR");
      console.log("=================================");

      console.error("Error Object:", error);

      // Axios error
      if (error.response) {
        console.error("❌ Server Response Error");
        console.error("Status:", error.response.status);
        console.error("Status Text:", error.response.statusText);
        console.error("Response Data:", error.response.data);
        console.error("Response Headers:", error.response.headers);

        setMessage(
          error.response.data?.message ||
            error.response.data?.error ||
            `Server Error: ${error.response.status}`
        );
      }

      // Request sent but no response
      else if (error.request) {
        console.error("❌ No Response From Server");
        console.error("Request:", error.request);

        setMessage(
          "Server did not respond. Check backend / API URL."
        );
      }

      // Something else
      else {
        console.error("❌ Request Setup Error");
        console.error("Message:", error.message);

        setMessage(
          error.message || "Failed to add product"
        );
      }

      console.error("❌ Error Message:", error.message);
      console.error("❌ Error Stack:", error.stack);

    } finally {
      setLoading(false);

      console.log("=================================");
      console.log("🏁 ADD PRODUCT REQUEST FINISHED");
      console.log("=================================");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h1 style={styles.title}>
          Admin - Add Product
        </h1>

        <p style={styles.subtitle}>
          Add a new product to your e-commerce website
        </p>

        <form onSubmit={handleSubmit}>

          {/* Product Name */}
          <label>Product Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />

          {/* Description */}
          <label>Description</label>

          <textarea
            name="description"
            placeholder="Enter product description"
            value={formData.description}
            onChange={handleChange}
            required
            style={styles.textarea}
          />

          {/* Price */}
          <label>Price</label>

          <input
            type="number"
            name="price"
            placeholder="Enter price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            required
            style={styles.input}
          />

          {/* Category */}
          <label>Category</label>

          <input
            type="text"
            name="category"
            placeholder="Example: Electronics"
            value={formData.category}
            onChange={handleChange}
            required
            style={styles.input}
          />

          {/* Stock */}
          <label>Stock</label>

          <input
            type="number"
            name="stock"
            placeholder="Enter stock quantity"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
            style={styles.input}
          />

          {/* Rating */}
          <label>Rating</label>

          <input
            type="number"
            name="rating"
            placeholder="Example: 4.5"
            value={formData.rating}
            onChange={handleChange}
            min="0"
            max="5"
            step="0.1"
            style={styles.input}
          />

          {/* Image */}
          <label>Product Image</label>

          <input
            id="productImage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            style={styles.fileInput}
          />

          {image && (
            <p style={styles.fileName}>
              Selected: {image.name}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Adding Product..."
              : "Add Product"}
          </button>

        </form>

        {/* Message */}
        {message && (
          <div style={styles.message}>
            {message}
          </div>
        )}

      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f4f6f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
  },

  card: {
    width: "100%",
    maxWidth: "550px",
    backgroundColor: "#ffffff",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  },

  title: {
    textAlign: "center",
    marginBottom: "8px",
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "25px",
  },

  input: {
    width: "100%",
    padding: "11px",
    marginTop: "7px",
    marginBottom: "18px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "11px",
    marginTop: "7px",
    marginBottom: "18px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box",
    resize: "vertical",
  },

  fileInput: {
    width: "100%",
    marginTop: "8px",
    marginBottom: "10px",
  },

  fileName: {
    fontSize: "14px",
    color: "#555",
  },

  button: {
    width: "100%",
    padding: "13px",
    marginTop: "20px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },

  message: {
    marginTop: "20px",
    padding: "12px",
    backgroundColor: "#f1f5f9",
    borderRadius: "6px",
    textAlign: "center",
  },
};

export default Admin;
