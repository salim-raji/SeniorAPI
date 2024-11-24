const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    placeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ApplicationUser',
        required: true
    }
});

module.exports = mongoose.model('Favorite', favoriteSchema);
