import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    submitSurvey,
    getLeaderboard,
    updateCurrentUser,
    changePassword,
    getUserActivity,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/leaderboard").get(getLeaderboard);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/survey").post(verifyJWT, submitSurvey);
router.route("/me")
    .get(verifyJWT, getCurrentUser)
    .put(verifyJWT, updateCurrentUser);

router.route("/me/activity").get(verifyJWT, getUserActivity);
router.route("/change-password").post(verifyJWT, changePassword);

export default router;



