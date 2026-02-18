// homepageSectionService.js
const HomepageSection = require('../models/homepageSection.model.js');

// Get all homepage sections
async function getAllSections() {
  try {
    const sections = await HomepageSection.find().sort({ order: 1 });
    return sections;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get enabled sections only
async function getEnabledSections() {
  try {
    const sections = await HomepageSection.find({ isEnabled: true }).sort({ order: 1 });
    return sections;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Create a new section
async function createSection(sectionData) {
  try {
    const section = new HomepageSection(sectionData);
    await section.save();
    return section;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Update a section
async function updateSection(sectionId, updateData) {
  try {
    const section = await HomepageSection.findByIdAndUpdate(
      sectionId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!section) {
      throw new Error('Section not found');
    }
    
    return section;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Delete a section
async function deleteSection(sectionId) {
  try {
    const section = await HomepageSection.findByIdAndDelete(sectionId);
    
    if (!section) {
      throw new Error('Section not found');
    }
    
    return { message: 'Section deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
}

// Update section order (for drag and drop)
async function updateSectionsOrder(sectionsOrder) {
  try {
    // Two-step approach to avoid unique index conflict:
    // Step 1: Set all to temporary negative values
    const tempOps = sectionsOrder.map((section, index) => ({
      updateOne: {
        filter: { _id: section._id },
        update: { order: -(index + 1000) } // Negative to avoid conflicts
      }
    }));
    
    await HomepageSection.bulkWrite(tempOps);
    
    // Step 2: Update to final positive values
    const finalOps = sectionsOrder.map((section, index) => ({
      updateOne: {
        filter: { _id: section._id },
        update: { order: index + 1 }
      }
    }));
    
    await HomepageSection.bulkWrite(finalOps);
    
    const updatedSections = await HomepageSection.find().sort({ order: 1 });
    return updatedSections;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Initialize default sections (run once)
async function initializeDefaultSections() {
  try {
    const count = await HomepageSection.countDocuments();
    
    if (count === 0) {
      const defaultSections = [
        {
          name: "blazers",
          label: "Blazers",
          path: "/women/blazer/blazers",
          isEnabled: true,
          order: 1,
          productsToShow: 10,
        },
        {
          name: "blazers_sets",
          label: "Blazer Sets",
          path: "/women/blazer/blazers_sets",
          isEnabled: true,
          order: 2,
          productsToShow: 10,
        },
        {
          name: "satin_shirts",
          label: "Satin Shirts",
          path: "/women/shirts/satin_shirts",
          isEnabled: true,
          order: 3,
          productsToShow: 10,
        },
        {
          name: "formal_pants",
          label: "Formal Pants",
          path: "/women/bottom_wear/formal_pants",
          isEnabled: true,
          order: 4,
          productsToShow: 10,
        },
        {
          name: "swimmingsuit",
          label: "Swimming Suit",
          path: "/women/swimming_costume/one_piece",
          isEnabled: true,
          order: 5,
          productsToShow: 10,
        },
        {
          name: "tummytucker",
          label: "Tummytucker",
          path: "/women/tummytucker/high_waist",
          isEnabled: true,
          order: 6,
          productsToShow: 10,
        },
      ];
      
      await HomepageSection.insertMany(defaultSections);
      return { message: 'Default sections initialized successfully' };
    }
    
    return { message: 'Sections already exist' };
  } catch (error) {
    throw new Error(error.message);
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
