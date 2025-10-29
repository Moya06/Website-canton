import Announcement from "../models/Anuncio.js";

// Create announcement
export const createAnnouncement = async (req, res) => {
    try {
        // 1. Validate announcement data
        const { name, description, address, date, type = 'general', image } = req.body;

        // 2. Get user ID from session or request
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

        // 3. Create announcement
        const announcement = await Announcement.create({
            name,
            description,
            address,
            date: new Date(date),
            type,
            image: image || '/imgs/img_cards/advertisement.png',
            user: userId,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // 4. Set session data if needed
        if (req.session && req.session.user) {
            req.session.user.lastAnnouncementCreated = announcement.id;
        }
        
        // 5. Send JSON response for AJAX requests
        res.status(201).json({
            success: true,
            data: {
                id: announcement._id,
                name: announcement.name,
                type: announcement.type,
                createdAt: announcement.createdAt
            },
            message: 'Anuncio creado exitosamente',
            redirect: '/advertisement'
        });

    } catch (error) {
        console.error('Error creating announcement:', error);
        
        // Send error response
        res.status(500).json({
            success: false,
            message: error.message || 'Error al crear el anuncio',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

// Update announcement
export const updateAnnouncement = async (req, res) => {
    try {
        // 1. Validate announcement data
        const { id, name, description, date, address, organizer, type, isActive, ...extraData } = req.body;

        // 2. Update announcement function
        const announcement = await Announcement.findByIdAndUpdate(id, {
            name,
            description,
            date,
            address,
            organizer,
            type,
            isActive
        }, { new: true });

        if (!announcement) {
            throw new Error('Anuncio no encontrado');
        }

        // 3. Set session data if needed
        if (req.session.user) {
            req.session.user.lastAnnouncementUpdated = announcement.id;
        }
        
        // 4. Redirect or send response
        const redirectTo = req.session.returnTo || '/dashboard';
        delete req.session.returnTo;
        
        res.redirect(redirectTo);
    } catch (error) {
        res.render('announcement', { 
            error: 'Error al actualizar el anuncio',
            formData: req.body 
        });
    }
};

// Delete announcement
export const deleteAnnouncement = async (req, res) => {
    try {
        // 1. Validate announcement ID
        const { id } = req.body;

        // 2. Delete announcement function
        const announcement = await Announcement.findByIdAndDelete(id);

        if (!announcement) {
            throw new Error('Anuncio no encontrado');
        }

        // 3. Update session if needed
        if (req.session.user && req.session.user.lastAnnouncementCreated === id) {
            delete req.session.user.lastAnnouncementCreated;
        }
        
        // 4. Redirect or send response
        const redirectTo = req.session.returnTo || '/dashboard';
        delete req.session.returnTo;
        
        res.redirect(redirectTo);
    } catch (error) {
        res.render('announcement', { 
            error: 'Error al eliminar el anuncio',
            formData: req.body 
        });
    }
};

// Get all announcements
export const getAllAnnouncements = async (req, res) => {
    try {
        // 1. Get all announcements
        const announcements = await Announcement.find({}).populate('organizer');
        
        // 2. Render announcements page
        res.render('announcements', { 
            announcements,
            user: req.user 
        });
    } catch (error) {
        res.render('announcements', { 
            error: 'Error al cargar los anuncios',
            announcements: [],
            user: req.user 
        });
    }
};

// Get announcement by ID
export const getAnnouncementById = async (req, res) => {
    try {
        // 1. Get announcement by ID
        const announcement = await Announcement.findById(req.params.id).populate('organizer');
        
        if (!announcement) {
            throw new Error('Anuncio no encontrado');
        }
        
        // 2. Render announcement detail page
        res.render('announcement-detail', { 
            announcement,
            user: req.user 
        });
    } catch (error) {
        res.render('announcement-detail', { 
            error: 'Error al cargar el anuncio',
            announcement: null,
            user: req.user 
        });
    }
};

// Get active announcements
export const getActiveAnnouncements = async (req, res) => {
    try {
        // 1. Get only active announcements
        const announcements = await Announcement.find({ isActive: true }).populate('organizer');
        
        // 2. Render active announcements page
        res.render('active-announcements', { 
            announcements,
            user: req.user 
        });
    } catch (error) {
        res.render('active-announcements', { 
            error: 'Error al cargar los anuncios activos',
            announcements: [],
            user: req.user 
        });
    }
};

// Get announcements by organizer
export const getAnnouncementsByOrganizer = async (req, res) => {
    try {
        // 1. Get announcements by organizer ID
        const announcements = await Announcement.find({ 
            organizer: req.params.organizerId,
            isActive: true 
        }).populate('organizer');
        
        // 2. Render organizer announcements page
        res.render('organizer-announcements', { 
            announcements,
            user: req.user 
        });
    } catch (error) {
        res.render('organizer-announcements', { 
            error: 'Error al cargar los anuncios del organizador',
            announcements: [],
            user: req.user 
        });
    }
};

// Get announcements by type
export const getAnnouncementsByType = async (req, res) => {
    try {
        // 1. Get announcements by type
        const announcements = await Announcement.find({ 
            type: req.params.type,
            isActive: true 
        }).populate('organizer');
        
        // 2. Render announcements by type page
        res.render('announcements-by-type', { 
            announcements,
            type: req.params.type,
            user: req.user 
        });
    } catch (error) {
        res.render('announcements-by-type', { 
            error: 'Error al cargar los anuncios por tipo',
            announcements: [],
            type: req.params.type,
            user: req.user 
        });
    }
};
