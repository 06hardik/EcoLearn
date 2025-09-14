import { Router } from "express";
import {
    createOrder,
    getUserOrders,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Secured routes
router.route("/").post(verifyJWT, createOrder);
router.route("/myorders").get(verifyJWT, getUserOrders);

export default router;