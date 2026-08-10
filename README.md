# e-utilities-cost

ระบบควบคุม/ติดตามค่าสาธารณูปโภคของหน่วยงาน/สถานศึกษา (Utility Expense Tracking & Control System)

Stack: Node.js + Express + Sequelize (Backend) / Vue 3 + Vite + Tailwind + Pinia (Frontend) / MariaDB / Docker

## เริ่มต้นใช้งาน (Local Dev ด้วย Docker Compose)

1. คัดลอกไฟล์ env ตัวอย่าง (มีไฟล์ `.env` ให้แล้วสำหรับทดสอบ local เปลี่ยนค่าก่อน deploy จริง):
   ```bash
   cp .env.example .env
   ```
   แก้ค่า `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, รหัสผ่านต่าง ๆ ให้เป็นค่าที่ปลอดภัย

2. รันทุก service:
   ```bash
   docker compose up -d --build
   ```
   - Backend: http://localhost:3000
   - Frontend: http://localhost:8080
   - phpMyAdmin: http://localhost:8081

3. Seed ข้อมูลเริ่มต้น (สร้าง admin user + หมวดหมู่เริ่มต้น) — รันครั้งเดียวหลัง backend container ขึ้นแล้ว:
   ```bash
   docker compose exec backend node src/seed.js
   ```
   ค่าเริ่มต้น: `username: admin`, `password:` ตามค่า `SEED_ADMIN_PASSWORD` ใน `.env` (ค่าเริ่มต้น `admin1234`)

4. เข้าสู่ระบบที่ http://localhost:8080/login

## รันแบบ Dev แยก (ไม่ผ่าน Docker ทั้งหมด)

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev        # ต้องมี MariaDB รันอยู่แล้ว (เช่นผ่าน docker compose up mariadb)
npm run seed        # seed ข้อมูลเริ่มต้น
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Build & Push ขึ้น Docker Hub

```bash
docker login
docker build -t <dockerhub-username>/e-utilities-cost-backend:latest ./backend
docker build -t <dockerhub-username>/e-utilities-cost-frontend:latest ./frontend
docker push <dockerhub-username>/e-utilities-cost-backend:latest
docker push <dockerhub-username>/e-utilities-cost-frontend:latest
```

หรือกำหนด `DOCKERHUB_USERNAME` ใน `.env` แล้วรัน:
```bash
docker compose build
docker compose push
```

## โครงสร้าง API หลัก

| Method | Endpoint | คำอธิบาย |
|---|---|---|
| POST | /api/auth/login | เข้าสู่ระบบ |
| POST | /api/auth/logout | ออกจากระบบ |
| POST | /api/auth/refresh | ขอ access token ใหม่ |
| GET | /api/auth/me | ข้อมูลผู้ใช้ปัจจุบัน |
| GET/POST/PUT/DELETE | /api/expense-categories | จัดการประเภทค่าใช้จ่าย |
| GET/POST/PUT/DELETE | /api/budget-categories | จัดการหมวดเงิน |
| GET/POST/PUT/DELETE | /api/expenses | จัดการรายการค่าใช้จ่าย |
| GET | /api/dashboard/summary?year= | สรุปยอดรายเดือนทั้งปี |
| GET | /api/dashboard/by-category?year= | สรุปแยกตามประเภทค่าใช้จ่าย |
| GET | /api/dashboard/by-budget?year= | สรุปแยกตามหมวดเงิน |
| GET | /api/dashboard/compare?year1=&year2= | เปรียบเทียบปีต่อปี |

## หมายเหตุ

- ทุก endpoint (ยกเว้น login) ต้องแนบ `Authorization: Bearer <accessToken>`
- Refresh token เก็บใน httpOnly cookie, access token เก็บใน memory (Pinia store) ฝั่ง frontend
- ควรเปลี่ยนรหัสผ่าน admin เริ่มต้นทันทีหลัง seed ในสภาพแวดล้อมจริง
- ส่วนขยายในอนาคต (ยังไม่ได้ implement): export PDF/Excel, ระบบแจ้งเตือน threshold, แนบไฟล์ใบเสร็จ, multi-branch, role-based permission ละเอียดขึ้น

## ขึ้น GitHub + ตั้งค่า CI/CD

### 1. สร้าง repo และ push ขึ้น GitHub

```bash
cd e-utilities-cost
git init
git add .
git commit -m "Initial commit: e-utilities-cost project scaffold"
git branch -M main
git remote add origin https://github.com/<your-username>/e-utilities-cost.git
git push -u origin main
```

`.gitignore` กันไฟล์ `.env`, `node_modules/`, `dist/` ไม่ให้ถูก commit ไว้ให้แล้ว — อย่าลืมตรวจสอบก่อน push ว่าไม่มีรหัสผ่านจริงหลุดไปในไฟล์ที่ commit

### 2. ตั้งค่า GitHub Secrets สำหรับ CI/CD

ไปที่ repo บน GitHub → **Settings → Secrets and variables → Actions → New repository secret** แล้วเพิ่ม 2 ตัว:

| Secret name | ค่า |
|---|---|
| `DOCKERHUB_USERNAME` | username จริงของคุณบน Docker Hub |
| `DOCKERHUB_TOKEN` | Access Token จาก Docker Hub (สร้างที่ [hub.docker.com/settings/security](https://hub.docker.com/settings/security) → New Access Token — **ห้ามใช้รหัสผ่านจริงของบัญชี**) |

### 3. Workflow ที่มีให้ (`.github/workflows/ci-cd.yml`)

ทำงานอัตโนมัติเมื่อ push ขึ้น branch `main` (หรือกด "Run workflow" เอง):

1. **backend-checks**: ติดตั้ง dependency + ตรวจ syntax ของ backend
2. **frontend-checks**: ติดตั้ง dependency + build frontend (vite build)
3. **build-and-push**: ถ้าสองงานแรกผ่าน → build image backend/frontend แล้ว push ขึ้น Docker Hub เป็น tag `latest` และ tag ตาม commit SHA

Pull request จะรันแค่ 2 job แรก (checks) ไม่ push image — ป้องกันไม่ให้โค้ดที่ยังไม่ merge ถูกปล่อยขึ้น Docker Hub

### 4. Deploy บนเซิร์ฟเวอร์จริง

หลัง CI push image ขึ้น Docker Hub แล้ว บนเซิร์ฟเวอร์ที่ต้องการ deploy แค่แก้ `DOCKERHUB_USERNAME` ใน `.env` ให้ตรงกับ Docker Hub username แล้วรัน:

```bash
docker compose pull
docker compose up -d
```

ก็จะดึง image ล่าสุดจาก Docker Hub มารันโดยไม่ต้อง build เอง

