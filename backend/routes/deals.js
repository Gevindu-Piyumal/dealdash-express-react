const express = require('express');
const admin = require('firebase-admin');
const multer = require('multer');
const router = express.Router();
const db = admin.firestore();
const bucket = admin.storage().bucket();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const validateDeal = (deal) => {
  if (!deal.title || typeof deal.title !== 'string') {
    throw new Error('Deal title must be a non-empty string');
  }
    if (!deal.vendor || typeof deal.vendor !== 'object') {
    throw new Error('Deal vendor must be a non-empty string');
  }
};

// GET all deals
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('deals').get();
    const deals = [];
    snapshot.forEach(doc => {
      deals.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(deals);
  } catch (error) {
    console.error("Error getting deals:", error);
    res.status(500).send(`Error getting deals: ${error}`);
  }
});

// GET a specific deal by ID
router.get('/:id', async (req, res) => {
  const dealId = req.params.id;

  try {
    const doc = await db.collection('deals').doc(dealId).get();
    if (!doc.exists) {
      return res.status(404).send('Deal not found');
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error getting deal:", error);
    res.status(500).send(`Error getting deal: ${error}`);
  }
});

// POST - Add a new deal with banner upload
router.post('/', upload.single('banner'), async (req, res) => {
  try {
    const deal = req.body;
    validateDeal(deal);

    if (!req.file) {
      throw new Error('No banner image uploaded');
    }

    const file = req.file;
    const timestamp = Date.now();
    const name = file.originalname.split('.')[0];
    const fileName = `${name}_${timestamp}.${file.originalname.split('.')[1]}`

    // Upload the file to Cloud Storage
    const bucketFile = bucket.file(`banners/${fileName}`);
    const blobStream = bucketFile.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (err) => {
      console.error("Error uploading to Cloud Storage:", err);
      throw new Error('Unable to upload image to Cloud Storage');
    });

    blobStream.on('finish', async () => {
      // Get the public URL of the uploaded image
      await bucketFile.makePublic();
      const imageUrl = bucketFile.publicUrl();

      // Add the image URL to the deal data
      deal.banner = imageUrl;

      // Add the deal data to Firestore
      const docRef = await db.collection('deals').add(deal);
      res.status(201).send(`Deal added with ID: ${docRef.id}`);
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error("Error adding deal:", error);
    res.status(400).send(`Error adding deal: ${error.message}`);
  }
});

// PUT - Update an existing deal with banner upload
router.put('/:id', upload.single('banner'), async (req, res) => {
  const dealId = req.params.id;
  try {
    const deal = req.body;
    validateDeal(deal);

    if (req.file) {
      const file = req.file;
      const timestamp = Date.now();
      const name = file.originalname.split('.')[0];
      const fileName = `${name}_${timestamp}.${file.originalname.split('.')[1]}`

      // Upload the new banner to Cloud Storage
      const bucketFile = bucket.file(`banners/${fileName}`);
      const blobStream = bucketFile.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      blobStream.on('error', (err) => {
        console.error("Error uploading to Cloud Storage:", err);
        throw new Error('Unable to upload image to Cloud Storage');
      });

      blobStream.on('finish', async () => {
        // Get the public URL of the uploaded image
        await bucketFile.makePublic();
        const imageUrl = bucketFile.publicUrl();

        // Add the image URL to the deal data
        deal.banner = imageUrl;

        // Update the deal data in Firestore
        await db.collection('deals').doc(dealId).update(deal);
        res.status(200).send('Deal updated successfully');
      });

      blobStream.end(file.buffer);
    } else {
      // No new banner uploaded, update the other fields
      await db.collection('deals').doc(dealId).update(deal);
      res.status(200).send('Deal updated successfully');
    }
  } catch (error) {
    console.error("Error updating deal:", error);
    res.status(400).send(`Error updating deal: ${error.message}`);
  }
});

// DELETE - Delete a deal
router.delete('/:id', async (req, res) => {
  const dealId = req.params.id;
  try {
    await db.collection('deals').doc(dealId).delete();
    res.status(200).send('Deal deleted successfully');
  } catch (error) {
    console.error("Error deleting deal:", error);
    res.status(500).send(`Error deleting deal: ${error}`);
  }
});

module.exports = router;
