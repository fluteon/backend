// homepageSectionController.js
const homepageSectionService = require('../services/homepageSection.service.js');

// Get all sections (for admin)
async function getAllSections(req, res) {
  try {
    const sections = await homepageSectionService.getAllSections();
    return res.status(200).json(sections);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Get enabled sections only (for frontend)
async function getEnabledSections(req, res) {
  try {
    const sections = await homepageSectionService.getEnabledSections();
    return res.status(200).json(sections);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Create a new section
async function createSection(req, res) {
  try {
    const section = await homepageSectionService.createSection(req.body);
    return res.status(201).json(section);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Update a section
async function updateSection(req, res) {
  try {
    const section = await homepageSectionService.updateSection(req.params.id, req.body);
    return res.status(200).json(section);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Delete a section
async function deleteSection(req, res) {
  try {
    const result = await homepageSectionService.deleteSection(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Update sections order
async function updateSectionsOrder(req, res) {
  try {
    const sections = await homepageSectionService.updateSectionsOrder(req.body.sections);
    return res.status(200).json(sections);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Initialize default sections
async function initializeDefaultSections(req, res) {
  try {
    const result = await homepageSectionService.initializeDefaultSections();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllSections,
  getEnabledSections,
  createSection,
  updateSection,
  deleteSection,
  updateSectionsOrder,
  initializeDefaultSections,
};
