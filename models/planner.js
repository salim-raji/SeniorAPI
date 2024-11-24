const mongoose = require('mongoose');

const plannerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ApplicationUser',
        required: true
    },
    destinations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination'
    }]
});

module.exports = mongoose.model('Planner', plannerSchema);
