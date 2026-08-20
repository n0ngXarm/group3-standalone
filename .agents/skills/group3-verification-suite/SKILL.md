---
name: group3-verification-suite
description: >-
  Quality gate, test execution, Vite build check, and Docker standalone container verification guide for Group 3 Standalone. Use when running tests, validating changes before committing, diagnosing regressions, building Vite bundles, or verifying Docker/Nginx deployment.
---

# Group 3 Verification & Quality Gate Suite

Complete runbook for executing automated tests, building the production frontend bundle, and validating the Docker standalone deployment.

---

## 1. Fast Unit & Contract Test Suite

Group 3 uses the native Node.js test runner with ES modules and path alias loader ([`test-alias-loader.js`](file:///home/nong_ing/group3-standalone/source/test-alias-loader.js)).

### Full Suite Run
```bash
cd /home/nong_ing/group3-standalone/source
npm test
```

### Targeted Test Runs by Category

| Target Category | Test File | Command |
| :--- | :--- | :--- |
| **All Mini-Games** | [`group-3.games.test.js`](file:///home/nong_ing/group3-standalone/source/tests/unit/group-3.games.test.js) | `npm test tests/unit/group-3.games.test.js` |
| **Mobile & Touch Contracts** | [`mobile_group3_empirical.test.js`](file:///home/nong_ing/group3-standalone/source/tests/unit/mobile_group3_empirical.test.js) | `npm test tests/unit/mobile_group3_empirical.test.js` |
| **Audio & Persona Registry** | [`group-3.audio.test.js`](file:///home/nong_ing/group3-standalone/source/tests/unit/group-3.audio.test.js) | `npm test tests/unit/group-3.audio.test.js` |
| **Theme & Storage Safety** | [`theme-policy.test.js`](file:///home/nong_ing/group3-standalone/source/tests/unit/theme-policy.test.js) | `npm test tests/unit/theme-policy.test.js` |
| **Standalone Boundaries** | [`standalone-boundary.test.js`](file:///home/nong_ing/group3-standalone/source/tests/unit/standalone-boundary.test.js) | `npm test tests/unit/standalone-boundary.test.js` |
| **Reader & Autoplay** | [`group-3.autoplay-contract.test.js`](file:///home/nong_ing/group3-standalone/source/tests/unit/group-3.autoplay-contract.test.js) | `npm test tests/unit/group-3.autoplay-contract.test.js` |

---

## 2. Frontend Production Build Check

Verify that Vite compiles without syntax errors, asset resolution issues, or bundle breakages:

```bash
cd /home/nong_ing/group3-standalone/source
npm run check
```

---

## 3. Docker Container & Standalone Boundary Checks

Group 3 is designed to run in an isolated, read-only static container without any backend or database dependencies.

### Rebuild and Start Container
```bash
cd /home/nong_ing/group3-standalone
docker compose build --no-cache
docker compose up -d
docker compose ps
```

### Health & Smoke Tests
```bash
# 1. Localhost smoke test (expect HTTP 200)
curl -fsS http://127.0.0.1:8104/group3/ > /dev/null && echo "Local HTTP 200 OK"

# 2. Tailscale access test
curl -fsS http://100.103.145.101:8104/group3/ > /dev/null && echo "Tailscale HTTP 200 OK"

# 3. View container logs
docker compose logs --tail=50
```

### Boundary & Security Checklist
- [x] Read-only root filesystem (`read_only: true`).
- [x] `no-new-privileges: true` security option enabled.
- [x] No backend secrets, API keys, or database dependencies present in image or source.
- [x] WebP assets under 160 KiB.
