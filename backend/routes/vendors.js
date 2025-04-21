const express = require('express');
const admin = require('firebase-admin');
const multer = require('multer');
const bucket = admin.storage().bucket();
const router = express.Router();
const db = admin.firestore();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const validateVendor = (vendor) => {
  if (!vendor.name || typeof vendor.name !== 'string') {
    throw new Error('Vendor name must be a non-empty string');
  }
};

// GET all vendors
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('vendors').get();
    const vendors = [];
    snapshot.forEach(doc => {
      vendors.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(vendors);
  } catch (error) {
    console.error("Error getting vendors:", error);
    res.status(500).send(`Error getting vendors: ${error}`);
  }
});

// GET a specific vendor by ID
router.get('/:id', async (req, res) => {
  const vendorId = req.params.id;

  try {
    const doc = await db.collection('vendors').doc(vendorId).get();
    if (!doc.exists) {
      return res.status(404).send('Vendor not found');
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error getting vendor:", error);
    res.status(500).send(`Error getting vendor: ${error}`);
  }
});

// POST - Add a new vendor
router.post('/', upload.single('logo'), async (req, res) => {
  try {
    const vendor = req.body;
    validateVendor(vendor);

    if (!req.file) {
      throw new Error('No logo image uploaded');
    }

    const file = req.file;
    const timestamp = Date.now();
    const name = file.originalname.split('.')[0];
    const fileName = `${name}_${timestamp}.${file.originalname.split('.')[1]}`

    // Upload the file to Cloud Storage
    const bucketFile = bucket.file(`logos/${fileName}`);
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

      // Add the image URL to the vendor data
      vendor.logo = imageUrl;

      // Add the vendor data to Firestore
      const docRef = await db.collection('vendors').add(vendor);
      res.status(201).send(`Vendor added with ID: ${docRef.id}`);
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error("Error adding vendor:", error);
    res.status(400).send(`Error adding vendor: ${error.message}`);
  }
});

// PUT - Update an existing vendor
router.put('/:id', upload.single('logo'), async (req, res) => {
  const vendorId = req.params.id;
  try {
    const vendor = req.body;

    validateVendor(vendor);

    // Check if a new logo was uploaded
    if (req.file) {
      const file = req.file;
      const timestamp = Date.now();
      const name = file.originalname.split('.')[0];
      const fileName = `${name}_${timestamp}.${file.originalname.split('.')[1]}`

      // Upload the new logo to Cloud Storage
      const bucketFile = bucket.file(`logos/${fileName}`);
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

        // Add the image URL to the vendor data
        vendor.logo = imageUrl;

        // Update the vendor data in Firestore
        await db.collection('vendors').doc(vendorId).update(vendor);
        res.status(200).send('Vendor updated successfully');
      });

      blobStream.end(file.buffer);
    } else {
      // No new logo uploaded, update the other fields
      await db.collection('vendors').doc(vendorId).update(vendor);
      res.status(200).send('Vendor updated successfully');
    }
  } catch (error) {
    console.error("Error updating vendor:", error);
    res.status(400).send(`Error updating vendor: ${error.message}`);
  }
});


// DELETE a vendor
router.delete('/:id', async (req, res) => {
  const vendorId = req.params.id;
  try {
    await db.collection('vendors').doc(vendorId).delete();
    res.status(200).send('Vendor deleted successfully');
  } catch (error) {
    console.error("Error deleting vendor:", error);
    res.status(500).send(`Error deleting vendor: ${error}`);
  }
});

module.exports = router;
