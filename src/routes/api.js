import express from "express";
import authControllers from "../controller/auth.controller.js";
import ProductController from "../controller/produk.controller.js";
import userController from "../controller/user.controller.js";
import pesananController from "../controller/pesanan.controller.js";
import reviewController from "../controller/review.controller.js";
import orderController from "../controller/order.controller.js";
import keranjangController from "../controller/keranjang.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { uploadMiddleware } from "../controller/produk.controller.js";

const router = express.Router();

// Auth routes
router.post("/login", authControllers.AuthLogin);
router.post("/register", authControllers.AuthRegister);
router.get("/logout", authControllers.AuthLogout);
router.get("/user", authMiddleware, authControllers.AuthMe);

// Produk routes
router.get("/products", authMiddleware, ProductController.getAll);
router.get("/products/:id", authMiddleware, ProductController.getById);
router.post(
  "/products",
  authMiddleware,
  uploadMiddleware,
  ProductController.create
);
router.put(
  "/products/:id",
  authMiddleware,
  uploadMiddleware,
  ProductController.update
);
router.delete("/products/:id", ProductController.remove);

//user routes
router.get("/users", authMiddleware, userController.getAll);
router.get("/users/:id", authMiddleware, userController.getById);
router.post("/users", authMiddleware, userController.create);
router.put(
  "/users/:id",
  authMiddleware,
  uploadMiddleware,
  userController.update
);
router.delete("/users/:id", authMiddleware, userController.remove);

//pesananan routes
router.get(
  "/pesanan",
  authMiddleware,
  adminMiddleware,
  pesananController.getAll
);
router.get("/pesanan/:id", authMiddleware, pesananController.getById);
router.post("/pesanan", authMiddleware, pesananController.create);
router.put("/pesanan/:id", authMiddleware, pesananController.update);
router.delete("/pesanan/:id", authMiddleware, pesananController.remove);

//review routes
router.get("/produk_reviews", authMiddleware, reviewController.getAll);
router.get("/produk_reviews/:id", authMiddleware, reviewController.getById);
router.post("/produk_reviews", authMiddleware, reviewController.create);
router.put("/produk_reviews/:id", authMiddleware, reviewController.update);
router.delete("/produk_reviews/:id", reviewController.remove);

//order routes
router.get("/orders", authMiddleware, orderController.getAll);
router.get("/orders/:id", authMiddleware, orderController.getById);
router.post("/orders", authMiddleware, orderController.create);
router.put("/orders/:id", authMiddleware, orderController.update);
router.delete("/orders/:id", orderController.remove);

// Keranjang routes
router.get("/carts", authMiddleware, keranjangController.getAll);
router.get("/carts/:id", authMiddleware, keranjangController.getById);
router.post("/carts", authMiddleware, keranjangController.create);
router.put("/carts/:id", authMiddleware, keranjangController.update);
router.delete("/carts/:id", authMiddleware, keranjangController.remove);

export default router;
