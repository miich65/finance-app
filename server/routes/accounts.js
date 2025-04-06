const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Account = require('../models/Account');

// @route   GET api/accounts
// @desc    Get all user's accounts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.id }).sort({ name: 1 });
    res.json(accounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/accounts
// @desc    Add new account
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('initialBalance', 'Initial balance is required').isNumeric()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, initialBalance } = req.body;

    try {
      const newAccount = new Account({
        name,
        initialBalance,
        currentBalance: initialBalance,
        userId: req.user.id
      });

      const account = await newAccount.save();
      res.json(account);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;