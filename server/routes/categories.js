const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Category = require('../models/Category');

// @route   GET api/categories
// @desc    Get all user's categories
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user.id }).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/categories
// @desc    Add new category
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('type', 'Type is required').isIn(['income', 'expense', 'both'])
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, type } = req.body;

    try {
      const newCategory = new Category({
        name,
        type,
        userId: req.user.id
      });

      const category = await newCategory.save();
      res.json(category);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;