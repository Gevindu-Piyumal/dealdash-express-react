const Deal = require('../models/deal');
const Vendor = require('../models/vendor');
const { uploadFile, deleteFile, DEAL_BUCKET } = require('../services/supabaseStorage');

// Get all deals
exports.getAllDeals = async (req, res) => {
  try {
    const { active, featured, category, vendor } = req.query;
    const filter = {};
    
    // Apply filters if provided
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }
    
    if (featured !== undefined) {
      filter.isFeatured = featured === 'true';
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (vendor) {
      filter.vendor = vendor;
    }
    
    // Only show deals that haven't expired
    if (filter.isActive) {
      filter.expireDate = { $gt: new Date() };
    }
    
    const deals = await Deal.find(filter)
      .populate('category', 'name icon')
      .populate('vendor', 'name logo address');
      
    res.status(200).json(deals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ message: 'Failed to fetch deals', error: error.message });
  }
};

// Get deal by ID
exports.getDealById = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id)
      .populate('category', 'name icon')
      .populate('vendor', 'name logo address contactNumber email website socialMedia');
    
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    
    res.status(200).json(deal);
  } catch (error) {
    console.error('Error fetching deal:', error);
    res.status(500).json({ message: 'Failed to fetch deal', error: error.message });
  }
};

// Create new deal
exports.createDeal = async (req, res) => {
  try {
    const dealData = { ...req.body };
    
    // Convert string dates to Date objects
    if (dealData.startDate) {
      dealData.startDate = new Date(dealData.startDate);
    }
    
    if (dealData.expireDate) {
      dealData.expireDate = new Date(dealData.expireDate);
    }
    
    // Convert string boolean values
    if (dealData.isActive !== undefined) {
      dealData.isActive = dealData.isActive === 'true';
    }
    
    if (dealData.isFeatured !== undefined) {
      dealData.isFeatured = dealData.isFeatured === 'true';
    }
    
    // Handle banner upload if provided
    if (req.file) {
      const bannerUrl = await uploadFile(req.file.buffer, req.file.originalname, DEAL_BUCKET);
      dealData.banner = bannerUrl;
    }
    
    // Create and save the new deal
    const newDeal = new Deal(dealData);
    const savedDeal = await newDeal.save();
    
    // Add the deal to the vendor's deals array
    await Vendor.findByIdAndUpdate(dealData.vendor, {
      $push: { deals: savedDeal._id }
    });
    
    // Populate references for the response
    const populatedDeal = await Deal.findById(savedDeal._id)
      .populate('category', 'name icon')
      .populate('vendor', 'name logo');
    
    res.status(201).json(populatedDeal);
  } catch (error) {
    console.error('Error creating deal:', error);
    res.status(500).json({ message: 'Failed to create deal', error: error.message });
  }
};

// Update deal
exports.updateDeal = async (req, res) => {
  try {
    const dealId = req.params.id;
    const dealData = { ...req.body };
    
    // Get existing deal to check if we need to delete old banner
    const existingDeal = await Deal.findById(dealId);
    if (!existingDeal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    
    // Convert string dates to Date objects
    if (dealData.startDate) {
      dealData.startDate = new Date(dealData.startDate);
    }
    
    if (dealData.expireDate) {
      dealData.expireDate = new Date(dealData.expireDate);
    }
    
    // Convert string boolean values
    if (dealData.isActive !== undefined) {
      dealData.isActive = dealData.isActive === 'true';
    }
    
    if (dealData.isFeatured !== undefined) {
      dealData.isFeatured = dealData.isFeatured === 'true';
    }
    
    // Handle banner upload if provided
    if (req.file) {
      // Delete old banner if it exists
      if (existingDeal.banner) {
        await deleteFile(existingDeal.banner);
      }
      
      // Upload new banner
      const bannerUrl = await uploadFile(req.file.buffer, req.file.originalname, DEAL_BUCKET);
      dealData.banner = bannerUrl;
    }
    
    // Handle vendor change if needed
    if (dealData.vendor && dealData.vendor !== existingDeal.vendor.toString()) {
      // Remove deal from old vendor's deals array
      await Vendor.findByIdAndUpdate(existingDeal.vendor, {
        $pull: { deals: dealId }
      });
      
      // Add deal to new vendor's deals array
      await Vendor.findByIdAndUpdate(dealData.vendor, {
        $push: { deals: dealId }
      });
    }
    
    // Update the deal
    const updatedDeal = await Deal.findByIdAndUpdate(
      dealId,
      { $set: dealData },
      { new: true, runValidators: true }
    )
    .populate('category', 'name icon')
    .populate('vendor', 'name logo');
    
    res.status(200).json(updatedDeal);
  } catch (error) {
    console.error('Error updating deal:', error);
    res.status(500).json({ message: 'Failed to update deal', error: error.message });
  }
};

// Delete deal
exports.deleteDeal = async (req, res) => {
  try {
    const dealId = req.params.id;
    
    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    
    // Delete banner from storage if it exists
    if (deal.banner) {
      await deleteFile(deal.banner);
    }
    
    // Remove deal from vendor's deals array
    await Vendor.findByIdAndUpdate(deal.vendor, {
      $pull: { deals: dealId }
    });
    
    // Delete the deal
    await Deal.findByIdAndDelete(dealId);
    
    res.status(200).json({ message: 'Deal deleted successfully' });
  } catch (error) {
    console.error('Error deleting deal:', error);
    res.status(500).json({ message: 'Failed to delete deal', error: error.message });
  }
};

// Get featured deals
exports.getFeaturedDeals = async (req, res) => {
  try {
    const currentDate = new Date();
    
    const featuredDeals = await Deal.find({
      isFeatured: true,
      isActive: true,
      startDate: { $lte: currentDate },
      expireDate: { $gt: currentDate }
    })
    .populate('category', 'name icon')
    .populate('vendor', 'name logo address')
    .limit(10); // Limit to 10 featured deals
    
    res.status(200).json(featuredDeals);
  } catch (error) {
    console.error('Error fetching featured deals:', error);
    res.status(500).json({ message: 'Failed to fetch featured deals', error: error.message });
  }
};

// Get deals by category
exports.getDealsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const currentDate = new Date();
    
    const deals = await Deal.find({
      category: categoryId,
      isActive: true,
      startDate: { $lte: currentDate },
      expireDate: { $gt: currentDate }
    })
    .populate('category', 'name icon')
    .populate('vendor', 'name logo address');
    
    res.status(200).json(deals);
  } catch (error) {
    console.error('Error fetching deals by category:', error);
    res.status(500).json({ message: 'Failed to fetch deals by category', error: error.message });
  }
};