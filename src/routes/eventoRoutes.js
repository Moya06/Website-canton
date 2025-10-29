import { Router } from "express";
import {
    createEvent,
    updateEvent,
    deleteEvent,
    getAllEvents,
    getEventById,
    getActiveEvents,
    getEventsByOrganizer
} from "../controllers/eventoController.js";

const router = Router();

// Create event route
router.post('/create-event', createEvent);

// Update event route
router.put('/update-event', updateEvent);

// Delete event route
router.delete('/delete-event', deleteEvent);

// Get all events route
router.get('/events', getAllEvents);

// Get event by ID route
router.get('/event/:id', getEventById);

// Get active events route
router.get('/active-events', getActiveEvents);

// Get events by organizer route
router.get('/organizer-events/:organizerId', getEventsByOrganizer);

export default router;
