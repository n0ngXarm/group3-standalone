const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/Group3App.jsx');
let content = fs.readFileSync(p, 'utf-8');

// If route has `redirect: true`, we should redirect.
// Add a useEffect to redirect if route.redirect is true.
// Actually, `routeFromLocation()` can just trigger `navigate` but that's impure.
// Inside Group3App:
const oldUseEffect = `  useEffect(() => {
    if (route.name === "home" && hasLearnerSession()) {
      navigate("/home/levels/", { replace: true });
    }
  }, [route.name]);`;

const newUseEffect = `  useEffect(() => {
    if (route.name === "home" && hasLearnerSession()) {
      navigate("/home/levels/", { replace: true });
    } else if (route.redirect) {
      navigate(canonicalPathForRoute(route), { replace: true });
    }
  }, [route.name, route.redirect]);`;

content = content.replace(oldUseEffect, newUseEffect);

// Remove PrefacePage usage
content = content.replace(/import \{ PrefacePage \} from "\.\/features\/reader\/PrefacePage\.jsx";\n/g, '');
content = content.replace(/if \(route\.name === "contents"\) \{/g, `if (route.name === "contents") {`);
// wait, we replaced 'preface' with 'contents' in routes.js, so route.name is 'contents' now.
// Let's remove the block that renders PrefacePage.
content = content.replace(/if \(route\.name === "preface"\) \{\s*return <PrefacePage key=\{`\$\{lesson\.id\}-preface`\} language=\{language\} lesson=\{lesson\} navigate=\{navigate\} \/>;\s*\}/g, '');

fs.writeFileSync(p, content, 'utf-8');
