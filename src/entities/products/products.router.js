import express from "express";
import { getProductDetail, getHomePage } from "./products.controller.js";
import { getProducts } from "./products.controller.js";

const router = express.Router();

router.get("/", getHomePage);
router.get("/product/:id", getProductDetail);
router.get("/products", getProducts);
export default router;
