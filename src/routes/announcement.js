import { Router } from "express";
import Announcement from "../models/Announcement.js";

const router = Router();

// Create announcement route
router.post('/create-announcement', async (req, res) => {
  try {
    // 1. Validate announcement data
    const { name, description, address, date, type = 'annoucement', ...extraData } = req.body;

    console.log("here")

    // 2. Create announcement function
    const announcement = await Announcement.create({
      name,
      description,
      date,
      address,
      type,
      isActive: true
    });

    // 3. Set session data if needed
    if (req.session.user) {
      req.session.user.lastAnnouncementCreated = announcement.id;
    }
    
    // 4. Redirect or send response
    const redirectTo = req.session.returnTo || '/dashboard';
    delete req.session.returnTo;
    
    res.redirect(redirectTo);
  } catch (error) {
    console.log(error)
    res.render('announcement', { 
      error: 'Error al crear el anuncio',
      formData: req.body 
    });
  }
});

// Update announcement route
router.put('/update-announcement', async (req, res) => {
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
});

// Delete announcement route
router.delete('/delete-announcement', async (req, res) => {
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
});

// Get all announcements route
router.get('/announcements', async (req, res) => {
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
});

// Get announcement by ID route
router.get('/announcement/:id', async (req, res) => {
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
});

// Get active announcements route
router.get('/active-announcements', async (req, res) => {
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
});

// Get announcements by organizer route
router.get('/organizer-announcements/:organizerId', async (req, res) => {
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
});

// Get announcements by type route
router.get('/announcements-by-type/:type', async (req, res) => {
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
});

export default router;
