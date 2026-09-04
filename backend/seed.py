import sqlite3

connection = sqlite3.Connection("ce50.db")
cursor = connection.cursor()

rooms_data = [
  ("E111", "ห้องเรียนปกติ ห้องที่มีจอ"),
  ("E112", "ห้องทำงานโปรเจค"),
  ("E113", "ห้องสาขาวิศวกรรมคอมพิวเตอร์"),
  ("E117", "ห้องปฏิบัติการคอมพิวเตอร์"),
  ("B218", "ห้องคอมพิวเตอร์ตึก B")
]

cursor.executemany(
  "INSERT INTO rooms (room_name, room_description) VALUES (?, ?)",
  rooms_data,
)

teachers_data = [
  ("อาจารย์อรรถศาสตร์", "นาคเทวัญ", "athasart.na@kmitl.ac.th"),
  ("ดร.รัตติกร", "สมบัติแก้ว", "rattikorn.so@kmitl.ac.th"),
  ("อาจารย์นภัสรพี", "สิทธิวัจน์", "pisakorn.si@kmitl.ac.th"),
  ("ว่าที่ร้อยตรี ศิลา", "ศิริมาสกุล", "silar.si@kmitl.ac.th"),
  ("อาจารย์สกาวกาญจน์", "ปิยะวิทย์วนิช", "sakawkarn.pi@kmitl.ac.th"),
  ("นายจตุรงค์", "เกตุนิมิต", "jaturong.k@ce.ac.th")
]

cursor.executemany(
  "INSERT INTO teachers (teacher_firstname, teacher_lastname, teacher_contact) VALUES (?, ?, ?)",
  teachers_data,
)

students_data = [
  ("67200412", "นายรุจิณัฐ", "อาศิรเมธี", "006", "0800479886"),
  ("67200014", "นางสาวกัณฐมณี", "กอบการ", "339", "0875732080"),
  ("67200099", "นายทัชภูมิ", "ใจดี", "787", "0986782950"),
  ("67200049", "นายเจษฎา", "ศรีสง่า", "538", "0626253837"),
  ("67200102", "นายทีปกิติ์", "พรหมสัตยพรต", "444", "0973016465"),
  ("67200350", "นางสาวณัฏฐ์ชยา", "จำปา", "123", "0985364534"),
  ("67200235", "นางสาวรินรดา", "บุญมี", "800", "0937764085"),
  ("67200079", "นางสาวณัฐธิดา", "เกื้อประจง", "007", "0801585306"),
  ("67200223", "นายมีสุข", "เอกพงษ์", "800", "0831508487"),
  ("67200369", "นายธีรศาสนต์", "คงเกิด", "800", "0656709042"),
  ("67200030", "นายคณพัฒน์", "รุ่งรพีพรพงษ์", "224", "0810247384"),
  ("67200093", "นายตระกูลชัย", "เเซ่ติ้ง", "006", "0980850838"),
  ("67200324", "นายกนกพัฒน์", "โพธิ", "444", "0926577824"),
  ("67200348", "นายณรงค์รักษ์", "เรืองศักดิ์", "999", "0929744516"),
  ("67200380", "นายปรินทร", "คงทอง", "339", "0631102883")
]

cursor.executemany(
  "INSERT INTO students (student_firstname, student_lastname, student_lineage, student_contact) VALUES (?, ?, ?, ?)",
  students_data,
)

#create hash_password function before run
users_data = [
  ("superadmin", "hash_password(super_pw)", "superadmin@ce.ac.th", "superadmin"),
  ("admin_y1", "hash_password(admin_pw)", "admin_y1@ce.ac.th", "admin"),
  ("writer_y1", "hash_password(writer_pw)", "writer_y1@ce.ac.th", "writer")
]

cursor.executemany(
  "INSERT INTO users (user_name, password_hash, user_email, user_role) VALUES (?, ?, ?, ?)",
  users_data,
)

projects_data = [
  (1, "H.I.V.E", "โปรเจค HoneyPot ของกลุ่มไปน์")
]

cursor.executemany(
  "INSERT INTO projects (project_id, project_name, project_description) VALUES (?, ?, ?)",
  projects_data,
)

student_projects_data = [
  ("67200099", 1)
]

cursor.executemany(
  "INSERT INTO student_projects (student_id, project_id) VALUES (?, ?)",
  student_projects_data,
)

internships_data = [
  ("67200380", "Frontend Developer", "SCG Thungsong", "ฝึกงานตำแหน่ง Frontend Developer ที่บริษัท SCG Thungsong เป็นเวลา 3 เดือน")
]

#Continue place cursor executemany

class_schedules_data = [
  ("1", "INFORMATION AND COMPUTER SECURITY", "5", "พื้นฐานสารสนเทศและความปลอดภัยของคอมพิวเตอร์", "wednesday", "13:00", "18:00")
]

exam_schedules_data = [
  ("INFORMATION AND COMPUTER SECURITY (MIDTERM)", 0, "13:30", "16:30")
]

news_item_data = [
  ("Topgun Riley", "งานแข่งขันด้าน Embemded System ร่วมกับ AI Automation", "งานแข่งขัน")
]

'''
#Didn't added landing page video yet, do it later
CREATE TABLE videos (
    video_id INTEGER PRIMARY KEY AUTOINCREMENT,
    video_title TEXT NOT NULL,
    video_description TEXT NOT NULL,
    video_path TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
'''
