const mongoose = require('mongoose');

const policyCategorySchema = new mongoose.Schema({
    category_name: { type: String, required: true }
});

module.exports = mongoose.model('PolicyCategory', policyCategorySchema);
