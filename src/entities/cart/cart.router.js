import express from "express";
import { addToCart, getCart, clearCart, makeOrder } from "./cart.controller.js";

const router = express.Router();

router.post("/cart/add", addToCart);
router.get("/checkout", getCart);
router.post("/checkout", makeOrder);

router.post("/cart/clear", clearCart);

export default router;
