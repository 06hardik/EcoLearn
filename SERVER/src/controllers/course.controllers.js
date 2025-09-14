import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({}).select("title description imageUrl");
    res.status(200).json(courses);
});
const getCourseById = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
});

const enrollInCourse = asyncHandler(async (req, res) => {
    const courseId = req.params.id;
    const userId = req.user.id; // From verifyJWT middleware

    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    const user = await User.findById(userId);
    if (user.enrolledCourses.includes(courseId)) {
        return res.status(400).json({ message: "You are already enrolled in this course" });
    }
    user.enrolledCourses.push(courseId);
    await user.save();

    res.status(200).json({
        message: `Successfully enrolled in ${course.title}`,
    });
});

const completeModule = asyncHandler(async (req, res) => {
    const { courseId, moduleId } = req.params;
    const userId = req.user.id;
    const POINTS_PER_MODULE = 25; 

    const user = await User.findById(userId);

    if (!user.enrolledCourses.includes(courseId)) {
        return res.status(403).json({ message: "You are not enrolled in this course" });
    }
    
    if (user.completedModules.includes(moduleId)) {
        return res.status(200).json({ message: "Module already completed" });
    }
    
    user.completedModules.push(moduleId);
    user.points += POINTS_PER_MODULE;
    await user.save();

    res.status(200).json({
        message: "Module marked as complete! You earned points!",
        newPoints: user.points
    });
});

export {
    getAllCourses,
    getCourseById,
    enrollInCourse,
    completeModule,
};