const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
    required: true
  },
  transactionType: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  taxRelevant: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('transaction', TransactionSchema);