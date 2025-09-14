import { Router } from "express";
import {
    getAllCourses,
    getCourseById,
    enrollInCourse,
    completeModule,
} from "../controllers/course.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/").get(getAllCourses);
router.route("/:id").get(getCourseById);

// Secured routes
router.route("/:id/enroll").post(verifyJWT, enrollInCourse);
router.route("/:courseId/modules/:moduleId/complete").post(verifyJWT, completeModule);

export default router;