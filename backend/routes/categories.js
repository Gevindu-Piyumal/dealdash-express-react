const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
const db = admin.firestore();

const validateCategory = (category) => {
    if (!category.name || typeof category.name !== 'string') {
        throw new Error('Category name must be a non-empty string');
    }
};

// GET all categories
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('categories').get();
        const categories = [];
        snapshot.forEach(doc => {
            categories.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error getting categories:", error);
        res.status(500).send(`Error getting categories: ${error}`);
    }
});

// GET a specific category by ID
router.get('/:id', async (req, res) => {
    const categoryId = req.params.id;

    try {
        const doc = await db.collection('categories').doc(categoryId).get();
        if (!doc.exists) {
            return res.status(404).send('Category not found');
        }
        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error("Error getting category:", error);
        res.status(500).send(`Error getting category: ${error}`);
    }
});

// POST - Add a new category
router.post('/', async (req, res) => {
    try {
        const category = req.body;
        validateCategory(category);

        const docRef = await db.collection('categories').add(category);
        res.status(201).send(`Category added with ID: ${docRef.id}`);
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(400).send(`Error adding category: ${error.message}`);
    }
});

// PUT - Update an existing category
router.put('/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
        const category = req.body;
        validateCategory(category);

        await db.collection('categories').doc(categoryId).update(category);
        res.status(200).send('Category updated successfully');
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(400).send(`Error updating category: ${error.message}`);
    }
});

// DELETE - Delete a category
router.delete('/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
        await db.collection('categories').doc(categoryId).delete();
        res.status(200).send('Category deleted successfully');
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).send(`Error deleting category: ${error}`);
    }
});

module.exports = router;
