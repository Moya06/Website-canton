import Transport from "../models/Transporte.js";

// Create transport
export const createTransport = async (req, res) => {
    try {
        // Basic validation
        if (!req.body.name || !req.body.address) {
            return res.status(400).json({ 
                success: false, 
                message: 'Faltan campos obligatorios' 
            });
        }

        const transport = await Transport.create({
            name: req.body.name,
            description: req.body.description || `Contacto: ${req.body.contact || 'N/A'} | Horarios: ${req.body.schedules || 'N/A'}`,
            address: req.body.address,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.status(201).json({ 
            success: true, 
            data: {
                id: transport._id,
                name: transport.name,
                address: transport.address,
                createdAt: transport.createdAt
            },
            message: 'Transporte creado exitosamente',
            redirect: '/transport'
        });
    } catch (error) {
        console.error('Error al crear transporte:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

// Update transport
export const updateTransport = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, address, isActive } = req.body;

        const transport = await Transport.findByIdAndUpdate(id, {
            name,
            description,
            price,
            address,
            isActive
        }, { new: true });

        if (!transport) {
            return res.status(404).json({
                success: false,
                message: 'Transporte no encontrado'
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Transporte actualizado con éxito',
            data: transport
        });
    } catch (error) {
        console.error('Error al actualizar transporte:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el transporte',
            error: error.message
        });
    }
};

// Delete transport
export const deleteTransport = async (req, res) => {
    try {
        const { id } = req.params;

        const transport = await Transport.findByIdAndDelete(id);
        if (!transport) {
            return res.status(404).json({
                success: false,
                message: 'Transporte no encontrado'
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Transporte eliminado con éxito'
        });
    } catch (error) {
        console.error('Error al eliminar transporte:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el transporte',
            error: error.message
        });
    }
};

// Get all transports
export const getAllTransports = async (req, res) => {
    try {
        const transports = await Transport.find({});
        res.json({
            success: true,
            data: transports
        });
    } catch (error) {
        console.error('Error al obtener transportes:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cargar los transportes',
            error: error.message
        });
    }
};

// Get transport by ID
export const getTransportById = async (req, res) => {
    try {
        const transport = await Transport.findById(req.params.id);
        if (!transport) {
            return res.status(404).json({
                success: false,
                message: 'Transporte no encontrado'
            });
        }

        res.json({
            success: true,
            data: transport
        });
    } catch (error) {
        console.error('Error al obtener transporte:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cargar el transporte',
            error: error.message
        });
    }
};

// Get only active transports
export const getActiveTransports = async (req, res) => {
    try {
        const transports = await Transport.find({ isActive: true });
        res.json({
            success: true,
            data: transports
        });
    } catch (error) {
        console.error('Error al obtener transportes activos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cargar los transportes activos',
            error: error.message
        });
    }
};
