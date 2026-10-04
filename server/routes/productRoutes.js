const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
} = require("../controllers/ProductController");

const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/", upload.single("image"), createProduct);

module.exports = router;