const mongoose = require('mongoose');

const schoolSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    
    },

    latitude: {
        type: Number,
        required: true,
    
    },
});

module.exports = mongoose.model('school', schoolSchema);