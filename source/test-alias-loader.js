import { register } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { fileURLToPath } from "node:url";

try {
  register(import.meta.url);
} catch {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, "./src");

const ALIASES = [
  { prefix: "@components/ui", target: "shared/components/ui/index.js" },
  { prefix: "@components/layout", target: "shared/components/layout/index.js" },
  { prefix: "@components/three", target: "shared/components/three/index.js" },
  { prefix: "@components", target: "shared/components/index.js" },
  { prefix: "@components/", target: "shared/components/" },
  { prefix: "@features/games", target: "shared/features/games/index.js" },
  { prefix: "@features/group-portal", target: "shared/features/group-portal/index.js" },
  { prefix: "@features", target: "shared/features/index.js" },
  { prefix: "@features/", target: "shared/features/" },
  { prefix: "@lib", target: "shared/lib/index.js" },
  { prefix: "@lib/", target: "shared/lib/" },
  { prefix: "@hooks", target: "shared/hooks/index.js" },
  { prefix: "@hooks/", target: "shared/hooks/" },
  { prefix: "@services", target: "shared/services/index.js" },
  { prefix: "@services/", target: "shared/services/" },
  { prefix: "@styles/", target: "shared/styles/" },
  { prefix: "@styles", target: "shared/styles/" },
  { prefix: "@shared/", target: "shared/" },
  { prefix: "@surfaces/", target: "surfaces/" },
  { prefix: "@assets/", target: "assets/" },
  { prefix: "@app/", target: "app/" },
  { prefix: "@app", target: "app/index.js" },
  { prefix: "@/", target: "" },
];

export function resolve(specifier, context, nextResolve) {
  for (const { prefix, target } of ALIASES) {
    if (specifier === prefix) {
      const fullPath = path.resolve(srcDir, target);
      return nextResolve(pathToFileURL(fullPath).href, context);
    }
    if (prefix.endsWith("/") && specifier.startsWith(prefix)) {
      const subPath = specifier.slice(prefix.length);
      const fullPath = path.resolve(srcDir, target, subPath);
      return nextResolve(pathToFileURL(fullPath).href, context);
    }
  }
  return nextResolve(specifier, context);
}
