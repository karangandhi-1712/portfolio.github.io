// server.js — serves the dark-terminal portfolio to browsers, and a terminal-native
// ANSI Shadow banner + text menu to curl / wget / httpie / plain terminals.
//
// Deploy this in front of the static files in /public (copy index.html,
// about.html, projects.html, experience.html, contact.html, blog.html, assets/ here).
//
//   npm install express
//   node server.js
//
// On a platform without a persistent Node process (e.g. pure static
// hosting like GitHub Pages), see the "STATIC-HOST ALTERNATIVE" note
// at the bottom of this file.

const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// ---------- terminal 256-color ANSI palette ----------
const C = {
  reset: '\x1b[0m',
  ink: '\x1b[38;5;251m',      // light grey (body text)
  accent: '\x1b[38;5;48m',    // terminal green
  amber: '\x1b[38;5;214m',    // amber (for WIP badges)
  faint: '\x1b[38;5;240m',    // dim grey
  bold: '\x1b[1m',
  dim: '\x1b[2m',
};

// ---------- ANSI Shadow banner (figlet font: ansi_shadow) ----------
const BANNER = `
${C.accent}${C.bold}██╗  ██╗ █████╗ ██████╗  █████╗ ███╗   ██╗
██║ ██╔╝██╔══██╗██╔══██╗██╔══██╗████╗  ██║
█████╔╝ ███████║██████╔╝███████║██╔██╗ ██║
██╔═██╗ ██╔══██║██╔══██╗██╔══██║██║╚██╗██║
██║  ██╗██║  ██║██║  ██║██║  ██║██║ ╚████║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝${C.reset}

${C.ink}${C.bold} ██████╗  █████╗ ███╗   ██╗██████╗ ██╗  ██╗██╗
██╔════╝ ██╔══██╗████╗  ██║██╔══██╗██║  ██║██║
██║  ███╗███████║██╔██╗ ██║██║  ██║███████║██║
██║   ██║██╔══██║██║╚██╗██║██║  ██║██╔══██║██║
╚██████╔╝██║  ██║██║ ╚████║██████╔╝██║  ██║██║
 ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝╚═╝${C.reset}
`;

// ---------- content, shared with the HTML pages ----------
const PAGES = {
  home: () => `${BANNER}
${C.faint}Computer Science undergraduate · VIT Chennai${C.reset}
${C.accent}● Open to opportunities${C.reset}

${C.ink}${C.bold}whoami${C.reset}
  Building software that runs machines, not just screens.
  CS undergrad working across robotics software, systems
  programming in Rust/C++, and full-stack web development.
  Most recently: ROS2 navigation stacks at Vector Robotics.

${menu()}
`,

  about: () => `${section('ABOUT')}
${C.ink}${C.bold}Education${C.reset}
  2024–Present   B.Tech CSE, VIT Chennai            CGPA 8.28
  2022–2024      CBSE XII, SNBP Intl. School, Pune   88.8%
  2009–2022      ICSE X, Spicer Higher Sec., Pune    94.5%

${C.ink}${C.bold}Skills${C.reset}
  Languages     C++, Python, Rust, JavaScript, SQL, Go, C
  Frameworks    ROS2, React.js, Node.js, Express.js,
                MongoDB, FastAPI, Django
  Tools         Git, Docker, Linux, WebSockets
  Core CS       DSA, OOPS, DBMS, OS, Networks, SLAM, AI/ML

${menu()}
`,

  projects: () => `${section('PROJECTS')}
${C.accent}${C.bold}// Featured — Robotics${C.reset}

${C.ink}${C.bold}vector_AGVsim${C.reset}                                 ${C.dim}2026${C.reset}
  AGV/robot simulation (Vector Robotics internship).
  Gazebo Harmonic, URDF/Xacro, ROS2 control interfaces.
  ${C.faint}Python · ROS2 · SLAM · Gazebo Harmonic${C.reset}
  ${C.accent}https://github.com/karangandhi-1712/vector_AGVsim${C.reset}

${C.ink}${C.bold}vectorbot_in_warehouse${C.reset}                       ${C.dim}2026${C.reset}
  Warehouse robot navigation/simulation — SLAM + path
  planning in constrained indoor environments.
  ${C.faint}Python · ROS2 · SLAM · Navigation${C.reset}
  ${C.accent}https://github.com/karangandhi-1712/vectorbot_in_warehouse${C.reset}

${C.accent}${C.bold}// Established${C.reset}

${C.ink}${C.bold}Campus360${C.reset}                                    ${C.dim}Jan 2026${C.reset}
  Centralized campus platform — forums, resources, real-time
  chat, event reminders. Low-latency messaging via WebSockets.
  ${C.faint}WAMP · AJAX · WebSockets${C.reset}

${C.ink}${C.bold}At-Risk Students' Detector${C.reset}                   ${C.dim}Dec 2025${C.reset}
  ML prediction system (Random Forest, K-Means) with FastAPI
  and Django backends for model integration.
  ${C.faint}Machine Learning · FastAPI · Django${C.reset}

${C.accent}${C.bold}// Experiments${C.reset}

${C.ink}${C.bold}lidar_workspace${C.reset}
  Hands-on test of real-time LiDAR data visualization in RViz.
  ${C.faint}Python${C.reset}

${C.amber}${C.bold}// Currently Building${C.reset}

${C.ink}${C.bold}LogiSync${C.reset} ${C.amber}[WIP]${C.reset}
  Currently scoping — ML-driven logistics tracking for smart
  cities. Architecture TBD.

${C.ink}${C.bold}YT Music Segregator${C.reset} ${C.amber}[WIP]${C.reset}
  Working utility that segregates liked YouTube Music songs by
  language (Hindi / non-Hindi). Long-term idea: extend into a
  more complete music experience.

  More: ${C.accent}https://github.com/karangandhi-1712${C.reset}

${menu()}
`,

  experience: () => `${section('EXPERIENCE')}
${C.ink}${C.bold}Robotics Software Intern${C.reset} — Vector Robotics, Pune
  ${C.dim}May 2026 – Jul 2026${C.reset}
  Core robotics modules in ROS2/C++/Python. SLAM for autonomous
  navigation. Gazebo Harmonic sims (URDF/Xacro). Automated
  CAD-to-simulation pipeline via Fusion 360.

${C.ink}${C.bold}Outreach & Sponsorship Lead${C.reset} — CodeChef, VIT Chennai
  ${C.dim}Mar 2026 – Present${C.reset}

${C.ink}${C.bold}Open Source Member${C.reset} — Google Developers Group, VIT Chennai
  ${C.dim}Nov 2025 – Apr 2026${C.reset}

${C.ink}${C.bold}Social Media & Outreach Lead${C.reset} — Gujarati Literary Assoc.
  ${C.dim}Sept 2025 – Sept 2026${C.reset}

${C.ink}${C.bold}Achievements${C.reset}
  96.23%ile   JEE Mains 2024 (AIR 58,311 / 1.5M+ candidates)
  AIR 7,914   VITEEE 2024, 97%ile MET 2024
  4th & 6th   Code N Conquer 2024, BitWars 2.0

${menu()}
`,

  blog: () => `${section('BLOG')}
  ${C.faint}Posts coming soon.${C.reset}

  I'm working on writing about ROS2 workflows, systems-level
  debugging, and lessons from building things.

  ${C.accent}In the meantime, try: curl karangandhi.in/projects${C.reset}

${menu()}
`,

  contact: () => `${section('CONTACT')}
  Open to internships, collaborations, and anything involving
  robotics, Rust, or systems software.

  ${C.accent}Email${C.reset}     karananandgandhi@gmail.com
  ${C.accent}GitHub${C.reset}    https://github.com/karangandhi-1712
  ${C.accent}LinkedIn${C.reset}  https://linkedin.com/in/karangandhi1712

  ${C.dim}curl -X POST karangandhi.in/contact -d "message=hi"${C.reset}
  ${C.dim}(wires to the same Formspree endpoint as the web form)${C.reset}

${menu()}
`,

  help: () => `${section('HELP')}
${C.ink}${C.bold}Navigate this site from your terminal:${C.reset}

  curl karangandhi.in                curl karangandhi.in/about
  curl karangandhi.in/projects        curl karangandhi.in/experience
  curl karangandhi.in/blog            curl karangandhi.in/contact
  curl karangandhi.in/help

  ${C.faint}(open in a browser instead for the full dark-terminal site)${C.reset}
`,
};

function section(title) {
  return `${BANNER}${C.accent}${C.bold}── ${title} ${'─'.repeat(Math.max(0, 40 - title.length))}${C.reset}\n`;
}

function menu() {
  return `${C.dim}────────────────────────────────────────────${C.reset}
${C.faint}Navigate:${C.reset} ${C.accent}/about${C.reset}  ${C.accent}/projects${C.reset}  ${C.accent}/experience${C.reset}  ${C.accent}/blog${C.reset}  ${C.accent}/contact${C.reset}  ${C.accent}/help${C.reset}
${C.dim}e.g.  curl karangandhi.in/projects${C.reset}`;
}

// ---------- terminal-agent detection ----------
// Matches curl, wget, httpie (python-requests / HTTPie), and plain
// telnet/nc-style clients that send no browser UA at all.
function isTerminalClient(req) {
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  if (!ua) return true;
  return /curl|wget|httpie|python-requests|powershell|fetch\b/.test(ua)
      && !/mozilla|chrome|safari|firefox|edg\//.test(ua);
}

app.use((req, res, next) => {
  if (isTerminalClient(req)) {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    const route = req.path.replace(/^\//, '').split('/')[0] || 'home';
    const page = PAGES[route] || (() => `${C.accent}404${C.reset} — try ${C.accent}curl karangandhi.in/help${C.reset}\n`);
    return res.status(PAGES[route] ? 200 : 404).send(page());
  }
  next();
});

// ---------- browser fallback: serve the static sepia site ----------
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log(`listening on :${PORT}`));

/*
STATIC-HOST ALTERNATIVE (no Node process, e.g. GitHub Pages / Netlify
static-only / Cloudflare Pages without Functions):

Static hosts can't branch on the User-Agent header before the browser
gets a response, so terminal detection genuinely needs *some* server:
  - Netlify: drop this logic into a Netlify Function (functions/terminal.js)
    and add a redirect rule in netlify.toml: `/* -> /.netlify/functions/terminal`
    with a condition, or check the UA inside the function and return either
    the plain-text banner or a 302 to the static index.html.
  - Vercel: same idea as an Edge Function / Middleware (middleware.ts),
    reading `request.headers.get('user-agent')`.
  - Cloudflare Pages: a Pages Function (functions/_middleware.js) with the
    same UA check.

The PAGES/menu/isTerminalClient logic above is framework-agnostic — copy
it into whichever of those you use; only the request/response wiring
at the very top and bottom of this file changes.
*/
