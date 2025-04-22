const express = require('express');
const router = express.Router();
const multer = require('multer');
const vendorController = require('../controllers/vendorController');

// Setup multer for memory storage (we'll process and upload to Supabase later)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// GET all vendors
router.get('/', vendorController.getAllVendors);

// GET nearby vendors
router.get('/nearby', vendorController.getNearbyVendors);

// GET a specific vendor
router.get('/:id', vendorController.getVendorById);

// POST create a new vendor
router.post('/', upload.single('logo'), vendorController.createVendor);

// PUT update a vendor
router.put('/:id', upload.single('logo'), vendorController.updateVendor);

// DELETE a vendor
router.delete('/:id', vendorController.deleteVendor);

module.exports = router;