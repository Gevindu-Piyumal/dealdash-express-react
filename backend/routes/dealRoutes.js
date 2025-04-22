const express = require('express');
const router = express.Router();
const multer = require('multer');
const dealController = require('../controllers/dealController');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// GET all deals
router.get('/', dealController.getAllDeals);

// GET featured deals
router.get('/featured', dealController.getFeaturedDeals);

// GET deals by category
router.get('/category/:categoryId', dealController.getDealsByCategory);

// GET a specific deal
router.get('/:id', dealController.getDealById);

// POST create a new deal
router.post('/', upload.single('banner'), dealController.createDeal);

// PUT update a deal
router.put('/:id', upload.single('banner'), dealController.updateDeal);

// DELETE a deal
router.delete('/:id', dealController.deleteDeal);

module.exports = router;