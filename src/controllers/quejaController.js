import mongoose from "mongoose";
import Reports from "../models/Queja.js";

// Helper for error handling
const handleError = (res, error, status = 500, defaultMessage = 'Error en el servidor') => {
    console.error('Error:', error);
    return res.status(status).json({
        success: false,
        message: error.message || defaultMessage,
        error: process.env.NODE_ENV === 'development' ? {
            stack: error.stack,
            details: error.details || null
        } : undefined
    });
};

// Create report/complaint
export const createReport = async (req, res) => {
    try {
        const { name, description, date, address, user, type = 'General' } = req.body;

        const reportData = {
            name,
            description,
            date: new Date(date),
            address,
            user: new mongoose.Types.ObjectId(user),
            type,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const report = await Reports.create(reportData);

        res.status(201).json({
            success: true,
            data: {
                id: report._id,
                name: report.name,
                type: report.type,
                date: report.date
            },
            message: 'Reporte creado exitosamente',
            redirect: '/dashboard',
            timestamp: new Date()
        });

    } catch (error) {
        error.details = {
            body: req.body,
            errorType: 'DatabaseError'
        };
        handleError(res, error, 500, 'Error al guardar el reporte en la base de datos');
    }
};

// Update report/complaint
export const updateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = {
            ...req.body,
            updatedAt: new Date()
        };

        // Validate and format date if exists
        if (updates.date) {
            updates.date = new Date(updates.date);
        }

        // Validate user ID if present in update
        if (updates.user && !mongoose.Types.ObjectId.isValid(updates.user)) {
            return handleError(res, new Error('ID de usuario no válido'), 400);
        }

        const report = await Reports.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        });

        if (!report) {
            return handleError(res, new Error('Reporte no encontrado'), 404);
        }

        res.json({
            success: true,
            data: report,
            message: 'Reporte actualizado exitosamente'
        });

    } catch (error) {
        handleError(res, error, 500, 'Error al actualizar el reporte');
    }
};

// Delete report/complaint (soft delete)
export const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Reports.findByIdAndUpdate(id, {
            isActive: false,
            updatedAt: new Date()
        }, { new: true });

        if (!report) {
            return handleError(res, new Error('Reporte no encontrado'), 404);
        }

        res.json({
            success: true,
            message: 'Reporte desactivado exitosamente',
            deactivatedAt: new Date()
        });

    } catch (error) {
        handleError(res, error, 500, 'Error al desactivar el reporte');
    }
};

// Get reports with pagination
export const getReports = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            active,
            userId,
            type,
            startDate,
            endDate
        } = req.query;

        const query = {};

        if (active !== undefined) {
            query.isActive = active === 'true';
        }

        if (userId) {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return handleError(res, new Error('ID de usuario no válido'), 400);
            }
            query.user = userId;
        }

        if (type) {
            query.type = type;
        }

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const options = {
            sort: { createdAt: -1 },
            populate: 'user',
            skip: (parseInt(page) - 1) * parseInt(limit),
            limit: parseInt(limit)
        };

        const reports = await Reports.find(query, null, options);
        const totalDocs = await Reports.countDocuments(query);

        const totalPages = Math.ceil(totalDocs / parseInt(limit));
        const currentPage = parseInt(page);
        
        res.json({
            success: true,
            data: reports,
            pagination: {
                total: totalDocs,
                pages: totalPages,
                page: currentPage,
                limit: parseInt(limit),
                hasNext: currentPage < totalPages,
                hasPrev: currentPage > 1
            }
        });

    } catch (error) {
        handleError(res, error, 500, 'Error al obtener los reportes');
    }
};

// Get specific report by ID
export const getReportById = async (req, res) => {
    try {
        const report = await Reports.findById(req.params.id).populate('user');
        
        if (!report) {
            return handleError(res, new Error('Reporte no encontrado'), 404);
        }
        
        res.json({
            success: true,
            data: report
        });
    } catch (error) {
        handleError(res, error, 500, 'Error al obtener el reporte');
    }
};
