const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  initialBalance: {
    type: Number,
    required: true,
    default: 0
  },
  currentBalance: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = mongoose.model('account', AccountSchema);