const supabase = require('../config/supabase');
const { body, validationResult } = require('express-validator');

exports.getExpenses = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', req.user.userId);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createExpense = async (req, res) => {
  const { category_id, date, item, amount, note } = req.body;

  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert({ category_id, date, item, amount, note, user_id: req.user.userId })
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMonthlyReport = async (req, res) => {
    const { year, month } = req.query;
    
    try {
      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 0).toISOString();
  
      const { data, error } = await supabase
        .from('expenses')
        .select('category_id, amount, categories(name)')
        .eq('user_id', req.user.userId)
        .gte('date', startDate)
        .lte('date', endDate);
  
      if (error) throw error;
  
      const report = data.reduce((acc, expense) => {
        const categoryName = expense.categories.name;
        if (!acc[categoryName]) {
          acc[categoryName] = 0;
        }
        acc[categoryName] += parseFloat(expense.amount);
        return acc;
      }, {});
  
      const total = Object.values(report).reduce((sum, amount) => sum + amount, 0);
  
      res.status(200).json({ report, total });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  exports.getYearlyReport = async (req, res) => {
    const { year } = req.query;
    
    try {
      const startDate = new Date(year, 0, 1).toISOString();
      const endDate = new Date(year, 11, 31).toISOString();
  
      const { data, error } = await supabase
        .from('expenses')
        .select('amount, date')
        .eq('user_id', req.user.userId)
        .gte('date', startDate)
        .lte('date', endDate);
  
      if (error) throw error;
  
      const report = data.reduce((acc, expense) => {
        const month = new Date(expense.date).getMonth();
        if (!acc[month]) {
          acc[month] = 0;
        }
        acc[month] += parseFloat(expense.amount);
        return acc;
      }, {});
  
      const total = Object.values(report).reduce((sum, amount) => sum + amount, 0);
  
      res.status(200).json({ report, total });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // Input validation middleware
exports.validateExpense = [
    body('category_id').isUUID(),
    body('date').isISO8601(),
    body('item').isString().notEmpty(),
    body('amount').isFloat({ min: 0 }),
    body('note').optional().isString(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];
// Todo : Add updateExpense and deleteExpense methods here