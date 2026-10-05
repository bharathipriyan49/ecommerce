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

    // Check required fields
    if (
      !name ||
      !description ||
      price === undefined ||
      !category
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // Check image
    if (!req.file) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }

    // Upload image to Cloudinary
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
          // Save product in MongoDB
          const product = await Product.create({
            name,
            description,
            price: Number(price),
            category,
            stock:
              stock !== undefined && stock !== ""
                ? Number(stock)
                : 0,
            rating:
              rating !== undefined && rating !== ""
                ? Number(rating)
                : 0,
            image: result.secure_url,
          });

          return res.status(201).json({
            message: "Product added successfully",
            product,
          });
        } catch (dbError) {
          console.error("Database Error:", dbError);

          return res.status(500).json({
            message: "Failed to save product",
            error: dbError.message,
          });
        }
      }
    );

    // Send image buffer to Cloudinary
    uploadStream.end(req.file.buffer);

  } catch (error) {
    console.error("Create Product Error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
};
