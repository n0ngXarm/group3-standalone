import puppeteer from "puppeteer";

const target = process.argv[2] ?? "http://127.0.0.1:4178/group3/home/?theme=dark";
const fontStylesheetOverride = process.argv[3] ?? "";
const summaryOnly = process.argv.includes("--summary");
const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1 });
  if (fontStylesheetOverride) {
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (request.url().startsWith("https://fonts.googleapis.com/css2?")) {
        request.continue({ url: fontStylesheetOverride });
      } else {
        request.continue();
      }
    });
  }
  const client = await page.createCDPSession();
  await client.send("Network.enable");
  await client.send("Network.setCacheDisabled", { cacheDisabled: true });

  const requests = new Map();
  client.on("Network.requestWillBeSent", (event) => {
    requests.set(event.requestId, {
      requestId: event.requestId,
      url: event.request.url,
      type: event.type,
      initiator: event.initiator?.type ?? "",
      initiatorUrl: event.initiator?.url ?? event.documentURL ?? "",
      priority: event.request.initialPriority ?? "",
      requestTimestamp: event.timestamp,
    });
  });
  client.on("Network.responseReceived", (event) => {
    const request = requests.get(event.requestId);
    if (!request) return;
    request.type = event.type;
    request.mimeType = event.response.mimeType;
    request.responseTimestamp = event.timestamp;
    request.timing = event.response.timing ?? null;
    request.protocol = event.response.protocol;
    request.fromDiskCache = event.response.fromDiskCache;
  });
  client.on("Network.loadingFinished", (event) => {
    const request = requests.get(event.requestId);
    if (!request) return;
    request.transferSize = event.encodedDataLength;
    request.finishTimestamp = event.timestamp;
  });

  await page.goto(target, { waitUntil: "networkidle0", timeout: 60_000 });
  await new Promise((resolve) => setTimeout(resolve, 5_000));

  const pageData = await page.evaluate(() => {
    const cleanFamily = (value) => value.split(",").map((part) => part.trim().replaceAll('"', ""));
    const nodes = [...document.querySelectorAll("body *")].filter((element) => {
      if (!(element instanceof HTMLElement)) return false;
      if (!element.textContent?.trim()) return false;
      if ([...element.children].some((child) => child.textContent?.trim())) return false;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
    });
    const describe = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        tag: element.tagName.toLowerCase(),
        className: element.className?.toString().slice(0, 120) ?? "",
        text: element.textContent.trim().replace(/\s+/g, " ").slice(0, 120),
        family: cleanFamily(style.fontFamily),
        weight: style.fontWeight,
        style: style.fontStyle,
        fontSize: style.fontSize,
        aboveFold: rect.top < innerHeight && rect.bottom > 0,
      };
    };
    return {
      origin: location.origin,
      fonts: [...document.fonts].map((font) => ({
        family: font.family.replaceAll('"', ""),
        weight: font.weight,
        style: font.style,
        display: font.display,
        status: font.status,
        unicodeRange: font.unicodeRange,
      })),
      textRuns: nodes.map(describe),
      resources: performance.getEntriesByType("resource").map((entry) => ({
        url: entry.name,
        initiatorType: entry.initiatorType,
        startTime: entry.startTime,
        duration: entry.duration,
        transferSize: entry.transferSize,
        decodedBodySize: entry.decodedBodySize,
      })),
    };
  });

  const googleStylesheet = [...requests.values()].find((request) =>
    request.type === "Stylesheet" && request.url.startsWith("https://fonts.googleapis.com/"));
  let googleCss = "";
  if (googleStylesheet) {
    try {
      googleCss = (await client.send("Network.getResponseBody", {
        requestId: googleStylesheet.requestId,
      })).body;
    } catch {
      googleCss = "";
    }
  }
  const fontFaces = [...googleCss.matchAll(/@font-face\s*{([^}]+)}/g)].map((match) => {
    const body = match[1];
    const value = (property) => body.match(new RegExp(`${property}\\s*:\\s*([^;]+)`))?.[1]?.trim() ?? "";
    const source = value("src");
    return {
      family: value("font-family").replaceAll(/["']/g, ""),
      weight: value("font-weight"),
      style: value("font-style"),
      display: value("font-display"),
      format: source.match(/format\(["']?([^"')]+)["']?\)/)?.[1] ?? "",
      url: source.match(/url\(([^)]+)\)/)?.[1]?.replaceAll(/["']/g, "") ?? "",
      unicodeRange: value("unicode-range"),
    };
  });

  const network = [...requests.values()].filter((request) => request.transferSize != null);
  const aboveFoldTypography = pageData.textRuns.filter((run) => run.aboveFold);
  const fontRequests = network
    .filter((request) => request.type === "Font" || /font|woff|ttf|otf/i.test(request.mimeType ?? ""))
    .map((request) => {
      const face = fontFaces.find((candidate) => candidate.url === request.url) ?? {};
      const usedAboveFold = aboveFoldTypography.some((run) =>
        run.family.includes(face.family));
      const usedOnHome = pageData.textRuns.some((run) =>
        run.family.includes(face.family));
      return {
      url: request.url,
      family: face.family ?? "",
      weight: face.weight ?? "",
      style: face.style ?? "",
      format: face.format ?? request.mimeType ?? "",
      display: face.display ?? "",
      unicodeRange: face.unicodeRange ?? "",
      transferSize: request.transferSize,
      priority: request.priority,
      initiator: request.initiator,
      initiatorUrl: request.initiatorUrl,
      durationMs: request.finishTimestamp && request.requestTimestamp
        ? (request.finishTimestamp - request.requestTimestamp) * 1_000
        : null,
      crossOrigin: new URL(request.url).origin !== pageData.origin,
      usedAboveFold,
      usedOnHome,
    };})
    .sort((a, b) => b.transferSize - a.transferSize);
  const blockers = network
    .filter((request) => request.type === "Stylesheet")
    .map((request) => ({
      url: request.url,
      type: request.type,
      transferSize: request.transferSize,
      resourceSize: pageData.resources.find((entry) => entry.url === request.url)?.decodedBodySize ?? null,
      durationMs: request.finishTimestamp && request.requestTimestamp
        ? (request.finishTimestamp - request.requestTimestamp) * 1_000
        : null,
      priority: request.priority,
      initiator: request.initiator,
      initiatorUrl: request.initiatorUrl,
      timing: request.timing,
    }))
    .sort((a, b) => b.transferSize - a.transferSize);
  const usedTypography = Object.values(pageData.textRuns.reduce((groups, run) => {
    const key = `${run.family.join(", ")} | ${run.weight} | ${run.style}`;
    const group = groups[key] ??= {
      family: run.family,
      weight: run.weight,
      style: run.style,
      aboveFold: false,
      examples: [],
    };
    group.aboveFold ||= run.aboveFold;
    if (group.examples.length < 5) group.examples.push(run.text);
    return groups;
  }, {}));
  const totals = network.reduce((result, request) => {
    result.total += request.transferSize;
    if (request.type === "Font") result.font += request.transferSize;
    if (request.type === "Stylesheet") result.css += request.transferSize;
    return result;
  }, { total: 0, font: 0, css: 0 });

  const fontGroups = Object.values(fontRequests.reduce((groups, font) => {
    const key = `${font.family}|${font.weight}|${font.style}`;
    const group = groups[key] ??= {
      family: font.family,
      weight: font.weight,
      style: font.style,
      files: 0,
      transferSize: 0,
      usedAboveFold: false,
      usedOnHome: false,
    };
    group.files += 1;
    group.transferSize += font.transferSize;
    group.usedAboveFold ||= font.usedAboveFold;
    group.usedOnHome ||= font.usedOnHome;
    return groups;
  }, {})).sort((a, b) => b.transferSize - a.transferSize);

  const report = {
    target,
    fontStylesheetOverride: fontStylesheetOverride || null,
    totals,
    fontFileCount: fontRequests.length,
    fontGroups,
    fontRequests,
    usedTypography,
    blockers,
  };
  if (summaryOnly) {
    delete report.fontRequests;
    report.usedTypography = usedTypography.filter((group) => group.aboveFold);
  }
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
