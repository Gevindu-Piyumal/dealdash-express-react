const express = require('express');
const router = express.Router();
const multer = require('multer');
const categoryController = require('../controllers/categoryController');

// Setup multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }
});

// GET all categories
router.get('/', categoryController.getAllCategories);

// GET categories with deal counts
router.get('/with-counts', categoryController.getCategoriesWithDealCounts);

// GET a specific category
router.get('/:id', categoryController.getCategoryById);

// POST create a new category
router.post('/', upload.single('icon'), categoryController.createCategory);

// PUT update a category
router.put('/:id', upload.single('icon'), categoryController.updateCategory);

// DELETE a category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;