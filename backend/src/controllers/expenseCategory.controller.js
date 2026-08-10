const { ExpenseCategory } = require('../models');

exports.list = async (req, res, next) => {
  try {
    const items = await ExpenseCategory.findAll({ order: [['id', 'ASC']] });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, code, unit } = req.body;
    if (!name || !code) {
      return res.status(400).json({ message: 'กรุณากรอกชื่อและรหัส' });
    }
    const item = await ExpenseCategory.create({ name, code, unit });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await ExpenseCategory.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await ExpenseCategory.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    await item.destroy();
    res.json({ message: 'ลบสำเร็จ' });
  } catch (err) {
    next(err);
  }
};
