import { useEffect, useRef } from "react";
import * as THREE from "three";
import { getBrowserAdaptiveThreePolicy } from "@lib";


const BACKDROP_PALETTES = {
  light: {
    chars: ["#E23D28", "#D4A853", "#E23D28", "#D4A853", "#c94043"],
    particleCore: "rgba(212,168,83,1)",
    particleHalo: "rgba(226,61,40,0.6)",
    particleEdge: "rgba(226,61,40,0)",
  },
  dark: {
    chars: ["#5BA8C8", "#D4A853", "#6F8FA6", "#C79A50", "#B9786F"],
    particleCore: "rgba(91,168,200,0.95)",
    particleHalo: "rgba(212,168,83,0.58)",
    particleEdge: "rgba(91,168,200,0)",
  },
};

function activeBackdropTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function makeCharTexture(char, color, size = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, size, size);
  ctx.font = `900 ${size * 0.6}px "Noto Serif SC", serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = color;
  ctx.shadowBlur = 25;
  ctx.fillStyle = color;
  ctx.fillText(char, size / 2, size / 2);
  ctx.shadowBlur = 0;
  ctx.fillText(char, size / 2, size / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function makeParticleTexture(palette) {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);

  gradient.addColorStop(0, palette.particleCore);
  gradient.addColorStop(0.2, palette.particleHalo);
  gradient.addColorStop(1, palette.particleEdge);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  return new THREE.CanvasTexture(canvas);
}

export default function ThreeBackdrop() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;
    if (document.documentElement.dataset.surface === "group-1" || import.meta.env.VITE_GROUP_ID === "1") {
      return undefined;
    }

    const policy = getBrowserAdaptiveThreePolicy();
    if (!policy.allowDecorativeWebGL) return undefined;

    let frameId = 0;
    let disposed = false;
    let running = false;
    let intersectionObserver;
    let visible = true;
    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !policy.mobile, alpha: true, powerPreference: "low-power" });
    } catch (error) {
      console.info("WebGL background disabled; using the CSS background.", error);
      container.classList.add("three-container-fallback");
      return undefined;
    }
    const startedAt = performance.now();
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const meshes = [];
    const disposables = [];

    camera.position.z = 30;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(policy.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const onMouseMove = (event) => {
      mouse.tx = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = -(event.clientY / window.innerHeight - 0.5) * 2;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const setupScene = async () => {
      if (document.fonts?.ready) await document.fonts.ready;
      if (disposed) return;

      const chars = ["中", "华", "文", "学", "好", "人", "大", "天", "心", "爱", "美", "龙", "风", "月", "山", "水", "道", "德", "仁", "义"];
      let sceneTheme = activeBackdropTheme();
      let palette = BACKDROP_PALETTES[sceneTheme];

      const visibleChars = chars.slice(0, policy.visibleCharacterCount);

      visibleChars.forEach((char, index) => {
        const texture = makeCharTexture(char, palette.chars[index % palette.chars.length]);
        const baseOpacity = 0.12 + Math.random() * 0.13;
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: baseOpacity,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const geometry = new THREE.PlaneGeometry(3, 3);
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set((Math.random() - 0.5) * 55, (Math.random() - 0.5) * 45, (Math.random() - 0.5) * 20 - 5);
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * 0.5 * Math.PI);
        mesh.userData = {
          fs: 0.3 + Math.random() * 0.5,
          fa: 0.5 + Math.random() * 1.5,
          rx: (Math.random() - 0.5) * 0.005,
          ry: (Math.random() - 0.5) * 0.008,
          iy: mesh.position.y,
          ph: Math.random() * Math.PI * 2,
          char,
          colorIndex: index,
          baseOpacity,
        };

        scene.add(mesh);
        meshes.push(mesh);
        disposables.push(texture, material, geometry);
      });

      const particleCount = policy.particleCount;
      const particleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);

      for (let index = 0; index < particleCount; index += 1) {
        positions[index * 3] = (Math.random() - 0.5) * 65;
        positions[index * 3 + 1] = (Math.random() - 0.5) * 55;
        positions[index * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
      }
      const basePositions = positions.slice();

      particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const particleTexture = makeParticleTexture(palette);
      const particleMaterial = new THREE.PointsMaterial({
        map: particleTexture,
        transparent: true,
        opacity: 0.55,
        size: 0.8,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(particleGeometry, particleMaterial);

      scene.add(particles);
      disposables.push(particleGeometry, particleMaterial, particleTexture);

      const syncPalette = () => {
        const nextTheme = activeBackdropTheme();
        if (nextTheme === sceneTheme) return;
        sceneTheme = nextTheme;
        palette = BACKDROP_PALETTES[sceneTheme];

        meshes.forEach((mesh) => {
          const nextTexture = makeCharTexture(
            mesh.userData.char,
            palette.chars[mesh.userData.colorIndex % palette.chars.length],
          );
          mesh.material.map?.dispose();
          mesh.material.map = nextTexture;
          mesh.material.opacity = mesh.userData.baseOpacity;
          mesh.material.needsUpdate = true;
          disposables.push(nextTexture);
        });

        const nextParticleTexture = makeParticleTexture(palette);
        particleMaterial.map?.dispose();
        particleMaterial.map = nextParticleTexture;
        particleMaterial.needsUpdate = true;
        disposables.push(nextParticleTexture);
      };
      const themeObserver = new MutationObserver(syncPalette);
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      disposables.push({ dispose: () => themeObserver.disconnect() });

      let previousFrame = performance.now();
      let previousRender = 0;
      const animate = (now) => {
        if (!running || disposed || !visible || document.hidden) return;
        frameId = requestAnimationFrame(animate);
        if (now - previousRender < policy.targetFrameMs) return;
        previousRender = now;
        const elapsed = (now - startedAt) / 1000;
        const delta = Math.min((now - previousFrame) / 1000, 0.05);
        previousFrame = now;
        const pointerEase = 1 - Math.exp(-3.1 * delta);

        mouse.x += (mouse.tx - mouse.x) * pointerEase;
        mouse.y += (mouse.ty - mouse.y) * pointerEase;
        camera.position.x = mouse.x * 3;
        camera.position.y = mouse.y * 2;
        camera.lookAt(0, 0, 0);

        meshes.forEach((mesh) => {
          const data = mesh.userData;
          mesh.position.y = data.iy + Math.sin(elapsed * data.fs + data.ph) * data.fa;
          mesh.rotation.x += data.rx * delta * 60;
          mesh.rotation.y += data.ry * delta * 60;
        });

        const particlePositions = particleGeometry.attributes.position.array;
        for (let index = 0; index < particleCount; index += 1) {
          particlePositions[index * 3] = basePositions[index * 3] + Math.cos(elapsed * 0.3 + index * 0.5) * 0.12;
          particlePositions[index * 3 + 1] = basePositions[index * 3 + 1] + Math.sin(elapsed * 0.5 + index) * 0.18;
        }
        particleGeometry.attributes.position.needsUpdate = true;
        particles.rotation.y = elapsed * 0.02;
        renderer.render(scene, camera);
      };

      const stopAnimation = () => {
        running = false;
        cancelAnimationFrame(frameId);
        frameId = 0;
      };
      const startAnimation = () => {
        if (running || disposed || document.hidden || !visible) return;
        running = true;
        previousFrame = performance.now();
        previousRender = 0;
        frameId = requestAnimationFrame(animate);
      };
      const onVisibilityChange = () => {
        if (document.hidden) stopAnimation();
        else startAnimation();
      };

      if ("IntersectionObserver" in window) {
        intersectionObserver = new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting;
            if (visible) startAnimation();
            else stopAnimation();
          },
          { rootMargin: "0px" },
        );
        intersectionObserver.observe(container);
      }

      document.addEventListener("visibilitychange", onVisibilityChange);
      disposables.push({
        dispose: () => {
          stopAnimation();
          intersectionObserver?.disconnect();
          document.removeEventListener("visibilitychange", onVisibilityChange);
        },
      });
      startAnimation();
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);
    setupScene().catch((error) => console.info("3D background setup skipped.", error));

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      disposables.forEach((item) => item.dispose?.());
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} className="three-container" aria-hidden="true" />;
}
