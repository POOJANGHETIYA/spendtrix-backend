const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', expenseController.getExpenses);
router.post('/', expenseController.createExpense);
router.get('/monthly-report', expenseController.getMonthlyReport);
router.get('/yearly-report', expenseController.getYearlyReport);


// Todo : Add routes for updateExpense and deleteExpense
module.exports = router;