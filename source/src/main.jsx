import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "@shared/styles/runtime.css";
import SurfaceLoader from "@app/SurfaceLoader.jsx";
import { getBrowserAdaptiveThreePolicy } from "@lib";

const ThreeBackdrop = React.lazy(() => import("@components/three/ThreeBackdrop.jsx"));


function DeferredThreeBackdrop() {
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const policy = getBrowserAdaptiveThreePolicy();
    if (!policy.allowDecorativeWebGL) return undefined;

    const mountBackdrop = () => setShouldMount(true);
    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(mountBackdrop, { timeout: 1500 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timerId = window.setTimeout(mountBackdrop, 320);
    return () => window.clearTimeout(timerId);
  }, []);

  if (!shouldMount) {
    return <div className="three-container three-container-fallback" aria-hidden="true" />;
  }

  return (
    <React.Suspense fallback={<div className="three-container three-container-fallback" aria-hidden="true" />}>
      <ThreeBackdrop />
    </React.Suspense>
  );
}

// Remove data left by the retired account/progress system. Theme persistence is
// owned by the synchronous controller loaded from index.html before this module.
try {
  ["huayun_client_id", "huayun_learner", "huayun_p", "huayun_language"]
    .forEach((key) => localStorage.removeItem(key));
  const cleanUrl = new URL(window.location.href);
  const retiredParams = ["learner", "level", "lesson"];
  if (retiredParams.some((parameter) => cleanUrl.searchParams.has(parameter))) {
    retiredParams.forEach((parameter) => cleanUrl.searchParams.delete(parameter));
    window.history.replaceState(window.history.state, "", `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`);
  }
} catch {
  // Storage can be unavailable in privacy-focused browsers; the app still works.
}

const rootElement = document.getElementById("root");
const appRoot = window.__HUAYUN_REACT_ROOT__ || createRoot(rootElement);
window.__HUAYUN_REACT_ROOT__ = appRoot;

appRoot.render(
  <React.StrictMode>
    <DeferredThreeBackdrop />
    <React.Suspense fallback={<div className="app-loading" role="status">กำลังโหลด...</div>}>
      <SurfaceLoader />
    </React.Suspense>
  </React.StrictMode>,
);
