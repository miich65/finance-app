const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

// @route   GET api/transactions
// @desc    Get all user's transactions
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ date: -1 })
      .populate('categoryId', 'name type')
      .populate('accountId', 'name');
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/transactions/paginated
// @desc    Get paginated user's transactions
// @access  Private
router.get('/paginated', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate('categoryId', 'name type')
      .populate('accountId', 'name');
    
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/transactions
// @desc    Add new transaction
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('amount', 'Amount is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('categoryId', 'Category is required').not().isEmpty(),
      check('accountId', 'Account is required').not().isEmpty(),
      check('transactionType', 'Transaction type is required').isIn(['income', 'expense'])
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, date, description, categoryId, accountId, transactionType, taxRelevant } = req.body;

    try {
      // Find the account to update balance
      const account = await Account.findOne({ _id: accountId, userId: req.user.id });
      
      if (!account) {
        return res.status(404).json({ msg: 'Account not found' });
      }

      // Create new transaction
      const newTransaction = new Transaction({
        userId: req.user.id,
        amount,
        date: date || Date.now(),
        description,
        categoryId,
        accountId,
        transactionType,
        taxRelevant: taxRelevant || false
      });

      const transaction = await newTransaction.save();

      // Update account balance
      const balanceChange = transactionType === 'income' ? amount : -amount;
      account.currentBalance += balanceChange;
      await account.save();

      res.json(transaction);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/transactions/:id
// @desc    Delete transaction
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ msg: 'Transaction not found' });
    }

    // Make sure user owns transaction
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Find the account to update balance
    const account = await Account.findOne({ _id: transaction.accountId, userId: req.user.id });
    
    if (account) {
      // Reverse the original transaction effect on balance
      const balanceChange = transaction.transactionType === 'income' ? -transaction.amount : transaction.amount;
      account.currentBalance += balanceChange;
      await account.save();
    }

    await Transaction.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Transaction removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;