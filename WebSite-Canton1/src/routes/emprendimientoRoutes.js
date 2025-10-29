import { Router } from "express";
import {
    createEntrepreneurship,
    updateEntrepreneurship,
    deleteEntrepreneurship,
    getAllEntrepreneurships,
    getEntrepreneurshipById,
    getActiveEntrepreneurships,
    getEntrepreneurshipsByUser
} from "../controllers/emprendimientoController.js";
import { uploadSingle, handleUploadError } from "../middlewares/uploadMiddleware.js";

const router = Router();

// Create entrepreneurship route
router.post("/create-entrepreneurship", uploadSingle("img"), createEntrepreneurship);

// Error handling for uploads
router.use(handleUploadError);

// Update entrepreneurship route
router.put("/update-entrepreneurship", updateEntrepreneurship);

// Delete entrepreneurship route
router.delete("/delete-entrepreneurship", deleteEntrepreneurship);

// Get all entrepreneurships route
router.get("/entrepreneurships", getAllEntrepreneurships);

// Get entrepreneurship by ID route
router.get("/entrepreneurship/:id", getEntrepreneurshipById);

// Get active entrepreneurships route
router.get("/active-entrepreneurships", getActiveEntrepreneurships);

// Get entrepreneurships by user route
router.get("/user-entrepreneurships/:userId", getEntrepreneurshipsByUser);

export default router;
