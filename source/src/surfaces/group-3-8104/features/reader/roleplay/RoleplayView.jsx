import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import Icon from "../../../../../shared/components/ui/Icon.jsx";
import { pauseIcon, playIcon } from "../../../../../shared/components/ui/iconPaths.js";

const PROFILE_COLORS = {
  bai: 0x2f9e6e,
  cafeServer: 0x3a7bd5,
  liu: 0x26466d,
  restaurantServer: 0xc9742a,
  teacherWang: 0x8a5bd6,
  wang: 0xd5548a,
};

function buildHumanoid(color) {
  const group = new THREE.Group();
  const bodyMaterial = new THREE.MeshLambertMaterial({ color, emissive: 0x000000, emissiveIntensity: 1 });
  const darkMaterial = new THREE.MeshLambertMaterial({ color: 0x23262e });
  const skinMaterial = new THREE.MeshLambertMaterial({ color: 0xd9a06a });
  const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1d22 });

  const legGeo = new THREE.CapsuleGeometry(0.1, 0.46, 6, 12);
  const footGeo = new THREE.BoxGeometry(0.24, 0.12, 0.34);
  [-1, 1].forEach((side) => {
    const leg = new THREE.Mesh(legGeo, darkMaterial);
    leg.position.set(0.15 * side, 0.33, 0);
    const foot = new THREE.Mesh(footGeo, darkMaterial);
    foot.position.set(0.15 * side, 0.06, 0.05);
    group.add(leg, foot);
  });

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.34, 8, 14), bodyMaterial);
  torso.position.y = 1.04;
  group.add(torso);

  const shoulderGeo = new THREE.SphereGeometry(0.1, 12, 10);
  const arms = [];
  [-1, 1].forEach((side) => {
    const shoulder = new THREE.Mesh(shoulderGeo, bodyMaterial);
    shoulder.position.set(0.33 * side, 1.36, 0);
    const arm = new THREE.Group();
    arm.position.set(0.36 * side, 1.33, 0);
    const armMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.38, 5, 10), bodyMaterial);
    armMesh.position.y = -0.29;
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 8), skinMaterial);
    hand.position.y = -0.62;
    arm.add(armMesh, hand);
    group.add(shoulder, arm);
    arms.push(arm);
  });

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.14, 10), skinMaterial);
  neck.position.y = 1.5;
  group.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.23, 24, 18), skinMaterial);
  head.position.y = 1.68;
  group.add(head);

  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.235, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.55),
    darkMaterial
  );
  hair.position.y = 1.75;
  group.add(hair);

  const eyeMat = eyeMaterial;
  const eyeGeo = new THREE.SphereGeometry(0.028, 10, 8);
  [-1, 1].forEach((side) => {
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    eye.position.set(0.085 * side, 1.69, 0.225);
    group.add(eye);
  });

  const label = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xffffff, transparent: true, opacity: 0 }));
  label.scale.set(1.7, 0.52, 1);
  label.position.y = 2.16;
  group.add(label);

  group.userData = { label, arms, head, bodyMaterial };
  return group;
}

function makeLabelTexture(main, sub) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 170;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = "700 46px system-ui, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "#ffffff";
  context.shadowColor = "rgba(0,0,0,0.85)";
  context.shadowBlur = 16;
  context.fillText(main || "", 256, 64);
  context.shadowBlur = 0;
  if (sub) {
    context.fillStyle = "rgba(255,255,255,0.72)";
    context.font = "600 26px system-ui, sans-serif";
    context.fillText(sub, 256, 122);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function RolePicker({ characters = {}, language = "th", onCancel, onPick, scene = null, text = {} }) {
  const profileName = (profile) => ({ th: profile.nameTh, zh: profile.hanzi, en: profile.nameEn || profile.pinyin }[language]);
  const note = (entry) => ({ th: entry.noteTh, zh: entry.noteZh, en: entry.noteEn }[language]);

  return (
    <div className="g3-role-picker-backdrop" role="presentation">
      <div className="g3-role-picker" role="dialog" aria-modal="true" aria-labelledby="g3-role-picker-title">
        <header><span aria-hidden="true" /><h2 id="g3-role-picker-title">{text.rolePickerTitle || "เลือกบทบาท"}</h2></header>
        <p>{text.rolePickerBody || "เลือกตัวละครที่คุณจะเล่นเป็น จากนั้นเข้าโหมดจำลอง 3D มุมมองของตัวละครนั้น"}</p>
        <div className="g3-role-picker-grid">
          {(scene?.characters || []).map((entry) => {
            const profile = characters[entry.profile];
            if (!profile) return null;
            return (
              <button type="button" className="g3-role-picker-card" key={entry.role} onClick={() => onPick(entry.role)}>
                <span className="g3-role-picker-badge">{text.roleplayRole || "บทบาท"} {entry.role}</span>
                {profile.image && <img className="g3-role-picker-avatar" src={profile.image} alt="" width="128" height="128" decoding="async" />}
                <strong>{profileName(profile)}</strong>
                <em>{profile.hanzi} · {profile.pinyin}</em>
                {note(entry) && <small>{note(entry)}</small>}
              </button>
            );
          })}
        </div>
        <p className="g3-role-picker-note">{text.rolePickerNote || "เลือกบทบาท แล้วสลับโหมด 3D/2D ได้ที่ปุ่มบนจอ · กด F เพื่อเล่น/หยุด"}</p>
        <div className="g3-role-picker-cancel">
          <button type="button" onClick={onCancel}>{text.cancel || "ยกเลิก"}</button>
        </div>
      </div>
    </div>
  );
}

function Roleplay2D({
  characters = {},
  language = "th",
  lineIndex = -1,
  lines = [],
  onTogglePlayback,
  role = "A",
  scene = null,
  text = {},
  isPlaying = false,
  roleProfile = "wang",
  otherProfile = "wang",
}) {
  const currentLine = lineIndex >= 0 ? lines[lineIndex] : null;
  const profileName = (profile) => ({ th: profile.nameTh, zh: profile.hanzi, en: profile.nameEn || profile.pinyin }[language]);
  const isSelf = Boolean(currentLine && currentLine.role === role);
  const activeProfile = currentLine ? (isSelf ? roleProfile : otherProfile) : null;
  const speakerName = activeProfile ? characters[activeProfile] || {} : {};
  const sceneTitle = { th: scene?.titleTh, zh: scene?.title, en: scene?.titleEn || scene?.title }[language];
  const sceneContext = { th: scene?.contextTh, zh: scene?.context, en: scene?.contextEn || scene?.context }[language];
  const imgStyle = (profile) => {
    const char = characters[profile] || {};
    return char.imageFocus ? { objectPosition: char.imageFocus } : undefined;
  };
  const profileColor = (profile) => {
    const hex = PROFILE_COLORS[profile];
    return hex ? `#${hex.toString(16).padStart(6, "0")}` : null;
  };
  const speakerColor = activeProfile ? profileColor(activeProfile) : null;

  return (
    <div className="g3-roleplay-2d">
      <div className="g3-roleplay-2d-stage">
        {scene?.image && (
          <img
            className="g3-roleplay-2d-scene-img"
            src={scene.image}
            srcSet={scene.imageSrcSet}
            alt=""
            draggable="false"
            decoding="async"
            style={scene.imageFocus ? { objectPosition: scene.imageFocus } : undefined}
          />
        )}
        <div className="g3-roleplay-2d-scene-shade" />
        {sceneTitle && <strong className="g3-roleplay-2d-title">{sceneTitle}</strong>}
        {sceneContext && <span className="g3-roleplay-2d-context">{sceneContext}</span>}
      </div>
      <div className="g3-roleplay-2d-panel">
        <div className="g3-roleplay-2d-cast">
          {[roleProfile, otherProfile].map((profile) => {
            const char = characters[profile] || {};
            const active = profile === activeProfile;
            return (
              <button
                type="button"
                key={profile}
                className={active ? "g3-roleplay-2d-card is-active" : "g3-roleplay-2d-card"}
                onClick={onTogglePlayback}
                aria-label={char.hanzi || profile}
              >
                {char.image && (
                  <img
                    className="g3-roleplay-2d-avatar"
                    key={active ? `line-${lineIndex}` : "idle"}
                    src={char.image}
                    srcSet={char.imageSrcSet}
                    alt=""
                    width="96"
                    height="96"
                    decoding="async"
                    style={imgStyle(profile)}
                  />
                )}
                <span className="g3-roleplay-2d-card-name">
                  <strong>{char.hanzi || profile}</strong>
                  <em>{profileName(char)}</em>
                </span>
                {active && <i className="g3-roleplay-2d-card-dot" />}
              </button>
            );
          })}
        </div>
        <div key={lineIndex} className="g3-roleplay-2d-line" style={speakerColor ? { borderLeftColor: speakerColor } : undefined}>
          {currentLine ? (
            <>
              <span className="g3-roleplay-2d-who">
                <i style={speakerColor ? { backgroundColor: speakerColor, boxShadow: `0 0 0.6rem ${speakerColor}` } : undefined} />
                <strong style={speakerColor ? { color: speakerColor } : undefined}>{speakerName.hanzi || activeProfile}</strong>
                <em>{profileName(speakerName)}</em>
              </span>
              <strong className="g3-roleplay-2d-text">{currentLine.hanzi}</strong>
              <em className="g3-roleplay-2d-pinyin">{currentLine.pinyin}</em>
              <small className="g3-roleplay-2d-thai">{currentLine[language] || currentLine.th}</small>
            </>
          ) : (
            <span className="g3-roleplay-2d-wait">{text.roleplayWait || "กดเล่นเพื่อเริ่ม"}</span>
          )}
        </div>
        <div className="g3-roleplay-2d-bar">
          <button type="button" className="g3-roleplay-play" onClick={onTogglePlayback} aria-label={isPlaying ? text.pausePlayback : text.resumePlayback}>
            <Icon paths={isPlaying ? pauseIcon : playIcon} />
          </button>
          <span className="g3-roleplay-f">{text.pressF || "F"}</span>
          <span className="g3-roleplay-2d-progress">{Math.min(lineIndex + 1, lines.length)} / {lines.length}</span>
        </div>
      </div>
    </div>
  );
}

export function RoleplayView({
  characters = {},
  language = "th",
  lineIndex = -1,
  lines = [],
  onExit,
  onTogglePlayback,
  role = "A",
  scene = null,
  status = "paused",
  text = {},
}) {
  const mountRef = useRef(null);
  const bubbleRef = useRef(null);
  const statusRef = useRef({ lineIndex: -1, status });
  const [mode, setMode] = useState("2d");
  const sceneData = useMemo(() => {
    if (!scene) return { background: null, characters: [], lines: [] };
    return { background: scene.image || null, characters: scene.characters || [], lines };
  }, [scene, lines]);

  const roleProfile = useMemo(() => {
    const entry = (sceneData.characters || []).find((item) => item.role === role);
    return entry ? entry.profile : "wang";
  }, [sceneData.characters, role]);
  const otherRole = role === "A" ? "B" : "A";
  const otherProfile = useMemo(() => {
    const entry = (sceneData.characters || []).find((item) => item.role === otherRole);
    return entry ? entry.profile : "wang";
  }, [sceneData.characters, otherRole]);

  const isPlaying = status === "playing";

  useEffect(() => {
    statusRef.current.lineIndex = lineIndex;
  }, [lineIndex]);

  useEffect(() => {
    statusRef.current.status = status;
  }, [status]);

  const rafRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const bubble = bubbleRef.current;
    if (!mount || !bubble) return undefined;

    let disposed = false;
    let yaw = 1.0;
    let pitch = 0.12;
    const orbit = { yaw, pitch };
    let pointerDown = null;

    const scene3d = new THREE.Scene();
    scene3d.background = new THREE.Color(0x10141b);

    const initialWidth = mount.clientWidth || 1;
    const initialHeight = mount.clientHeight || 1;
    const camera = new THREE.PerspectiveCamera(50, initialWidth / initialHeight, 0.1, 100);
    camera.position.set(0, 1.6, 6.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setSize(initialWidth, initialHeight);
    mount.appendChild(renderer.domElement);
    canvasRef.current = renderer.domElement;

    scene3d.fog = new THREE.Fog(0x10141b, 13, 34);

    const hemi = new THREE.HemisphereLight(0xfff2e0, 0x2a2f3a, 1.0);
    scene3d.add(hemi);
    const key = new THREE.DirectionalLight(0xfff0d8, 1.7);
    key.position.set(2.6, 4.4, 3.2);
    scene3d.add(key);
    const rim = new THREE.DirectionalLight(0x8fb8ff, 0.6);
    rim.position.set(-3.4, 2.6, -3.4);
    scene3d.add(rim);
    const fill = new THREE.DirectionalLight(0xffc9a8, 0.35);
    fill.position.set(0.4, 0.6, -2.8);
    scene3d.add(fill);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(9, 48),
      new THREE.MeshStandardMaterial({ color: 0x1b212b, roughness: 0.92 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene3d.add(floor);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.6, 1.68, 48),
      new THREE.MeshBasicMaterial({ color: 0xd9b36a, transparent: true, opacity: 0.8 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.02;
    scene3d.add(ring);

    const glowDisc = new THREE.Mesh(
      new THREE.CircleGeometry(1.6, 48),
      new THREE.MeshBasicMaterial({ color: 0xd9b36a, transparent: true, opacity: 0.05 })
    );
    glowDisc.rotation.x = -Math.PI / 2;
    glowDisc.position.y = 0.015;
    scene3d.add(glowDisc);

    const blobShadowMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.32 });
    const blobShadowGeometry = new THREE.CircleGeometry(0.62, 24);
    const makeBlobShadow = (x) => {
      const shadow = new THREE.Mesh(blobShadowGeometry, blobShadowMaterial);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.set(x, 0.02, 0);
      scene3d.add(shadow);
      return shadow;
    };
    const selfBlobShadow = makeBlobShadow(-1.15);
    const otherBlobShadow = makeBlobShadow(1.15);

    const selfHumanoid = buildHumanoid(PROFILE_COLORS[roleProfile] || 0xffffff);
    selfHumanoid.position.set(-1.15, 0, 0);
    selfHumanoid.rotation.y = Math.PI / 2;
    scene3d.add(selfHumanoid);

    const otherHumanoid = buildHumanoid(PROFILE_COLORS[otherProfile] || 0xffffff);
    otherHumanoid.position.set(1.15, 0, 0);
    otherHumanoid.rotation.y = -Math.PI / 2;
    scene3d.add(otherHumanoid);

    const selfCharacter = characters[roleProfile] || {};
    const otherCharacter = characters[otherProfile] || {};
    const labelSub = (character, fallback) =>
      language === "th" ? fallback : language === "zh" ? character.pinyin || "" : character.nameEn || character.pinyin || "";
    const selfLabelMat = new THREE.SpriteMaterial({
      map: makeLabelTexture(selfCharacter.hanzi || roleProfile, labelSub(selfCharacter, text.youLabel || "คุณ")),
      transparent: true,
      depthTest: false,
    });
    selfHumanoid.userData.label.material = selfLabelMat;
    const otherLabelMat = new THREE.SpriteMaterial({
      map: makeLabelTexture(otherCharacter.hanzi || otherProfile, labelSub(otherCharacter, otherCharacter.nameTh || "")),
      transparent: true,
      depthTest: false,
    });
    otherHumanoid.userData.label.material = otherLabelMat;

    let backgroundSprite = null;
    if (sceneData.background) {
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin("anonymous");
      loader.load(
        sceneData.background,
        (tex) => {
          if (disposed) return;
          tex.colorSpace = THREE.SRGBColorSpace;
          const imageAspect = tex.image ? tex.image.width / tex.image.height : 1.6;
          const baseHeight = 11.2;
          const scaleX = Math.max(baseHeight * imageAspect, 17.6);
          const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
          sprite.scale.set(scaleX, baseHeight, 1);
          sprite.position.set(0, 1.35, -11.5);
          scene3d.add(sprite);
          backgroundSprite = sprite;
        },
        undefined,
        () => {}
      );
    }

    const dustCount = 70;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i += 1) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 13;
      dustPositions[i * 3 + 1] = 0.2 + Math.random() * 4.4;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 9;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      color: 0xffe9c8,
      size: 0.045,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene3d.add(dust);

    const bubbleBase = new THREE.Object3D();
    bubbleBase.position.set(1.15, 1.95, 0);
    scene3d.add(bubbleBase);

    const updateBubble = () => {
      const state = statusRef.current;
      const current = lines[state.lineIndex];
      if (!current || !bubble) {
        bubble.style.opacity = "0";
        return;
      }
      const isSelf = current.role === role;
      bubbleBase.position.set(isSelf ? -1.15 : 1.15, 1.95, 0);
      const projected = bubbleBase.position.clone().project(camera);
      if (projected.z > 1) {
        bubble.style.opacity = "0";
        return;
      }
      const bubbleWidth = bubble.offsetWidth || 240;
      const bubbleHeight = bubble.offsetHeight || 84;
      let x = (projected.x * 0.5 + 0.5) * mount.clientWidth;
      let y = (-projected.y * 0.5 + 0.5) * mount.clientHeight - 16;
      x = Math.max(bubbleWidth / 2 + 10, Math.min(mount.clientWidth - bubbleWidth / 2 - 10, x));
      y = Math.max(bubbleHeight + 12, Math.min(mount.clientHeight - 16, y));
      bubble.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
      bubble.style.opacity = "1";
    };

    const animate = () => {
      if (disposed) return;
      const now = performance.now();
      const state = statusRef.current;
      const current = lines[state.lineIndex];

      const speakingSelf = Boolean(current && current.role === role && state.status === "playing");
      const speakingOther = Boolean(current && current.role !== role && state.status === "playing");

      [selfHumanoid, otherHumanoid].forEach((humanoid, index) => {
        const speaking = index === 0 ? speakingSelf : speakingOther;
        const arm = humanoid.userData.arms[1];
        const wave = Math.sin(now * 0.006) * 0.42;
        arm.rotation.z = -0.35 + (speaking ? wave : 0);
        humanoid.userData.arms[0].rotation.z = 0.08;
        const bob = speaking ? Math.sin(now * 0.009) * 0.045 : 0;
        humanoid.position.y = bob;
        humanoid.userData.head.rotation.z = speaking ? Math.sin(now * 0.004) * 0.05 : 0;
        const profileColor = PROFILE_COLORS[index === 0 ? roleProfile : otherProfile] || 0xffffff;
        humanoid.userData.bodyMaterial.emissive = new THREE.Color(speaking ? profileColor : 0x000000);
        humanoid.userData.bodyMaterial.emissiveIntensity = speaking ? 0.18 : 0.1;
        humanoid.userData.bodyMaterial.needsUpdate = true;
        if (humanoid.userData.label.material.map) {
          humanoid.userData.label.material.opacity = index === 0 ? 0.95 : 0.62;
          humanoid.userData.label.material.needsUpdate = true;
        }
      });

      const target = new THREE.Vector3(0, 1.3, 0);
      const radius = 5.3;
      const cosPitch = Math.cos(orbit.pitch);
      camera.position.set(
        target.x + radius * cosPitch * Math.sin(orbit.yaw),
        target.y + radius * Math.sin(orbit.pitch),
        target.z + radius * cosPitch * Math.cos(orbit.yaw)
      );
      camera.lookAt(target);
      updateBubble();
      renderer.render(scene3d, camera);
      rafRef.current = window.requestAnimationFrame(animate);
    };

    const onPointerDown = (event) => {
      pointerDown = { x: event.clientX, y: event.clientY, yaw: orbit.yaw, pitch: orbit.pitch };
      mount.setPointerCapture?.(event.pointerId);
    };
    const onPointerMove = (event) => {
      if (!pointerDown) return;
      const dx = event.clientX - pointerDown.x;
      const dy = event.clientY - pointerDown.y;
      orbit.yaw = pointerDown.yaw - dx * 0.0055;
      orbit.pitch = Math.max(-0.35, Math.min(1.05, pointerDown.pitch + dy * 0.004));
    };
    const onPointerUp = () => {
      pointerDown = null;
    };
    const onWheel = (event) => {
      orbit.pitch = Math.max(-0.35, Math.min(1.05, orbit.pitch + event.deltaY * 0.001));
    };

    mount.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    mount.addEventListener("wheel", onWheel, { passive: true });

    const onResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
    resizeObserver?.observe(mount);
    requestAnimationFrame(onResize);

    animate();

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      window.cancelAnimationFrame(rafRef.current);
      mount.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      mount.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      scene3d.traverse((object) => {
        if (object.isMesh) {
          object.geometry?.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((m) => m.dispose());
          else material?.dispose();
        }
        if (object.isSprite) object.material?.dispose();
        if (object.isPoints) {
          object.geometry?.dispose();
          object.material?.dispose();
        }
      });
      [selfLabelMat, otherLabelMat].forEach((material) => material.map?.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [characters, language, lines, mode, otherProfile, role, roleProfile, sceneData.background, text.youLabel]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const key = (event.key || "").toLowerCase();
      if (key === "f" && !event.repeat) onTogglePlayback();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onTogglePlayback]);

  const currentLine = lineIndex >= 0 ? lines[lineIndex] : null;

  return (
    <section className={mode === "2d" ? "g3-roleplay is-2d" : "g3-roleplay"} aria-label={text.roleplayView || "Roleplay view"}>
      {mode === "3d" && (
        <>
          <div className="g3-roleplay-stage" ref={mountRef} />
          <div className="g3-roleplay-bubble" ref={bubbleRef} role="status" aria-live="polite">
            {currentLine && (
              <>
                <strong>{currentLine.hanzi}</strong>
                <em>{currentLine.pinyin}</em>
                <small>{currentLine[language] || currentLine.th}</small>
              </>
            )}
          </div>
        </>
      )}
      {mode === "2d" && (
        <Roleplay2D
          characters={characters}
          language={language}
          lineIndex={lineIndex}
          lines={lines}
          onTogglePlayback={onTogglePlayback}
          role={role}
          scene={scene}
          text={text}
          isPlaying={isPlaying}
          roleProfile={roleProfile}
          otherProfile={otherProfile}
        />
      )}
      <header className="g3-roleplay-top">
        <span className="g3-roleplay-role">{role}</span>
        <span className="g3-roleplay-hint">{text.dragToLook || "ลากเพื่อหมุนมุมมอง"}</span>
        <div className="g3-roleplay-mode" role="group" aria-label={text.modeLabel || "โหมดแสดงผล"}>
          <button type="button" className={mode === "3d" ? "is-active" : ""} onClick={() => setMode("3d")}>
            {text.mode3d || "3D"}
          </button>
          <button type="button" className={mode === "2d" ? "is-active" : ""} onClick={() => setMode("2d")}>
            {text.mode2d || "2D"}
          </button>
        </div>
        <button type="button" className="g3-roleplay-exit" onClick={onExit}>
          {text.exitRoleplay || "ออก"}
        </button>
      </header>
      <footer className="g3-roleplay-bar">
        <button type="button" className="g3-roleplay-play" onClick={onTogglePlayback} aria-label={isPlaying ? text.pausePlayback : text.resumePlayback}>
          <Icon paths={isPlaying ? pauseIcon : playIcon} />
        </button>
        <span className="g3-roleplay-f">{text.pressF || "F"}</span>
      </footer>
    </section>
  );
}
