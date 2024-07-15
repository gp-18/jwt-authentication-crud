import express from "express";
import {
  userRegistration,
  userLogin,
  changePassword,
  getUserProfile,
  forgotPasswordResetLink,
  forgetPasswordReset,
} from "../controllers/userController.js";
import {
  getAllProducts,
  createProduct,
  getParticularProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import checkUserAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", userRegistration);
router.post("/login", userLogin);
router.post("/forgotPasswordResetLink", forgotPasswordResetLink);
router.post("/forgotPassword/:id/:token", forgetPasswordReset);
router.post("/changePassword", checkUserAuth, changePassword);
router.get("/userProfile", checkUserAuth, getUserProfile);

router.post("/createProduct", createProduct);
router.get("/products", getAllProducts);
router.get("/product/:id", getParticularProduct); 
router.post("/updateProduct/:id",updateProduct);
router.delete("/deleteProduct/:id",deleteProduct);

export default router;
