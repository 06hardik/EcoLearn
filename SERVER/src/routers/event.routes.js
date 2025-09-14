import { Router } from "express";
import {
    getAllEvents,
    getEventById,
    registerForEvent,
} from "../controllers/event.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/").get(getAllEvents);
router.route("/:id").get(getEventById);

// Secured routes
router.route("/:id/register").post(verifyJWT, registerForEvent);

export default router;