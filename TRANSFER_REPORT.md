# Group 3 Standalone Transfer Report

เวลาเสร็จสิ้น: `2026-08-17T23:33:16+07:00`

## ปลายทาง

- Host: `nong_ing@100.103.145.101` ผ่าน Tailscale
- OS/arch: Fedora 44, `x86_64`
- Path: `/home/nong_ing/group3-standalone`
- URL: `http://100.103.145.101:8104/group3/`
- Container: `group3-standalone`
- Image: `group3-standalone:20260817`

## ผลตรวจ

- Package SHA-256: ผ่านทุกไฟล์หลังโอน
- Compose config: ผ่าน
- Container: `running`, `healthy`, restart `0`
- Security: read-only root filesystem, `no-new-privileges`
- Port: `127.0.0.1:8104:80` และ `100.103.145.101:8104:80` เท่านั้น
- Home, HSK1, reader และเกม 4 เกม: HTTP 200
- WebP และ MP3 ตัวอย่าง: HTTP 200
- Asset ที่ไม่มีจริง: HTTP 404
- Chromium ผ่าน Tailscale: render หน้า Group 3 พร้อม CSS, JS, Three.js และรูปภาพสำเร็จ
- Container ที่มีอยู่เดิมบน Fedora (`nongmodels-adminer`): ยังทำงานอยู่

## Image verification

- Image ต้นทางใหม่: `sha256:fa1a59d5a77928ebfe759a87e3a9ce6902ed73923d59c57501b3b6ab599218c4`
- Image Fedora ใหม่: `sha256:505dbda6c24af1311e1bb477f374bcf30f07d6c6f70b6f48ff8b7634cdbac783`
- Docker engine/storage แสดง config image ID ต่างกันหลัง load แต่ filesystem layer digests ตรงกันครบ 10/10 ชั้น
- Rollback image filesystem layer digests ตรงกันครบ 12/12 ชั้น

## Isolation verification

- Source repository HEAD คงเดิม: `8049530e3b6d5cab0833865531615b8f997203e0`
- Git index fingerprint คงเดิม: `e9fc18fe712344730acd40bf60ac127684e831a83962c894a57488eb9a519480`
- Staged diff fingerprint คงเดิม: `448ce946f4fba45edbc99ccd3c9b8f44c47de3cdcacc51f6f38249e682c8f635`
- Unstaged diff fingerprint คงเดิม: `b7e37a58efa41c004a20d53be3ed376b2ba0a6269b548a75672b7e50b51898ac`
- Group 3 container เดิมคง ID/image/start time เดิม และยัง healthy/restart 0

## หมายเหตุที่คาดไว้

- Nginx entrypoint แจ้งว่าแก้ default config ไม่ได้เพราะ root filesystem เป็น read-only; เป็น warning ที่คาดไว้และ Nginx เริ่มทำงานปกติ
- Log error หนึ่งรายการเกิดจาก smoke test asset ปลอมที่ตั้งใจให้ตอบ 404
