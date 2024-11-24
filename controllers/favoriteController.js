const express = require('express');
const Favorite = require('../models/favorite');
const router = express.Router();

// Add a place to favorites
router.post('/', async (req, res) => {
    try {
        const favorite = new Favorite(req.body);
        await favorite.save();
        res.status(201).json(favorite);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get favorites for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.params.userId }).populate('placeId');
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove a favorite by ID
router.delete('/:id', async (req, res) => {
    try {
        const favorite = await Favorite.findByIdAndDelete(req.params.id);
        if (!favorite) return res.status(404).json({ message: 'Favorite not found' });
        res.json({ message: 'Favorite removed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
