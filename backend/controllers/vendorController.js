const Vendor = require('../models/vendor');
const { uploadFile, deleteFile, VENDOR_BUCKET } = require('../services/supabaseStorage');
const mongoose = require('mongoose');

// Get all vendors
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate('deals', 'title description');
    res.status(200).json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ message: 'Failed to fetch vendors', error: error.message });
  }
};

// Get vendor by ID
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate('deals');

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.status(200).json(vendor);
  } catch (error) {
    console.error('Error fetching vendor:', error);
    res.status(500).json({ message: 'Failed to fetch vendor', error: error.message });
  }
};

// Create new vendor
exports.createVendor = async (req, res) => {
  try {
    const vendorData = { ...req.body };

    // Handle logo upload if provided
    if (req.file) {
      const logoUrl = await uploadFile(req.file.buffer, req.file.originalname, VENDOR_BUCKET);
      vendorData.logo = logoUrl;
    }

    // Handle location data if provided
    if (req.body.longitude && req.body.latitude) {
      vendorData.location = {
        type: 'Point',
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
      };

      // Remove these from the main object as they're now in the location structure
      delete vendorData.longitude;
      delete vendorData.latitude;
    }

    // Handle social media data
    vendorData.socialMedia = {
      facebook: req.body.facebook || '',
      instagram: req.body.instagram || '',
      whatsapp: req.body.whatsapp || ''
    };

    // Remove individual social media fields from the main object
    delete vendorData.facebook;
    delete vendorData.instagram;
    delete vendorData.whatsapp;

    const newVendor = new Vendor(vendorData);
    const savedVendor = await newVendor.save();

    res.status(201).json(savedVendor);
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({ message: 'Failed to create vendor', error: error.message });
  }
};

// Update vendor
exports.updateVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendorData = { ...req.body };

    // Get existing vendor to check if we need to delete old logo
    const existingVendor = await Vendor.findById(vendorId);
    if (!existingVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Handle logo upload if provided
    if (req.file) {
      // Delete old logo if it exists
      if (existingVendor.logo) {
        await deleteFile(existingVendor.logo);
      }

      // Upload new logo
      const logoUrl = await uploadFile(req.file.buffer, req.file.originalname, VENDOR_BUCKET);
      vendorData.logo = logoUrl;
    }

    // Handle location data if provided
    if (req.body.longitude && req.body.latitude) {
      vendorData.location = {
        type: 'Point',
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
      };

      // Remove these from the main object
      delete vendorData.longitude;
      delete vendorData.latitude;
    }

    // Handle social media data
    if (req.body.facebook || req.body.instagram || req.body.whatsapp) {
      vendorData.socialMedia = {
        facebook: req.body.facebook || existingVendor.socialMedia.facebook || '',
        instagram: req.body.instagram || existingVendor.socialMedia.instagram || '',
        whatsapp: req.body.whatsapp || existingVendor.socialMedia.whatsapp || ''
      };

      // Remove individual social media fields from the main object
      delete vendorData.facebook;
      delete vendorData.instagram;
      delete vendorData.whatsapp;
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { $set: vendorData },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedVendor);
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({ message: 'Failed to update vendor', error: error.message });
  }
};

// Delete vendor
exports.deleteVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Delete logo from storage if it exists
    if (vendor.logo) {
      await deleteFile(vendor.logo);
    }

    await Vendor.findByIdAndDelete(vendorId);

    res.status(200).json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    console.error('Error deleting vendor:', error);
    res.status(500).json({ message: 'Failed to delete vendor', error: error.message });
  }
};

// Search vendors by location with category filtering
exports.getNearbyVendors = async (req, res) => {
  try {
    const { longitude, latitude, distance = 5000, category = 'All' } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ message: 'Longitude and latitude are required' });
    }

    // if a specific category is provided find its ObjectId
    let categoryFilter = {};
    if (category !== 'All' && category !== '') {
      const Category = mongoose.model('Category');
      const categoryDoc = await Category.findOne({ name: category });

      if (!categoryDoc) {
        return res.status(404).json({ message: 'Category not found' });
      }

      categoryFilter = { category: categoryDoc._id };
    }

    // Find nearby vendors with calculated distance
    const vendors = await Vendor.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          distanceField: 'distance',
          maxDistance: parseInt(distance),
          spherical: true
        }
      },
      {
        $lookup: {
          from: 'deals',
          localField: 'deals',
          foreignField: '_id',
          pipeline: [
            {
              $match: {
                isActive: true,
                ...categoryFilter
              }
            },
            {
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'categoryDetails'
              }
            },
            { $unwind: { path: '$categoryDetails', preserveNullAndEmptyArrays: true } }
          ],
          as: 'dealDetails'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          logo: 1,
          location: 1,
          distance: 1,
          activeDealCount: { $size: '$dealDetails' }
        }
      },
      {
        $match: {
          activeDealCount: { $gt: 0 }
        }
      }
    ]);

    const results = vendors.map(vendor => ({
      _id: vendor._id,
      name: vendor.name,
      logo: vendor.logo,
      activeDealCount: vendor.activeDealCount,
      distance: Math.round(vendor.distance),
      location: vendor.location
    }));

    res.status(200).json(results);
  } catch (error) {
    console.error('Error searching nearby vendors:', error);
    res.status(500).json({ message: 'Failed to search nearby vendors', error: error.message });
  }
};