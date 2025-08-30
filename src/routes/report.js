import { Router } from "express";
import mongoose from "mongoose"; // Añadido import de mongoose
import Reports from "../models/Reports.js";

const router = Router();

// Helper mejorado para manejar errores
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

// Middleware para validar ObjectIds
const validateObjectId = (req, res, next) => {
  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return handleError(res, new Error('ID no válido'), 400);
  }
  next();
};

// Middleware mejorado para validación de campos
const validateReportFields = (req, res, next) => {
  const requiredFields = {
    name: 'Título del reporte',
    description: 'Descripción',
    date: 'Fecha',
    address: 'Dirección',
    user: 'ID de usuario'
  };
  
  const missingFields = [];
  const invalidFields = [];

  // Verificar campos faltantes
  for (const [field, description] of Object.entries(requiredFields)) {
    if (!req.body[field]) {
      missingFields.push(description);
    }
  }

  // Validación específica para la fecha
  if (req.body.date && isNaN(new Date(req.body.date).getTime())) {
    invalidFields.push('Fecha con formato inválido');
  }

  // Validar que el user ID tenga formato válido para ObjectId
  if (req.body.user && !mongoose.Types.ObjectId.isValid(req.body.user)) {
    invalidFields.push('ID de usuario no válido');
  }

  if (missingFields.length > 0 || invalidFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: {
        missingFields,
        invalidFields
      }
    });
  }

  next();
};

// Ruta para crear reportes - Versión optimizada y corregida
router.post('/create-report', validateReportFields, async (req, res) => {
  try {
    const { name, description, date, address, user, type = 'General' } = req.body;

    const reportData = {
      name,
      description,
      date: new Date(date),
      address,
      user: new mongoose.Types.ObjectId(user), // Conversión explícita a ObjectId
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
});

// Ruta para actualizar reportes - Versión consolidada
router.put('/update-report/:id', validateObjectId, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {
      ...req.body,
      updatedAt: new Date()
    };

    // Validar y formatear fecha si existe
    if (updates.date) {
      updates.date = new Date(updates.date);
    }

    // Validar user ID si está presente en la actualización
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
});

// Eliminé la ruta duplicada de update-report

// Ruta para eliminar reportes (borrado lógico) - Versión consolidada
router.delete('/delete-report/:id', validateObjectId, async (req, res) => {
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
});

// Eliminé la ruta duplicada de delete-report

// Ruta para obtener reportes con paginación - Versión optimizada
router.get('/reports', async (req, res) => {
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
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: 'user'
    };

    const reports = await Reports.paginate(query, options);

    res.json({
      success: true,
      data: reports.docs,
      pagination: {
        total: reports.totalDocs,
        pages: reports.totalPages,
        page: reports.page,
        limit: reports.limit,
        hasNext: reports.hasNextPage,
        hasPrev: reports.hasPrevPage
      }
    });

  } catch (error) {
    handleError(res, error, 500, 'Error al obtener los reportes');
  }
});

// Eliminé las rutas redundantes (/active-reports, /user-reports/:userId, /reports-by-date)

// Ruta para obtener un reporte específico
router.get('/report/:id', validateObjectId, async (req, res) => {
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
});

export default router;