# Group 3 Home PageSpeed Optimization Spec

## User outcome

Improve the deployed Group 3 experience across desktop, tablet, and mobile, starting with the Home screen measured by the saved PageSpeed report. Preserve the current visual identity and route behavior; redesign only controls or loading behavior that PageSpeed identifies as problematic.

## Baseline

Saved report: <https://pagespeed.web.dev/analysis/https-group3-standalone-vercel-app/uczm11d5z3>

- Desktop: Performance 91, Accessibility 93, FCP 1.3 s, LCP 1.4 s, TBT 0 ms, CLS 0.
- Mobile: Performance 57, Accessibility 96, FCP 7.8 s, LCP 9.4 s, TBT 0 ms, CLS 0.
- Render-blocking resources: `theme-init.js`, the main application stylesheet, and Google Fonts; estimated desktop savings 950 ms and mobile savings 6,140 ms.
- Unused transfer: CSS 122 KiB and JavaScript 129 KiB, including 58 KiB attributed to Three.js.
- Image delivery: the 768 px Home backdrop is 93.3 KiB with estimated savings of 67.3 KiB.
- Accessibility failures: the active `TH` language button lacks contrast; desktop carousel dots lack sufficient touch size or spacing.
- Animation diagnostics: the sign entrance, CTA glow, and color transitions are not fully composited.

## Acceptance criteria

- Google Fonts must not block first render; a no-JavaScript fallback must remain.
- The synchronous theme decision must remain available before the application module runs without a separate render-blocking request.
- Decorative Three.js must not be requested before deliberate user interaction and must remain disabled by the adaptive-performance policy where appropriate.
- Every Home carousel tab must expose a rendered target of at least 44 by 44 CSS pixels at desktop, tablet, and mobile widths.
- The selected language control must have a WCAG AA contrast ratio of at least 4.5:1 in light and dark themes.
- The Home hero must retain responsive `srcset`, explicit dimensions, high fetch priority, and use a materially smaller 768 px asset without visible layout changes.
- Initial Home route JavaScript and CSS must exclude route-only lesson/practice payloads where this can be done without changing route behavior.
- Existing Home, routing, theme, mobile, and production-build checks must pass.
- Browser verification must cover 1366x768, 1024x768, 768x1024, 412x915, and 360x800.
- PageSpeed/Lighthouse reruns must preserve CLS 0 and TBT 0 while improving the mobile critical path; external score variance is reported rather than hidden.

## Non-goals

- No visual redesign of screens that already fit and remain usable.
- No removal of multilingual typography, themes, lesson content, audio, or WebGL capability after interaction.
- No backend, routing URL, or learner-session contract changes.
