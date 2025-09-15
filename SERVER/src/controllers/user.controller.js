import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js"; 
import { uploadToCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please provide all fields" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User with this email already exists" });
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            message: "User registered successfully",
            user: userResponse,
        });
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }
});

const getCurrentUser = asyncHandler(async (req, res) =>{
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '10d',
        });

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 30 * 24 * 60 * 60 * 1000 
        };

        return res
            .status(200)
            .cookie('token', token, options)
            .json({
                message: "Login successful",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });

    } else {
        return res.status(401).json({ message: "Invalid email or password" });
    }
});


const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "User logged out successfully" });
});

const submitSurvey = asyncHandler(async (req, res) => {
    const { householdSize, wasteCollectionFrequency, recyclingPractices } = req.body;
    
    let category = 'Medium Waste';
    if (householdSize <= 2 && recyclingPractices === 'Always') {
        category = 'Low Waste';
    } else if (householdSize >= 5 || recyclingPractices === 'Rarely') {
        category = 'High Waste';
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            surveyData: {
                householdSize,
                wasteCollectionFrequency,
                recyclingPractices,
            },
            category: category,
        },
        { new: true } 
    ).select("-password");

    res.status(200).json({
        message: "Survey submitted successfully",
        user: updatedUser
    });
});

const getLeaderboard = asyncHandler(async (req, res) => {
    const users = await User.find({})
        .sort({ points: -1 })
        .limit(20) 
        .select("name points category avatarUrl");

    res.status(200).json(users);
});

const updateCurrentUser = asyncHandler(async (req, res) => {
    const { name, email } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { name, email },
        { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
    });
});

const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Please provide both current and new passwords" });
    }

    const user = await User.findById(req.user.id);
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid current password" });
    }
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
});

const getUserActivity = asyncHandler(async (req, res) => {
    const activities = [
        { title: "Joined 'Clean Up Our Parks' Campaign", type: "Campaign", date: "2025-09-12T10:00:00Z" },
        { title: "Completed 'Waste Reduction' Module", type: "Learning", date: "2025-09-10T15:30:00Z" },
        { title: "Earned 50 Green Points", type: "Reward", date: "2025-09-10T15:30:00Z" },
        { title: "Joined 'Plant a Tree Today' Campaign", type: "Campaign", date: "2025-09-05T11:00:00Z" },
    ];
    
    res.status(200).json(activities);
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        return res.status(400).json({ message: "Avatar file is missing" });
    }

    const avatar = await uploadToCloudinary(avatarLocalPath);
    if (!avatar.url) {
        return res.status(500).json({ message: "Error while uploading avatar" });
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { avatarUrl: avatar.url } },
        { new: true }
    ).select("-password");

    return res.status(200)
        .json({ 
            message: "Avatar image updated successfully", 
            user 
        });
});

export {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    submitSurvey,
    getLeaderboard,
    updateCurrentUser,
    changePassword,
    getUserActivity,
    updateUserAvatar
};