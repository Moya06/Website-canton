import { Router } from "express";
import {
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    getAllAnnouncements,
    getAnnouncementById,
    getActiveAnnouncements,
    getAnnouncementsByOrganizer,
    getAnnouncementsByType
} from "../controllers/anuncioController.js";

const router = Router();

// Create announcement route
router.post('/create-announcement', createAnnouncement);

// Update announcement route
router.put('/update-announcement', updateAnnouncement);

// Delete announcement route
router.delete('/delete-announcement', deleteAnnouncement);

// Get all announcements route
router.get('/announcements', getAllAnnouncements);

// Get announcement by ID route
router.get('/announcement/:id', getAnnouncementById);

// Get active announcements route
router.get('/active-announcements', getActiveAnnouncements);

// Get announcements by organizer route
router.get('/organizer-announcements/:organizerId', getAnnouncementsByOrganizer);

// Get announcements by type route
router.get('/announcements-by-type/:type', getAnnouncementsByType);

export default router;
