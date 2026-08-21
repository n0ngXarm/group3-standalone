with open('src/surfaces/group-3-8104/styles/home-single-screen.css', 'r') as f:
    css = f.read()

bad = """  }
}

  border: 1px solid var(--g3-line);
  color: var(--g3-ink);
  border-radius: 999px;"""

good = """  }
}

.g3-manga-pause-btn {
  background: color-mix(in srgb, var(--g3-bg-soft) 80%, transparent);
  border: 1px solid var(--g3-line);
  color: var(--g3-ink);
  border-radius: 999px;"""

css = css.replace(bad, good)
with open('src/surfaces/group-3-8104/styles/home-single-screen.css', 'w') as f:
    f.write(css)
