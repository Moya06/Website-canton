import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { isAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// GET all users
router.get('/', isAdmin, async (req, res) => {
    try {
        const users = await User.find({ isActive: true }).select('-password');
        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Error al obtener usuarios'
        });
    }
});

// GET user by ID
router.get('/:id', isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                message: 'Usuario no encontrado'
            });
        }

        if (!user.isActive) {
            return res.status(404).json({
                success: false,
                error: 'User not active',
                message: 'Usuario no activo'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Error al obtener usuario'
        });
    }
});

// PUT update user
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, last_name, email, rol, birthdate, password, ...extraData } = req.body;

        // Build update object
        const updateData = {
            name: name?.toLowerCase(),
            last_name: last_name?.toLowerCase(),
            email: email?.toLowerCase(),
            rol,
            birthdate
        };

        // If password is provided, hash it
        if (password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(password, saltRounds);
        }

        // Remove undefined values
        Object.keys(updateData).forEach(key =>
            updateData[key] === undefined && delete updateData[key]
        );

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Error al actualizar usuario'
        });
    }
});

// DELETE user (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Usuario eliminado exitosamente',
            user
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Error al eliminar usuario'
        });
    }
});

// DELETE user permanently (hard delete)
router.delete('/:id/permanent', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Usuario eliminado permanentemente',
            user: { id: user._id, email: user.email }
        });
    } catch (error) {
        console.error('Error permanently deleting user:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Error al eliminar permanentemente el usuario'
        });
    }
});

// PATCH activate/deactivate user
router.patch('/:id/toggle-status', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                message: 'Usuario no encontrado'
            });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({
            success: true,
            message: `Usuario ${user.isActive ? 'activado' : 'desactivado'} exitosamente`,
            user
        });
    } catch (error) {
        console.error('Error toggling user status:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Error al cambiar estado del usuario'
        });
    }
});

export default router;
