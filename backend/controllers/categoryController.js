const Category = require("../models/Category");

// Helper function to generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Get all categories (public - for frontend)
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getActiveCategories();

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    console.error('Get all categories error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all categories (admin)
const getAllCategoriesAdmin = async (req, res) => {
  try {
    const { sortBy = 'name', order = 'asc', search } = req.query;

    let query = {};

    // Search functionality
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const categories = await Category.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .select('name slug icon description subcategories isActive createdAt updatedAt');

    // Calculate stats
    const totalSubcategories = categories.reduce((sum, cat) => sum + cat.subcategories.length, 0);
    const activeCategories = categories.filter(c => c.isActive).length;

    return res.status(200).json({
      success: true,
      count: categories.length,
      stats: {
        total: categories.length,
        active: activeCategories,
        inactive: categories.length - activeCategories,
        totalSubcategories
      },
      categories
    });
  } catch (error) {
    console.error('Get all categories admin error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get category by ID or slug
const getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;

    let category;
    // Check if it's a MongoDB ObjectId or a slug
    if (categoryId.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(categoryId);
    } else {
      category = await Category.findBySlug(categoryId);
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    return res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Get category by ID error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create new category (admin)
const createCategory = async (req, res) => {
  try {
    const { name, icon, description } = req.body;

    // Validate required fields
    if (!name || !icon) {
      return res.status(400).json({
        success: false,
        message: "Name and icon are required"
      });
    }

    // Generate slug from name
    const slug = generateSlug(name);

    // Check if category already exists
    const existingCategory = await Category.findOne({
      $or: [
        { name: name.trim() },
        { slug }
      ]
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists"
      });
    }

    // Create new category
    const newCategory = await Category.create({
      name: name.trim(),
      slug,
      icon: icon.trim(),
      description: description?.trim() || '',
      subcategories: [],
      isActive: true
    });

    console.log(`[ADMIN] Category created: ${newCategory.name} (${newCategory.slug})`);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory
    });
  } catch (error) {
    console.error('Create category error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update category (admin)
const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, icon, description, isActive } = req.body;

    // Find category
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // Check if new name already exists (if changing name)
    if (name && name !== category.name) {
      const slug = generateSlug(name);
      const duplicateCategory = await Category.findOne({
        _id: { $ne: categoryId },
        $or: [
          { name: name.trim() },
          { slug }
        ]
      });

      if (duplicateCategory) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists"
        });
      }

      category.name = name.trim();
      category.slug = slug;
    }

    // Update other fields
    if (icon) category.icon = icon.trim();
    if (description !== undefined) category.description = description.trim();
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    console.log(`[ADMIN] Category updated: ${category.name} (${category.slug})`);

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete category (admin)
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    await Category.findByIdAndDelete(categoryId);

    console.log(`[ADMIN] Category deleted: ${category.name}`);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    console.error('Delete category error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Toggle category status (admin)
const toggleCategoryStatus = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    category.isActive = !category.isActive;
    await category.save();

    console.log(`[ADMIN] Category status toggled: ${category.name} - ${category.isActive ? 'Active' : 'Inactive'}`);

    return res.status(200).json({
      success: true,
      message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
      category
    });
  } catch (error) {
    console.error('Toggle category status error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add subcategory to category (admin)
const addSubcategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Subcategory name is required"
      });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // Generate slug for subcategory
    const slug = generateSlug(name);

    // Check if subcategory already exists in this category
    const existingSubcategory = category.subcategories.find(
      sub => sub.name.toLowerCase() === name.trim().toLowerCase() || sub.slug === slug
    );

    if (existingSubcategory) {
      return res.status(400).json({
        success: false,
        message: "Subcategory already exists in this category"
      });
    }

    // Add subcategory
    category.subcategories.push({
      name: name.trim(),
      slug,
      isActive: true
    });

    // Sort subcategories alphabetically
    category.subcategories.sort((a, b) => a.name.localeCompare(b.name));

    await category.save();

    console.log(`[ADMIN] Subcategory added: ${name} to ${category.name}`);

    return res.status(201).json({
      success: true,
      message: "Subcategory added successfully",
      category
    });
  } catch (error) {
    console.error('Add subcategory error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update subcategory (admin)
const updateSubcategory = async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.params;
    const { name, isActive } = req.body;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    const subcategory = category.subcategories.id(subcategoryId);

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found"
      });
    }

    // Update name and slug if provided
    if (name && name !== subcategory.name) {
      const slug = generateSlug(name);

      // Check for duplicate subcategory name in this category
      const duplicateSubcategory = category.subcategories.find(
        sub => sub._id.toString() !== subcategoryId &&
        (sub.name.toLowerCase() === name.trim().toLowerCase() || sub.slug === slug)
      );

      if (duplicateSubcategory) {
        return res.status(400).json({
          success: false,
          message: "Subcategory with this name already exists in this category"
        });
      }

      subcategory.name = name.trim();
      subcategory.slug = slug;
    }

    // Update status if provided
    if (isActive !== undefined) {
      subcategory.isActive = isActive;
    }

    // Sort subcategories alphabetically
    category.subcategories.sort((a, b) => a.name.localeCompare(b.name));

    await category.save();

    console.log(`[ADMIN] Subcategory updated: ${subcategory.name} in ${category.name}`);

    return res.status(200).json({
      success: true,
      message: "Subcategory updated successfully",
      category
    });
  } catch (error) {
    console.error('Update subcategory error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete subcategory (admin)
const deleteSubcategory = async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.params;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    const subcategory = category.subcategories.id(subcategoryId);

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found"
      });
    }

    const subcategoryName = subcategory.name;
    subcategory.remove();
    await category.save();

    console.log(`[ADMIN] Subcategory deleted: ${subcategoryName} from ${category.name}`);

    return res.status(200).json({
      success: true,
      message: "Subcategory deleted successfully",
      category
    });
  } catch (error) {
    console.error('Delete subcategory error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllCategories,
  getAllCategoriesAdmin,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory
};
