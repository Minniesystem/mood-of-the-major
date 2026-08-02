# Mood of the Major — Starter Project

โปรเจกต์เริ่มต้นแบบ Full-Stack สำหรับผู้เริ่มต้น ประกอบด้วย

- Frontend: React + Vite + Tailwind CSS
- Backend: Express.js
- ข้อมูลระยะแรก: เก็บในหน่วยความจำของ Server เพื่อให้ทดลองระบบได้ก่อน
- ฐานข้อมูล: MongoDB Atlas สำหรับจัดเก็บข้อมูลแบบถาวร

## 0) ตรวจสอบ Node.js

เปิด Terminal ใน VS Code แล้วพิมพ์

```bash
node -v
npm -v
```

แนะนำให้ Node.js เป็นเวอร์ชัน 20.19 ขึ้นไป หรือ 22.12 ขึ้นไป

## 1) เปิด Backend

เปิด Terminal ช่องที่ 1

```bash
cd backend
npm install
npm run dev
```

ถ้าสำเร็จจะเห็น

```text
Mood API is running at http://localhost:4000
```

ทดสอบใน Browser:

```text
http://localhost:4000/api/health
```

## 2) เปิด Frontend

เปิด Terminal ช่องที่ 2 โดยกดเครื่องหมาย + ใน Terminal

```bash
cd frontend
npm install
npm run dev
```

เปิดลิงก์ที่ Terminal แสดง โดยปกติคือ

```text
http://localhost:5173
```

## 3) ทดลองใช้งาน

1. เลือกคณะ
2. เลือกสาขา
3. เลือกอารมณ์
4. พิมพ์ข้อความหรือเว้นว่าง
5. กดส่งความรู้สึก
6. ดูจำนวนและโพสต์ล่าสุดด้านล่าง

## หมายเหตุสำคัญ

ข้อมูลเวอร์ชันนี้จะหายเมื่อปิด Backend เพราะยังไม่ได้ต่อ MongoDB
จุดประสงค์คือให้เห็นการทำงานของ Frontend และ Backend ก่อน
