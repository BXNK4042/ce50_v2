# คู่มือการส่งต่องานระบบหลังบ้าน (Admin CRUD Handover for Leo)

> **สำหรับ:** Leo (Frontend Developer)  
> **จาก:** Fah (Backend & Database Developer)  
> **Git Branch:** `fah-dev`  
> **สถานะ:** ระบบ Backend REST API และโครงสร้างหน้า Admin CRUD เชื่อมต่อฐานข้อมูลใช้งานได้จริง 100% เรียบร้อยแล้ว (No decoration, just working)

---

## 1. ตำแหน่งไฟล์ที่เกี่ยวข้อง (Files to Style & Decorate)

- **หน้าเข้าสู่ระบบ (Admin Login):** `frontend/app/admin/login/page.tsx`
- **หน้าแดชบอร์ดจัดการข้อมูล (Admin Dashboard):** `frontend/app/admin/page.tsx`
- **ลิงก์เข้าแอดมินที่ Footer:** `frontend/app/layout.tsx` (ปุ่ม `Admin Portal` ข้างข้อความลิขสิทธิ์)

---

## 2. ข้อมูลบัญชีสำหรับเข้าทดสอบ (Test Credentials)

- **Username:** `adminFah`
- **Password:** `admince04`
- **Role:** `superadmin` (สิทธิ์เต็ม จัดการเพิ่ม/แก้ไข/ลบ ได้ทุกตาราง)

---

## 3. สิ่งที่สามารถปรับแต่งหรือตกแต่งได้เต็มที่ (Allowed to Customize)

- ปรับแต่ง Class Tailwind CSS / Bootstrap 5
- ปรับแต่งสีปุ่ม, ไอคอน, สไตล์ตาราง (Data Tables), การ์ด, และหน้าต่าง Modal ฟอร์ม
- จัดวาง Layout และความสวยงาม Responsive ให้เข้ากับธีมหลักของเว็บไซต์
- เพิ่ม Animation หรือลูกเล่นการแสดงผลได้ตามต้องการ

---

## 4. ข้อควรระวัง - จุดที่ห้ามเปลี่ยน (Contract & Logic Integrity)

1. **URL และ HTTP Methods ของ API:**
   - อย่าเปลี่ยน URL ที่ยิงไปยัง Backend `http://localhost:8000/...` เช่น:
     - ยืนยันตัวตน: `POST /auth/login`
     - อัปโหลดไฟล์ภาพ: `POST /upload` (ส่ง `file` และ `module`)
     - จัดการข้อมูล: `GET`, `POST`, `PUT`, `DELETE` สำหรับ `/teachers`, `/students`, `/news`, `/projects`, `/companys`, `/internship`, `/class`, `/exam`, `/rooms`
2. **ชื่อฟิลด์ข้อมูลใน `formData`:**
   - ต้องคงชื่อคีย์ของฟิลด์ตามโครงสร้างเดิมไว้ (เช่น `teacher_firstname`, `student_email`, `news_title` ฯลฯ) เพื่อให้บันทึกคำสั่ง SQL ลงฐานข้อมูล `ce50.db` ได้ถูกต้อง
3. **การตรวจสอบสิทธิ์ใน `localStorage`:**
   - อย่าลบตัวแปร `ce50_admin_token` และ `ce50_admin_user` เพราะใช้สำหรับ Route Guard ตรวจสอบสถานะการเข้าสู่ระบบ
4. **ระบบอัปโหลดรูปภาพ (`/upload`):**
   - รองรับเฉพาะนามสกุล `.jpg`, `.jpeg`, `.png`, `.webp` และขนาดไฟล์ไม่เกิน 5MB ตามเกณฑ์ทดสอบ `TC_TCH_003` และ `TC_TCH_004`
