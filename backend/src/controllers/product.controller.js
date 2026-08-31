const { Product } = require('../models');

exports.list = async (req, res, next) => {
  try {
    // ผู้ใช้ทั่วไปเห็นแค่สินค้าที่เปิดขาย, admin เห็นทั้งหมด
    const where = req.user?.role === 'admin' ? {} : { is_active: true };
    const items = await Product.findAll({ where, order: [['id', 'DESC']] });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const item = await Product.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'ไม่พบสินค้า' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, description, price, stock, image_path, is_active } = req.body;
    if (!name || price == null) {
      return res.status(400).json({ message: 'กรุณากรอกชื่อสินค้าและราคา' });
    }
    if (Number(price) < 0) {
      return res.status(400).json({ message: 'ราคาต้องไม่ติดลบ' });
    }
    const item = await Product.create({
      name,
      description,
      price,
      stock: stock ?? 0,
      image_path,
      is_active: is_active ?? true,
      created_by: req.user.id,
    });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Product.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'ไม่พบสินค้า' });
    if (req.body.price != null && Number(req.body.price) < 0) {
      return res.status(400).json({ message: 'ราคาต้องไม่ติดลบ' });
    }
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Product.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'ไม่พบสินค้า' });
    await item.destroy();
    res.json({ message: 'ลบสินค้าสำเร็จ' });
  } catch (err) {
    next(err);
  }
};

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'กรุณาเลือกไฟล์รูปภาพ' });
    }
    res.json({ path: `/uploads/${req.file.filename}` });
  } catch (err) {
    next(err);
  }
};