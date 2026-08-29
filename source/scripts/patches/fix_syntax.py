with open("src/surfaces/group-3-8104/styles/home-single-screen.css", "r") as f:
    css = f.read()

bad = """@keyframes g3-premium-rise {



/* ---------- Carousel dots: gold pill on active ---------- */"""

good = """@keyframes g3-premium-rise {
  from { opacity: 0; transform: translateY(1.1rem); }
  to { opacity: 1; transform: translateY(0); }
}

/* ---------- Carousel dots: gold pill on active ---------- */"""

if bad in css:
    css = css.replace(bad, good)
    with open("src/surfaces/group-3-8104/styles/home-single-screen.css", "w") as f:
        f.write(css)
    print("Fixed syntax")
else:
    print("Pattern not found")
