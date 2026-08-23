const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/routing/routes.js');
let content = fs.readFileSync(p, 'utf-8');

// 1. Change default section from "overview" to "contents"
content = content.replace(/section = "overview"/g, 'section = "contents"');
content = content.replace(/section \|\| "overview"/g, 'section || "contents"');
content = content.replace(/parts\[4\] \|\| "overview"/g, 'parts[4] || "contents"');

// 2. Remove "preface" from frontMatterRoutes
content = content.replace(/{\s*name: "preface",\s*path: lessonPath\(lesson, "overview"\),\s*number: "I"\s*},\s*/, '');
content = content.replace(/number: "II"/g, 'number: "I"');
content = content.replace(/number: "III"/g, 'number: "II"');

// 3. Handle old /overview/ URLs by redirecting them to contents
content = content.replace(
  /if \(section === "overview"\) return { level, lessonSlug: slug, name: "preface" };/,
  'if (section === "overview" || section === "preface") return { level, lessonSlug: slug, name: "contents", redirect: true };'
);
content = content.replace(
  /if \(leaf === "preface" \|\| leaf === "overview"\) return { level, lessonSlug: legacySlug, name: "preface" };/,
  'if (leaf === "preface" || leaf === "overview") return { level, lessonSlug: legacySlug, name: "contents", redirect: true };'
);

// 4. Any leftover `name: "preface"` fallback to `name: "contents"`
content = content.replace(/name: "preface"/g, 'name: "contents"');

fs.writeFileSync(p, content, 'utf-8');
