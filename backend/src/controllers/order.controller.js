const { sequelize, Order, OrderItem, Product } = require('../models');

// สร้างคำสั่งซื้อจากตะกร้า (ใช้ transaction กันสต็อกไม่ตรง)
exports.create = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { items, note } = req.body; // items = [{ product_id, quantity }]

    if (!Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: 'ตะกร้าว่างเปล่า' });
    }

    let totalAmount = 0;
    const orderItemsData = [];

    for (const line of items) {
      const product = await Product.findByPk(line.product_id, { transaction: t, lock: t.LOCK.UPDATE });
      if (!product || !product.is_active) {
        await t.rollback();
        return res.status(400).json({ message: `ไม่พบสินค้า id ${line.product_id}` });
      }
      if (line.quantity <= 0) {
        await t.rollback();
        return res.status(400).json({ message: 'จำนวนสินค้าต้องมากกว่า 0' });
      }
      if (product.stock < line.quantity) {
        await t.rollback();
        return res.status(400).json({ message: `สินค้า "${product.name}" มีไม่พอในสต็อก` });
      }

      totalAmount += Number(product.price) * line.quantity;
      orderItemsData.push({
        product_id: product.id,
        quantity: line.quantity,
        unit_price: product.price,
      });

      product.stock -= line.quantity;
      await product.save({ transaction: t });
    }

    const order = await Order.create(
      { user_id: req.user.id, total_amount: totalAmount, note, status: 'pending' },
      { transaction: t }
    );

    for (const data of orderItemsData) {
      await OrderItem.create({ ...data, order_id: order.id }, { transaction: t });
    }

    await t.commit();

    const fullOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
    });
    res.status(201).json(fullOrder);
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

// ผู้ใช้ดูคำสั่งซื้อของตัวเอง / admin ดูทั้งหมด
exports.list = async (req, res, next) => {
  try {
    const where = req.user.role === 'admin' ? {} : { user_id: req.user.id };
    const orders = await Order.findAll({
      where,
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
      order: [['id', 'DESC']],
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
    });
    if (!order) return res.status(404).json({ message: 'ไม่พบคำสั่งซื้อ' });
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึงคำสั่งซื้อนี้' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// admin เปลี่ยนสถานะคำสั่งซื้อ
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const valid = ['pending', 'paid', 'shipped', 'completed', 'cancelled'];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: 'สถานะไม่ถูกต้อง' });
    }
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'ไม่พบคำสั่งซื้อ' });
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
};