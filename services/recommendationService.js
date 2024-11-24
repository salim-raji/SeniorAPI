const Place = require('../models/place');
const User = require('../models/user');

/**
 * Generate recommendations for a user.
 * @param {ObjectId} userId
 * @returns {Array} Recommended places
 */
async function generateRecommendations(userId) {
    // Step 1: Fetch user preferences and interaction history
    const user = await User.findById(userId).populate('favorites interactionHistory.placeId');
    if (!user) throw new Error('User not found.');

    const { preferences, favorites, interactionHistory } = user;

    // Step 2: Content-based Filtering
    const contentBasedRecommendations = await getContentBasedRecommendations(preferences, favorites);

    // Step 3: Collaborative Filtering
    const collaborativeRecommendations = await getCollaborativeRecommendations(userId, favorites);

    // Step 4: Combine and Deduplicate Recommendations
    const combinedRecommendations = [...contentBasedRecommendations, ...collaborativeRecommendations];
    const uniqueRecommendations = deduplicateRecommendations(combinedRecommendations);

    return uniqueRecommendations;
}

/**
 * Get recommendations based on user preferences and favorite places.
 * @param {Object} preferences
 * @param {Array} favorites
 * @returns {Array} Recommended places
 */
async function getContentBasedRecommendations(preferences, favorites) {
    const favoriteTags = favorites.flatMap((place) => place.tags);
    const budgetRange = preferences.budgetRange || {};

    return await Place.find({
        $and: [
            { budget: { $gte: budgetRange.min || 0, $lte: budgetRange.max || Infinity } },
            { tags: { $in: favoriteTags } } // Match tags with favorites
        ]
    }).limit(10); // Limit results
}

/**
 * Get recommendations based on collaborative filtering.
 * Finds other users with similar preferences or interaction history.
 * @param {ObjectId} userId
 * @param {Array} favorites
 * @returns {Array} Recommended places
 */
async function getCollaborativeRecommendations(userId, favorites) {
    const favoriteIds = favorites.map((fav) => fav._id);

    // Find users who liked the same places
    const similarUsers = await User.find({
        favorites: { $in: favoriteIds },
        _id: { $ne: userId } // Exclude current user
    }).populate('favorites');

    const recommendedPlaces = similarUsers.flatMap((user) => user.favorites);
    return recommendedPlaces.filter((place) => !favoriteIds.includes(place._id)); // Exclude already liked places
}

/**
 * Deduplicates recommendations by removing duplicates.
 * @param {Array} recommendations
 * @returns {Array} Unique recommendations
 */
function deduplicateRecommendations(recommendations) {
    const seen = new Set();
    return recommendations.filter((place) => {
        if (seen.has(place._id.toString())) return false;
        seen.add(place._id.toString());
        return true;
    });
}

module.exports = { generateRecommendations };
