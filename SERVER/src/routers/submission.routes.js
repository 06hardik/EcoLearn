import { Router } from "express";
import {
    createSubmission,
    getSubmissionsForEvent,
} from "../controllers/submission.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/event/:eventId").get(getSubmissionsForEvent);

// Secured routes
router.route("/").post(verifyJWT, upload.single('impactPhoto'), createSubmission);

export default router;