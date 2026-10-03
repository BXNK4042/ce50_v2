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
    ("67200380", "นายปรินทร", "คงทอง", "339", "67200380@kmitl.ac.th", "bank.parinthon")
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
    (2, "Software Development Processes (ทฤษฎี)", 4, "หลักการและกระบวนการพัฒนาซอฟต์แวร์", "monday", "10:00", "12:00"),
    (2, "Software Development Processes ปฏิบัติ)", 5, "ฝึกปฏิบัติกระบวนการพัฒนาซอฟต์แวร์", "monday", "13:00", "16:00"),
    (3, "Team-Project 2 ปฏิบัติ)", 1, "ฝึกพัฒนาโครงงานเป็นทีม", "monday", "18:00", "20:00"),
    (2, "Database Systems (ทฤษฎี)", 5, "หลักการออกแบบและจัดการฐานข้อมูล", "tuesday", "10:00", "12:00"),
    (2, "Database Systems ปฏิบัติ)", 5, "ฝึกออกแบบและใช้งานฐานข้อมูล", "tuesday", "13:00", "16:00"),
    (4, "Computer Hardware Design (ทฤษฎี)", 6, "หลักการออกแบบฮาร์ดแวร์คอมพิวเตอร์", "wednesday", "10:00", "12:00"),
    (1, "Information and Computer Security ปฏิบัติ)", 5, "ฝึกปฏิบัติด้านความมั่นคงปลอดภัยคอมพิวเตอร์", "wednesday", "13:00", "16:00"),
    (1, "Information and Computer Security (ทฤษฎี)", 5, "พื้นฐานความมั่นคงปลอดภัยสารสนเทศ", "wednesday", "16:00", "18:00"),
    (4, "Computer Hardware Design ปฏิบัติ)", 6, "ฝึกออกแบบวงจรและฮาร์ดแวร์คอมพิวเตอร์", "thursday", "09:00", "12:00"),
    (2, "Computer Architecture ปฏิบัติ)", 4, "ฝึกวิเคราะห์โครงสร้างและสถาปัตยกรรมคอมพิวเตอร์", "thursday", "17:00", "20:00"),
    (2, "Computer Architecture (ทฤษฎี)", 1, "หลักการสถาปัตยกรรมคอมพิวเตอร์", "friday", "10:00", "12:00")
  ]

  insertMany(
    "INSERT INTO class_schedules (teacher_id, class_name, room_id, class_description, class_day, class_start, class_end) VALUES (?, ?, ?, ?, ?, ?, ?)",
    class_schedules_data,
  )


def seedExamSchedules():
  exam_schedules_data = [
    ("11256011", "Software Development Processes (MIDTERM)", 0, "2026-08-23", "13:30", "16:30", "E113"),
    ("11256011", "Software Development Processes (FINAL)", 1, "2026-11-03", "13:30", "16:30", "E113"),
    ("11256016", "Database Systems (MIDTERM)", 0, "2026-08-21", "13:30", "16:30", "E113"),
    ("11256016", "Database Systems (FINAL)", 1, "2026-10-30", "13:30", "16:30", "E113"),
    ("11256022", "Information and Computer Security (FINAL)", 1, "2026-10-26", "13:30", "16:30", "E113"),
    ("11256025", "Computer Architecture (MIDTERM)", 0, "2026-08-19", "13:30", "16:30", "E113"),
    ("11256025", "Computer Architecture (FINAL)", 1, "2026-10-28", "13:30", "16:30", "E113"),
    ("11256027", "Computer Hardware Design (FINAL)", 1, "2026-11-04", "13:30", "16:30", "E113")
  ]

  insertMany(
    "INSERT INTO exam_schedules (exam_code, exam_name, exam_final, exam_date, exam_start, exam_end, exam_room) VALUES (?, ?, ?, ?, ?, ?, ?)",
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
