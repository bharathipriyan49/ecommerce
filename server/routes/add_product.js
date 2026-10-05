const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

// ===============================
// CREATE PRODUCT
// ===============================
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      rating
    } = req.body;

    // Validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        message: "Name, description, price and category are required"
      });
    }

    // Image required
    if (!req.file) {
      return res.status(400).json({
        message: "Product image is required"
      });
    }

    // Upload image to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "ecommerce/products"
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);

          return res.status(500).json({
            message: "Image upload failed",
            error: error.message
          });
        }

        try {
          const product = await Product.create({
            name,
            description,
            price: Number(price),
            category,
            stock: Number(stock) || 0,
            rating: Number(rating) || 0,
            image: result.secure_url
          });

          res.status(201).json({
            message: "Product created successfully",
            product
          });
        } catch (dbError) {
          console.error("Database Error:", dbError);

          return res.status(500).json({
            message: "Failed to create product",
            error: dbError.message
          });
        }
      }
    );

    uploadStream.end(req.file.buffer);

  } catch (error) {
    console.error("Create Product Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// ===============================
// GET ALL PRODUCTS
// ===============================
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json(products);

  } catch (error) {
    console.error("Get Products Error:", error);

    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message
    });
  }
};


// ===============================
// GET SINGLE PRODUCT
// ===============================
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(product);

  } catch (error) {
    console.error("Get Product Error:", error);

    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message
    });
  }
};


// ===============================
// UPDATE PRODUCT
// ===============================
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, rating } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // Update text fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.category = category || product.category;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.rating = rating !== undefined ? Number(rating) : product.rating;

    // If new image uploaded
    if (req.file) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "ecommerce/products"
        },
        async (error, result) => {
          if (error) {
            return res.status(500).json({
              message: "Image upload failed",
              error: error.message
            });
          }

          product.image = result.secure_url;

          const updatedProduct = await product.save();

          res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
          });
        }
      );

      uploadStream.end(req.file.buffer);

    } else {
      const updatedProduct = await product.save();

      res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct
      });
    }

  } catch (error) {
    console.error("Update Product Error:", error);

    res.status(500).json({
      message: "Failed to update product",
      error: error.message
    });
  }
};


// ===============================
// DELETE PRODUCT
// ===============================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error("Delete Product Error:", error);

    res.status(500).json({
      message: "Failed to delete product",
      error: error.message
    });
  }
};


// ===============================
// EXPORT
// ===============================
module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
