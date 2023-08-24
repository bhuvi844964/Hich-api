// productsRoutes.js
import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  uploadImageData,
  getProductCount,
} from "../controllers/productController.js";
import {
  authenticateToken,
  authorizeRole,
} from "../middlewares/authMiddleware.js";
import languageMiddleware from "../middlewares/languageMiddleware.js";

const router = express.Router();

// Route for creating a new product
router.post(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  uploadImageData,
  createProduct
);

// Route for getting all products
router.get("/", authenticateToken, getAllProducts);

//Route for get products count
router.get(
  "/count",
  authenticateToken,
  authorizeRole("admin"),
  getProductCount
);

// Route for getting a specific product by ID
router.get("/:productId", authenticateToken, getProductById);

// Route for updating a product by ID
router.put(
  "/:productId",
  authenticateToken,
  authorizeRole("admin"),
  uploadImageData,
  updateProductById
);

// Route for deleting a product by ID
router.delete(
  "/:productId",
  authenticateToken,
  authorizeRole("admin"),
  deleteProductById
);

export default router;
