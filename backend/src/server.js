const app = require('./app');
const { sequelize } = require('./models');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('เชื่อมต่อฐานข้อมูลสำเร็จ');

    // sync (ใน production ควรใช้ migration แทน)
    await sequelize.sync();
    console.log('Sync โมเดลกับฐานข้อมูลสำเร็จ');

    app.listen(PORT, () => {
      console.log(`Server กำลังทำงานที่ port ${PORT}`);
    });
  } catch (err) {
    console.error('ไม่สามารถเริ่มเซิร์ฟเวอร์ได้:', err);
    process.exit(1);
  }
}

start();
