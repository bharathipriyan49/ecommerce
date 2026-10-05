const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

// Admin route
const adminRoutes = require("./routes/add_products");

// Other routes
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

// Load environment variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "E-Commerce API is running",
  });
});

// Admin - Add Product
app.use("/api/admin/mohan", adminRoutes);

// Authentication
app.use("/api/auth", authRoutes);

// Products
app.use("/api/products", productRoutes);

// Orders
app.use("/api/orders", orderRoutes);

// Feedback
app.use("/api/feedback", feedbackRoutes);

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
