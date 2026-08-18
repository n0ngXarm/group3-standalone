# Group 3 Standalone

แพ็กเกจเฉพาะ Group 3 สำหรับเครื่อง `linux/amd64` แยกจากระบบ China-v2 หลัก

## ขอบเขต

- Frontend Group 3: HSK 1–3, 48 บท, reader, เสียง, รูป และเกม 4 เกม
- Static Nginx เท่านั้น ไม่มี backend, PostgreSQL หรือ secret จากระบบหลัก
- เปิดบริการที่พอร์ต `8104` เฉพาะ `127.0.0.1` และ Tailscale `100.103.145.101`
- Image หลัก: `group3-standalone:20260817`
- Image ย้อนกลับจากระบบเดิม: `group3-standalone:live-rollback-20260813`
- Source snapshot มาจาก working tree ของ `/home/pisitpong/China-v2` ที่ HEAD `8049530e3b6d5cab0833865531615b8f997203e0`

## ติดตั้งจาก image ที่แนบมา

```bash
cd /home/nong_ing/group3-standalone
sha256sum -c SHA256SUMS
gzip -dc images/group3-images-amd64.tar.gz | docker load
docker compose config
docker compose up -d --no-build
docker compose ps
curl -fsS http://127.0.0.1:8104/group3/ >/dev/null
```

เปิดจากเครื่องใน Tailscale:

```text
http://100.103.145.101:8104/group3/
```

## คำสั่งดูแล

```bash
docker compose logs --tail=100
docker compose restart
docker compose down
```

## Build ใหม่จาก source snapshot

```bash
docker compose build --no-cache
docker compose up -d
```

## Rollback ชั่วคราว

หยุดบริการหลัก แล้วรัน image เดิมบนพอร์ตเดียวกัน:

```bash
docker compose down
docker run -d --name group3-standalone-rollback \
  --restart unless-stopped \
  --read-only --security-opt no-new-privileges:true \
  --tmpfs /var/cache/nginx --tmpfs /var/run --tmpfs /tmp \
  -p 8104:80 group3-standalone:live-rollback-20260813
```

กลับมาใช้ image ใหม่:

```bash
docker stop group3-standalone-rollback
docker rm group3-standalone-rollback
docker compose up -d --no-build
```

## หมายเหตุ

- `source/node_modules` และ `source/dist` ไม่อยู่ในแพ็กเกจ เพื่อลดขนาดและป้องกัน artifact ชั่วคราวปนไป
- Source มีไฟล์เสียง WebP และ compatibility symlink ครบตาม Group 3
- Container ใช้ root filesystem แบบ read-only, `no-new-privileges` และ resource limits
