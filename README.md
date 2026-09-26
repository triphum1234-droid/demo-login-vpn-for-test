# Demo Login VPN for Test

เว็บเดโมหน้าล็อกอินของแอป VPN สำหรับทดลอง flow ด้วย Email, Google Account และ Apple ID พร้อมหน้าแสดงผลเมื่อล็อกอินสำเร็จ

> **หมายเหตุ:** Google และ Apple ในโปรเจกต์นี้เป็นหน้าจำลองสำหรับสาธิตเท่านั้น ไม่ได้เชื่อมต่อหรือยืนยันตัวตนกับบริการจริง และไม่ควรใช้ข้อมูลบัญชีจริง

## ความสามารถ

- ล็อกอินด้วย Email พร้อมตรวจข้อมูลว่าง รูปแบบอีเมล และข้อมูลไม่ถูกต้อง
- Google flow จำลองการเลือกบัญชี การกรอกบัญชีอื่น และการอนุญาตสิทธิ์
- Apple flow จำลองการกรอก Apple Account การยืนยันรหัส และการเลือกแชร์หรือซ่อนอีเมล
- ไปยังหน้า Login สำเร็จเมื่อข้อมูลเดโมผ่าน และออกจากระบบเพื่อล้าง session
- ไฟล์ Excel สำหรับ Test Case และคู่มือขั้นตอนทดสอบ อยู่ใน `test-cases/`

## เริ่มใช้งาน

เปิด `index.html` ในเบราว์เซอร์ได้โดยตรง หากเบราว์เซอร์จำกัดการทำงานของ `localStorage` ให้เปิด local server จากโฟลเดอร์โปรเจกต์แทน:

```bash
python -m http.server 8000
```

แล้วเปิด `http://localhost:8000` ในเบราว์เซอร์ ไม่ต้องติดตั้งแพ็กเกจเพิ่มเติม

## บัญชีสำหรับเดโม

| วิธี | ข้อมูลทดสอบ |
| --- | --- |
| Email | `demo@nexusvpn.test` / `VPNdemo123!` |
| Google: เลือกบัญชีที่บันทึกไว้ | Alex Morgan (`alex@nexus.test`) แล้วกดยืนยันสิทธิ์ |
| Google: ใช้บัญชีอื่น | `alex@nexus.test` / `GoogleDemo123!` |
| Apple ID | `demo@icloud.test` / `AppleDemo123!` |
| Apple verification code | `246810` |

## Test Case

เปิด `test-cases/vpn_login_demo_test_cases.xlsx` แล้วเริ่มจากชีต **วิธีทดสอบ** จากนั้นรันรายการในชีต **Test Cases** ทีละกรณี บันทึกสถานะและผลจริงในแถวของแต่ละ Test Case

## โครงสร้างไฟล์

```text
.
├── app.js
├── index.html
├── styles.css
├── success.html
├── README.md
└── test-cases/
    └── vpn_login_demo_test_cases.xlsx
```
