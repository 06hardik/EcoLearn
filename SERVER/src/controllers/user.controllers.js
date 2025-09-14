import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js"; 

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

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
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


export {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    submitSurvey,
    getLeaderboard,
};