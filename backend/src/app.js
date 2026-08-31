const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:8080',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;