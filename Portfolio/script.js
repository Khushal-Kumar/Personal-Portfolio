// =========================================
// 1. Navigation & Smooth Scroll
// =========================================

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const t = document.getElementById(a.getAttribute("href").slice(1));
    if (t) {
      window.scrollTo({
        top: t.offsetTop - 60, // Adjust for fixed header
        behavior: "smooth",
      });
    }
  });
});

// Mobile Navigation Toggle
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const links = document.querySelectorAll(".nav-link");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
}

// Close mobile menu when a link is clicked
links.forEach((l) =>
  l.addEventListener("click", () => navMenu.classList.remove("open"))
);

// Active Link Highlighting on Scroll
window.addEventListener("scroll", () => {
  const y = window.pageYOffset;
  document.querySelectorAll("section").forEach((sec) => {
    const o = sec.offsetTop - 70;
    const h = sec.offsetHeight;
    const id = sec.getAttribute("id");
    
    if (y >= o && y < o + h) {
      links.forEach((link) => link.classList.remove("active"));
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (activeLink) activeLink.classList.add("active");
    }
  });
});

// =========================================
// 2. UI Interactions (Dark Mode, Back to Top)
// =========================================

// Back-to-top button
const backToTop = document.createElement("button");
backToTop.textContent = "⬆️";
backToTop.style =
  "position:fixed;bottom:20px;right:20px;display:none;" +
  "background:#00cfff;color:#fff;border:none;padding:12px;border-radius:50%;" + 
  "cursor:pointer;z-index:1000;transition:opacity .3s;box-shadow: 0 4px 10px rgba(0,0,0,0.2);font-size:18px;";
document.body.append(backToTop);

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.style.display = "block";
    setTimeout(() => (backToTop.style.opacity = "1"), 10);
  } else {
    backToTop.style.opacity = "0";
    setTimeout(() => (backToTop.style.display = "none"), 300);
  }
});

backToTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

// Dark Mode Toggle
const dmToggle = document.getElementById("themeToggleBtn");
if (localStorage.getItem("dark-mode") === "enabled") {
  document.body.classList.add("dark-mode");
}

if (dmToggle) {
  dmToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
      "dark-mode",
      document.body.classList.contains("dark-mode") ? "enabled" : "disabled"
    );
  });
}

// Dynamic Year in Footer
document.getElementById("year").textContent = new Date().getFullYear();

// Resume Download Animation
const resumeBtn = document.getElementById("resumeDownloadBtn");
const resumeStatus = document.getElementById("resumeStatus");

if (resumeBtn) {
  resumeBtn.addEventListener("click", () => {
    resumeBtn.style.opacity = "0.7";
    resumeBtn.textContent = "⏳ Downloading...";
    
    setTimeout(() => {
      resumeBtn.style.opacity = "1";
      resumeBtn.textContent = "📄 Download Resume";
      if (resumeStatus) {
        resumeStatus.textContent = "✅ Downloaded!";
        setTimeout(() => (resumeStatus.textContent = ""), 3000);
      }
    }, 1500);
  });
}

// =========================================
// 3. Modals Logic
// =========================================

function openModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.style.display = "block";
    // Small timeout to allow CSS transition if added later
    setTimeout(() => (m.style.opacity = "1"), 10); 
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.style.opacity = "0";
    setTimeout(() => {
      m.style.display = "none";
      document.body.style.overflow = "auto"; // Restore scrolling
    }, 300);
  }
}

// Close modal when clicking outside content
window.onclick = (e) => {
  if (e.target.classList.contains("modal")) {
    closeModal(e.target.id);
  }
};

// =========================================
// 4. Scroll Animations (Skills Progress)
// =========================================

const bars = document.querySelectorAll(".progress");

function animateBars() {
  bars.forEach((b) => {
    const rect = b.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      b.style.width = b.getAttribute("data-width");
    }
  });
}

window.addEventListener("scroll", () => {
  // Debounce for performance
  clearTimeout(window.animateBarsTimeout);
  window.animateBarsTimeout = setTimeout(animateBars, 50);
});

// Initial check in case bars are already visible
animateBars();

// =========================================
// 5. Contact Form Handler (Flask Backend)
// =========================================

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stop page reload

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    const btn = contactForm.querySelector("button");
    const originalBtnText = btn.textContent;

    // UI Loading State
    btn.textContent = "Sending...";
    btn.disabled = true;
    btn.style.opacity = "0.7";
    formStatus.textContent = "";
    formStatus.className = "form-status"; // Reset classes

    try {
      // Send data to Python/Flask backend
      const response = await fetch("http://127.0.0.1:5000/submit-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const result = await response.json();

      if (response.ok) {
        formStatus.textContent = "✅ Message sent successfully!";
        formStatus.classList.add("status-success");
        contactForm.reset(); // Clear form
      } else {
        throw new Error(result.message || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Error:", error);
      formStatus.textContent = "❌ Server error. Is app.py running?";
      formStatus.classList.add("status-error");
    } finally {
      // Restore Button State
      btn.textContent = originalBtnText;
      btn.disabled = false;
      btn.style.opacity = "1";
      
      // Clear success message after 5 seconds
      if (formStatus.classList.contains("status-success")) {
        setTimeout(() => {
            formStatus.textContent = "";
            formStatus.className = "form-status";
        }, 5000);
      }
    }
  });
}