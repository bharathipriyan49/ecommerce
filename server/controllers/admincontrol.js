const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      rating,
    } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "ecommerce/products",
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);

          return res.status(500).json({
            message: "Image upload failed",
            error: error.message,
          });
        }

        try {
          const product = await Product.create({
            name,
            description,
            price,
            category,
            stock: stock || 0,
            rating: rating || 0,
            image: result.secure_url,
          });

          res.status(201).json({
            message: "Product added successfully",
            product,
          });
        } catch (dbError) {
          console.error("Database Error:", dbError);

          res.status(500).json({
            message: "Failed to save product",
            error: dbError.message,
          });
        }
      }
    );

    uploadStream.end(req.file.buffer);

  } catch (error) {
    console.error("Create Product Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
};
