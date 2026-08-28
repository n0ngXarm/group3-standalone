const CHARACTER_ROOT = "/assets/group3/shared/characters";

function srcSet(root, name, widths) {
  return widths.map((width) => `${root}/${name}-${width}w.webp ${width}w`).join(", ");
}

export function homeBackdropMedia(name, { critical = false } = {}) {
  const root = `${CHARACTER_ROOT}/visual-novel-backgrounds`;
  return {
    decoding: "async",
    fetchPriority: critical ? "high" : "auto",
    height: 900,
    loading: critical ? "eager" : "lazy",
    sizes: "(max-width: 720px) 100vw, 55vw",
    src: `${root}/${name}-1200w.webp`,
    srcSet: srcSet(root, name, [480, 768, 1200, 1600]),
    width: 1600,
  };
}

export function homeActorMedia(folder, name) {
  const root = `${CHARACTER_ROOT}/${folder}`;
  return {
    decoding: "async",
    fetchPriority: "auto",
    height: 540,
    loading: "eager",
    sizes: "(max-width: 720px) 42vw, 20vw",
    src: `${root}/${name}-480w.webp`,
    srcSet: srcSet(root, name, [480, 768]),
    width: 360,
  };
}

export function homeLogoMedia() {
  const root = "/assets/group3/shared/home";
  return {
    decoding: "async",
    fetchPriority: "auto",
    height: 128,
    loading: "eager",
    sizes: "58px",
    src: `${root}/brand-logo-64w.webp`,
    srcSet: `${root}/brand-logo-64w.webp 64w, ${root}/brand-logo-128w.webp 128w`,
    width: 128,
  };
}

export function mapHomeMedia(media, resolvePath) {
  return {
    ...media,
    src: resolvePath(media.src),
    srcSet: media.srcSet
      .split(", ")
      .map((candidate) => {
        const separator = candidate.lastIndexOf(" ");
        return `${resolvePath(candidate.slice(0, separator))}${candidate.slice(separator)}`;
      })
      .join(", "),
  };
}
