import { spinnerIcon } from "./iconPaths.js";

const FALLBACK_PATHS = Object.freeze(["M5 5h14v14H5V5Z"]);

export default function Icon({
  paths = FALLBACK_PATHS,
  size = "1em",
  className = "",
  decorative = true,
  label,
  spin = false,
  style,
  ...props
}) {
  const resolvedPaths = paths?.length ? paths : FALLBACK_PATHS;
  const isSpinner = paths === spinnerIcon;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      aria-hidden={decorative ? "true" : undefined}
      aria-label={decorative ? undefined : label}
      role={decorative ? undefined : "img"}
      className={`ui-icon${spin || isSpinner ? " ui-icon--spin" : ""}${className ? ` ${className}` : ""}`}
      style={{ "--ui-icon-size": size, ...style }}
      {...props}
    >
      {resolvedPaths.map((path, index) => <path d={path} key={`${path}-${index}`} />)}
    </svg>
  );
}
