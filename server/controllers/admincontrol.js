const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

const createProduct = async (req, res) => {
  try {
    console.log("========== CREATE PRODUCT ==========");
    console.log("Body:", req.body);
    console.log("File:", req.file ? req.file.originalname : "No file");

    const {
      name,
      description,
      price,
      category,
      stock,
      rating,
    } = req.body;

    // Check required fields
    if (!name || !description || price === undefined || !category) {
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

    // Check Cloudinary configuration
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("Cloudinary environment variables are missing");

      return res.status(500).json({
        message: "Cloudinary configuration is missing",
      });
    }

    // Upload image to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "ecommerce/products",
        resource_type: "image",
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
          console.log("Cloudinary Upload Success");
          console.log("Image URL:", result.secure_url);

          // Convert values safely
          const productPrice = Number(price);
          const productStock =
            stock !== undefined && stock !== ""
              ? Number(stock)
              : 0;

          const productRating =
            rating !== undefined && rating !== ""
              ? Number(rating)
              : 0;

          // Validate numbers
          if (isNaN(productPrice)) {
            return res.status(400).json({
              message: "Price must be a valid number",
            });
          }

          if (isNaN(productStock)) {
            return res.status(400).json({
              message: "Stock must be a valid number",
            });
          }

          if (isNaN(productRating)) {
            return res.status(400).json({
              message: "Rating must be a valid number",
            });
          }

          // Save product in MongoDB
          const product = await Product.create({
            name: name.trim(),
            description: description.trim(),
            price: productPrice,
            category: category.trim(),
            stock: productStock,
            rating: productRating,
            image: result.secure_url,
          });

          console.log("Product saved successfully:", product._id);

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
