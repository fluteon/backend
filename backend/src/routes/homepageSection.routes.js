// homepageSectionRoutes.js
const express = require('express');
const router = express.Router();
const homepageSectionController = require('../controllers/homepageSection.controller.js');
const authenticate = require('../middleware/authenticat.js');

// Public route - get enabled sections for frontend
router.get('/enabled', homepageSectionController.getEnabledSections);

// Admin routes - require authentication
router.get('/', authenticate, homepageSectionController.getAllSections);
router.post('/', authenticate, homepageSectionController.createSection);
router.put('/reorder', authenticate, homepageSectionController.updateSectionsOrder);
router.put('/:id', authenticate, homepageSectionController.updateSection);
router.delete('/:id', authenticate, homepageSectionController.deleteSection);
router.post('/initialize', authenticate, homepageSectionController.initializeDefaultSections);

module.exports = router;
