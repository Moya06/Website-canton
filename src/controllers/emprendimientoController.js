import Entrepreneurship from "../models/Emprendimiento.js";

// Create entrepreneurship
export const createEntrepreneurship = async (req, res) => {
    try {
        // 1. Validate entrepreneurship data
        const { name, description, phone, address, type_entrepreneur } = req.body;

        // 2. Get uploaded image path
        const imgPath = req.file ? req.file.path : null;

        // 3. Get user ID from session or request
        let userId;
        if (req.session && req.session.user) {
            userId = req.session.user.id;
        } else if (req.body.user) {
            userId = req.body.user;
        } else {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }

        // 4. Create entrepreneurship
        const entrepreneurship = await Entrepreneurship.create({
            name,
            description,
            phone,
            address,
            type_entrepreneur,
            user: userId,
            img: imgPath,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // 5. Set session data if needed
        if (req.session && req.session.user) {
            req.session.user.lastEntrepreneurshipCreated = entrepreneurship.id;
        }

        // 6. Send JSON response for AJAX requests
        res.status(201).json({
            success: true,
            data: {
                id: entrepreneurship._id,
                name: entrepreneurship.name,
                type: entrepreneurship.type_entrepreneur,
                createdAt: entrepreneurship.createdAt
            },
            message: 'Emprendimiento creado exitosamente',
            redirect: '/entrepreneur'
        });

    } catch (error) {
        console.error('Error creating entrepreneurship:', error);
        
        // Send error response
        res.status(500).json({
            success: false,
            message: error.message || 'Error al crear el emprendimiento',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

// Update entrepreneurship
export const updateEntrepreneurship = async (req, res) => {
    try {
        // 1. Validate entrepreneurship data
        const {
            id,
            name,
            description,
            phone,
            address,
            user,
            isActive,
            ...extraData
        } = req.body;

        // 2. Update entrepreneurship function
        const entrepreneurship = await Entrepreneurship.findByIdAndUpdate(
            id,
            {
                name,
                description,
                phone,
                address,
                user,
                isActive,
            },
            { new: true },
        );

        if (!entrepreneurship) {
            throw new Error("Emprendimiento no encontrado");
        }

        // 3. Set session data if needed
        if (req.session.user) {
            req.session.user.lastEntrepreneurshipUpdated = entrepreneurship.id;
        }

        // 4. Redirect or send response
        const redirectTo = req.session.returnTo || "/dashboard";
        delete req.session.returnTo;

        res.redirect(redirectTo);
    } catch (error) {
        res.render("entrepreneurship", {
            error: "Error al actualizar el emprendimiento",
            formData: req.body,
        });
    }
};

// Delete entrepreneurship
export const deleteEntrepreneurship = async (req, res) => {
    try {
        // 1. Validate entrepreneurship ID
        const { id } = req.body;

        // 2. Delete entrepreneurship function
        const entrepreneurship = await Entrepreneurship.findByIdAndDelete(id);

        if (!entrepreneurship) {
            throw new Error("Emprendimiento no encontrado");
        }

        // 3. Update session if needed
        if (
            req.session.user &&
            req.session.user.lastEntrepreneurshipCreated === id
        ) {
            delete req.session.user.lastEntrepreneurshipCreated;
        }

        // 4. Redirect or send response
        const redirectTo = req.session.returnTo || "/dashboard";
        delete req.session.returnTo;

        res.redirect(redirectTo);
    } catch (error) {
        res.render("entrepreneurship", {
            error: "Error al eliminar el emprendimiento",
            formData: req.body,
        });
    }
};

// Get all entrepreneurships
export const getAllEntrepreneurships = async (req, res) => {
    try {
        // 1. Get all entrepreneurships
        const entrepreneurships = await Entrepreneurship.find({}).populate("user");

        // 2. Render entrepreneurships page
        res.render("entrepreneurships", {
            entrepreneurships,
            user: req.user,
        });
    } catch (error) {
        res.render("entrepreneurships", {
            error: "Error al cargar los emprendimientos",
            entrepreneurships: [],
            user: req.user,
        });
    }
};

// Get entrepreneurship by ID
export const getEntrepreneurshipById = async (req, res) => {
    try {
        // 1. Get entrepreneurship by ID
        const entrepreneurship = await Entrepreneurship.findById(
            req.params.id,
        ).populate("user");

        if (!entrepreneurship) {
            throw new Error("Emprendimiento no encontrado");
        }

        // 2. Render entrepreneurship detail page
        res.render("entrepreneurship-detail", {
            entrepreneurship,
            user: req.user,
        });
    } catch (error) {
        res.render("entrepreneurship-detail", {
            error: "Error al cargar el emprendimiento",
            entrepreneurship: null,
            user: req.user,
        });
    }
};

// Get active entrepreneurships
export const getActiveEntrepreneurships = async (req, res) => {
    try {
        // 1. Get only active entrepreneurships
        const entrepreneurships = await Entrepreneurship.find({
            isActive: true,
        }).populate("user");

        // 2. Render active entrepreneurships page
        res.render("active-entrepreneurships", {
            entrepreneurships,
            user: req.user,
        });
    } catch (error) {
        res.render("active-entrepreneurships", {
            error: "Error al cargar los emprendimientos activos",
            entrepreneurships: [],
            user: req.user,
        });
    }
};

// Get entrepreneurships by user
export const getEntrepreneurshipsByUser = async (req, res) => {
    try {
        // 1. Get entrepreneurships by user ID
        const entrepreneurships = await Entrepreneurship.find({
            user: req.params.userId,
            isActive: true,
        }).populate("user");

        // 2. Render user entrepreneurships page
        res.render("user-entrepreneurships", {
            entrepreneurships,
            user: req.user,
        });
    } catch (error) {
        res.render("user-entrepreneurships", {
            error: "Error al cargar los emprendimientos del usuario",
            entrepreneurships: [],
            user: req.user,
        });
    }
};
