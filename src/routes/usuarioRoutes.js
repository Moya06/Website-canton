import { Router } from "express";
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    deleteUserPermanently,
    toggleUserStatus
} from "../controllers/usuarioController.js";
import { isAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// GET all users
router.get('/', isAdmin, getAllUsers);

// GET user by ID
router.get('/:id', isAdmin, getUserById);

// POST create user
router.post('/', createUser);

// PUT update user
router.put('/:id', updateUser);

// DELETE user (soft delete)
router.delete('/:id', deleteUser);

// DELETE user permanently (hard delete)
router.delete('/:id/permanent', deleteUserPermanently);

// PATCH activate/deactivate user
router.patch('/:id/toggle-status', toggleUserStatus);

export default router;
