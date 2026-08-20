export const REPORT_CONFIG = Object.freeze({
  categories: Object.freeze(["bug", "content", "design", "suggestion"]),
  severities: Object.freeze(["low", "medium", "high"]),
  descriptionMinChars: 10,
  descriptionMaxChars: 4_000,
  stepsMaxChars: 3_000,
  maxPayloadBytes: 60 * 1024,
});

export const SURFACE_RUNTIME_CONFIG = Object.freeze({
  productionDomain: "nongmodels.com",
  subdomains: Object.freeze({
    central: "central",
    group1: "group1",
    group2: "group2",
    group3: "group3",
    group4: "group4",
    group5: "group5",
  }),
  directPorts: Object.freeze({
    central: 8101,
    group1: 8102,
    group2: 8103,
    group3: 8104,
    group4: 8105,
    group5: 8106,
  }),
});

export const APP_CONFIG = {
  name: "HuaYun China-v2",
  subtitle: "เว็บไซต์เรียนภาษาจีนสำหรับโปรเจกต์กลุ่ม HSK1 - HSK3",
  apiBaseUrl: (import.meta.env?.VITE_API_URL ?? "").replace(/\/$/, ""),
  defaultLanguage: "th",
  totalLessons: 48,
  groupPorts: {
    hub: SURFACE_RUNTIME_CONFIG.directPorts.central,
    group1: SURFACE_RUNTIME_CONFIG.directPorts.group1,
    group2: SURFACE_RUNTIME_CONFIG.directPorts.group2,
    group3: SURFACE_RUNTIME_CONFIG.directPorts.group3,
    group4: SURFACE_RUNTIME_CONFIG.directPorts.group4,
    group5: SURFACE_RUNTIME_CONFIG.directPorts.group5,
  },
  report: REPORT_CONFIG,
  theme: {
    bgBase: "#faf7f1",
    bgSurface: "#fffdf9",
    accentGold: "#b99a65",
    accentFill: "#86693b",
    textPrimary: "#2b241c",
    textSecondary: "#7c7264",
    borderHairline: "#e7dfd0",
  },
};

export default APP_CONFIG;
