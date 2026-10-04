import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).with_name("ce50.db")


def insertMany(query, data):
  with sqlite3.connect(DB_PATH) as connection:
    connection.execute("PRAGMA foreign_keys = ON;")
    connection.executemany(query, data)


def seedRooms():
  rooms_data = [
    ("E111", "ห้องเรียนปกติ ห้องที่มีจอ"),
    ("E112", "ห้องทำงานโปรเจค"),
    ("E113", "ห้องสาขาวิศวกรรมคอมพิวเตอร์"),
    ("E107", "ห้องปฏิบัติการคอมพิวเตอร์"),
    ("B218", "ห้องคอมพิวเตอร์ตึก B"),
    ("B217", "ห้องวัดระดับภาษาอังกฤษ")
  ]

  insertMany(
    "INSERT INTO rooms (room_name, room_description) VALUES (?, ?)",
    rooms_data,
  )


def seedTeachers():
  teachers_data = [
    ("อาจารย์อรรถศาสตร์", "นาคเทวัญ", "athasart.na@kmitl.ac.th", "athasart"),
    ("ดร.รัตติกร", "สมบัติแก้ว", "rattikorn.so@kmitl.ac.th", "rattikorn"),
    ("อาจารย์นภัสรพี", "สิทธิวัจน์", "pisakorn.si@kmitl.ac.th", "pisakorn"),
    ("ว่าที่ร้อยตรี ศิลา", "ศิริมาสกุล", "silar.si@kmitl.ac.th", "silar"),
    ("อาจารย์สกาวกาญจน์", "ปิยะวิทย์วนิช", "sakawkarn.pi@kmitl.ac.th", "sakawkarn"),
    ("นายจตุรงค์", "เกตุนิมิต", "jaturong.k@ce.ac.th", "jaturong")
  ]

  insertMany(
    "INSERT INTO teachers (teacher_firstname, teacher_lastname, teacher_contact, teacher_name_en) VALUES (?, ?, ?, ?)",
    teachers_data,
  )


def seedStudents():
  students_data = [
    ("67200412", "นายรุจิณัฐ", "อาศิรเมธี", "006", "67200412@kmitl.ac.th", "Rujinat_Fah"),
    ("67200014", "นางสาวกัณฐมณี", "กอบการ", "339", "67200014@kmitl.ac.th", "kwin_mhy"),
    ("67200099", "นายทัชภูมิ", "ใจดี", "787", "67200099@kmitl.ac.th", "pipe2bot"),
    ("67200049", "นายเจษฎา", "ศรีสง่า", "538", "67200049@kmitl.ac.th", "p_Jetsada_p"),
    ("67200102", "นายทีปกิติ์", "พรหมสัตยพรต", "444", "67200102@kmitl.ac.th", "lil_weirx"),
    ("67200350", "นางสาวณัฏฐ์ชยา", "จำปา", "123", "67200350@kmitl.ac.th", "Waa_.zz"),
    ("67200235", "นางสาวรินรดา", "บุญมี", "800", "67200235@kmitl.ac.th", "nnoey.rb"),
    ("67200079", "นางสาวณัฐธิดา", "เกื้อประจง", "007", "67200079@kmitl.ac.th", "ntd.axn"),
    ("67200223", "นายมีสุข", "เอกพงษ์", "800", "67200223@kmitl.ac.th", "Messily ekkaphong"),
    ("67200369", "นายธีรศาสนต์", "คงเกิด", "800", "67200369@kmitl.ac.th", "Teeuytee"),
    ("67200030", "นายคณพัฒน์", "รุ่งรพีพรพงษ์", "224", "67200030@kmitl.ac.th", "pooh_2134"),
    ("67200093", "นายตระกูลชัย", "เเซ่ติ้ง", "006", "67200093@kmitl.ac.th", None),
    ("67200324", "นายกนกพัฒน์", "โพธิ", "444", "67200324@kmitl.ac.th", "lxo_xelxeoo"),
    ("67200348", "นายณรงค์รักษ์", "เรืองศักดิ์", "999", "67200348@kmitl.ac.th", "ainxri"),
    ("67200380", "นายปรินทร", "คงทอง", "339", "67200380@kmitl.ac.th", "bank.parinthon"),
    ("66200001", "นายกฤษณะ", "วงศ์สว่าง", "001", "66200001@kmitl.ac.th", "kritsana_ce"),
    ("66200002", "นางสาวชลธิชา", "ทองอยู่", "002", "66200002@kmitl.ac.th", "chon_ce"),
    ("65200001", "นายพีรพล", "แซ่ลิ้ม", "003", "65200001@kmitl.ac.th", "peerapol_ce"),
    ("64200001", "นายธนวัฒน์", "สุขสม", "004", "64200001@kmitl.ac.th", "tanawat_ce")
  ]

  insertMany(
    "INSERT INTO students (student_id, student_firstname, student_lastname, student_lineage, student_email, student_instagram) VALUES (?, ?, ?, ?, ?, ?)",
    students_data,
  )


def seedUsers():
  users_data = [
    ("superadmin", "hash_password(super_pw)", "superadmin@ce.ac.th", "superadmin"),
    ("admin_y1", "hash_password(admin_pw)", "admin_y1@ce.ac.th", "admin"),
    ("writer_y1", "hash_password(writer_pw)", "writer_y1@ce.ac.th", "writer"),
    ("adminFah", "0bfd52e76bd1395e11b9b0d4b354ccf02f1718143f1229bb43c2bc1eddea7a9b", "fah@ce.ac.th", "superadmin")
  ]

  insertMany(
    "INSERT INTO users (user_name, password_hash, user_email, user_role) VALUES (?, ?, ?, ?)",
    users_data,
  )


def seedProjects():
  projects_data = [
    (1, "H.I.V.E", "โปรเจค HoneyPot ของกลุ่มไปน์", "hive.png")
  ]

  insertMany(
    "INSERT INTO projects (project_id, project_name, project_description, project_image) VALUES (?, ?, ?, ?)",
    projects_data,
  )


def seedStudentProjects():
  student_projects_data = [
    ("67200099", 1)
  ]

  insertMany(
    "INSERT INTO student_projects (student_id, project_id) VALUES (?, ?)",
    student_projects_data,
  )


def seedCompanys():
  companys_data = [
    (1, "SCG", "scg"),
    (3, "armstrong", "armstrong"),
  ]

  insertMany(
    "INSERT INTO companys (company_id, company_name, company_image) VALUES (?, ?, ?)",
    companys_data,
  )


def seedInternships():
  internships_data = [
    ("67200380", "Frontend Developer", 1, "ฝึกงานตำแหน่ง Frontend Developer ที่บริษัท SCG Thungsong เป็นเวลา 3 เดือน"),
    ("67200030", "Backend Developer", 1, "ฝึกงานตำแหน่ง Backend Developer ที่บริษัท SCG Thungsong เป็นเวลา 3 เดือน"),
    ("67200099", "Security Engineer", 3, "จัดการโครงสร้างพื้นฐานระบบเครือข่าย พัฒนาโซลูชันความปลอดภัยทางไซเบอร์ ผู้เชี่ยวชาญการแข่งขัน CTF"),
  ]

  insertMany(
    "INSERT INTO internships (student_id, internship_title, company_id, internship_description) VALUES (?, ?, ?, ?)",
    internships_data,
  )


def seedClassSchedules():
  class_schedules_data = [
    # CE04 (ปี 1) - Semester 1
    (2, "Software Development Processes (ทฤษฎี)", 4, "หลักการและกระบวนการพัฒนาซอฟต์แวร์", "monday", "10:00", "12:00", "CE04", 1),
    (2, "Software Development Processes ปฏิบัติ)", 5, "ฝึกปฏิบัติกระบวนการพัฒนาซอฟต์แวร์", "monday", "13:00", "16:00", "CE04", 1),
    (3, "Team-Project 2 ปฏิบัติ)", 1, "ฝึกพัฒนาโครงงานเป็นทีม", "monday", "18:00", "20:00", "CE04", 1),
    (2, "Database Systems (ทฤษฎี)", 5, "หลักการออกแบบและจัดการฐานข้อมูล", "tuesday", "10:00", "12:00", "CE04", 1),
    (2, "Database Systems ปฏิบัติ)", 5, "ฝึกออกแบบและใช้งานฐานข้อมูล", "tuesday", "13:00", "16:00", "CE04", 1),
    (4, "Computer Hardware Design (ทฤษฎี)", 6, "หลักการออกแบบฮาร์ดแวร์คอมพิวเตอร์", "wednesday", "10:00", "12:00", "CE04", 1),
    (1, "Information and Computer Security ปฏิบัติ)", 5, "ฝึกปฏิบัติด้านความมั่นคงปลอดภัยคอมพิวเตอร์", "wednesday", "13:00", "16:00", "CE04", 1),
    (1, "Information and Computer Security (ทฤษฎี)", 5, "พื้นฐานความมั่นคงปลอดภัยสารสนเทศ", "wednesday", "16:00", "18:00", "CE04", 1),
    (4, "Computer Hardware Design ปฏิบัติ)", 6, "ฝึกออกแบบวงจรและฮาร์ดแวร์คอมพิวเตอร์", "thursday", "09:00", "12:00", "CE04", 1),
    (2, "Computer Architecture ปฏิบัติ)", 4, "ฝึกวิเคราะห์โครงสร้างและสถาปัตยกรรมคอมพิวเตอร์", "thursday", "17:00", "20:00", "CE04", 1),
    (2, "Computer Architecture (ทฤษฎี)", 1, "หลักการสถาปัตยกรรมคอมพิวเตอร์", "friday", "10:00", "12:00", "CE04", 1),

    # CE04 - Semester 2
    (2, "Data Structures & Algorithms (ทฤษฎี)", 4, "โครงสร้างข้อมูลและขั้นตอนวิธี", "monday", "09:00", "12:00", "CE04", 2),
    (2, "Data Structures & Algorithms ปฏิบัติ)", 5, "ฝึกปฏิบัติการเขียนโปรแกรมโครงสร้างข้อมูล", "monday", "13:00", "16:00", "CE04", 2),
    (4, "Digital Logic & Microprocessors (ทฤษฎี)", 6, "วงจรดิจิทัลและไมโครโปรเซสเซอร์", "tuesday", "10:00", "12:00", "CE04", 2),
    (1, "Computer Networks & Protocols (ทฤษฎี)", 4, "ระบบเครือข่ายและเกณฑ์วิธีคอมพิวเตอร์", "wednesday", "09:00", "12:00", "CE04", 2),

    # CE03 (ปี 2) - Semester 1 & 2
    (3, "Operating Systems & Kernels (ทฤษฎี)", 4, "ระบบปฏิบัติการและการจัดการทรัพยากร", "tuesday", "09:00", "12:00", "CE03", 1),
    (1, "Cloud Architecture & DevOps ปฏิบัติ)", 5, "การจัดการสถาปัตยกรรมคลาวด์", "thursday", "13:00", "16:00", "CE03", 1),
    (5, "Artificial Intelligence Systems (ทฤษฎี)", 6, "ระบบปัญญาประดิษฐ์และแมชชีนเลิร์นนิง", "wednesday", "10:00", "12:00", "CE03", 2),
    (2, "Web & Distributed Applications ปฏิบัติ)", 4, "การพัฒนาเว็บแอปพลิเคชันแบบกระจาย", "friday", "13:00", "17:00", "CE03", 2),

    # CE02 (ปี 3) - Semester 1 & 2
    (6, "Computer Engineering Capstone Project I", 2, "โครงงานวิศวกรรมคอมพิวเตอร์ขั้นสูง 1", "friday", "09:00", "12:00", "CE02", 1),
    (6, "Computer Engineering Capstone Project II", 2, "โครงงานวิศวกรรมคอมพิวเตอร์ขั้นสูง 2", "friday", "09:00", "12:00", "CE02", 2),
  ]

  insertMany(
    "INSERT INTO class_schedules (teacher_id, class_name, room_id, class_description, class_day, class_start, class_end, generation, semester) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    class_schedules_data,
  )


def seedExamSchedules():
  exam_schedules_data = [
    # CE04 - Semester 1
    ("11256011", "Software Development Processes (MIDTERM)", 0, "2026-08-23", "13:30", "16:30", "E113", "CE04", 1),
    ("11256011", "Software Development Processes (FINAL)", 1, "2026-11-03", "13:30", "16:30", "E113", "CE04", 1),
    ("11256016", "Database Systems (MIDTERM)", 0, "2026-08-21", "13:30", "16:30", "E113", "CE04", 1),
    ("11256016", "Database Systems (FINAL)", 1, "2026-10-30", "13:30", "16:30", "E113", "CE04", 1),
    ("11256022", "Information and Computer Security (FINAL)", 1, "2026-10-26", "13:30", "16:30", "E113", "CE04", 1),
    ("11256025", "Computer Architecture (MIDTERM)", 0, "2026-08-19", "13:30", "16:30", "E113", "CE04", 1),
    ("11256025", "Computer Architecture (FINAL)", 1, "2026-10-28", "13:30", "16:30", "E113", "CE04", 1),
    ("11256027", "Computer Hardware Design (FINAL)", 1, "2026-11-04", "13:30", "16:30", "E113", "CE04", 1),

    # CE04 - Semester 2
    ("11256031", "Data Structures & Algorithms (MIDTERM)", 0, "2027-01-15", "09:30", "12:30", "E111", "CE04", 2),
    ("11256031", "Data Structures & Algorithms (FINAL)", 1, "2027-03-22", "09:30", "12:30", "E111", "CE04", 2),
    ("11256035", "Digital Logic & Microprocessors (FINAL)", 1, "2027-03-24", "13:30", "16:30", "E107", "CE04", 2),
    ("11256040", "Computer Networks & Protocols (FINAL)", 1, "2027-03-26", "09:30", "12:30", "E113", "CE04", 2),

    # CE03 - Semester 1 & 2
    ("11256050", "Operating Systems & Kernels (FINAL)", 1, "2026-10-29", "13:30", "16:30", "E112", "CE03", 1),
    ("11256055", "Cloud Architecture & DevOps (FINAL)", 1, "2026-11-02", "09:30", "12:30", "E107", "CE03", 1),
    ("11256060", "Artificial Intelligence Systems (FINAL)", 1, "2027-03-25", "13:30", "16:30", "E113", "CE03", 2),

    # CE02 - Semester 1 & 2
    ("11256070", "Capstone Project I Presentation", 1, "2026-11-06", "09:00", "16:00", "E112", "CE02", 1),
    ("11256071", "Capstone Project II Presentation", 1, "2027-03-29", "09:00", "16:00", "E112", "CE02", 2),
  ]

  insertMany(
    "INSERT INTO exam_schedules (exam_code, exam_name, exam_final, exam_date, exam_start, exam_end, exam_room, generation, semester) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    exam_schedules_data,
  )


def seedNewsItems():
  news_item_data = [
    ("Topgun Riley", "งานแข่งขันด้าน Embemded System ร่วมกับ AI Automation", "งานแข่งขัน", "tesa_top_gun_rally_01.jpg")
  ]

  insertMany(
    "INSERT INTO news_item (news_title, news_description, news_category, news_image) VALUES (?, ?, ?, ?)",
    news_item_data,
  )


def seedAll():
  seedRooms()
  seedTeachers()
  seedStudents()
  seedUsers()
  seedProjects()
  seedStudentProjects()
  seedCompanys()
  seedInternships()
  seedClassSchedules()
  seedExamSchedules()
  seedNewsItems()


if __name__ == "__main__":
  seedAll()
