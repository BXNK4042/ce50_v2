# คู่มือการส่งต่องานระบบประเมินสายอาชีพ (BCS Tech Career Quiz Handover for Leo)

> **สำหรับ:** Leo (Frontend Developer & UI Designer)  
> **จาก:** Fah (Backend & Database Developer)  
> **Git Branch:** `fah-dev`  
> **สถานะปัจจุบัน:** ระบบ Scoring Engine, API คำนวณคะแนน Tie-breaker, และหน้าเว็บแบบทดสอบ 30 ข้อ ทำงานได้จริง 100% (No decoration, fully functional) พร้อมให้ Leo นำไปปรับธีม ดีไซน์ และใส่ลูกเล่น UI/UX ได้เต็มที่

---

## 1. ตำแหน่งไฟล์ที่เกี่ยวข้อง (Files to Style & Decorate)

- **หน้าทำแบบทดสอบและแสดงผลลัพธ์:** `frontend/app/quiz/page.tsx`
- **ลิงก์บน Navigation Bar & Footer:** `frontend/app/layout.tsx` (เมนู `Career Quiz`)
- **API ข้อมูลฝั่ง Backend (อ้างอิง):** `backend/quiz_data.py` และ `backend/main.py`

---

## 2. โครงสร้างการทำงานของระบบ (How It Works)

ระบบอ้างอิงคำถามและ 20 สายอาชีพจากมาตรฐาน **BCS (British Computer Society) Tech Career Framework**:
1. หน้าเว็บจะยิงดึงคำถาม 30 ข้อจาก `GET http://localhost:8000/quiz/questions`
2. ผู้ใช้ตอบคำถามข้อ 1-29 แบบตัวเลือกเดียว (Single Choice) และข้อ 30 แบบเลือกได้หลายข้อ (Multiple Choice: Interests)
3. มีปุ่ม **"⚡ ทดสอบสุ่มคำตอบอัตโนมัติ (Demo Fill)"** ให้ Leo หรืออาจารย์ใช้กดเทสเพื่อข้ามไปดูหน้าแสดงผลลัพธ์ได้ทันทีโดยไม่ต้องคลิกเอง 30 ข้อ
4. เมื่อกดส่ง จะยิงไปที่ `POST http://localhost:8000/quiz/evaluate` และระบบจะคำนวณคืนค่า Top 3 อาชีพที่เหมาะสมที่สุด พร้อมคะแนนของทั้ง 20 อาชีพ

---

## 3. สิ่งที่ Leo สามารถปรับแต่งและตกแต่งได้เต็มที่ (Allowed to Customize)

### 3.1 หน้าจอทำแบบทดสอบ (Quiz Flow UI)
- **สไตล์การ์ดคำถาม & ตัวเลือก:** ปรับขนาดฟอนต์, สีพื้นหลัง, ขอบเรืองแสง (Glow), Hover effects, หรือลูกเล่น Glassmorphism
- **Animations & Transitions:** เพิ่ม Framer Motion หรือ CSS Transition เวลาผู้ใช้กด "ถัดไป / ย้อนกลับ" เพื่อให้การเปลี่ยนข้อดูลื่นไหล
- **Progress Bar & Quick Jump Navigator:** ตกแต่งแถบความคืบหน้า และปุ่มตัวเลข 1-30 ให้เข้ากับธีมเว็บไซต์ CE50
- **คำถามข้อ 30 (Interests):** จัดแต่ง Checkbox Chips หรือ Grid การเลือกความสนใจให้อ่านง่ายและสวยงาม
- **ปุ่ม Demo Fill:** สามารถเปลี่ยนสไตล์ปุ่ม ย้ายตำแหน่ง หรือซ่อน/แสดงได้ตามความเหมาะสม

### 3.2 หน้าจอแสดงผลลัพธ์ (Results View)
- **การ์ด Top 3 อาชีพ:**
  - ตกแต่งให้เด่นเป็นพิเศษ เช่น สไตล์แท่นรับรางวัล (Podium 1st 🥇, 2nd 🥈, 3rd 🥉) หรือสไตล์ Character Card
  - ใส่ภาพประกอบ/Avatar/3D Icon ของแต่ละบทบาทอาชีพ (เช่น ภาพ Software Developer, AI Engineer, Cyber Specialist)
- **Data Visualization & ชาร์ตคะแนน:**
  - สามารถเปลี่ยนแถบ Progress Bar ธรรมดาเป็น **Radar Chart (แมงมุม)** หรือ Bar Chart สวยๆ เพื่อเทียบความถนัดในแต่ละหมวดหมู่
- **ตารางคะแนน All 20 Roles:**
  - ปรับแต่งการแสดงผลคะแนนของทั้ง 20 อาชีพให้มี Filter หรือจัดเรียงได้ตามต้องการ
- **หน้าสำหรับพิมพ์หรือส่งออก (Print / PDF View):**
  - ปรับ CSS `@media print` ให้เมื่อกดปุ่ม "พิมพ์หรือบันทึกผล" แล้วจะได้เอกสาร A4 ที่จัดหน้าสวยงามเพื่อให้นักศึกษานำไปแนบ Portfolio ได้

---

## 4. โครงสร้างข้อมูลที่ Backend ส่งให้ (Data Contract)

เมื่อยิง `POST http://localhost:8000/quiz/evaluate` จะได้รับ JSON ที่มีข้อมูลครบถ้วนดังนี้:

```typescript
interface RoleResult {
  rank: number;                  // อันดับ (1, 2, 3...)
  role_id: number;               // รหัสอาชีพมาตรฐาน BCS (เช่น 23079)
  title: string;                 // ชื่ออาชีพภาษาอังกฤษ (เช่น "Software Developer")
  title_th: string;              // ชื่ออาชีพภาษาไทย (เช่น "นักพัฒนาซอฟต์แวร์และโปรแกรมเมอร์")
  category: string;              // หมวดหมู่อาชีพ (เช่น "Software Engineering & Architecture")
  icon: string;                  // คลาสไอคอน Bootstrap Icons (เช่น "bi-laptop")
  badge_color: string;           // สี Badge แนะนำ (เช่น "bg-primary")
  score: number;                 // คะแนนที่ได้จากการตอบ
  max_score: number;             // คะแนนเต็มที่เป็นไปได้ของบทบาทนี้
  match_percentage: number;      // ร้อยละความสอดคล้อง (เช่น 85%)
  relative_percentage: number;   // ร้อยละเมื่อเทียบกับอันดับ 1
  skills_abilities_score: number;// คะแนนในหมวด Skills + Abilities (ใช้ตัดสิน Tie-breaker)
  summary: string;               // คำโปรยสรุปหน้าที่สั้นๆ
  description: string;           // คำอธิบายลักษณะงานเชิงลึก
  key_skills: string[];          // รายการทักษะจำเป็น (Core Competencies)
  matching_ce_courses: string[]; // รายวิชาภาควิชาวิศวกรรมคอมพิวเตอร์ KMITL ที่แนะนำ
  career_prospects: string;      // เส้นทางการเติบโตในสายงาน (Junior -> Senior -> Lead)
}
```

---

## 5. ข้อควรระวัง - จุดที่ห้ามเปลี่ยน (Contract & Logic Integrity)

1. **API Endpoints:**
   - ห้ามเปลี่ยน URL: `http://localhost:8000/quiz/questions` และ `http://localhost:8000/quiz/evaluate`
2. **รูปแบบการส่ง Payload ใน `POST /quiz/evaluate`:**
   - ต้องส่งในรูปแบบ `{ answers: { [questionId: string]: number | number[] } }`
   - ตัวเลข Question ID ต้องตรงกับคำถาม (1 ถึง 30)
   - ข้อ 1-29 ส่งค่าเป็นตัวเลข Index ของตัวเลือก (เช่น `0, 1, 2`)
   - ข้อ 30 ส่งค่าเป็น Array ของตัวเลข Index ที่เลือก (เช่น `[0, 3, 5]`)
3. **การทำงานของฟังก์ชัน Scoring:**
   - การประมวลผลคะแนนและเกณฑ์ Tie-Breaker อยู่ที่ Backend ทั้งหมด Leo ไม่ต้องเขียนสูตรคำนวณเองที่หน้าบ้าน นำค่าจาก Response ไปแสดงผลได้เลย
