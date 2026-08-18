import { SURFACE_RUNTIME_CONFIG } from "./config.js";

const DIRECT_SURFACE_PORTS = Object.freeze(
  Object.fromEntries(
    Object.entries(SURFACE_RUNTIME_CONFIG.directPorts)
      .map(([surface, port]) => [surface, String(port)]),
  ),
);

const GATEWAY_SURFACE_PATTERN = /^\/(central|group[1-5])(?:\/|$)/i;
const RETIRED_LEARNING_PARAMS = Object.freeze(["learner", "level", "lesson"]);

function currentLocation() {
  if (typeof window === "undefined") {
    return {
      hash: "",
      hostname: "localhost",
      pathname: "/",
      port: "",
      protocol: "http:",
      search: "",
    };
  }
  return window.location;
}

function normalizePath(path = "/") {
  const value = String(path || "/");
  return `/${value.replace(/^\/+/, "")}`;
}

function surfaceKey(groupId) {
  if (groupId === "central" || Number(groupId) === 0) return "central";
  const numericGroupId = Number(groupId);
  if (!Number.isInteger(numericGroupId) || numericGroupId < 1 || numericGroupId > 5) {
    throw new RangeError(`Unknown HuaYun surface: ${groupId}`);
  }
  return `group${numericGroupId}`;
}

function directSurface(location) {
  const locationPort = String(location.port || "");
  return Object.entries(DIRECT_SURFACE_PORTS)
    .find(([, port]) => port === locationPort)?.[0] || null;
}

function namedProductionSurface(location) {
  const hostname = String(location.hostname || "")
    .trim()
    .toLowerCase()
    .replace(/\.$/, "");
  const domain = SURFACE_RUNTIME_CONFIG.productionDomain.toLowerCase();
  const domainSuffix = `.${domain}`;
  if (!hostname.endsWith(domainSuffix)) return null;

  const subdomain = hostname.slice(0, -domainSuffix.length);
  return Object.entries(SURFACE_RUNTIME_CONFIG.subdomains)
    .find(([, configuredSubdomain]) => configuredSubdomain === subdomain)?.[0] || null;
}

function namedProductionHostname(surface) {
  return `${SURFACE_RUNTIME_CONFIG.subdomains[surface]}.${SURFACE_RUNTIME_CONFIG.productionDomain}`;
}

function gatewaySurface(location) {
  if (directSurface(location) || namedProductionSurface(location)) return null;
  return location.pathname?.match(GATEWAY_SURFACE_PATTERN)?.[1]?.toLowerCase() || null;
}

function applyAllowedUiParams(url, theme) {
  RETIRED_LEARNING_PARAMS.forEach((parameter) => url.searchParams.delete(parameter));
  if (theme === "light" || theme === "dark") url.searchParams.set("theme", theme);
  return url;
}

function localHref(path, theme) {
  const url = new URL(path, "http://huayun.local");
  applyAllowedUiParams(url, theme);
  return `${url.pathname}${url.search}${url.hash}`;
}

function absoluteSurfaceHref(origin, path, theme) {
  const url = new URL(path, origin);
  applyAllowedUiParams(url, theme);
  return url.href;
}

export function surfacePath(groupId, path = "/", location = currentLocation()) {
  const target = surfaceKey(groupId);
  const normalizedPath = normalizePath(path);
  return gatewaySurface(location) ? `/${target}${normalizedPath}` : normalizedPath;
}

export function surfaceAssetPath(groupId, assetPath, location = currentLocation()) {
  const normalizedAssetPath = normalizePath(assetPath);
  if (!normalizedAssetPath.startsWith("/assets/") && !normalizedAssetPath.startsWith("/covers/")) {
    throw new TypeError(`Surface asset must start with /assets/ or /covers/: ${assetPath}`);
  }
  return surfacePath(groupId, normalizedAssetPath, location);
}

export function surfaceHref(
  targetGroupId,
  path = "/",
  {
    location = currentLocation(),
    sourceGroupId = null,
    theme = null,
  } = {},
) {
  const target = surfaceKey(targetGroupId);
  const source = sourceGroupId === null ? null : surfaceKey(sourceGroupId);
  const normalizedPath = normalizePath(path);
  const currentDirectSurface = directSurface(location);
  const currentNamedSurface = namedProductionSurface(location);

  if (gatewaySurface(location)) {
    return localHref(`/${target}${normalizedPath}`, theme);
  }

  if (currentNamedSurface) {
    if (target === currentNamedSurface) return localHref(normalizedPath, theme);

    const targetOrigin = new URL(
      `${location.protocol || "https:"}//${namedProductionHostname(target)}`,
    );
    if (location.port) targetOrigin.port = String(location.port);
    return absoluteSurfaceHref(targetOrigin, normalizedPath, theme);
  }

  if (!currentDirectSurface || target === currentDirectSurface) {
    const localPath = target === source || currentDirectSurface
      ? normalizedPath
      : `/${target}${normalizedPath}`;
    return localHref(localPath, theme);
  }

  const targetOrigin = new URL(
    `${location.protocol || "http:"}//${location.hostname || "localhost"}`,
  );
  targetOrigin.port = DIRECT_SURFACE_PORTS[target];
  return absoluteSurfaceHref(targetOrigin, normalizedPath, theme);
}

export function canonicalSurfaceLocation(
  groupId,
  path,
  {
    hash = "",
    location = currentLocation(),
    scene = null,
    theme = null,
  } = {},
) {
  const url = new URL(surfacePath(groupId, path, location), "http://huayun.local");
  applyAllowedUiParams(url, theme);
  if (scene !== null && Number.isInteger(Number(scene))) url.searchParams.set("scene", String(scene));
  url.hash = hash;
  return `${url.pathname}${url.search}${url.hash}`;
}

export function removeLegacyLearningParams(location = currentLocation()) {
  const url = new URL(
    `${location.pathname || "/"}${location.search || ""}${location.hash || ""}`,
    "http://huayun.local",
  );
  RETIRED_LEARNING_PARAMS.forEach((parameter) => url.searchParams.delete(parameter));
  return `${url.pathname}${url.search}${url.hash}`;
}
