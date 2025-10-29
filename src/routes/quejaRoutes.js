import { Router } from "express";
import {
    createReport,
    updateReport,
    deleteReport,
    getReports,
    getReportById
} from "../controllers/quejaController.js";

const router = Router();

// Ruta para crear reportes
router.post('/create-report', createReport);

// Ruta para actualizar reportes
router.put('/update-report/:id', updateReport);

// Eliminé la ruta duplicada de update-report

// Ruta para eliminar reportes (borrado lógico)
router.delete('/delete-report/:id', deleteReport);

// Eliminé la ruta duplicada de delete-report

// Ruta para obtener reportes con paginación
router.get('/reports', getReports);

// Eliminé las rutas redundantes (/active-reports, /user-reports/:userId, /reports-by-date)

// Ruta para obtener un reporte específico
router.get('/report/:id', getReportById);

export default router;