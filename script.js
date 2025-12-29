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

// ================= HERO CUBE (THREE.JS) =================
if (window.THREE && document.getElementById("three-hero-cube")) {
  const canvas = document.getElementById("three-hero-cube");
  const width = 120;
  const height = 120;
  canvas.width = width;
  canvas.height = height;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(width, height, false);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
  camera.position.z = 180;

  // Cube
  const geometry = new THREE.BoxGeometry(48, 48, 48);
  const material = new THREE.MeshStandardMaterial({
    color: 0x2563eb,
    metalness: 0.5,
    roughness: 0.3,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Light
  const light = new THREE.PointLight(0xffffff, 1, 500);
  light.position.set(60, 80, 120);
  scene.add(light);

  // Animate
  function animateCube() {
    cube.rotation.x += 0.012;
    cube.rotation.y += 0.018;
    renderer.render(scene, camera);
    requestAnimationFrame(animateCube);
  }
  animateCube();
}

// ================= MAIN UI LOGIC =================
document.addEventListener("DOMContentLoaded", function () {
  // --- Theme Toggle ---
  const themeBtn = document.getElementById("theme-toggle");
  function setTheme(dark) {
    if (dark) {
      document.body.classList.add("dark");
      themeBtn.innerHTML = `<span style="display:inline-block; animation: spin-sun 1s linear;">☀️</span>`;
      // Add animation CSS if not already present
      if (!document.getElementById("spin-sun-style")) {
        const style = document.createElement("style");
        style.id = "spin-sun-style";
        style.textContent = `
          @keyframes spin-sun {
        0% { transform: rotate(0deg) scale(1); }
        60% { transform: rotate(360deg) scale(1.2);}
        100% { transform: rotate(360deg) scale(1);}
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      document.body.classList.remove("dark");
      themeBtn.innerHTML = `<span style="display:inline-block; animation: spin-moon 1s linear;">🌙</span>`;
      // Add animation CSS if not already present
      if (!document.getElementById("spin-moon-style")) {
        const style = document.createElement("style");
        style.id = "spin-moon-style";
        style.textContent = `
          @keyframes spin-moon {
        0% { transform: rotate(0deg) scale(1); }
        60% { transform: rotate(-360deg) scale(1.2);}
        100% { transform: rotate(-360deg) scale(1);}
          }
        `;
        document.head.appendChild(style);
      }
    }
    localStorage.setItem("theme", dark ? "dark" : "light");
  }

  const userTheme = localStorage.getItem("theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(userTheme === "dark" || (!userTheme && systemDark));

  themeBtn.addEventListener("click", function () {
    setTheme(!document.body.classList.contains("dark"));
  });

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

  // --- THREE.JS PARTICLES BACKGROUND ---
  if (window.THREE && document.getElementById("three-projects-bg")) {
    const canvas = document.getElementById("three-projects-bg");
    const container = canvas.parentElement;
    const width = container.offsetWidth;
    const height = 220;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = "100%";
    canvas.style.height = height + "px";
    canvas.style.pointerEvents = "none";

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.z = 200;

    // Particles
    const particles = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particles * 3);
    for (let i = 0; i < particles; i++) {
      positions[i * 3] = (Math.random() - 0.5) * width * 0.8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * height * 0.7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0x2563eb,
      size: 3,
      opacity: 0.7,
      transparent: true,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Animate
    function animate() {
      points.rotation.y += 0.002;
      points.rotation.x += 0.001;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    // Responsive resize
    window.addEventListener("resize", () => {
      const newWidth = container.offsetWidth;
      canvas.width = newWidth;
      renderer.setSize(newWidth, height, false);
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
    });
  }
});
