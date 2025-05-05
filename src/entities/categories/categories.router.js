import express from "express";
import { getCategoryPage } from "./categories.controller.js";

const router = express.Router();

router.get("/category/:id", getCategoryPage);

export default router;