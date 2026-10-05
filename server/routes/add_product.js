const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
  createProduct,
} = require("../controllers/admincontrol");

// Add Product
router.post(
  "/",
  upload.single("image"),
  createProduct
);

module.exports = router;
