const mongoose = require('mongoose');

const policyInfoSchema = new mongoose.Schema({
    policy_number: { type: String, required: true, unique: true },
    policy_start_date: { type: Date, required: true },
    policy_end_date: { type: Date, required: true },
    policy_category: { type: mongoose.Schema.Types.ObjectId, ref: 'Policycategory', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'PolicyCarrier', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('PolicyInfo', policyInfoSchema);
