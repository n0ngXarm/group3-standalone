import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const packageRoot = path.dirname(sourceRoot);

test("nginx is static-only and has no backend or API proxy", async () => {
  const nginx = await readFile(path.join(sourceRoot, "nginx.conf"), "utf8");
  assert.doesNotMatch(nginx, /backend:|proxy_pass|DATABASE_URL|\/api\//);
  assert.match(nginx, /location \^~ \/group3\//);
  assert.match(nginx, /location \/home/);
});

test("compose exposes only the standalone frontend", async () => {
  const compose = await readFile(path.join(packageRoot, "compose.yaml"), "utf8");
  assert.match(compose, /group3-standalone:20260817/);
  assert.match(compose, /"127\.0\.0\.1:8104:80"/);
  assert.match(compose, /"100\.103\.145\.101:8104:80"/);
  assert.doesNotMatch(compose, /"8104:80"|0\.0\.0\.0/);
  assert.doesNotMatch(compose, /postgres|DATABASE_URL|cloudflare|privileged/);
});
