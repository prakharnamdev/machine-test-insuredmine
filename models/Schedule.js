const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    message: { type: String, required: true },
    scheduledTime: { type: Date, required: true }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
