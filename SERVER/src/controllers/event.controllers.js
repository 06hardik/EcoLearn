import { Event } from "../models/event.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({ date: { $gte: new Date() } })
        .sort({ date: 1 })
        .select("title description date location imageUrl eventType");
    res.status(200).json(events);
});

const getEventById = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
});

const registerForEvent = asyncHandler(async (req, res) => {
    const eventId = req.params.id;
    const userId = req.user.id;
    const POINTS_PER_EVENT = 50;

    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }

    const user = await User.findById(userId);

    if (user.registeredEvents.includes(eventId) || event.attendees.includes(userId)) {
        return res.status(400).json({ message: "You are already registered for this event" });
    }

    user.registeredEvents.push(eventId);
    user.points += POINTS_PER_EVENT;
    event.attendees.push(userId);

    await user.save();
    await event.save();

    res.status(200).json({
        message: `Successfully registered for ${event.title}! You earned points!`,
    });
});

export {
    getAllEvents,
    getEventById,
    registerForEvent,
};