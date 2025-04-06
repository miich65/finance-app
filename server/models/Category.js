const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'both'],
    required: true
  }
});

module.exports = mongoose.model('category', CategorySchema);