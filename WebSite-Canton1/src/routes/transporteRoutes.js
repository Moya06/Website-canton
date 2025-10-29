import { Router } from "express";
import {
    createTransport,
    updateTransport,
    deleteTransport,
    getAllTransports,
    getTransportById,
    getActiveTransports
} from "../controllers/transporteController.js";

const router = Router();

  // Crear transporte
router.post('/', createTransport);

// Actualizar transporte
router.put('/:id', updateTransport);

// Eliminar transporte
router.delete('/:id', deleteTransport);

// Obtener todos los transportes
router.get('/', getAllTransports);

// Obtener transporte por ID
router.get('/:id', getTransportById);

// Obtener solo transportes activos
router.get('/activos/todos', getActiveTransports);

export default router;