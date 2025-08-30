import { Router } from "express";
import Transport from "../models/Transport.js";

  const router = Router();

  // Crear transporte

router.post('/', async (req, res) => {
  try {
    // Validación básica
    if (!req.body.name || !req.body.address) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan campos obligatorios' 
      }); // ¡Siempre JSON!
    }

    const transport = await Transport.create({
      name: req.body.name,
      description: `Contacto: ${req.body.contact} | Horarios: ${req.body.schedules}`,
      address: req.body.address,
      isActive: true
    });

    res.status(201).json({ 
      success: true, 
      data: transport 
    }); // ¡Siempre JSON!
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor' 
    }); // ¡Siempre JSON!
  }
});

// Actualizar transporte
router.put('/:id', async (req, res) => {
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
});

// Eliminar transporte
router.delete('/:id', async (req, res) => {
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
});

// Obtener todos los transportes
router.get('/', async (req, res) => {
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
});

// Obtener transporte por ID
router.get('/:id', async (req, res) => {
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
});

// Obtener solo transportes activos
router.get('/activos/todos', async (req, res) => {
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
});

export default router;