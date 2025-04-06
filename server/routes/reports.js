const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

const Transaction = require('../models/Transaction');

// @route   GET api/reports/cashflow
// @desc    Get cashflow report data
// @access  Private
router.get('/cashflow', auth, async (req, res) => {
  try {
    const { period } = req.query; // 'month', 'quarter', 'year'
    let dateFormat;
    
    switch(period) {
      case 'month':
        dateFormat = { $dateToString: { format: "%Y-%m-%d", date: "$date" } };
        break;
      case 'quarter':
        dateFormat = { 
          $dateToString: { 
            format: "%Y-%m", 
            date: "$date" 
          } 
        };
        break;
      case 'year':
      default:
        dateFormat = { 
          $dateToString: { 
            format: "%Y-%m", 
            date: "$date" 
          } 
        };
    }

    const cashflow = await Transaction.aggregate([
      { 
        $match: { 
          userId: mongoose.Types.ObjectId(req.user.id) 
        } 
      },
      {
        $group: {
          _id: {
            date: dateFormat,
            type: "$transactionType"
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          income: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "income"] }, "$total", 0]
            }
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "expense"] }, "$total", 0]
            }
          }
        }
      },
      {
        $project: {
          date: "$_id",
          income: 1,
          expense: 1,
          balance: { $subtract: ["$income", "$expense"] },
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.json(cashflow);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/reports/categories
// @desc    Get spending by category
// @access  Private
router.get('/categories', auth, async (req, res) => {
  try {
    const { type, period } = req.query; // type: 'income' or 'expense', period: timeframe
    
    let dateFilter = {};
    const now = new Date();
    
    switch(period) {
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        dateFilter = { date: { $gte: monthStart } };
        break;
      case 'quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        dateFilter = { date: { $gte: quarterStart } };
        break;
      case 'year':
        const yearStart = new Date(now.getFullYear(), 0, 1);
        dateFilter = { date: { $gte: yearStart } };
        break;
      default:
        // No filter, all time
    }

    const categoryData = await Transaction.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(req.user.id),
          transactionType: type || { $in: ['income', 'expense'] },
          ...dateFilter
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: {
            categoryId: '$categoryId',
            categoryName: '$category.name'
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $project: {
          categoryId: '$_id.categoryId',
          categoryName: '$_id.categoryName',
          total: 1,
          _id: 0
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json(categoryData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/reports/summary
// @desc    Get financial summary
// @access  Private
router.get('/summary', auth, async (req, res) => {
  try {
    // Get total income, expenses and balance
    const totals = await Transaction.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(req.user.id)
        }
      },
      {
        $group: {
          _id: "$transactionType",
          total: { $sum: "$amount" }
        }
      }
    ]);
    
    let summary = {
      income: 0,
      expense: 0,
      balance: 0,
      taxRelevantIncome: 0,
      taxRelevantExpense: 0
    };
    
    totals.forEach(item => {
      summary[item._id] = item.total;
    });
    
    summary.balance = summary.income - summary.expense;
    
    // Get tax relevant totals
    const taxRelevant = await Transaction.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(req.user.id),
          taxRelevant: true
        }
      },
      {
        $group: {
          _id: "$transactionType",
          total: { $sum: "$amount" }
        }
      }
    ]);
    
    taxRelevant.forEach(item => {
      summary[`taxRelevant${item._id.charAt(0).toUpperCase() + item._id.slice(1)}`] = item.total;
    });

    res.json(summary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;