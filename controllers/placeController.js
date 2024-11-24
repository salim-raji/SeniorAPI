const express = require('express');
const Place = require('../models/place');
const router = express.Router();

// Create a new place
router.post('/', async (req, res) => {
    try {
        const place = new Place(req.body);
        await place.save();
        res.status(201).json(place);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all places
router.get('/', async (req, res) => {
    try {
        const places = await Place.find();
        res.json(places);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a place by ID
router.get('/place/:id', async (req, res) => {
    try {
        const place = await Place.findById(req.params.id);
        if (!place) return res.status(404).json({ message: 'Place not found' });
        res.json(place);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a place by ID
router.put('place/:id', async (req, res) => {
    try {
        const place = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!place) return res.status(404).json({ message: 'Place not found' });
        res.json(place);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a place by ID
router.delete('place/:id', async (req, res) => {
    try {
        const place = await Place.findByIdAndDelete(req.params.id);
        if (!place) return res.status(404).json({ message: 'Place not found' });
        res.json({ message: 'Place deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get restaurants by cuisine type
router.get('/get/restaurants', async (req, res) => {
    try {
        const restaurants = await Place.find({ type: 'Restaurant' });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get hotels by star rating
router.get('/get/hotels', async (req, res) => {
    try {

        const hotels = await Place.find({ type: 'Hotel'});
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get hotels by amenities
router.get('/hotels/amenities', async (req, res) => {
    try {
        const { amenities } = req.query;
        const amenitiesArray = amenities.split(',').map(item => item.trim());
        const hotels = await Place.find({ 
            type: 'hotel', 
            amenities: { $all: amenitiesArray }
        });
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get nightlife places by type
router.get('/get/nightlife', async (req, res) => {
    try {
        const nightlifePlaces = await Place.find({ type: 'Nightlife'});
        res.json(nightlifePlaces);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get restaurants by budget and cuisine exclusion
router.get('/restaurants/filter', async (req, res) => {
    try {
        const { budget, excludeCuisine } = req.query;
        const restaurants = await Place.find({
            type: 'restaurant',
            budget: { $lte: budget },
            cuisineType: { $ne: excludeCuisine }
        });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get places by activity type
router.get('/activities', async (req, res) => {
    try {
        const { activityType } = req.query;
        const places = await Place.find({
            preferredActivities: activityType
        });
        res.json(places);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get nearby places within a specified distance
router.get('/nearby', async (req, res) => {
    try {
        const { maxDistance } = req.query;
        const places = await Place.find({
            distanceFromLocation: { $lte: maxDistance }
        });
        res.json(places);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get hotels by rating and price range
router.get('/hotels/filter', async (req, res) => {
    try {
        const { minRating, priceRange } = req.query;
        const hotels = await Place.find({
            type: 'hotel',
            rating: { $gte: minRating },
            priceRange: priceRange
        });
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get places by combined preferences (budget, rating, distance)
router.get('/places/filter', async (req, res) => {
    try {
        const { budget, minRating, maxDistance } = req.query;
        const places = await Place.find({
            budget: { $lte: budget },
            rating: { $gte: minRating },
            distanceFromLocation: { $lte: maxDistance }
        });
        res.json(places);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get restaurants by dietary restrictions and budget
router.get('/restaurants/dietary', async (req, res) => {
    try {
        const { budget, restriction } = req.query;
        const restaurants = await Place.find({
            type: 'restaurant',
            budget: { $lte: budget },
            dietaryRestrictions: restriction
        });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get family-friendly places
router.get('/family-friendly', async (req, res) => {
    try {
        const places = await Place.find({
            familyFriendly: true
        });
        res.json(places);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get places by ambiance preference
router.get('/places/ambiance', async (req, res) => {
    try {
        const { ambiance } = req.query;
        const places = await Place.find({
            ambiance: ambiance
        });
        res.json(places);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get places with special deals
router.get('/special-deals', async (req, res) => {
    try {
        const places = await Place.find({
            specialDeals: true
        });
        res.json(places);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get recommendations by ambiance, family-friendliness, dietary needs, and budget
router.get('/recommendations', async (req, res) => {
    try {
        const { ambiance, familyFriendly, restriction, budget } = req.query;
        const recommendations = await Place.find({
            ambiance: ambiance,
            familyFriendly: familyFriendly === 'true',
            dietaryRestrictions: restriction,
            budget: { $lte: budget }
        });
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get places with outdoor seating and pet-friendly options
router.get('/outdoor-pet-friendly', async (req, res) => {
    try {
        const places = await Place.find({
            outdoorSeating: true,
            petFriendly: true
        });
        res.json(places);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get places by noise level
router.get('/quiet-places', async (req, res) => {
    try {
        const places = await Place.find({
            noiseLevel: 'quiet'
        });
        res.json(places);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get places by group accommodation size
router.get('/group-accommodation', async (req, res) => {
    try {
        const { groupSize } = req.query;
        const places = await Place.find({
            groupAccommodation: { $gte: groupSize }
        });
        res.json(places);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get places with seasonal offerings
router.get('/seasonal', async (req, res) => {
    try {
        const places = await Place.find({
            seasonal: true
        });
        res.json(places);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get recommendations based on traveler type
router.get('/recommendations/traveler-type', async (req, res) => {
    try {
        const { travelerType } = req.query;
        const recommendations = await Place.find({
            recommendedFor: travelerType
        });
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




module.exports = router;
