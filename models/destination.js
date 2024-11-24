const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    placeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
    plannerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Planner',
        required: true
    },
    notes: String
});

module.exports = mongoose.model('Destination', destinationSchema);
