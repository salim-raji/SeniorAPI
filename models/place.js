const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    name: String,
    type: String, 
    address: String,
    description: String,
    cuisineType: String, 
    openingHours: String,
    menuQR: String,
    website: String,
    rating: {
        type: Number,
        default: 0
    },
    reviews: String,
    amenities: [String], 
    priceRange: String, 
    preferredActivities: [String], 
    distanceFromLocation: Number, 
    budget: Number, 
    dietaryRestrictions: [String], 
    familyFriendly: Boolean,
    ambiance: String, // e.g., 'romantic', 'casual', 'luxurious'
    specialDeals: Boolean, // Indicates if there are discounts or deals available
    outdoorSeating: Boolean, // For restaurants and cafes with outdoor seating
    petFriendly: Boolean, // Indicates if pets are allowed
    noiseLevel: String, // e.g., 'quiet', 'moderate', 'loud'
    groupAccommodation: Number, // Max group size the place can accommodate
    seasonal: Boolean, // Indicates if the place has seasonal offerings (e.g., winter or summer activities)
    recommendedFor: [String], // e.g., 'couples', 'families', 'business travelers', 'backpackers'
    tags: [String]
});

module.exports = mongoose.model('Place', placeSchema);
