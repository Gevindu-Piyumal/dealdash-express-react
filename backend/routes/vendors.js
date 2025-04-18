const express = require('express');
const admin = require('firebase-admin');
const db = admin.firestore();

const router = express.Router();
const vendorsRef = db.collection('vendors');

router.get('/', async (req, res) => {
  const snap = await vendorsRef.get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

router.post('/', async (req, res) => {
  const payload = { ...req.body, createdAt: admin.firestore.FieldValue.serverTimestamp() };
  const doc = await vendorsRef.add(payload);
  res.status(201).json({ id: doc.id });
});

router.put('/:id', async (req, res) => {
  await vendorsRef.doc(req.params.id).update(req.body);
  res.sendStatus(204);
});

router.delete('/:id', async (req, res) => {
  await vendorsRef.doc(req.params.id).delete();
  res.sendStatus(204);
});

module.exports = router;
