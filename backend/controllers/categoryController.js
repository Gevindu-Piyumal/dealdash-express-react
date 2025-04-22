const Category = require('../models/category');
const Deal = require('../models/deal');
const { uploadFile, deleteFile, CATEGORY_BUCKET } = require('../services/supabaseStorage');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort('name');
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Failed to fetch category', error: error.message });
  }
};

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    // Check if category with same name already exists
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    
    const categoryData = { name };
    
    // Handle icon upload if provided
    if (req.file) {
      const iconUrl = await uploadFile(req.file.buffer, req.file.originalname, CATEGORY_BUCKET);
      categoryData.icon = iconUrl;
    }
    
    const newCategory = new Category(categoryData);
    const savedCategory = await newCategory.save();
    
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Failed to create category', error: error.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name } = req.body;
    
    // Get existing category
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if another category with the same name exists (if name was changed)
    if (name && name !== existingCategory.name) {
      const duplicateCategory = await Category.findOne({ 
        _id: { $ne: categoryId },
        name: { $regex: new RegExp(`^${name}$`, 'i') }
      });
      
      if (duplicateCategory) {
        return res.status(400).json({ message: 'Category with this name already exists' });
      }
    }
    
    const categoryData = { name };
    
    // Handle icon upload if provided
    if (req.file) {
      // Delete old icon if it exists
      if (existingCategory.icon) {
        await deleteFile(existingCategory.icon);
      }
      
      // Upload new icon
      const iconUrl = await uploadFile(req.file.buffer, req.file.originalname, CATEGORY_BUCKET);
      categoryData.icon = iconUrl;
    }
    
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { $set: categoryData },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    // Check if this category has associated deals
    const dealsCount = await Deal.countDocuments({ category: categoryId });
    if (dealsCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category because it has ${dealsCount} associated deals. Reassign these deals to another category first.` 
      });
    }
    
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Delete icon from storage if it exists
    if (category.icon) {
      await deleteFile(category.icon);
    }
    
    await Category.findByIdAndDelete(categoryId);
    
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
};

// Get categories with deal counts
exports.getCategoriesWithDealCounts = async (req, res) => {
  try {
    // Get all categories
    const categories = await Category.find().sort('name');
    
    // For each category, count active deals
    const currentDate = new Date();
    
    const categoriesWithCounts = await Promise.all(categories.map(async (category) => {
      const count = await Deal.countDocuments({
        category: category._id,
        isActive: true,
        expireDate: { $gt: currentDate }
      });
      
      return {
        _id: category._id,
        name: category.name,
        icon: category.icon,
        dealCount: count
      };
    }));
    
    res.status(200).json(categoriesWithCounts);
  } catch (error) {
    console.error('Error fetching categories with deal counts:', error);
    res.status(500).json({ message: 'Failed to fetch categories with deal counts', error: error.message });
  }
};