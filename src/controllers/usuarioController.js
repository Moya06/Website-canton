import bcrypt from "bcrypt";
import User from "../models/Usuario.js";

// POST create user
export const createUser = async (req, res) => {
    try {
        const { name, last_name, email, birthdate, password, password_check, rol } = req.body;

        // Validaciones básicas
        if (!name || !last_name || !email || !password || !rol) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos obligatorios'
            });
        }

        if (password !== password_check) {
            return res.status(400).json({
                success: false,
                message: 'Las contraseñas no coinciden'
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'El usuario ya existe'
            });
        }

        // Hash de la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Crear usuario
        const user = await User.create({
            name: name.toLowerCase(),
            last_name: last_name.toLowerCase(),
            email: email.toLowerCase(),
            birthdate: new Date(birthdate),
            password: hashedPassword,
            rol,
            isActive: true
        });

        // Redirigir al dashboard con mensaje de éxito
        res.redirect('/dashboard?success=user_created&message=Usuario creado exitosamente');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Error al crear usuario'
        });
    }
};

// GET all users
export const getAllUsers = async (req, res) => {
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
};

// GET user by ID
export const getUserById = async (req, res) => {
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
};

// PUT update user
export const updateUser = async (req, res) => {
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

        // Redirigir al dashboard con mensaje de éxito
        res.redirect('/dashboard?success=user_updated&message=Usuario actualizado exitosamente');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Error al actualizar usuario'
        });
    }
};

// DELETE user (hard delete)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.session.user?.id;

        // Check if user is trying to delete themselves
        if (currentUserId && currentUserId === id) {
            return res.json({
                success: false,
                isSelfDeletion: true,
                message: 'No puedes eliminar tu propia cuenta desde aquí. Si deseas eliminar tu cuenta, contacta a un administrador.'
            });
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                message: 'Usuario no encontrado'
            });
        }

        // Redirigir al dashboard con mensaje de éxito
        res.redirect('/dashboard?success=user_deleted&message=Usuario eliminado exitosamente');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Error al eliminar usuario'
        });
    }
};

// DELETE user permanently (hard delete)
export const deleteUserPermanently = async (req, res) => {
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
};

// PATCH activate/deactivate user
export const toggleUserStatus = async (req, res) => {
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
};
