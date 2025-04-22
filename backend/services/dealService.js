const Deal = require('../models/deal');
const cron = require('node-cron');

// Update expired deals - set isActive to false if expireDate has passed
const updateExpiredDeals = async () => {
  try {
    const currentDate = new Date();
    
    const result = await Deal.updateMany(
      { 
        isActive: true,
        expireDate: { $lt: currentDate }
      },
      {
        $set: { isActive: false }
      }
    );
    
    console.log(`Updated ${result.modifiedCount} expired deals`);
  } catch (error) {
    console.error('Error updating expired deals:', error);
  }
};

// Schedule the job to run every day at midnight
const scheduleExpirationChecks = () => {
  cron.schedule('0 0 * * *', () => {
    console.log('Running expired deals check...');
    updateExpiredDeals();
  });
  
  // Also run once when the service starts
  updateExpiredDeals();
};

module.exports = {
  scheduleExpirationChecks
};