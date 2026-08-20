import { useEffect, useRef, useState } from "react";

const DEFAULT_ROOT_MARGIN = "160px 0px";

export default function useDeferredMedia({
  disabled = false,
  eager = false,
  rootMargin = DEFAULT_ROOT_MARGIN,
} = {}) {
  const targetRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(() => eager && !disabled);

  useEffect(() => {
    if (disabled) {
      setShouldLoad(false);
      return undefined;
    }
    if (eager || shouldLoad) {
      setShouldLoad(true);
      return undefined;
    }

    const target = targetRef.current;
    if (!target) return undefined;

    const reveal = () => setShouldLoad(true);
    target.addEventListener("pointerenter", reveal, { once: true });
    target.addEventListener("focusin", reveal, { once: true });

    if (!("IntersectionObserver" in window)) {
      reveal();
      return () => {
        target.removeEventListener("pointerenter", reveal);
        target.removeEventListener("focusin", reveal);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        reveal();
        observer.disconnect();
      },
      { rootMargin },
    );
    observer.observe(target);

    return () => {
      observer.disconnect();
      target.removeEventListener("pointerenter", reveal);
      target.removeEventListener("focusin", reveal);
    };
  }, [disabled, eager, rootMargin, shouldLoad]);

  return { ref: targetRef, shouldLoad };
}
