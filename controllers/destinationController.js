const express = require('express');
const Destination = require('../models/destination');
const router = express.Router();

// Add a destination to a planner
router.post('/', async (req, res) => {
    try {
        const destination = new Destination(req.body);
        await destination.save();
        res.status(201).json(destination);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get destinations for a specific planner
router.get('/planner/:plannerId', async (req, res) => {
    try {
        const destinations = await Destination.find({ plannerId: req.params.plannerId }).populate('placeId');
        res.json(destinations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove a destination by ID
router.delete('/:id', async (req, res) => {
    try {
        const destination = await Destination.findByIdAndDelete(req.params.id);
        if (!destination) return res.status(404).json({ message: 'Destination not found' });
        res.json({ message: 'Destination removed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
