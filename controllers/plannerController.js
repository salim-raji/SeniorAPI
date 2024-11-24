const express = require('express');
const Planner = require('../models/planner');
const router = express.Router();

// Create a new planner
router.post('/', async (req, res) => {
    try {
        const planner = new Planner(req.body);
        await planner.save();
        res.status(201).json(planner);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all planners for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const planners = await Planner.find({ userId: req.params.userId }).populate('destinations');
        res.json(planners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific planner by ID
router.get('/:id', async (req, res) => {
    try {
        const planner = await Planner.findById(req.params.id).populate('destinations');
        if (!planner) return res.status(404).json({ message: 'Planner not found' });
        res.json(planner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a planner
router.put('/:id', async (req, res) => {
    try {
        const planner = await Planner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!planner) return res.status(404).json({ message: 'Planner not found' });
        res.json(planner);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a planner
router.delete('/:id', async (req, res) => {
    try {
        const planner = await Planner.findByIdAndDelete(req.params.id);
        if (!planner) return res.status(404).json({ message: 'Planner not found' });
        res.json({ message: 'Planner deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
