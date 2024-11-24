const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ApplicationUser = require('../models/user'); 
const Place = require('../models/place');





// Add a place to the user's favorites
router.post('/:userId/favorites', async (req, res) => {
    const { userId } = req.params;
    const { placeId } = req.body; // Assuming the placeId is sent in the request body

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(placeId)) {
        return res.status(400).json({ error: 'Invalid userId or placeId' });
    }

    try {
        // Find the user by ID
        const user = await ApplicationUser.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the place is already in the user's favorites
        if (user.favorites.includes(placeId)) {
            return res.status(400).json({ error: 'Place already in favorites' });
        }

        // Add the place to the favorites array
        user.favorites.push(placeId);

        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'Place added to favorites successfully', favorites: user.favorites });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.get('/:userId/favorites', async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid userId' });
    }

    try {
        // Fetch the user's favorites
        const user = await ApplicationUser.findById(userId, 'favorites');


        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.favorites || user.favorites.length === 0) {
            return res.status(200).json({ favorites: [] });
        }

        // Fetch favorite places
        const favoritePlaces = await Place.find({ _id: { $in: user.favorites } });


        res.status(200).json(favoritePlaces );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Remove a place from the user's favorites
router.delete('/:userId/favorites', async (req, res) => {
    const { userId } = req.params;
    const { placeId } = req.body; // Assuming the placeId is sent in the request body

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(placeId)) {
        return res.status(400).json({ error: 'Invalid userId or placeId' });
    }

    try {
        // Find the user by ID
        const user = await ApplicationUser.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the place exists in the user's favorites
        if (!user.favorites.includes(placeId)) {
            return res.status(400).json({ error: 'Place not found in favorites' });
        }

        // Remove the place from the favorites array
        user.favorites = user.favorites.filter(fav => fav.toString() !== placeId);

        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'Place removed from favorites successfully', favorites: user.favorites });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Check if a place is in the user's favorites
router.get('/:userId/favorites/:placeId', async (req, res) => {
    const { userId, placeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(placeId)) {
        return res.status(400).json({ error: 'Invalid userId or placeId' });
    }

    try {
        // Find the user by ID
        const user = await ApplicationUser.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the place is in the user's favorites
        const isFavorite = user.favorites.includes(placeId);

        res.status(200).json({ isFavorite });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a planner
router.post('/:userId/planners', async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, date } = req.body;

        if (!name || !date) {
            return res.status(400).json({ message: "Planner name and date are required." });
        }

        const user = await ApplicationUser.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const newPlanner = { name, places: [], date };
        user.planners.push(newPlanner);
        await user.save();

        res.status(201).json({ message: "Planner created successfully.", planner: newPlanner });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error });
    }
});

// Add a place to a planner
router.put('/:userId/planners/:plannerId/places', async (req, res) => {
    try {
        const { userId, plannerId } = req.params;
        const { placeId } = req.body;

        if (!placeId) {
            return res.status(400).json({ message: "Place ID is required." });
        }

        const user = await ApplicationUser.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const planner = user.planners.id(plannerId);
        if (!planner) {
            return res.status(404).json({ message: "Planner not found." });
        }

        const placeExists = await Place.findById(placeId);
        if (!placeExists) {
            return res.status(404).json({ message: "Place not found." });
        }

        planner.places.push(placeId);
        await user.save();

        res.status(200).json({ message: "Place added to planner successfully.", planner });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error });
    }
});

// Remove a place from a planner
router.delete('/:userId/planners/:plannerId/places/:placeId', async (req, res) => {
    try {
        const { userId, plannerId, placeId } = req.params;

        const user = await ApplicationUser.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const planner = user.planners.id(plannerId);
        if (!planner) {
            return res.status(404).json({ message: "Planner not found." });
        }

        planner.places.pull(placeId);
        await user.save();

        res.status(200).json({ message: "Place removed from planner successfully.", planner });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error });
    }
});

// Delete a planner
router.delete('/:userId/planners/:plannerId', async (req, res) => {
    try {
        const { userId, plannerId } = req.params;

        const user = await ApplicationUser.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.planners.id(plannerId).remove();
        await user.save();

        res.status(200).json({ message: "Planner deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error });
    }
});

// Get all planners for a user
router.get('/:userId/planners', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await ApplicationUser.findById(userId).populate('planners.places');
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ planners: user.planners });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error });
    }
});

// Get a specific planner
router.get('/:userId/planners/:plannerId', async (req, res) => {
    try {
        const { userId, plannerId } = req.params;

        const user = await ApplicationUser.findById(userId).populate('planners.places');
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const planner = user.planners.id(plannerId);
        if (!planner) {
            return res.status(404).json({ message: "Planner not found." });
        }

        res.status(200).json({ planner });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error });
    }
});




module.exports = router;
