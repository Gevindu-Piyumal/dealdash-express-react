const express = require('express');
const admin = require('firebase-admin');
const db = admin.firestore();

const router = express.Router();
const categoriesRef = db.collection('categories');

router.get('/', async (req, res) => {
  const snap = await categoriesRef.get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

router.post('/', async (req, res) => {
  const { name, iconUrl } = req.body;
  const doc = await categoriesRef.add({ name, iconUrl });
  res.status(201).json({ id: doc.id });
});

router.put('/:id', async (req, res) => {
  await categoriesRef.doc(req.params.id).update(req.body);
  res.sendStatus(204);
});

router.delete('/:id', async (req, res) => {
  await categoriesRef.doc(req.params.id).delete();
  res.sendStatus(204);
});

module.exports = router;
