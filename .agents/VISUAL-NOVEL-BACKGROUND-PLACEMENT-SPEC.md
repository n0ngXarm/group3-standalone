# Visual Novel Background & Character Placement Spec

## เป้าหมาย

ใช้เอกสารนี้เป็นมาตรฐานสำหรับสร้างหรือปรับ **ภาพพื้นหลังของแต่ละฉาก** ให้เหมาะกับการนำ Character Sprite ไปวางบนหน้าเว็บ/เกม Visual Novel โดยไม่ทำให้ตัวละครดูเหมือนลอย ผิดสเกล บังวัตถุสำคัญ หรือชนกับ UI

---

## 1. รูปแบบภาพพื้นหลัง

- อัตราส่วนหลัก: `16:9`
- ความละเอียดขั้นต่ำแนะนำ: `1920x1080`
- ถ้าเจนความละเอียดสูงกว่า ให้คงอัตราส่วน 16:9
- มุมกล้องควรอยู่ประมาณระดับสายตาของคน
- หลีกเลี่ยง:
  - มุมก้มสูงเกินไป
  - มุมเงยแรง
  - Perspective แบบ wide-angle รุนแรง
  - วัตถุ foreground ขนาดใหญ่ตรงพื้นที่วางตัวละคร
- พื้นหลังต้องไม่มีตัวละครหลักติดมาในภาพ

---

## 2. Character Safe Area

แบ่งพื้นที่แนวนอนโดยประมาณดังนี้:

```text
0%                                                    100%
|-------------------------------------------------------|
|  LEFT CHARACTER  |      STORY / BG      | RIGHT CHARACTER |
|      0-28%       |        28-72%        |      72-100%     |
|-------------------------------------------------------|
```

### Left Character Zone

```text
X = 0% - 28%
```

ใช้สำหรับตัวละครฝั่งซ้าย

### Center Story Zone

```text
X = 28% - 72%
```

ควรปล่อยพื้นที่นี้ให้เห็น:

- ฉากสำคัญ
- เส้นทาง
- ประตู
- โต๊ะ
- เคาน์เตอร์
- Blackboard
- รถไฟ
- อาหาร
- Object ที่เกี่ยวข้องกับบทเรียน

ไม่ควรวางตัวละครหลักทับพื้นที่นี้โดยไม่จำเป็น

### Right Character Zone

```text
X = 72% - 100%
```

ใช้สำหรับตัวละครฝั่งขวา

---

## 3. Character Vertical Placement

Character Sprite แบบ Full Body ควรมีความสูงประมาณ:

```text
80% - 90% ของความสูงภาพ
```

จุดเท้าควรอยู่บน Ground Plane เดียวกับพื้นของฉาก

ตัวละครต้องไม่ดูเหมือน:

- ลอย
- จมพื้น
- สูงผิดสัดส่วนกับประตู/โต๊ะ
- ยืนอยู่บนโต๊ะหรือวัตถุ foreground โดยไม่ได้ตั้งใจ

### ตัวอย่างสำหรับ 1920x1080

ความสูงตัวละครโดยประมาณ:

```text
864px - 972px
```

ไม่จำเป็นต้องใช้ค่าตายตัว ให้ปรับตาม Perspective ของฉาก

---

## 4. Ground Plane

ก่อนสร้างพื้นหลัง ต้องกำหนดพื้นที่ที่ตัวละครจะยืนจริงไว้ก่อน

แนะนำให้พื้นช่วงล่างประมาณ:

```text
Y = 55% - 88%
```

เป็นพื้นที่ที่มองเห็นพื้นชัดเจนและสามารถวางเท้าตัวละครได้

ห้ามวางสิ่งของใหญ่ เช่น:

- โต๊ะ
- กล่อง
- เก้าอี้
- กระถาง
- ชั้นสินค้า
- ป้าย

กินพื้นที่ Character Safe Area มากเกินไป

---

## 5. UI / Dialogue Box Safe Area

บริเวณล่างของภาพประมาณ:

```text
Y = 78% - 100%
```

ควรถือเป็น UI Safe Area

ใช้สำหรับ:

- Dialogue Box
- ชื่อตัวละคร
- Subtitle
- Choice Buttons
- Control Buttons

อย่าวาง Object สำคัญของเนื้อเรื่องไว้ในบริเวณนี้

ตัวละครสามารถซ้อนบางส่วนกับ Dialogue Box ได้ถ้า UI Design รองรับ แต่ไม่ควรให้ส่วนสำคัญของร่างกายถูกตัดแบบแปลก ๆ

---

# Scene Specifications

## Scene 1 — ตลาดผลไม้ & ร้านน้ำชา

บทเรียน: `HSK 1`

ตัวละคร:

- 王老师 / แม่ค้าผลไม้
- David

### Background Composition

แนะนำ:

```text
LEFT CHARACTER ZONE
แม่ค้าผลไม้

CENTER
ทางเดินตลาด / Perspective / ฉากเมือง

RIGHT CHARACTER ZONE
David
```

องค์ประกอบพื้นหลัง:

- ร้านผลไม้
- แอปเปิล
- ส้ม
- ผลไม้หลายชนิด
- ร้านน้ำชา
- โคมจีน
- อาคารตลาดจีน
- ทางเดินกลาง

สำคัญ:

ร้านผลไม้สามารถอยู่ด้านซ้าย แต่ต้องไม่ยื่นเข้ามาจนกินพื้นที่ยืนของแม่ค้า

ร้านน้ำชาสามารถอยู่ด้านขวาหรือด้านหลัง แต่ต้องเหลือพื้นที่ยืนให้ David

Perspective ต้องทำให้ตัวละครทั้งสองดูเหมือนยืนบนทางเดินตลาดเดียวกัน

---

## Scene 2 — ห้องเรียนมหาวิทยาลัย

บทเรียน: `HSK 1`

ตัวละคร:

- Li Ming
- Mary

### Background Composition

```text
LEFT
Li Ming

CENTER
กระดาน / Projector / Classroom Focus

RIGHT
Mary
```

องค์ประกอบ:

- โต๊ะเรียน
- เก้าอี้
- Blackboard
- Projector Screen
- หน้าต่างมหาวิทยาลัย
- แสงกลางวัน

สำคัญ:

อย่าวางโต๊ะเรียนบังพื้นที่เท้าของตัวละครฝั่งซ้ายและขวา

ตำแหน่งตัวละครควรเหมือนยืนอยู่หน้าห้องหรือบริเวณ aisle

---

## Scene 3 — ภัตตาคาร / สั่งอาหาร

บทเรียน: `HSK 2`

ตัวละคร:

- Waiter
- Liu Ming

### Background Composition

```text
LEFT
Waiter

CENTER
โต๊ะอาหาร / Restaurant Interior

RIGHT
Liu Ming
```

องค์ประกอบ:

- โต๊ะจีน
- เก้าอี้
- โคมแดง
- การตกแต่งไม้
- เครื่องชา
- ภัตตาคารจีนแบบ Traditional + Modern

สำคัญ:

ต้องมีพื้นที่พื้นด้านหน้าโต๊ะให้ตัวละครสามารถยืนได้

ไม่ควรให้โต๊ะหลักกินพื้นที่จากซ้ายถึงขวาทั้งภาพ

---

## Scene 4 — สถานีรถไฟความเร็วสูง

บทเรียน: `HSK 3`

ตัวละคร:

- เจ้าหน้าที่รถไฟ
- Wang Yixue

### Background Composition

```text
LEFT
Wang Yixue

CENTER
สถานี / Ticket Area / Direction Sign

RIGHT
Railway Officer
```

หรือสลับซ้าย-ขวาตามบทสนทนาได้

องค์ประกอบ:

- Ticket Machine
- Information Counter
- ป้าย Direction
- Digital Schedule
- ประตูตรวจตั๋ว
- โครงสร้างสถานีรถไฟจีนสมัยใหม่

สำคัญ:

อย่าให้ Ticket Machine หรือเก้าอี้กิน Character Safe Area

ต้องมี Floor Perspective ชัด เพื่อให้วางตัวละครได้สมจริง

---

## Scene 5 — งานเลี้ยงห่อเกี๊ยวตรุษจีน

บทเรียน: `HSK 3`

ตัวละคร:

- Zhang Jie
- David

### Background Composition

```text
LEFT
Zhang Jie

CENTER
โต๊ะทำเกี๊ยว

RIGHT
David
```

องค์ประกอบ:

- โต๊ะไม้
- แป้ง
- ไส้เกี๊ยว
- เกี๊ยว
- เขียง
- โคมแดง
- ของตกแต่งตรุษจีน
- ห้องครัว / ห้องรับประทานอาหารจีน

สำคัญ:

โต๊ะทำเกี๊ยวเป็น Story Object หลัก

แต่ไม่ควรอยู่ด้านหน้าจนบังตัวละครเต็มตัว

แนะนำให้โต๊ะอยู่ระดับกลางหรือด้านหลังของตัวละคร

---

# Background Generation Rules

เวลา Agent สร้าง Prompt สำหรับ Background ให้เพิ่มแนวคิดประมาณนี้:

```text
visual novel background,
2D modern anime environment,
clean detailed background,
eye-level camera,
natural perspective,
wide 16:9 composition,
empty character standing space on both left and right foreground,
clear visible floor for full-body character placement,
important environmental storytelling elements concentrated in center,
no people,
no foreground objects blocking character zones,
composition designed for visual novel character sprites,
leave bottom UI safe area relatively uncluttered
```

---

# Negative Prompt / สิ่งที่ควรหลีกเลี่ยง

```text
people,
crowd,
character,
foreground person,
extreme wide angle,
fisheye,
dramatic tilted camera,
high-angle camera,
low-angle camera,
huge foreground objects,
objects blocking left character area,
objects blocking right character area,
cropped floor,
unclear ground plane,
busy bottom UI area
```

---

# Web Implementation Guide

ถ้า Agent นำไปวางในหน้าเว็บ ให้แยก Background กับ Character Sprite คนละ Layer

```text
Layer 1 — Background
Layer 2 — Character Left
Layer 3 — Character Right
Layer 4 — Dialogue / UI
```

ตัวอย่างแนวคิด CSS:

```css
.scene {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.scene-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.character {
  position: absolute;
  bottom: 0;
  height: 85%;
  object-fit: contain;
}

.character-left {
  left: 3%;
}

.character-right {
  right: 3%;
}

.dialogue-ui {
  position: absolute;
  left: 5%;
  right: 5%;
  bottom: 3%;
}
```

ตัวเลขเป็นค่าเริ่มต้น สามารถปรับตามแต่ละฉากได้

---

# Agent Instruction

เมื่อสร้างหรือแก้ Background:

1. อ่าน Character Sprite ที่จะใช้ในฉากก่อน
2. ประเมินความสูงและสัดส่วนตัวละคร
3. กำหนด Left / Right Character Safe Area
4. กำหนดตำแหน่ง Ground Plane
5. วาง Story Object ไว้บริเวณ Center
6. เว้นพื้นที่ด้านล่างสำหรับ Dialogue UI
7. ตรวจ Perspective ว่าเท้าตัวละครสามารถยืนบนพื้นได้จริง
8. ทดลอง Composite ตัวละครลงบน Background ก่อนอนุมัติภาพ
9. หากตัวละครดูใหญ่/เล็กผิดธรรมชาติ ให้ปรับ Background Perspective หรือ Sprite Scale
10. ห้ามเลือก Background จากความสวยอย่างเดียว ต้องประเมินการใช้งานร่วมกับ Character Sprite ก่อน

---

## หลักสำคัญ

> Background ของ Visual Novel ไม่ใช่ภาพเดี่ยวที่ต้องสวยที่สุด แต่เป็นพื้นที่สำหรับรองรับ Character Sprite, Story Object และ UI พร้อมกัน

ทุกครั้งที่สร้าง Background ต้องคิดตำแหน่งตัวละครไว้ตั้งแต่ขั้นตอน Composition
