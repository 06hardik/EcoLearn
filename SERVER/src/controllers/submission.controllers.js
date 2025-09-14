import { Submission } from "../models/submission.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createSubmission = asyncHandler(async (req, res) => {
    const { event, caption } = req.body;
    const userId = req.user.id;
    
    // Assumes your upload middleware provides the file URL in req.file.path or similar
    const imageUrl = req.file?.path;

    if (!imageUrl) {
        return res.status(400).json({ message: "Image file is required" });
    }
    if (!event) {
        return res.status(400).json({ message: "Event ID is required" });
    }

    const submission = await Submission.create({
        imageUrl,
        user: userId,
        event,
        caption,
    });

    res.status(201).json(submission);
});

const getSubmissionsForEvent = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const submissions = await Submission.find({ event: eventId })
        .populate("user", "name avatarUrl") // Fetches user info for each submission
        .sort({ createdAt: -1 });

    res.status(200).json(submissions);
});

export {
    createSubmission,
    getSubmissionsForEvent,
};