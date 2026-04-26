// ================= HERO TYPING ANIMATION =================
const typedName = document.getElementById("typed-name");
const cursor = document.getElementById("typed-cursor");
if (typedName && cursor) {
  const texts = [
    "a Rustacean",
    "a Web Developer",
    "an Open Source Enthusiast",
    "a Tech-Savvy Individual",
    "Learning New Things"
  ];
  let textIdx = 0;
  let i = 0;
  let typing = true;

  function typeLoop() {
    const current = texts[textIdx];
    if (typing) {
      if (i <= current.length) {
        typedName.textContent = current.slice(0, i);
        i++;
        setTimeout(typeLoop, 110);
      } else {
        typing = false;
        setTimeout(typeLoop, 900);
      }
    } else {
      if (i > 0) {
        typedName.textContent = current.slice(0, i - 1);
        i--;
        setTimeout(typeLoop, 60);
      } else {
        typing = true;
        textIdx = (textIdx + 1) % texts.length;
        setTimeout(typeLoop, 400);
      }
    }
  }
  typeLoop();

  // Blinking cursor
  setInterval(() => {
    cursor.style.visibility =
      cursor.style.visibility === "hidden" ? "visible" : "hidden";
  }, 500);
}


// ================= MAIN UI LOGIC =================
document.addEventListener("DOMContentLoaded", function () {

  // --- Smooth Scroll ---
  document.querySelectorAll("a.nav-link, .btn").forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  // --- REAL CONTACT FORM (FORMSPREE AJAX) ---
  // Matches the ID in the HTML I provided earlier: id="formspree-form"
  const form = document.getElementById("formspree-form");
  const successMsg = document.getElementById("formspree-success");
  const errorMsg = document.getElementById("formspree-error");

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault(); // STOP page redirect

      const data = new FormData(event.target);

      // Reset messages
      if (successMsg) successMsg.style.display = "none";
      if (errorMsg) errorMsg.style.display = "none";

      try {
        const response = await fetch(event.target.action, {
          method: form.method,
          body: data,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          form.reset();
          if (successMsg) successMsg.style.display = "block";
        } else {
          const data = await response.json();
          if (Object.hasOwn(data, "errors")) {
            if (errorMsg) {
              errorMsg.textContent = data["errors"]
                .map((error) => error["message"])
                .join(", ");
              errorMsg.style.display = "block";
            }
          } else {
            if (errorMsg) {
              errorMsg.textContent =
                "Oops! There was a problem submitting your form";
              errorMsg.style.display = "block";
            }
          }
        }
      } catch (error) {
        if (errorMsg) {
          errorMsg.textContent = "Oops! Network error. Please try again.";
          errorMsg.style.display = "block";
        }
      }
    });
  }


});
