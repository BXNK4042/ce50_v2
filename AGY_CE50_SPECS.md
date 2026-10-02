# AGY Memory & Specifications for WE ARE CE (CE50)
> Extracted from Antigravity (agy) session brain & transcripts (`C:\Users\leoev\.gemini\antigravity-cli\brain`)
> Repository Reference: `C:\Users\leoev\ce50` (Next.js + FastAPI + SQLite)
> Target Reference: `C:\Users\leoev\ce50_v2`

---

## 1. Executive Summary
โปรเจกต์ `ce50` เป็นเว็บไซต์ประชาสัมพันธ์และสารสนเทศสาขาวิศวกรรมคอมพิวเตอร์ สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง วิทยาเขตชุมพรเขตรอุดมศักดิ์ (KMITL PCC)
พัฒนาผ่าน **Antigravity (agy)** รวมทั้งสิ้น 33 เซสชันหลัก ครอบคลุมตั้งแต่การออกแบบ Navbar, Hero Video, การ์ดอาจารย์พร้อม Easter Eggs, หน้าผลงานโครงงาน, ตารางเรียน/สอบ, ข้อมูลนักศึกษา CE04, และระบบฝึกงาน

---

## 2. Global Conventions & Standards

### 2.1 Typography & Fonts
- **Font Family**: Google Font `Geist` (Sans-serif) และ `Geist_Mono` (Monospace), fallback: `Arial, Helvetica, sans-serif`
- **Default Theme**: Dark Mode (`class="dark"` บน `<html>`)
- **Theme Colors**:
  - Dark Mode Background: `#000000` (ดำสนิท)
  - Light Mode Background: `#ffffff` / Soft White
  - Primary Brand Blue: `#4483cc` / `#4480cd`
  - Secondary Light Blue: `#cad9f0`
  - Accent Orange (Athasart Dark): `#e55300`
  - Accent Orange (Athasart Light): `#f5945c`

### 2.2 Navigation Bar (Navbar)
- Sticky fixed top: `fixed-top z-50 bg-black/95 backdrop-blur-sm`
- โลโก้และข้อความกึ่งกลาง: โลโก้ `ce_logo.webp` วางข้างคำว่า `COM EN` และ `WE ARE CE`
- ปุ่มฝั่งขวา: Language Toggle (TH/EN) พร้อมแอนิเมชันเลื่อนแบบเจลลี่สมูท และ Theme Toggle (ดวงอาทิตย์ / พระจันทร์)
- ไม่เด้งกลับไปหน้าแรก และไม่ scroll ขึ้นบนสุดเวลาเปลี่ยนภาษา
- เมนู Dropdown "People / บุคลากร":
  - `Teachers` (คณาจารย์)
  - `CE04` (นักศึกษาชั้นปีที่ 3)
  - `CE05` (นักศึกษาชั้นปีที่ 2)
  - `CE06` (นักศึกษาชั้นปีที่ 1)

### 2.3 Footer
- ระยะห่างแถบข้อความลิ้งก์ด่วน 5px - 15px
- ข้อความลิขสิทธิ์: `© 2026 COMPUTER ENGINEERING KMITL PCC. ALL RIGHTS RESERVED.`
- ที่อยู่ทางการ: `สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง วิทยาเขตชุมพรเขตรอุดมศักดิ์ 17/1 หมู่ 6 ตำบลชุมโค อำเภอปะทิว จังหวัดชุมพร 86160`
- ลิงก์โซเชียลมีเดีย:
  - เว็บไซต์มหาลัย: `https://www.kmitl-chumphon.kmitl.ac.th/`
  - อีเมล: `kmitl-chumphon@kmitl.ac.th`
  - Facebook: `https://www.facebook.com/KMITLPrinceofChumphon#`
  - YouTube: `https://www.youtube.com/channel/UCVAF-WEWNY_UzrHlNZL5jog`
  - LINE: `https://line.me/R/ti/p/%40134lrlhe`

---

## 3. Page Specifications & Design Specs

### 3.1 Home Page (`/`)
1. **Hero Video Section**:
   - วิดีโอพื้นหลัง: `ce_hero_footage.mp4` / `Footage_CE04_remake.mp4` ความโปร่งใส 50%
   - ไม่กระพริบ และเล่นวนลูปต่อเนื่องเวลาสลับภาษา
   - โลโก้ `CE.webp` และข้อความ `WE ARE CE` ทับกึ่งกลาง มีเงาตัดบางๆ
2. **News Section**:
   - พื้นหลัง `#cad9f0` ในโหมดสว่าง, สีน้ำเงินเข้มในโหมดมืด
   - ข่าว 3 บล็อก (1 ข่าวใหญ่ฝั่งซ้าย + 2 ข่าวเล็กฝั่งขวา) ข้อความลอยตัวซ้ายล่างพร้อมเงา
3. **People Carousel Section**:
   - กล่องแนวตั้ง 5 กล่อง เลื่อนจากขวาไปซ้ายอย่างช้าๆ แบบ Infinite Carousel
   - ภาพเต็มกรอบพร้อมเอฟเฟกต์ Vignette ขอบตัด (Cutout Corners)

---

### 3.2 Teachers Page (`/people/teachers`)
- **Header**: `COMPUTER ENGINEERING FACULTY 2026` สี `#4483cc` พร้อมขีดเส้นใต้แนวนอน
- **Grid Layout**: แถวละ 3 คน กรอบสี่เหลี่ยมขอบตัด ยึดระยะห่างขอบเท่าหน้า Home
- **Teacher Cards & Easter Eggs**:
  1. **อาจารย์อรรถศาสตร์ นาคเทวัญ (Athasart)**:
     - ภาพพื้นฐาน: `athasart.webp` (Arthas) กลับภาพชิดขวา
     - พื้นหลัง: สีส้ม `#e55300` (ธีมดำ) / `#f5945c` (ธีมขาว)
     - เมื่อชี้เมาส์: พื้นหลังสลับเป็นสีส้ม
     - เมื่อคลิกการ์ด: ขยายกลางจอ หมุน 3 รอบ ตาเรืองแสงสีแดง (`shadow-[0_0_12px_6px_#ff0000]`) พร้อมข้อความ *"ประธานสาขาวิศวกรรมคอมพิวเตอร์"*
  2. **ดร.รัตติกร สมบัติแก้ว (Rattikorn)**:
     - เมื่อชี้เมาส์: ไม่เปลี่ยนรูป
     - เมื่อคลิกการ์ด: เปิด Modal การ์ดเกมหมุน 3D สุ่มหน้า 50/50:
       - หน้า 1 (Legendary): กรอบสีเหลืองทอง `border-amber-400`, ชื่อ *"อาจารย์rattikorn"* สีทอง `#fbbf24`, สเตตัส ATK 999 / DEF 999
       - หน้า 2 (Secret God Mode): กรอบสีม่วง `border-purple-500`, ภาพ `rattikorn-alt.webp`, ชื่อ *"ป้าจุ๋ม"* สีม่วง `#9663d1`, สเตตัส DAMAGE MAX / CHARM 100%
  3. **อาจารย์นภัสรพี สิทธิวัจน์ (Pisakorn)**:
     - เมื่อชี้เมาส์: เลือนเปลี่ยนภาพเป็น `pisakorn-alt.webp`
  4. **ว่าที่ร้อยตรี ศิลา ศิริมาสกุล (Silar)**:
     - เมื่อชี้เมาส์: เลือนเปลี่ยนภาพเป็น `silar-alt.webp`
  5. **อาจารย์สกาวกาญจน์ ปิยะวิทย์วนิช (Sakawkarn)**:
     - เมื่อชี้เมาส์: เลือนเปลี่ยนภาพเป็น `sakawkarn-alt.webp` (สเกล 1.07, ขยับ -8%)
  6. **นายจตุรงค์ เกตุนิมิต (Jaturong)**:
     - ตำแหน่งปกติ: *"นักวิชาการคอมพิวเตอร์"*
     - เมื่อชี้เมาส์: สลับพื้นหลังเป็นป้ายร้าน `niyomcha.webp`, ป้ายเปลี่ยนเป็น *"ผู้บริหารร้าน 'นิยมชา'"*, ซ่อนชั้นปีที่ดูแลและช่องทางติดต่อ

---

### 3.3 Student Cohort Page (`/people/students/CE04`)
- **Hero Banner**: ภาพพื้นหลัง `CE_04.webp` ปรับจุดโฟกัส เลือนหาย 30-50%
- **Heading**: `THIRD YEAR` และ `JUNIOR` สีฟ้า
- **Grid Layout**: แถวละ 5 การ์ด แสดงรูปเต็มการ์ด ชื่อ, รหัสประจำตัว (ID), ตำแหน่ง
- **Student Profile Modal**:
  - เมื่อคลิกการ์ดนักศึกษา เปิด Modal รายละเอียด
  - เบอร์โทรศัพท์ (Tel) และ Instagram (IG) แยกออกจากกันชัดเจนและกดเปิดได้จริง

---

### 3.4 Projects & Awards Page (`/projects` / `/works`)
- **Heading**: `โปรเจกต์/ผลงาน` / `Projects/Awards` กึ่งกลางหน้า
- **Grid Layout**: แถวละ 3 กล่องสี่เหลี่ยมผืนผ้าแนวนอน ขอบตัด ภาพเต็มกรอบ ข้อความลอยตัวพร้อมเงา
- **Detail View**: ซ่อน Header และ Footer ชั่วคราวเมื่อเปิดดูรายละเอียดผลงาน

---

### 3.5 Internship Page (`/internship`)
- **Heading**: `CE INTERNSHIP` / `การฝึกงานของนักศึกษาCE` สี `#4483cc` ขีดเส้นใต้ครึ่งหนึ่งของหัวข้อ
- **Grid Layout**: แถวละ 4 การ์ด แสดงชื่อบริษัทและตำแหน่งงาน
- **Detail View (`/internship/[id]`)**:
  - ฝั่งซ้าย 70%: ชื่อบริษัท, โลโก้ CE, รายละเอียดงาน, และระบบให้คะแนนดาวสีทอง 5 ดวงในส่วนคำแนะนำจากรุ่นพี่
  - ฝั่งขวา 30%: ตำแหน่งงาน, เบี้ยเลี้ยง และสวัสดิการ
  - โทนสี: น้ำเงิน, ดำ, เทา

---

### 3.6 Schedule Page (`/schedule`)
- **Class Timetable (`?type=class`)**: ตารางเรียนรายสัปดาห์ 7 วัน 9:00 - 17:00 น. รวมบล็อกวิชาเดียวกัน
- **Exam Timetable (`?type=exam`)**: นับเวลาถอยหลังสู่วันสอบที่ใกล้ที่สุด, ตารางสอบ Midterm / Finals พร้อมฟิลเตอร์

---

## 4. Backend & Database Specs

### 4.1 FastAPI Server & Dynamic Port
- ไฟล์หลัก: `server/main.py`
- ตรวจจับพอร์ตว่างอัตโนมัติ (8000 -> 8001 -> 8002...) และบันทึกพอร์ตลง `.backend_port`
- Endpoint Health Check: `GET /health` ส่งคืน `{"status": "ok", "app": "ce50"}`

### 4.2 SQLite Database Tables
- `teachers`: รายชื่ออาจารย์, รูปภาพ, ปีที่ปรึกษา, อีเมลทางการ (`@kmitl.ac.th`, `jaturong.k@ce.ac.th`)
- `students`: นักศึกษารุ่น CE04 (รหัส 67xxxxxx), เบอร์โทร, IG, ตำแหน่ง
- `companys`: สถานประกอบการฝึกงาน (SCG, Armstrong, Secure-D)
- `internships`: รายละเอียดการฝึกงาน, ตำแหน่ง, คะแนนรีวิว, เบี้ยเลี้ยง
- `class_schedules`: ตารางเรียน วัน เวลา ห้องเรียน
- `exam_schedules`: ตารางสอบ Midterm / Final วัน เวลา ห้องสอบ
- `news_item`: ข่าวสารประชาสัมพันธ์ภายในและภายนอก
- `projects`: ผลงานและโปรเจกต์นักศึกษา
