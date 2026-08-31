const sequelize = require('../config/db');
const User = require('./user.model');
const Product = require('./product.model');
const Order = require('./order.model');
const OrderItem = require('./orderItem.model'); // also sets up associations

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  OrderItem,
};