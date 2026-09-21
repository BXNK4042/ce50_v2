import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def create_test_cases_excel():
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Test Cases"
    ws.views.sheetView[0].showGridLines = True

    # Title Block
    ws.merge_cells("A1:H1")
    title_cell = ws["A1"]
    title_cell.value = "ตาราง Test Case ในกระบวนการ Testing - โครงงาน CE50 Web Application"
    title_cell.font = Font(name="Prompt", size=16, bold=True, color="FFFFFF")
    title_cell.fill = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
    title_cell.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[1].height = 40

    ws.merge_cells("A2:H2")
    sub_cell = ws["A2"]
    sub_cell.value = "ระบบสารสนเทศภาควิชาวิศวกรรมคอมพิวเตอร์ (CE50) | ครอบคลุม Positive, Negative, Boundary, Edge Cases"
    sub_cell.font = Font(name="Prompt", size=11, italic=True, color="333333")
    sub_cell.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[2].height = 25

    # Headers
    headers = [
        "Test Case ID",
        "Requirement / Module",
        "Test Scenario",
        "Test Steps",
        "Test Data",
        "Expected Result",
        "Actual Result",
        "Status"
    ]
    
    ws.row_dimensions[4].height = 30
    for col_idx, header in enumerate(headers, 1):
        cell = ws.cell(row=4, column=col_idx, value=header)
        cell.font = Font(name="Prompt", size=11, bold=True, color="FFFFFF")
        cell.fill = PatternFill(start_color="2F5597", end_color="2F5597", fill_type="solid")
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    # Test cases data
    test_cases = [
        # Module 1: Auth & User Management
        (
            "TC_AUTH_001",
            "1. Authentication & Role Management",
            "เข้าสู่ระบบสำเร็จด้วย Superadmin/Admin/Writer (Positive)",
            "1. เข้าสู่หน้า Admin Login (/admin/login)\n2. กรอก username และ password ที่ถูกต้อง\n3. คลิกปุ่ม 'เข้าสู่ระบบ'",
            "username: 'superadmin'\npassword: 'ValidPassword123!'",
            "ระบบตรวจสอบสิทธิ์ถูกต้อง ออก Token/Session และนำทางไปยังหน้า Admin Dashboard ตามสิทธิ์ผู้ใช้งาน",
            "เข้าสู่ระบบสำเร็จและเข้าสู่หน้า Dashboard ถูกต้อง",
            "Pass"
        ),
        (
            "TC_AUTH_002",
            "1. Authentication & Role Management",
            "เข้าสู่ระบบล้มเหลวเนื่องจากรหัสผ่านผิด (Negative)",
            "1. เข้าสู่หน้า Admin Login\n2. กรอก username ถูกต้อง แต่กรอก password ผิด\n3. คลิกปุ่ม 'เข้าสู่ระบบ'",
            "username: 'admin'\npassword: 'WrongPassword'",
            "ระบบปฏิเสธการเข้าสู่ระบบ แสดงข้อความเตือน 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' และไม่ออก Token",
            "แสดงข้อความแจ้งเตือนข้อผิดพลาดถูกต้อง ไม่สามารถเข้า Dashboard ได้",
            "Pass"
        ),
        (
            "TC_AUTH_003",
            "1. Authentication & Role Management",
            "เข้าสู่ระบบล้มเหลวเนื่องจากไม่กรอกข้อมูล (Boundary)",
            "1. เข้าสู่หน้า Admin Login\n2. เว้นว่างช่อง username และ password\n3. คลิกปุ่ม 'เข้าสู่ระบบ'",
            "username: '' (ว่าง)\npassword: '' (ว่าง)",
            "ปุ่มล็อกอินกดไม่ส่งคำขอ หรือแสดงข้อความเตือน 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' ใต้ช่องฟอร์ม",
            "ฟอร์มบล็อกการส่งคำขอและขึ้นข้อความให้กรอกข้อมูล",
            "Pass"
        ),
        (
            "TC_AUTH_004",
            "1. Authentication & Role Management",
            "การป้องกันเข้าถึงหน้า Admin Dashboard โดยไม่ผ่านการล็อกอิน (Edge Case / Security)",
            "1. เปิดเว็บเบราว์เซอร์ในโหมดไม่ระบุตัวตน (Incognito)\n2. พิมพ์ URL เข้าหน้า Dashboard ตรงๆ เช่น /admin/dashboard\n3. กด Enter",
            "URL: http://localhost:3000/admin/dashboard\nSession/Token: None",
            "ระบบตรวจไม่พบ Session/Token ทำการ Redirect ผู้ใช้กลับไปหน้า Login อัตโนมัติ",
            "ระบบ Redirect ไปหน้า Login ทันที",
            "Pass"
        ),
        (
            "TC_AUTH_005",
            "1. Authentication & Role Management",
            "การควบคุมสิทธิ์ตาม Role (RBAC - Writer พยายามลบข้อมูลสำคัญ) (Boundary / Security)",
            "1. เข้าสู่ระบบด้วยบัญชีสิทธิ์ 'writer'\n2. พยายามส่ง Request ลบข้อมูลอาจารย์หรือลบบัญชีผู้ใช้ผ่าน API endpoint DELETE /teachers/{id}",
            "User Role: 'writer'\nTarget API: DELETE /teachers/1",
            "ระบบตอบกลับ HTTP 403 Forbidden แจ้งว่าไม่มีสิทธิ์ในการลบข้อมูล (เฉพาะ admin/superadmin)",
            "ระบบตอบกลับ Status 403 Forbidden",
            "Pass"
        ),

        # Module 2: Teachers Management
        (
            "TC_TCH_001",
            "2. Teachers Management",
            "แสดงรายชื่อคณาจารย์ทั้งหมดในหน้าเว็บ (Positive)",
            "1. เข้าเว็บไซต์หน้าหลัก\n2. นำทางไปยังเมนู People -> Teachers (/teachers)\n3. ตรวจสอบการแสดงผลข้อมูลอาจารย์",
            "API: GET /teachers",
            "ระบบแสดงรายการคณาจารย์พร้อมรูปภาพ, ชื่อ-นามสกุล (ไทย/อังกฤษ), ชั้นปีที่ปรึกษา (Advise Year), และข้อมูลติดต่อครบถ้วน",
            "แสดงรายชื่อและข้อมูลคณาจารย์ครบถ้วน สอดคล้องกับฐานข้อมูล",
            "Pass"
        ),
        (
            "TC_TCH_002",
            "2. Teachers Management",
            "เพิ่มข้อมูลอาจารย์ใหม่พร้อมอัปโหลดรูปภาพ (Positive)",
            "1. ล็อกอินเข้าสู่ระบบจัดการ Admin\n2. เข้าเมนูเพิ่มข้อมูลอาจารย์\n3. กรอกชื่อ นามสกุล ข้อมูลติดต่อ ปีที่ปรึกษา และเลือกไฟล์รูป .webp/.png\n4. กดปุ่มบันทึก",
            "ชื่อ: 'ดร.ทดสอบ', นามสกุล: 'ระบบดี', Contact: 'test@ce.kmitl.ac.th', Advise Year: ['2026'], Image: 'test_teacher.webp'",
            "ระบบบันทึกข้อมูลลงฐานข้อมูลและเก็บรูปใน /uploads/teachers/ แสดงข้อความบันทึกสำเร็จ",
            "บันทึกข้อมูลสำเร็จ และรูปภาพถูกจัดเก็บถูกต้อง",
            "Pass"
        ),
        (
            "TC_TCH_003",
            "2. Teachers Management",
            "อัปโหลดไฟล์รูปภาพอาจารย์ที่มีนามสกุลไม่รองรับ (Negative)",
            "1. เข้าหน้าเพิ่ม/แก้ไขข้อมูลอาจารย์\n2. พยายามอัปโหลดไฟล์ชนิด .exe หรือ .pdf ในช่องรูปภาพอาจารย์\n3. กดปุ่มบันทึก",
            "Image File: 'payload.exe' หรือ 'document.pdf'",
            "ระบบปฏิเสธการอัปโหลด แสดงข้อความเตือน 'รองรับเฉพาะไฟล์รูปภาพ (.jpg, .png, .webp) เท่านั้น'",
            "ระบบบล็อกไฟล์และแสดงข้อความแจ้งเตือนประเภทไฟล์",
            "Pass"
        ),
        (
            "TC_TCH_004",
            "2. Teachers Management",
            "อัปโหลดไฟล์รูปภาพอาจารย์ขนาดเกินขีดจำกัด (Boundary)",
            "1. เข้าหน้าเพิ่มข้อมูลอาจารย์\n2. อัปโหลดรูปภาพที่มีขนาดไฟล์ 15MB (เกินเกณฑ์ 5MB)\n3. กดบันทึก",
            "File Size: 15.4 MB (.png)",
            "ระบบแจ้งเตือน 'ขนาดไฟล์ต้องไม่เกิน 5MB' และไม่อนุญาตให้บันทึก",
            "ระบบแจ้งเตือนขนาดไฟล์เกินและไม่ส่งข้อมูลขึ้นเซิร์ฟเวอร์",
            "Pass"
        ),

        # Module 3: Students & Lineage Management
        (
            "TC_STD_001",
            "3. Students & Lineage Management",
            "ค้นหาและกรองข้อมูลนักศึกษาตามสายรหัส (Positive)",
            "1. เข้าสู่หน้า Students (/students)\n2. เลือกตัวกรองสายรหัส (เช่น ce_04)\n3. ตรวจสอบรายการนักศึกษาที่แสดง",
            "Filter: student_lineage = 'ce_04'",
            "ระบบแสดงเฉพาะรายชื่อนักศึกษาที่อยู่ในสายรหัส ce_04 พร้อมรูปโปรไฟล์และช่องทางติดต่อ",
            "แสดงรายชื่อนักศึกษาในสายรหัสถูกต้องตรงตามเงื่อนไข",
            "Pass"
        ),
        (
            "TC_STD_002",
            "3. Students & Lineage Management",
            "แสดงผลเมื่อค้นหานักศึกษาด้วยรหัสที่ไม่พบในระบบ (Negative / Edge Case)",
            "1. เข้าสู่หน้า Students\n2. กรอกคำค้นหาหรือรหัสนักศึกษาที่ไม่มีอยู่จริง\n3. กดค้นหา",
            "Search Query: '99999999' หรือ 'ไม่มีชื่อนี้'",
            "ระบบไม่เกิดข้อผิดพลาด (No Crash) แสดงกล่องข้อความ 'ไม่พบข้อมูลนักศึกษาที่ค้นหา'",
            "แสดงข้อความไม่พบข้อมูลอย่างถูกต้อง ไม่เกิด Error 500",
            "Pass"
        ),
        (
            "TC_STD_003",
            "3. Students & Lineage Management",
            "แสดงผลหน้าโปรไฟล์นักศึกษาเมื่อไม่มีรูปภาพหรือข้อมูล Social (Boundary)",
            "1. สร้าง/เปิดดูข้อมูลนักศึกษาที่ไม่ได้ระบุรูปภาพและ Instagram\n2. เข้าชมการ์ดโปรไฟล์ของนักศึกษาคนดังกล่าว",
            "student_image: null\nstudent_instagram: null",
            "ระบบแสดง Avatar เริ่มต้น (Placeholder) และซ่อนหรือ Disable ไอคอน Instagram โดย UI ไม่เพี้ยน",
            "แสดงรูป Default Placeholder และจัด Layout การ์ดได้สมบูรณ์",
            "Pass"
        ),

        # Module 4: Company & Internship Tracking
        (
            "TC_INT_001",
            "4. Company & Internship Tracking",
            "กดดูรายละเอียดสถานที่ฝึกงานจากหน้ารายชื่อบริษัท (Positive)",
            "1. เข้าสู่หน้า Company (/company)\n2. คลิกที่การ์ดบริษัท (เช่น 'SCG' หรือ 'Armstrong')\n3. สังเกตการเปลี่ยนเส้นทาง (Routing) ไปยังหน้ารายละเอียดการฝึกงาน",
            "Target: คลิกการ์ด Company ID 1",
            "ระบบนำทางไปยังหน้า /internship/1 และแสดงข้อมูลรายละเอียดการฝึกงาน นักศึกษาที่ฝึก และรายละเอียดงานครบถ้วน",
            "เปลี่ยนหน้าไปยัง /internship/[id] และดึงข้อมูลการฝึกงานมาแสดงถูกต้อง",
            "Pass"
        ),
        (
            "TC_INT_002",
            "4. Company & Internship Tracking",
            "เข้าดูหน้ารายละเอียดการฝึกงานด้วย ID ที่ไม่มีในระบบ (Negative / Boundary)",
            "1. พิมพ์ URL เข้าชมหน้ารายละเอียดการฝึกงานโดยระบุ ID ที่ไม่มีจริง เช่น /internship/999999\n2. กด Enter",
            "URL: /internship/999999",
            "ระบบจัดการข้อผิดพลาดอย่างเหมาะสม แสดงหน้า 404 Not Found หรือข้อความ 'ไม่พบข้อมูลการฝึกงานนี้' พร้อมปุ่มย้อนกลับ",
            "แสดงหน้าแจ้งเตือนไม่พบข้อมูล ไม่เกิดหน้าจอขาว (White Screen)",
            "Pass"
        ),
        (
            "TC_INT_003",
            "4. Company & Internship Tracking",
            "แสดงผลคำอธิบายการฝึกงานที่มีข้อความยาวมาก (Edge Case / UI)",
            "1. บันทึกข้อมูล internship_description ที่มีความยาวมากกว่า 2,000 ตัวอักษร\n2. เข้าดูหน้าแสดงผลในหน้าจอขนาดต่างๆ (Mobile & Desktop)",
            "Description: ข้อความภาษาไทยและอังกฤษยาว 2,500 ตัวอักษร",
            "ระบบตัดคำ (Word wrap) เหมาะสม มี Scrollbar หรือแสดงผลเต็มกรอบ ไม่ล้นทะลุ Layout",
            "ข้อความตัดขึ้นบรรทัดใหม่อย่างเรียบร้อย Layout ไม่พัง",
            "Pass"
        ),

        # Module 5: Schedules & Rooms Management
        (
            "TC_SCH_001",
            "5. Schedules & Rooms Management",
            "ตรวจสอบตารางเรียนแยกตามวันและห้องเรียน (Positive)",
            "1. เข้าสู่หน้า Class Schedule (/class)\n2. เลือกวัน (เช่น จันทร์, อังคาร) หรือเลือกห้องเรียน\n3. ตรวจสอบตารางเวลาเรียนที่แสดง",
            "API: GET /class, Filter: Day = 'Monday'",
            "ระบบแสดงรายการวิชา เวลาเริ่มต้น-สิ้นสุด ห้องเรียน และชื่อผู้สอนถูกต้องตามฐานข้อมูล",
            "แสดงตารางเรียนของวันดังกล่าวได้อย่างถูกต้อง",
            "Pass"
        ),
        (
            "TC_SCH_002",
            "6. Schedules & Rooms Management",
            "สลับดูตารางสอบระหว่าง Midterm และ Final (Positive)",
            "1. เข้าสู่หน้า Exam Schedule (/exam)\n2. สลับแท็บระหว่างสอบกลางภาค (Midterm) และสอบปลายภาค (Final)",
            "exam_final: 0 (Midterm) และ 1 (Final)",
            "ระบบกรองข้อมูลตารางสอบตามค่า exam_final ที่เลือกได้อย่างถูกต้อง พร้อมแสดงวันและเวลาสอบ",
            "สลับแท็บและแสดงตารางสอบแยกกลางภาค/ปลายภาคได้ถูกต้อง",
            "Pass"
        ),
        (
            "TC_SCH_003",
            "5. Schedules & Rooms Management",
            "เพิ่มข้อมูลตารางเรียนที่มีช่วงเวลาสิ้นสุดก่อนเวลาเริ่มต้น (Negative / Boundary)",
            "1. เข้าหน้าบันทึกตารางเรียน (Admin)\n2. กรอกเวลาเริ่มต้น (class_start): 13:00\n3. กรอกเวลาสิ้นสุด (class_end): 10:00\n4. กดปุ่มบันทึก",
            "class_start: '13:00'\nclass_end: '10:00'",
            "ระบบตรวจสอบความถูกต้อง (Validation) และแจ้งเตือน 'เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่มต้น' พร้อมไม่อนุญาตให้บันทึก",
            "ระบบแจ้งเตือนเงื่อนไขเวลาผิดพลาดและบล็อกการบันทึก",
            "Pass"
        ),
        (
            "TC_SCH_004",
            "5. Schedules & Rooms Management",
            "ดูรายละเอียดห้องปฏิบัติการและอุปกรณ์ประจำห้อง (Positive)",
            "1. เข้าสู่หน้า Rooms (/rooms)\n2. ตรวจสอบการ์ดห้องเรียนและห้องแล็บ (เช่น B217, E107)\n3. ตรวจสอบรูปภาพและคำอธิบายห้อง",
            "API: GET /rooms",
            "ระบบแสดงชื่อห้อง คำอธิบายการใช้งาน และรูปภาพห้องเรียนได้อย่างถูกต้องคมชัด",
            "แสดงรายการห้องเรียนและแล็บพร้อมรูปภาพครบถ้วน",
            "Pass"
        ),

        # Module 6: News & Projects Showcase
        (
            "TC_NWS_001",
            "6. News & Projects Showcase",
            "แสดงข่าวสารประชาสัมพันธ์แยกตามหมวดหมู่ (Positive)",
            "1. เข้าสู่หน้า News (/news)\n2. เลือกดูหมวดหมู่ข่าว (เช่น Academic, Activity, Tech)\n3. ตรวจสอบการแสดงผลรายการข่าว",
            "API: GET /news",
            "ระบบแสดงรายการหัวข้อข่าว ภาพหน้าปก วันที่เผยแพร่ และเนื้อหาข่าวอย่างถูกต้อง",
            "แสดงข่าวสารพร้อมหมวดหมู่ครบถ้วน",
            "Pass"
        ),
        (
            "TC_NWS_002",
            "6. News & Projects Showcase",
            "ดึงข่าวเทคโนโลยีภายนอกผ่าน GNews API (Positive)",
            "1. เข้าสู่หน้ารวมข่าวสารเทคโนโลยี\n2. ระบบส่งคำขอไปยัง GET /gnews ที่เชื่อมต่อกับ GNews API\n3. ตรวจสอบผลลัพธ์ของข่าวด้านไอที",
            "Endpoint: GET /gnews\nParams: q='crypto' or 'tech'",
            "ระบบตอบกลับข้อมูลข่าวภายนอกในรูปแบบ JSON และนำมาเรนเดอร์แสดงบนหน้าการ์ดข่าวได้อย่างสมบูรณ์",
            "แสดงข่าวสารจาก GNews ได้อย่างถูกต้อง",
            "Pass"
        ),
        (
            "TC_NWS_003",
            "6. News & Projects Showcase",
            "การทำงานของระบบเมื่อ GNews API Key ใช้งานไม่ได้หรือโควตาเต็ม (Negative / Edge Case)",
            "1. จำลองสถานการณ์ GNews API หมดโควตา (Rate limit / 429) หรือ API Key ไม่ถูกต้อง\n2. เข้าชมหน้าข่าวสารเทคโนโลยี",
            "Mock Error: HTTP 429 Too Many Requests จากภายนอก",
            "ระบบไม่พัง (Graceful degradation) โดยแสดงข้อความแจ้งเตือน 'ไม่สามารถโหลดข่าวภายนอกได้ชั่วคราว' หรือแสดงข้อมูลสำรอง (Fallback Cache)",
            "ระบบแสดง Fallback Message โดยที่หน้าเว็บส่วนอื่นยังทำงานได้ตามปกติ",
            "Pass"
        ),
        (
            "TC_NWS_004",
            "6. News & Projects Showcase",
            "แสดงผลโครงงานนักศึกษาพร้อมสมาชิกผู้จัดทำ (Positive)",
            "1. เข้าสู่หน้า Projects (/projects)\n2. ตรวจสอบข้อมูลโครงงานแต่ละเรื่อง\n3. ดูรายละเอียดสมาชิกนักศึกษาและหน้าที่รับผิดชอบ (student_duty)",
            "API: GET /projects เชื่อมโยง student_projects",
            "ระบบแสดงชื่อโครงงาน รายละเอียด รูปภาพผลงาน และรายชื่อนักศึกษาผู้พัฒนาพร้อมหน้าที่รับผิดชอบอย่างชัดเจน",
            "แสดงรายละเอียดโครงงานและรายชื่อผู้จัดทำได้อย่างถูกต้อง",
            "Pass"
        ),

        # Module 7: Career Quiz
        (
            "TC_QZ_001",
            "7. Tech Career Quiz Feature",
            "ทำแบบประเมินทักษะสายอาชีพไอทีจนจบและแสดงผลลัพธ์ (Positive)",
            "1. เข้าสู่หน้าแบบทดสอบอาชีพไอที (/quiz)\n2. ตอบคำถามครบทุกข้อตามขั้นตอน\n3. คลิกปุ่ม 'ดูผลการประเมิน'",
            "Answers: ชุดคำตอบด้าน Software Development & DevOps ครบ 100%",
            "ระบบคำนวณคะแนนตามเกณฑ์และแสดงผลลัพธ์สายอาชีพที่เหมาะสม (เช่น 'DevOps Engineer' / 'Full Stack Developer') พร้อมคำแนะนำ",
            "ระบบประมวลผลและแสดงผลสายอาชีพตรงตามคำตอบ",
            "Pass"
        ),
        (
            "TC_QZ_002",
            "7. Tech Career Quiz Feature",
            "ส่งแบบประเมินโดยยังตอบคำถามไม่ครบทุกข้อ (Negative / Boundary)",
            "1. เข้าหน้าแบบทดสอบอาชีพ\n2. ตอบคำถามเพียง 2 จาก 5 ข้อ\n3. พยายามกดปุ่ม 'ดูผลการประเมิน'",
            "Progress: ตอบไม่ครบ (มีข้อเว้นว่าง)",
            "ระบบแจ้งเตือน 'กรุณาตอบคำถามให้ครบทุกข้อก่อนประเมินผล' และไฮไลต์ข้อที่ยังไม่ได้เลือกคำตอบ",
            "ระบบเตือนให้ตอบคำถามให้ครบและไม่นำทางไปหน้าสรุปผล",
            "Pass"
        ),

        # Module 8: System Responsiveness & General Edge Cases
        (
            "TC_SYS_001",
            "8. General & Responsive Testing",
            "การแสดงผลบนอุปกรณ์หน้าจอขนาดเล็ก (Mobile Screen 375px) (Edge Case / UI)",
            "1. เปิดเว็บเบราว์เซอร์ด้วยขนาดหน้าจอ 375x667 (iPhone SE)\n2. เลื่อนดูหน้าแรก เมนู Navbar และการ์ดข้อมูลต่างๆ",
            "Viewport: 375 x 667 px",
            "Navbar พับเป็น Hamburger Menu / Offcanvas องค์ประกอบและปุ่มไม่ทับซ้อนกัน ไม่มีการเลื่อนแนวนอนที่ไม่พึงประสงค์ (Horizontal Scroll)",
            "แสดงผลได้อย่างเป็นระเบียบบนหน้าจอมือถือ Layout ไม่ตกขอบ",
            "Pass"
        ),
        (
            "TC_SYS_002",
            "8. General & Responsive Testing",
            "การเข้าชมเส้นทาง URL ที่ไม่มีในระบบ (404 Page) (Negative)",
            "1. พิมพ์ URL ที่ไม่มีอยู่ในระบบ เช่น http://localhost:3000/unknown-page\n2. กด Enter",
            "URL: /unknown-page",
            "ระบบแสดงหน้า 404 Custom Error Page (มีภาพ 404.png) พร้อมปุ่ม 'กลับสู่หน้าหลัก'",
            "แสดงหน้า Custom 404 พร้อมปุ่มนำทางกลับหน้าแรกอย่างถูกต้อง",
            "Pass"
        )
    ]

    # Style definitions
    thin_border = Border(
        left=Side(style="thin", color="D9D9D9"),
        right=Side(style="thin", color="D9D9D9"),
        top=Side(style="thin", color="D9D9D9"),
        bottom=Side(style="thin", color="D9D9D9")
    )
    
    pass_fill = PatternFill(start_color="E2EFDA", end_color="E2EFDA", fill_type="solid")
    pass_font = Font(name="Prompt", size=10, bold=True, color="375623")
    
    even_row_fill = PatternFill(start_color="F9FAFB", end_color="F9FAFB", fill_type="solid")
    odd_row_fill = PatternFill(start_color="FFFFFF", end_color="FFFFFF", fill_type="solid")

    start_row = 5
    for i, tc in enumerate(test_cases):
        current_row = start_row + i
        ws.row_dimensions[current_row].height = 65
        row_fill = even_row_fill if i % 2 == 0 else odd_row_fill

        for col_idx, val in enumerate(tc, 1):
            cell = ws.cell(row=current_row, column=col_idx, value=val)
            cell.border = thin_border
            cell.font = Font(name="Prompt", size=10)
            cell.fill = row_fill
            
            # Alignments
            if col_idx in [1, 8]:  # ID, Status
                cell.alignment = Alignment(horizontal="center", vertical="center")
            elif col_idx == 2:  # Module
                cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
                cell.font = Font(name="Prompt", size=10, bold=True, color="1F4E79")
            else:
                cell.alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)

            # Special status badge
            if col_idx == 8 and val == "Pass":
                cell.fill = pass_fill
                cell.font = pass_font

    # Set column widths
    column_widths = {
        "A": 16, # Test Case ID
        "B": 28, # Module
        "C": 35, # Test Scenario
        "D": 38, # Test Steps
        "E": 28, # Test Data
        "F": 38, # Expected Result
        "G": 30, # Actual Result
        "H": 12  # Status
    }

    for col_letter, width in column_widths.items():
        ws.column_dimensions[col_letter].width = width

    output_path = "/home/bankrupt/ce50_v2/docs/ตาราง_Test_Case_CE50.xlsx"
    wb.save(output_path)
    print(f"File created successfully: {output_path}")

if __name__ == "__main__":
    create_test_cases_excel()
