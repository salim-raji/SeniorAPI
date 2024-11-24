const express = require('express');
const ApplicationUser = require('../models/user');
const Place = require('../models/place');
const router = express.Router();

router.get('/recommendations/ultimate', async (req, res) => {
    try {
        const { userId, location, timeOfDay } = req.query;

        const user = await ApplicationUser.findById(userId).populate('interactionHistory.placeId');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const places = await Place.find();

        const behaviorAnalysis = analyzeUserBehavior(user);

        const collaborativeRecommendations = await getAdvancedCollaborativeRecommendations(user, places, behaviorAnalysis);

        const contentBasedRecommendations = getContextAwareRecommendations(user, places, location, timeOfDay);

        const trendingRecommendations = getTrendingPlaces(places);

        const graphRecommendations = getGraphRecommendations(user, places);

        const finalRecommendations = combineUltimateRecommendations(
            collaborativeRecommendations,
            contentBasedRecommendations,
            trendingRecommendations,
            graphRecommendations
        );

        res.json(finalRecommendations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

function analyzeUserBehavior(user) {
    const interactionScores = {
        view: 1,
        favorite: 3,
        visited: 5,
    };

    const behavior = user.interactionHistory.reduce((acc, interaction) => {
        if (!interaction) return acc; 
        const type = interaction.interactionType;
        acc[type] = (acc[type] || 0) + interactionScores[type];
        return acc;
    }, {});

    const totalScore = Object.values(behavior).reduce((sum, score) => sum + score, 0);
    return { ...behavior, totalScore };
}

async function getAdvancedCollaborativeRecommendations(user, places, behaviorAnalysis) {
    const allUsers = await ApplicationUser.find().populate('interactionHistory.placeId');

    const similarUsers = allUsers
        .filter(otherUser => otherUser._id.toString() !== user._id.toString())
        .map(otherUser => ({
            user: otherUser,
            similarity: calculateHybridSimilarity(user, otherUser),
        }))
        .filter(item => item.similarity > 0.4)
        .sort((a, b) => b.similarity - a.similarity);

    const recommendations = {};
    similarUsers.forEach(({ user: otherUser }) => {
        otherUser.interactionHistory.forEach(interaction => {
            if (
                interaction &&
                interaction.placeId &&
                !user.interactionHistory.some(i => i.placeId && i.placeId.equals(interaction.placeId))
            ) {
                const placeId = interaction.placeId.toString();
                recommendations[placeId] = (recommendations[placeId] || 0) + behaviorAnalysis.totalScore * 0.2;
            }
        });
    });

    return Object.entries(recommendations)
        .map(([placeId, score]) => {
            const place = places.find(p => p._id && p._id.equals(placeId));
            if (place) {
                return { place, score };
            }
            return null;
        })
        .filter(Boolean);
}

function calculateHybridSimilarity(user1, user2) {
    const user1Places = new Set(
        user1.interactionHistory
            .map(i => i.placeId?.toString())
            .filter(Boolean)
    );
    const user2Places = new Set(
        user2.interactionHistory
            .map(i => i.placeId?.toString())
            .filter(Boolean)
    );

    const dotProduct = buildInteractionVector(user1).reduce((sum, value, index) => {
        const user2Vector = buildInteractionVector(user2);
        return sum + value * user2Vector[index];
    }, 0);

    const magnitude1 = Math.sqrt(buildInteractionVector(user1).reduce((sum, value) => sum + value ** 2, 0));
    const magnitude2 = Math.sqrt(buildInteractionVector(user2).reduce((sum, value) => sum + value ** 2, 0));

    const cosineSimilarity = magnitude1 && magnitude2 ? dotProduct / (magnitude1 * magnitude2) : 0;

    const jaccardSimilarity = [...user1Places].filter(place => user2Places.has(place)).length / 
        new Set([...user1Places, ...user2Places]).size;

    return 0.7 * cosineSimilarity + 0.3 * jaccardSimilarity;
}

function getContextAwareRecommendations(user, places, location, timeOfDay) {
    return places.map(place => {
        let score = calculatePlaceContextScore(user, place, location, timeOfDay);

        // Add extra weight if the place is in user's favorites
        if (user.favorites.some(favId => favId.equals(place._id))) {
            score += 0.5; // Arbitrary weight for favorites
        }

        return { place, score };
    })
    .filter(item => item.score > 0.4)
    .sort((a, b) => b.score - a.score);
}

function calculatePlaceContextScore(user, place, location, timeOfDay) {
    let score = 0;
    if (user.preferences.favoriteCuisines.includes(place.cuisineType)) score += 0.4;
    if (user.preferences.preferredPlaceTypes.includes(place.type)) score += 0.3;
    if (place.budget <= user.preferences.budgetRange.max && place.budget >= user.preferences.budgetRange.min) score += 0.2;
    if (place.location && place.location === location) score += 0.1;
    if (place.timePreference && place.timePreference === timeOfDay) score += 0.1;

    return score;
}

function getTrendingPlaces(places) {
    return places
        .filter(place => place.trending || place.seasonal)
        .map(place => ({
            place,
            score: place.trending ? 0.6 : 0.4,
        }));
}

function getGraphRecommendations(user, places) {
    const graphRecommendations = {};

    user.interactionHistory.forEach(interaction => {
        if (!interaction || !interaction.placeId) return; 
        const relatedPlaces = places.filter(
            place => place.relatedPlaces && place.relatedPlaces.includes(interaction.placeId.toString())
        );
        relatedPlaces.forEach(place => {
            graphRecommendations[place._id.toString()] = (graphRecommendations[place._id.toString()] || 0) + 0.3;
        });
    });

    return Object.entries(graphRecommendations).map(([placeId, score]) => ({
        place: places.find(p => p._id && p._id.equals(placeId)),
        score,
    })).filter(Boolean);
}

function combineUltimateRecommendations(...recommendationSources) {
    const combined = new Map();

    recommendationSources.forEach(source => {
        source.forEach(({ place, score }) => {
            if (place && place._id) {
                const placeId = place._id.toString();
                if (combined.has(placeId)) {
                    combined.get(placeId).score += score;
                } else {
                    combined.set(placeId, { place, score });
                }
            }
        });
    });

    return Array.from(combined.values())
        .sort((a, b) => b.score - a.score)
        .map(item => item.place);
}

function buildInteractionVector(user) {
    const interactionScores = { view: 1, favorite: 3, visited: 5 };

    const interactionMap = new Map();
    user.interactionHistory.forEach(interaction => {
        if (!interaction || !interaction.placeId) return; 
        const placeId = interaction.placeId.toString();
        const score = interactionScores[interaction.interactionType] || 0;
        interactionMap.set(placeId, (interactionMap.get(placeId) || 0) + score);
    });

    return Array.from(interactionMap.values());
}

module.exports = router;
