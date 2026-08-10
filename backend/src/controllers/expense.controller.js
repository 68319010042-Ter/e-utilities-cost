const { Op } = require('sequelize');
const { Expense, ExpenseCategory, BudgetCategory } = require('../models');

const includeRelations = [
  { model: ExpenseCategory, as: 'expenseCategory' },
  { model: BudgetCategory, as: 'budgetCategory' },
];

exports.list = async (req, res, next) => {
  try {
    const { month, year, expense_category_id, budget_category_id, page = 1, limit = 20 } = req.query;
    const where = {};

    if (year && month) {
      const start = `${year}-${String(month).padStart(2, '0')}-01`;
      const end = `${year}-${String(month).padStart(2, '0')}-31`;
      where.billing_month = { [Op.between]: [start, end] };
    } else if (year) {
      where.billing_month = { [Op.between]: [`${year}-01-01`, `${year}-12-31`] };
    }

    if (expense_category_id) where.expense_category_id = expense_category_id;
    if (budget_category_id) where.budget_category_id = budget_category_id;

    const offset = (Number(page) - 1) * Number(limit);

    const { rows, count } = await Expense.findAndCountAll({
      where,
      include: includeRelations,
      order: [['billing_month', 'DESC']],
      limit: Number(limit),
      offset,
    });

    res.json({ data: rows, total: count, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await Expense.findByPk(req.params.id, { include: includeRelations });
    if (!item) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const {
      expense_category_id,
      budget_category_id,
      amount,
      billing_month,
      paid_date,
      invoice_no,
      note,
      attachment_path,
    } = req.body;

    if (!expense_category_id || !budget_category_id || !amount || !billing_month) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    const item = await Expense.create({
      expense_category_id,
      budget_category_id,
      amount,
      billing_month,
      paid_date,
      invoice_no,
      note,
      attachment_path,
      created_by: req.user?.id,
    });

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Expense.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Expense.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    await item.destroy();
    res.json({ message: 'ลบสำเร็จ' });
  } catch (err) {
    next(err);
  }
};
