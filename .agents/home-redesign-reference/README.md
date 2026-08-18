# Home Redesign Reference — Group 3 Standalone

> **สถานะ: DESIGN / INTERACTION REFERENCE ONLY**
>
> ไฟล์ในโฟลเดอร์นี้เป็นต้นแบบสำหรับนำแนวคิดไปปรับใช้กับโปรเจกต์จริง **ห้ามนำ HTML ไปแทนที่ source ปัจจุบันทั้งไฟล์**

## จุดประสงค์

โฟลเดอร์นี้เก็บ Home Page prototype ที่ผ่านการคุยและปรับทิศทางร่วมกับผู้ใช้ เพื่อให้ Agent / Developer คนถัดไปสามารถเปิดดูหน้าตาและ interaction ที่ต้องการได้ทันที โดยไม่ต้องตีความจากข้อความอย่างเดียว

Prototype หลัก:

- `home-preview-v8.html`

## กฎสำคัญในการนำไปใช้

1. **ห้าม replace หน้า Home ปัจจุบันด้วยไฟล์ HTML นี้โดยตรง**
2. ให้ถือ `home-preview-v8.html` เป็น **visual + interaction reference** เท่านั้น
3. Source of truth ของระบบจริงยังอยู่ใน React/Vite project โดยเฉพาะบริเวณ:
   - `source/src/surfaces/group-3-8104/Group3App.jsx`
   - `source/src/surfaces/group-3-8104/features/catalog/StoryExperience.jsx`
   - `source/src/surfaces/group-3-8104/styles/home.css`
   - theme/tokens ที่โปรเจกต์ใช้อยู่
4. เวลา implement ให้ย้ายเฉพาะแนวคิดด้าน layout, component structure, spacing และ interaction จาก prototype ไปเขียนใหม่ให้เข้ากับ architecture เดิม
5. **ห้ามทำลาย routing, localization, audio service, lesson registry, theme switching, accessibility หรือ feature เดิมที่มีอยู่**
6. ก่อนแก้ production code ให้ตรวจ component และ service ที่มีอยู่ก่อนเสมอ และ reuse ของเดิมเมื่อทำได้
7. สีใน production ให้ยึด theme token ของโปรเจกต์ ไม่ hard-code palette จาก mockup หากมี token ที่เทียบกันได้

## Design Direction ที่ตกลงไว้

### 1. โครง Home หลัก

ยึดโครงจาก wireframe แรกของผู้ใช้:

- Header / Navbar ด้านบน
- Hero แบ่งสองฝั่ง
- ฝั่งซ้าย:
  - Headline ใหญ่
  - คำอธิบายสั้น
  - CTA หลัก เช่น เริ่มเรียน
  - CTA รอง
- ฝั่งขวา:
  - กล่อง Preview ขนาดใหญ่
  - ลูกศรซ้าย / ขวา
  - Pagination dots ด้านล่าง
  - มีชื่อ feature / content ของ slide

### 2. Preview ฝั่งขวา

ฝั่งขวาไม่ต้องใช้ 3D และไม่จำเป็นต้องเป็นวิดีโอเต็มรูปแบบ

แนวทางที่ต้องการคือ **2D / manga-like / visual-novel-like presentation**:

- ใช้ภาพ 2D หลายเฟรม
- เปลี่ยน frame / expression / pose ตามบทสนทนา
- ให้ความรู้สึกเหมือนอ่านมังงะหรือฉาก visual novel
- รองรับ Hanzi + Pinyin + คำแปล
- ผูกกับเสียงและ dialogue interaction ได้
- เน้นเบาและสมเหตุสมผลกับเว็บเรียนภาษา มากกว่าการทำ 3D scene

Prototype HTML ปัจจุบันใช้ element จำลองแทน artwork จริง ดังนั้นตอน production สามารถเปลี่ยนเป็น assets 2D จริงภายหลังได้

### 3. Feature Cards ใต้ Hero

ต้องมี section การ์ด 4 ใบประมาณนี้:

- ฟังและอ่าน
- ลองพูดตอบ / Roleplay
- จำคำศัพท์จากเรื่อง
- ทบทวนด้วยเกม

รูปแบบการ์ด:

- ดูเป็น card ลอยเรียบ ๆ
- ไม่ต้องมี CTA button ใหญ่หรือข้อความเชิญกดที่เด่นเกินไป
- ทั้ง card สามารถ clickable ได้
- การกด card เปิด **Popup / Modal demo** โดยยังคงอยู่หน้า Home

### 4. Popup Demo

แต่ละ popup ควรเป็น demo ที่ใช้งานได้จริง ไม่ใช่ภาพอธิบายอย่างเดียว

ข้อมูลขั้นต่ำในตัวอย่าง:

- Hanzi
- Pinyin
- คำแปล
- ฟังก์ชันเสียง
- interaction ที่สัมพันธ์กับหัวข้อนั้น

ตัวอย่าง flow ที่ prototype ใช้อยู่:

`บทสนทนา → คำศัพท์ → Roleplay → เกมทบทวน`

ควรพยายามใช้ข้อมูลสถานการณ์เดียวกันเพื่อให้ผู้ใช้เข้าใจว่าฟีเจอร์ทั้งหมดเชื่อมต่อกัน

### 5. หลัก UX สำหรับผู้ใช้ใหม่

หน้า Home ต้องทำให้ผู้ใช้ใหม่เข้าใจเร็วว่า:

1. เว็บนี้ใช้เรียนอะไร
2. เริ่มเรียนตรงไหน
3. มีอะไรให้ทำบ้าง
4. สามารถทดลอง feature ก่อนเข้า lesson จริงได้

หลีกเลี่ยงการอัดคำอธิบายจำนวนมากหรือทำให้ user ต้องเข้าใจศัพท์ภายในระบบก่อนจึงจะใช้งานได้

## วิธีใช้ Prototype

เปิด `home-preview-v8.html` ใน browser ได้โดยตรงเพื่อดู:

- Hero layout
- Preview carousel
- Feature cards
- Popup interaction
- SpeechSynthesis demo
- Vocabulary demo
- Roleplay demo
- Matching-game demo

Prototype เป็น standalone HTML เพื่อให้ตรวจ visual/interaction ได้เร็วเท่านั้น ไม่ใช่ production implementation

## Workflow ที่แนะนำสำหรับ Agent ต่อไป

1. อ่านไฟล์นี้ก่อน
2. เปิด `home-preview-v8.html`
3. สำรวจ Home production ปัจจุบันใน React project
4. ทำ mapping ว่า prototype ส่วนไหนควรไปอยู่ component ใด
5. reuse routing / localization / audio / lesson data / theme token เดิม
6. implement ทีละส่วน
7. ทำ preview ให้ผู้ใช้ตรวจทุกครั้งก่อนแก้ส่วนใหญ่ต่อ
8. เมื่อผู้ใช้ approve แล้วจึงเก็บรายละเอียด responsive, accessibility และ regression tests

## สิ่งที่ไม่ควรทำ

- copy HTML prototype ไปทับ `StoryExperience.jsx`
- ลบ component เดิมเพื่อให้ prototype รันง่ายขึ้น
- เปลี่ยน theme system ใหม่โดยไม่จำเป็น
- hard-code lesson content แทน registry จริง
- ตัด localization เหลือภาษาเดียว
- ตัด audio service แล้วใช้ SpeechSynthesis อย่างเดียวใน production โดยไม่ตรวจระบบเดิม
- เปลี่ยน route structure โดยไม่จำเป็น
- เปลี่ยน 2D preview เป็น 3D หรือ video-heavy experience โดยพลการ

---

**สรุป:** `home-preview-v8.html` คือแบบตัวอย่างที่ใช้สื่อสาร design/UX เท่านั้น ให้ Agent นำไป **ปรับใช้กับระบบเดิม** ไม่ใช่ใช้แทนระบบเดิมทั้งชุด
