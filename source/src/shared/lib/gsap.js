import { gsap } from "gsap";

// Global GSAP Defaults for Quiet Luxury / Soft Motion
if (typeof window !== "undefined") {
  gsap.defaults({
    ease: "power1.out",
    duration: 0.5,
  });
}

export { gsap };
export default gsap;
