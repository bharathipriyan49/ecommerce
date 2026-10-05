const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
  createProduct,
} = require("../controllers/productController");

router.post(
  "/",
  upload.single("image"),
  createProduct
);

module.exports = router;
