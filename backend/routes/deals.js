const express = require('express');
const admin = require('firebase-admin');
const db = admin.firestore();

const router = express.Router();
const dealsRef = db.collection('deals');

router.get('/', async (req, res) => {
  const snap = await dealsRef.get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

router.post('/', async (req, res) => {
  const {
    title, description, bannerUrl,
    categoryId, startDate, expireDate,
    isActive, isFeatured, vendorId
  } = req.body;

  const data = {
    title, description, bannerUrl, categoryId, vendorId,
    startDate: admin.firestore.Timestamp.fromDate(new Date(startDate)),
    expireDate: admin.firestore.Timestamp.fromDate(new Date(expireDate)),
    isActive, isFeatured,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };

  const doc = await dealsRef.add(data);
  res.status(201).json({ id: doc.id });
});

router.put('/:id', async (req, res) => {
  await dealsRef.doc(req.params.id).update(req.body);
  res.sendStatus(204);
});

router.delete('/:id', async (req, res) => {
  await dealsRef.doc(req.params.id).delete();
  res.sendStatus(204);
});

module.exports = router;
