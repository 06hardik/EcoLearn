import { Router } from "express";
import {
    getAllProducts,
    getProductById,
} from "../controllers/product.controller.js";

const router = Router();

// Public routes
router.route("/").get(getAllProducts);
router.route("/:id").get(getProductById);

export default router;