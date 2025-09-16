import { Submission } from "../models/submission.model.js";
import { Event } from "../models/event.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createSubmission = asyncHandler(async (req, res) => {
    const { event, caption } = req.body;
    const userId = req.user._id;

    if (!req.file) {
        return res.status(400).json({ message: "Photo file is required" });
    }

    const photoLocalPath = req.file.path;
    const cloudinaryResponse = await uploadOnCloudinary(photoLocalPath);

    if (!cloudinaryResponse || !cloudinaryResponse.url) {
        return res.status(500).json({ message: "Failed to upload photo to the cloud" });
    }
    const submission = await Submission.create({
        imageUrl: cloudinaryResponse.url,
        user: userId,
        event,
        caption
    });

    return res.status(201).json({
        message: "Impact photo uploaded successfully!",
        submission
    });
});

const getSubmissionsForEvent = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    
    const submissions = await Submission.find({ event: eventId })
        .populate("user", "name avatarUrl")
        .sort({ createdAt: -1 });

    if (!submissions) {
        return res.status(404).json({ message: "No submissions found for this event" });
    }

    return res.status(200).json(submissions);
});


export {
    createSubmission,
    getSubmissionsForEvent,
};
