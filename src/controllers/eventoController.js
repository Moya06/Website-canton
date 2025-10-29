import Evento from "../models/Evento.js";

// Create event
export const createEvent = async (req, res) => {
    try {
        const { name, description, address, date, type = 'event', image } = req.body;

        // Get user ID from session or request
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

        const event = await Evento.create({
            name,
            description,
            address,
            date: new Date(date),
            type,
            image: image || '/imgs/img_cards/event.jpg',
            user: userId,
            organizer: userId, // Set organizer to the same user for now
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        if (req.session && req.session.user) {
            req.session.user.lastEventCreated = event.id;
        }
        
        // Send JSON response for AJAX requests
        res.status(201).json({
            success: true,
            data: {
                id: event._id,
                name: event.name,
                type: event.type,
                createdAt: event.createdAt
            },
            message: 'Evento creado exitosamente',
            redirect: '/event'
        });

    } catch (error) {
        console.error('Error creating event:', error);
        
        // Send error response
        res.status(500).json({
            success: false,
            message: error.message || 'Error al crear el evento',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

// Update event
export const updateEvent = async (req, res) => {
    try {
        const { id, name, description, date, address, organizer, type, isActive, ...extraData } = req.body;

        const event = await Evento.findByIdAndUpdate(id, {
            name,
            description,
            date,
            address,
            organizer,
            type,
            isActive
        }, { new: true });

        if (!event) {
            throw new Error('Evento no encontrado');
        }

        if (req.session.user) {
            req.session.user.lastEventUpdated = event.id;
        }
        
        const redirectTo = req.session.returnTo || '/dashboard';
        delete req.session.returnTo;
        
        res.redirect(redirectTo);
    } catch (error) {
        res.render('event', { 
            error: 'Error al actualizar el evento',
            formData: req.body 
        });
    }
};

// Delete event
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.body;

        const event = await Evento.findByIdAndDelete(id);

        if (!event) {
            throw new Error('Evento no encontrado');
        }

        if (req.session.user && req.session.user.lastEventCreated === id) {
            delete req.session.user.lastEventCreated;
        }
        
        const redirectTo = req.session.returnTo || '/dashboard';
        delete req.session.returnTo;
        
        res.redirect(redirectTo);
    } catch (error) {
        res.render('event', { 
            error: 'Error al eliminar el evento',
            formData: req.body 
        });
    }
};

// Get all events
export const getAllEvents = async (req, res) => {
    try {
        const events = await Evento.find({}).populate('organizer');
        
        res.render('events', { 
            events,
            user: req.user 
        });
    } catch (error) {
        res.render('events', { 
            error: 'Error al cargar los eventos',
            events: [],
            user: req.user 
        });
    }
};

// Get event by ID
export const getEventById = async (req, res) => {
    try {
        const event = await Evento.findById(req.params.id).populate('organizer');
        
        if (!event) {
            throw new Error('Evento no encontrado');
        }
        
        res.render('event-detail', { 
            event,
            user: req.user 
        });
    } catch (error) {
        res.render('event-detail', { 
            error: 'Error al cargar el evento',
            event: null,
            user: req.user 
        });
    }
};

// Get active events
export const getActiveEvents = async (req, res) => {
    try {
        const events = await Evento.find({ 
            isActive: true 
        }).populate('organizer');
        
        res.render('active-events', { 
            events,
            user: req.user 
        });
    } catch (error) {
        res.render('active-events', { 
            error: 'Error al cargar los eventos activos',
            events: [],
            user: req.user 
        });
    }
};

// Get events by organizer
export const getEventsByOrganizer = async (req, res) => {
    try {
        const events = await Evento.find({ 
            organizer: req.params.organizerId,
            isActive: true 
        }).populate('organizer');
        
        res.render('organizer-events', { 
            events,
            user: req.user 
        });
    } catch (error) {
        res.render('organizer-events', { 
            error: 'Error al cargar los eventos del organizador',
            events: [],
            user: req.user 
        });
    }
};
