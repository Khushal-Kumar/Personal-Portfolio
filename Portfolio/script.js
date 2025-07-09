// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const t = document.getElementById(a.getAttribute("href").slice(1));
    if (t) window.scrollTo({ top: t.offsetTop - 60, behavior: "smooth" });
  });
});

// Back-to-top button
const backToTop = document.createElement("button");
backToTop.textContent = "⬆️";
backToTop.style =
  "position:fixed;bottom:20px;right:20px;display:none;" +
  "background:#2563eb;color:#fff;border:none;padding:12px;border-radius:8px;cursor:pointer;z-index:1000;transition:opacity .3s";
document.body.append(backToTop);
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.style.display = "block";
    backToTop.style.opacity = "1";
  } else {
    backToTop.style.opacity = "0";
    setTimeout(() => (backToTop.style.display = "none"), 300);
  }
});
backToTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

// Dark mode toggle
const dmToggle = document.querySelector(".dark-mode-toggle");
if (localStorage.getItem("dark-mode") === "enabled")
  document.body.classList.add("dark-mode");
dmToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "dark-mode",
    document.body.classList.contains("dark-mode") ? "enabled" : "disabled"
  );
});

// Resume download with animation
const resumeBtn = document.getElementById("resumeDownloadBtn");
const resumeStatus = document.getElementById("resumeStatus");
resumeBtn.addEventListener("click", () => {
  resumeBtn.classList.add("loading");
  resumeStatus.classList.remove("show");
  setTimeout(() => {
    resumeBtn.classList.remove("loading");
    resumeStatus.textContent = "✅ Downloaded!";
    resumeStatus.classList.add("show");
    setTimeout(() => resumeStatus.classList.remove("show"), 3000);
  }, 1500);
});

// Modal functions
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.style = "display:block;opacity:1;transition:opacity .3s;";
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.style.opacity = "0";
    setTimeout(() => (m.style.display = "none"), 300);
  }
}
window.onclick = (e) => {
  document.querySelectorAll(".modal").forEach((m) => {
    if (e.target === m) closeModal(m.id);
  });
};

// Progress-bar animate
const bars = document.querySelectorAll(".progress");
function animateBars() {
  bars.forEach((b) => (b.style.width = b.getAttribute("data-width")));
}
window.addEventListener("scroll", () => {
  clearTimeout(window.animateBarsTimeout);
  window.animateBarsTimeout = setTimeout(animateBars, 100);
});
animateBars();

// Nav mobile toggle & scroll-active
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const links = document.querySelectorAll(".nav-link");
navToggle.addEventListener("click", () => navMenu.classList.toggle("open"));
links.forEach((l) =>
  l.addEventListener("click", () => navMenu.classList.remove("open"))
);
window.addEventListener("scroll", () => {
  const y = window.pageYOffset;
  document.querySelectorAll("section").forEach((sec) => {
    const o = sec.offsetTop - 70,
      h = sec.offsetHeight;
    const id = sec.getAttribute("id");
    if (y >= o && y < o + h) {
      links.forEach((link) => link.classList.remove("active"));
      const a = document.querySelector(`.nav-link[href="#${id}"]`);
      if (a) a.classList.add("active");
    }
  });
});

// Dynamic year
document.getElementById("year").textContent = new Date().getFullYear();
