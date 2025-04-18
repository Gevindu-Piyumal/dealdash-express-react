require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const multer = require('multer');



// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
});

const db = admin.firestore();
const bucket = admin.storage().bucket();
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
app.use(cors());
app.use(express.json());

app.use('/categories', require('./routes/categories'));
app.use('/vendors', require('./routes/vendors'));
app.use('/deals', require('./routes/deals'));

// image upload
app.post('/upload/:folder', upload.single('file'), async (req, res) => {
  const { folder } = req.params; 
  const blob = bucket.file(`${folder}s/${Date.now()}_${req.file.originalname}`);
  const stream = blob.createWriteStream({
    metadata: { contentType: req.file.mimetype }
  });

  stream.on('error', err => res.status(500).send(err.message));
  stream.on('finish', async () => {
    await blob.makePublic();
    res.json({ url: blob.publicUrl() });
  });
  stream.end(req.file.buffer);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
