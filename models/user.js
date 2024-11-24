const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place'
    }],
    planners: [{
        name: {
            type: String,
            required: true 
        },
        places: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Place' 
        }],
        date: { type: Date},
        createdAt: {
            type: Date,
            default: Date.now 
        }
    }],
    interactionHistory: [{
        placeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Place'
        },
        interactionType: {
            type: String,
            enum: ['view', 'favorite', 'visited'],
            required: true
        },
        interactionDate: {
            type: Date,
            default: Date.now
        }
    }],
    preferences: {
        budgetRange: {
            min: { type: Number, default: 0 },
            max: { type: Number, default: 500 }
        },
        favoriteCuisines: [String],
        preferredPlaceTypes: [String]
    },
    recommendationsHistory: [{
        placeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Place'
        },
        recommendationDate: {
            type: Date,
            default: Date.now
        }
    }],
    chatbotInteractions: [{
        query: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        context: {
            type: String,
            enum: ['plan_request', 'recommendation_request', 'general_question'],
            required: true
        }
    }],
    feedback: [{
        placeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Place'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comments: String,
        feedbackDate: {
            type: Date,
            default: Date.now
        }
    }],
    frequentLocations: [{
        location: {
            type: String, // e.g., city names or GPS coordinates
            required: true
        },
        visits: {
            type: Number,
            default: 1
        }
    }],
    segment: {
        type: String,
        enum: ['budget_traveler', 'luxury_traveler', 'adventurer', 'foodie', 'sightseer'],
        default: 'sightseer'
    }
});

const ApplicationUser = mongoose.model('ApplicationUser', userSchema);

module.exports = ApplicationUser;
