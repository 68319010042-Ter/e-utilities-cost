const { Op, fn, col, literal } = require('sequelize');
const { Expense, ExpenseCategory, BudgetCategory } = require('../models');

// GET /api/dashboard/summary?year=
exports.summary = async (req, res, next) => {
  try {
    const year = req.query.year || new Date().getFullYear();

    const rows = await Expense.findAll({
      attributes: [
        [fn('MONTH', col('billing_month')), 'month'],
        [fn('SUM', col('amount')), 'total'],
      ],
      where: {
        billing_month: { [Op.between]: [`${year}-01-01`, `${year}-12-31`] },
      },
      group: [fn('MONTH', col('billing_month'))],
      order: [[literal('month'), 'ASC']],
      raw: true,
    });

    // Fill all 12 months
    const monthly = Array.from({ length: 12 }, (_, i) => {
      const found = rows.find((r) => Number(r.month) === i + 1);
      return { month: i + 1, total: found ? Number(found.total) : 0 };
    });

    const yearTotal = monthly.reduce((sum, m) => sum + m.total, 0);

    res.json({ year: Number(year), monthly, yearTotal });
  } catch (err) {
    next(err);
  }
};

// GET /api/dashboard/by-category?year=
exports.byCategory = async (req, res, next) => {
  try {
    const year = req.query.year || new Date().getFullYear();

    const rows = await Expense.findAll({
      attributes: [
        'expense_category_id',
        [fn('SUM', col('Expense.amount')), 'total'],
      ],
      include: [{ model: ExpenseCategory, as: 'expenseCategory', attributes: ['name', 'code'] }],
      where: {
        billing_month: { [Op.between]: [`${year}-01-01`, `${year}-12-31`] },
      },
      group: ['expense_category_id', 'expenseCategory.id'],
      raw: true,
      nest: true,
    });

    res.json(rows.map((r) => ({
      name: r.expenseCategory.name,
      code: r.expenseCategory.code,
      total: Number(r.total),
    })));
  } catch (err) {
    next(err);
  }
};

// GET /api/dashboard/by-budget?year=
exports.byBudget = async (req, res, next) => {
  try {
    const year = req.query.year || new Date().getFullYear();

    const rows = await Expense.findAll({
      attributes: [
        'budget_category_id',
        [fn('SUM', col('Expense.amount')), 'total'],
      ],
      include: [{ model: BudgetCategory, as: 'budgetCategory', attributes: ['name', 'code'] }],
      where: {
        billing_month: { [Op.between]: [`${year}-01-01`, `${year}-12-31`] },
      },
      group: ['budget_category_id', 'budgetCategory.id'],
      raw: true,
      nest: true,
    });

    res.json(rows.map((r) => ({
      name: r.budgetCategory.name,
      code: r.budgetCategory.code,
      total: Number(r.total),
    })));
  } catch (err) {
    next(err);
  }
};

// GET /api/dashboard/compare?year1=&year2=
exports.compare = async (req, res, next) => {
  try {
    const { year1, year2 } = req.query;
    if (!year1 || !year2) {
      return res.status(400).json({ message: 'กรุณาระบุ year1 และ year2' });
    }

    async function monthlyForYear(year) {
      const rows = await Expense.findAll({
        attributes: [
          [fn('MONTH', col('billing_month')), 'month'],
          [fn('SUM', col('amount')), 'total'],
        ],
        where: {
          billing_month: { [Op.between]: [`${year}-01-01`, `${year}-12-31`] },
        },
        group: [fn('MONTH', col('billing_month'))],
        raw: true,
      });
      return Array.from({ length: 12 }, (_, i) => {
        const found = rows.find((r) => Number(r.month) === i + 1);
        return found ? Number(found.total) : 0;
      });
    }

    const [dataYear1, dataYear2] = await Promise.all([
      monthlyForYear(year1),
      monthlyForYear(year2),
    ]);

    res.json({
      year1: Number(year1),
      year2: Number(year2),
      monthly: { [year1]: dataYear1, [year2]: dataYear2 },
    });
  } catch (err) {
    next(err);
  }
};
