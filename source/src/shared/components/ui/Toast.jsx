import { useEffect } from "react";
import Icon from "./Icon.jsx";
import { circleCheckIcon } from "./iconPaths.js";

export default function Toast({ message, visible, onClose }) {
  useEffect(() => {
    if (!visible) return undefined;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  if (!visible) return null;

  const toastStyle = {
    position: "fixed",
    left: "50%",
    bottom: "1.5rem",
    transform: "translateX(-50%)",
    zIndex: 9999,
    width: "min(440px, calc(100vw - 1.5rem))",
    maxWidth: "calc(100vw - 1.5rem)",
    pointerEvents: "none",
  };

  const contentStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    width: "100%",
    padding: "0.8rem 1rem",
    borderRadius: "0.9rem",
    background: "rgba(15, 23, 42, 0.92)",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.22)",
    color: "#f8fafc",
    whiteSpace: "normal",
    lineHeight: 1.4,
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  };

  return (
    <div className="toast-wrap" style={toastStyle} aria-live="polite" aria-atomic="true">
      <div className="toast-content" style={contentStyle}>
        <Icon paths={circleCheckIcon} />
        <span className="text-sm font-medium" style={{ display: "block", minWidth: 0, flex: 1, overflowWrap: "anywhere", wordBreak: "break-word" }}>{message}</span>
      </div>
    </div>
  );
}
