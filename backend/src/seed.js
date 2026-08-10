const bcrypt = require('bcrypt');
const { sequelize, User, ExpenseCategory, BudgetCategory } = require('./models');
require('dotenv').config();

const expenseCategories = [
  { name: 'ค่าไฟฟ้า', code: 'ELEC' },
  { name: 'ค่าพลังงาน', code: 'ENERGY' },
  { name: 'ค่าน้ำประปา', code: 'WATER' },
  { name: 'ค่าอินเตอร์เน็ต', code: 'INTERNET' },
  { name: 'ค่าโทรศัพท์', code: 'PHONE' },
  { name: 'ค่าไปรษณีย์', code: 'POST' },
  { name: 'ค่าทิ้งขยะ', code: 'WASTE' },
];

const budgetCategories = [
  { name: 'งบประมาณ (ปวช.)', code: 'BUDGET_PVC' },
  { name: 'งบประมาณ (ปวส.)', code: 'BUDGET_PVS' },
  { name: 'เงินรายได้สถานศึกษา', code: 'INCOME_SCHOOL' },
];

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    for (const item of expenseCategories) {
      await ExpenseCategory.findOrCreate({ where: { code: item.code }, defaults: item });
    }
    console.log('Seed expense_categories สำเร็จ');

    for (const item of budgetCategories) {
      await BudgetCategory.findOrCreate({ where: { code: item.code }, defaults: item });
    }
    console.log('Seed budget_categories สำเร็จ');

    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin1234';
    const hashed = await bcrypt.hash(adminPassword, 10);
    const [admin, created] = await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        username: 'admin',
        password: hashed,
        full_name: 'ผู้ดูแลระบบ',
        role: 'admin',
      },
    });

    if (created) {
      console.log(`สร้างผู้ใช้ admin สำเร็จ (username: admin, password: ${adminPassword})`);
    } else {
      console.log('มีผู้ใช้ admin อยู่แล้ว');
    }

    process.exit(0);
  } catch (err) {
    console.error('Seed ล้มเหลว:', err);
    process.exit(1);
  }
}

seed();
