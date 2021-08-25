const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const distanceSchema = new Schema({
    source: String,
    destination: String,
    distance: Number,
    counter: {type: Number, default: 0},
});

const Distance = mongoose.model('Distance', distanceSchema);

module.exports = Distance;
