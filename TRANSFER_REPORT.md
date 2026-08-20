# Group 3 Standalone Transfer Report

## 1. ล่าสุด: nongserver1 (`100.83.235.78`) - แยกโหมด Standalone Dev อิสระ
- **เวลาเสร็จสิ้น**: `2026-08-19T16:06:00+07:00`
- **Host**: `pisitpong@100.83.235.78` (Tailscale)
- **ตำแหน่งโฟลเดอร์บน Server**: `/home/pisitpong/group3-standalone/`
- **Container Name**: `group3-standalone-dev`
- **Image**: `group3-standalone:20260819`
- **พอร์ตบริการ (Dedicated Port)**: `8303` (Forwarding: `8303 -> 80`)
- **URL เข้าใช้งาน Dev**: `http://100.83.235.78:8303/group3/`
- **สถานะ**: `running`, `healthy`, HTTP 200 OK

### 🛡️ การแยกอิสระจากระบบหลัก (China-v2)
- **China-v2 หลัก**: ยังคงใช้พอร์ต `8104` และ `8101` (Gateway) เดิม โดยไม่ถูกแตะต้องหรือกระทบใดๆ ทั้งสิ้น
- **Group 3 Standalone Dev**: ทำงานแยกเดี่ยวอย่างสมบูรณ์ในโฟลเดอร์ `/home/pisitpong/group3-standalone/` บนพอร์ต `8303`
- **Passwordless SSH**: ตั้งค่า SSH Key สำหรับ `pisitpong@100.83.235.78` เรียบร้อย

---

## 2. ประวัติเดิม: Fedora Host (`100.103.145.101`)
- **เวลาเสร็จสิ้น**: `2026-08-17T23:33:16+07:00`
- **Host**: `nong_ing@100.103.145.101` ผ่าน Tailscale
- **Path**: `/home/nong_ing/group3-standalone`
- **URL**: `http://100.103.145.101:8104/group3/`
