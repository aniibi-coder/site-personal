/* Desktop-portfolio template (vanilla JS)
   - draggable windows
   - z-index focus
   - dark mode + sfx toggles (WebAudio beep)
   - remembers layout in localStorage
*/

const STORAGE_KEY = "desktop_portfolio_v1";

const SITE = {
  name: "Maksim SHMELEV",
  tagline: "Marketing & E-commerce • Data-driven",
  role: "E-commerce Intern",
  email: "shmelevmaksim4studies@gmail.com",
  phone: "07 77 10 15 76",
  linkedin: "https://www.linkedin.com/in/maksim-shmelev/",
  location: "France / Bordeaux (open to opportunities)",
  languages: [
    { name: "English", level: "IELTS 7.5" },
    { name: "French", level: "A2" },
  ],
  summary:
    "Intern with experience in Marketing & E-commerce. Strong in working with data, analyzing campaign performance, optimizing funnels, and improving customer experience.",
  skills: [
    "Excel / Office / PowerPoint (reporting & analytics)",
    "Campaign performance analysis & optimization",
    "Customer funnel + engagement tracking",
    "User feedback analysis (reviews, retention, satisfaction)",
    "Detailed planning (Calendar / Notion / Teams)",
    "AI tools: ChatGPT, Grok, Gemini (daily workflow)",
    "Figma / Photoshop / DaVinci Resolve / Premiere Pro",
  ],
  experience: [
    {
      title: "E-commerce Intern",
      company: "Socialist",
      place: "Moscow, Russia",
      dates: "Oct 2024 — Feb 2025",
      bullets: [
        "Analyzed and collected product data; prepared weekly performance reports",
        "Monitored customer engagement and conversion across the sales funnel",
        "Analyzed customer feedback and reviews to assess satisfaction and improvement areas",
        "Helped publish new products and set up advertising campaigns",
        "Managed pricing levels using performance metrics and competitor analysis",
      ],
    },
    {
      title: "Product Manager",
      company: "Fuh!",
      place: "Moscow, Russia",
      dates: "Feb 2025 — Aug 2025",
      bullets: [
        "Planned advertising activities for a subscription-based psychological service startup",
        "Created brand book and contributed to product positioning",
        "Worked on product development, analyzed performance and user problems",
        "Collected and reviewed early user feedback after beta testing",
        "Analyzed engagement and retention during subscription launch",
        "Collaborated with the team to improve the product and personalize customer experience",
      ],
    },
  ],
  education: [
    {
      title: "Brand & Product Management (Master)",
      org: "KEDGE Business School, Bordeaux",
      dates: "Since Sep 2025",
      bullets: [
        "Public speaking",
        "Digital marketing",
        "Financial performance",
        "Customer behavior pattern analysis",
      ],
    },
    {
      title: "Management in Organizations (Bachelor)",
      org: "Plekhanov Russian University of Economics, Moscow",
      dates: "Sep 2021 — Aug 2025",
      bullets: [
        "Program taught fully in English",
        "Financial / Management / Marketing skills",
        "Entrepreneurship program participation",
      ],
    },
  ],
  certifications: [
    {
      title: "Marketplace Manager — Professional Training Course (256h)",
      org: "Yandex Practicum",
      date: "Jul 2024",
      bullets: ["Marketplace data analysis", "E-commerce fundamentals", "Media planning & ad management"],
    },
    {
      title: "Google Digital Marketing & E-commerce",
      org: "Google",
      date: "Jun 2024",
      bullets: ["Marketing basics", "Digital marketing"],
    },
  ],
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/maksim-shmelev/" },
  ],
  cvUrl: "assets/CV_2026-01-22_Maksim_Shmelev.pdf",
};

const WINDOWS = {
  about: {
    title: "about",
    w: 620,
    h: 560,
    html: () => `
      <h2>hi! i'm ${escapeHtml(SITE.name)}</h2>
      <p><span class="kbd">${escapeHtml(SITE.role)}</span> · <span class="kbd">${escapeHtml(SITE.tagline)}</span></p>
      <p style="margin-top:10px;color:var(--muted)">${escapeHtml(SITE.summary)}</p>

      <div class="hr"></div>

      <h3>skills</h3>
      <ul>
        ${SITE.skills.map(s => `<li>${escapeHtml(s)}</li>`).join("")}
      </ul>

      <h3>languages</h3>
      <div class="pills">
        ${SITE.languages.map(l => `<span class="pill">${escapeHtml(l.name)} · ${escapeHtml(l.level)}</span>`).join("")}
      </div>

      <div class="hr"></div>
      <p>Tip: drag windows by the titlebar. Press <span class="kbd">Esc</span> to close the active window.</p>
    `,
  },

  work: {
    title: "work",
    w: 720,
    h: 600,
    html: () => `
      <h2>work experience</h2>
      <div class="cards">
        ${SITE.experience.map(job => `
          <div class="card">
            <div class="card__title">${escapeHtml(job.title)} · ${escapeHtml(job.company)}</div>
            <div class="card__meta">${escapeHtml(job.place)} · ${escapeHtml(job.dates)}</div>
            <ul>
              ${job.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
            </ul>
          </div>
        `).join("")}
      </div>

      <div class="hr"></div>

      <h3>education</h3>
      <div class="cards">
        ${SITE.education.map(ed => `
          <div class="card">
            <div class="card__title">${escapeHtml(ed.title)}</div>
            <div class="card__meta">${escapeHtml(ed.org)} · ${escapeHtml(ed.dates)}</div>
            <ul>
              ${ed.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
            </ul>
          </div>
        `).join("")}
      </div>

      <h3>certifications</h3>
      <div class="cards">
        ${SITE.certifications.map(c => `
          <div class="card">
            <div class="card__title">${escapeHtml(c.title)}</div>
            <div class="card__meta">${escapeHtml(c.org)} · ${escapeHtml(c.date)}</div>
            <ul>
              ${c.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
            </ul>
          </div>
        `).join("")}
      </div>
    `,
  },

  links: {
    title: "links",
    w: 520,
    h: 480,
    html: () => `
      <h2>links</h2>
      <div class="hr"></div>

      <div class="cards">
        <div class="card">
          <div class="card__title">LinkedIn</div>
          <div class="card__meta">@maksim-shmelev</div>
          <a href="${escapeAttr(SITE.linkedin)}" target="_blank" rel="noopener">open</a>
        </div>

        <div class="card">
          <div class="card__title">Email</div>
          <div class="card__meta">${escapeHtml(SITE.email)}</div>
          <a href="mailto:${escapeAttr(SITE.email)}">write</a>
        </div>

        <div class="card">
          <div class="card__title">CV (PDF)</div>
          <div class="card__meta">${escapeHtml(SITE.cvUrl)}</div>
          <a href="${escapeAttr(SITE.cvUrl)}" target="_blank" rel="noopener">open</a>
        </div>
      </div>
    `,
  },

  contact: {
    title: "contact",
    w: 520,
    h: 440,
    html: () => `
      <h2>contact</h2>
      <p>Best way to reach me — email.</p>
      <div class="hr"></div>

      <p><strong>Email:</strong> <a href="mailto:${escapeAttr(SITE.email)}">${escapeHtml(SITE.email)}</a></p>
      <p><strong>Phone:</strong> <a href="tel:${escapeAttr(SITE.phone.replace(/\s+/g,''))}">${escapeHtml(SITE.phone)}</a></p>
      <p><strong>LinkedIn:</strong> <a href="${escapeAttr(SITE.linkedin)}" target="_blank" rel="noopener">@maksim-shmelev</a></p>

      <div class="hr"></div>
      <a class="btnlink" href="mailto:${escapeAttr(SITE.email)}?subject=Hello%20from%20your%20website" target="_self">Open mail app</a>
    `,
  },

  downloads: {
    title: "downloads",
    w: 640,
    h: 520,
    html: () => `
      <h2>downloads</h2>
      <p>CV and other files.</p>
      <div class="hr"></div>

      <div class="cards">
        <div class="card">
          <div class="card__title">CV — Maksim SHMELEV</div>
          <div class="card__meta">PDF</div>
          <p>Download the latest version of my CV.</p>
          <a href="${escapeAttr(SITE.cvUrl)}" target="_blank" rel="noopener">open</a>
        </div>
      </div>

      <div class="hr"></div>
      <p style="color:var(--muted);font-family:var(--mono);font-size:12px">Tip: to make the CV link work on GitHub Pages, keep the PDF at <span class="kbd">assets/</span>.</p>
    `,
  },

  faq: {
    title: "faq",
    w: 520,
    h: 460,
    html: () => `
      <h2>faq</h2>

      <h3>Do you check DMs?</h3>
      <p>Usually no — email is best.</p>

      <h3>What roles are you interested in?</h3>
      <p>Marketing / E-commerce internships (data-driven) and product / growth roles.</p>

      <h3>What tools do you use?</h3>
      <p>${escapeHtml(SITE.skills.slice(0,6).join(" · "))}</p>
    `,
  },
};

/* -------------------------
   State + helpers
-------------------------- */
const windowsEl = document.getElementById("windows");
const toastEl = document.getElementById("toast");

const themeToggle = document.getElementById("themeToggle");
const sfxToggle = document.getElementById("sfxToggle");
const resetLayoutBtn = document.getElementById("resetLayout");

const brandText = document.getElementById("brandText");
const hintText = document.getElementById("hintText");

const state = loadState();

/* z-index stacking */
let zTop = 20;
let activeWindowId = null;

brandText.textContent = `hi! i'm ${SITE.name}`;
hintText.textContent = SITE.tagline;

applyTheme(state.theme);
applySfx(state.sfx);

/* -------------------------
   Classical music rat (play/pause)
-------------------------- */
const ratCard = document.getElementById("ratCard");
const RAT_TRACK = "./assets/Andante.mp3"; // put Andante.mp3 next to index.html (root)
let ratAudio = null;

function ensureRatAudio(){
  if (ratAudio) return ratAudio;
  ratAudio = new Audio(RAT_TRACK);
  ratAudio.preload = "auto";
  ratAudio.loop = true;
  ratAudio.addEventListener("play", () => setRatPlaying(true));
  ratAudio.addEventListener("pause", () => setRatPlaying(false));
  return ratAudio;
}

function setRatPlaying(on){
  if (!ratCard) return;
  ratCard.classList.toggle("is-playing", !!on);
  ratCard.setAttribute("aria-pressed", on ? "true" : "false");
}

if (ratCard){
  ratCard.addEventListener("click", async () => {
    const a = ensureRatAudio();
    try{
      if (a.paused){
        await a.play();
        toast("♪ Andante — playing");
      } else {
        a.pause();
        toast("Andante — paused");
      }
    } catch (e){
      // Usually autoplay permission; user gesture already happened, but just in case.
      toast("Audio blocked — tap again");
    }
  });
}

/* -------------------------
   Audio (tiny click beep)
-------------------------- */
let audioCtx = null;

function beep(freq = 560, durationMs = 30, gainVal = 0.03) {
  if (!state.sfx) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const t0 = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "square";
    osc.frequency.value = freq;

    gain.gain.value = gainVal;

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(t0);
    osc.stop(t0 + durationMs / 1000);
  } catch (_) {
    // ignore
  }
}

/* -------------------------
   Dock icons click
-------------------------- */
document.querySelectorAll(".icon[data-open]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-open");
    openWindow(id);
  });
});

/* -------------------------
   Toggles
-------------------------- */
themeToggle.addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  applyTheme(state.theme);
  saveState();
  beep(680, 35);
});

sfxToggle.addEventListener("click", () => {
  state.sfx = !state.sfx;
  applySfx(state.sfx);

/* -------------------------
   Classical music rat (play/pause)
-------------------------- */
const ratCard = document.getElementById("ratCard");
const RAT_TRACK = "./Andante.mp3"; // put Andante.mp3 next to index.html (root)
let ratAudio = null;

function ensureRatAudio(){
  if (ratAudio) return ratAudio;
  ratAudio = new Audio(RAT_TRACK);
  ratAudio.preload = "auto";
  ratAudio.loop = true;
  ratAudio.addEventListener("play", () => setRatPlaying(true));
  ratAudio.addEventListener("pause", () => setRatPlaying(false));
  return ratAudio;
}

function setRatPlaying(on){
  if (!ratCard) return;
  ratCard.classList.toggle("is-playing", !!on);
  ratCard.setAttribute("aria-pressed", on ? "true" : "false");
}

if (ratCard){
  ratCard.addEventListener("click", async () => {
    const a = ensureRatAudio();
    try{
      if (a.paused){
        await a.play();
        toast("♪ Andante — playing");
      } else {
        a.pause();
        toast("Andante — paused");
      }
    } catch (e){
      // Usually autoplay permission; user gesture already happened, but just in case.
      toast("Audio blocked — tap again");
    }
  });
}
  saveState();
  beep(440, 40);
  toast(state.sfx ? "SFX: on" : "SFX: off");
});

resetLayoutBtn.addEventListener("click", () => {
  state.layout = {};
  saveState();

  const ids = Object.keys(state.open || {});
  let offset = 0;
  ids.forEach((id) => {
    const w = document.getElementById(`win-${id}`);
    if (!w) return;

    const rect = getInitialRect(id, WINDOWS[id] || { w: 560, h: 520 }, offset);
    w.style.left = `${rect.x}px`;
    w.style.top = `${rect.y}px`;
    w.style.width = `${rect.w}px`;
    w.style.height = `${rect.h}px`;

    rememberWindowRect(id, w);
    offset += 1;
  });

  beep(520, 50);
  toast("Layout reset");
});

/* -------------------------
   Window open/close
-------------------------- */
function openWindow(id) {
  const def = WINDOWS[id];
  if (!def) return;

  // already open => focus
  const existing = document.getElementById(`win-${id}`);
  if (existing) {
    focusWindow(id, existing);
    beep(620, 25);
    return;
  }

  const rect = getInitialRect(id, def);

  const win = document.createElement("section");
  win.className = "window";
  win.id = `win-${id}`;
  win.setAttribute("role", "dialog");
  win.setAttribute("aria-modal", "false");
  win.setAttribute("aria-label", def.title);

  win.style.width = `${rect.w}px`;
  win.style.height = `${rect.h}px`;
  win.style.left = `${rect.x}px`;
  win.style.top = `${rect.y}px`;
  win.style.zIndex = `${++zTop}`;

  win.innerHTML = `
    <div class="titlebar" data-drag-handle>
      <div class="titlebar__title">${escapeHtml(def.title)}</div>
      <div class="titlebar__actions">
        <button class="winbtn winbtn--close" type="button" aria-label="Close">[x]</button>
      </div>
    </div>
    <div class="window__content">
      ${def.html()}
    </div>
  `;

  windowsEl.appendChild(win);
  state.open[id] = true;
  saveState();

  markIconOpen(id, true);

  // Close button
  win.querySelector(".winbtn--close").addEventListener("click", () => closeWindow(id));

  // Focus on click
  win.addEventListener("mousedown", () => focusWindow(id, win));

  // Drag
  enableDrag(win, id);
  enableResizePersistence(win, id);

  focusWindow(id, win);
  beep(740, 28);
}

function closeWindow(id) {
  const win = document.getElementById(`win-${id}`);
  if (!win) return;
  disableResizePersistence(id);
  win.remove();
  delete state.open[id];
  saveState();
  markIconOpen(id, false);
  beep(380, 35);
}

function focusWindow(id, el) {
  activeWindowId = id;
  el.style.zIndex = `${++zTop}`;
}

/* Esc closes active window */
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && activeWindowId) {
    closeWindow(activeWindowId);
    activeWindowId = null;
  }
});

/* -------------------------
   Resizing (persist width/height via ResizeObserver)
-------------------------- */
const _resizeObservers = new Map();

function enableResizePersistence(win, id){
  try{
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      // save pos + size (debounced by rAF)
      rememberWindowRect(id, win);
    });
    ro.observe(win);
    _resizeObservers.set(id, ro);
  } catch (_) {}
}

function disableResizePersistence(id){
  const ro = _resizeObservers.get(id);
  if (!ro) return;
  try{ ro.disconnect(); } catch(_){}
  _resizeObservers.delete(id);
}

/* -------------------------
   Dragging
-------------------------- */
function enableDrag(win, id) {
  const handle = win.querySelector("[data-drag-handle]");
  if (!handle) return;

  let dragging = false;
  let startX = 0, startY = 0;
  let winX = 0, winY = 0;

  const onDown = (e) => {
    if (e.target && e.target.closest("button")) return;

    dragging = true;
    focusWindow(id, win);

    const rect = win.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    winX = rect.left;
    winY = rect.top;

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp, { once: true });
  };

  const onMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const maxX = window.innerWidth - 80;
    const maxY = window.innerHeight - 60;

    const nx = clamp(winX + dx, 10, maxX);
    const ny = clamp(winY + dy, 68, maxY);

    win.style.left = `${nx}px`;
    win.style.top = `${ny}px`;
  };

  const onUp = () => {
    dragging = false;
    window.removeEventListener("mousemove", onMove);
    rememberWindowRect(id, win);
  };

  handle.addEventListener("mousedown", onDown);
}

/* remember size/pos */
function rememberWindowRect(id, win) {
  const r = win.getBoundingClientRect();
  state.layout[id] = {
    x: Math.round(r.left),
    y: Math.round(r.top),
    w: Math.round(r.width),
    h: Math.round(r.height),
  };
  saveState();
}

function getInitialRect(id, def, cascadeIndex = null) {
  const saved = state.layout[id];
  if (saved) return saved;

  const w = def.w || 560;
  const h = def.h || 520;

  const openedCount = cascadeIndex !== null ? cascadeIndex : Object.keys(state.open).length;
  const baseX = Math.round((window.innerWidth - w) / 2);
  const baseY = 120;

  const x = clamp(baseX + openedCount * 22, 10, Math.max(10, window.innerWidth - w - 10));
  const y = clamp(baseY + openedCount * 22, 68, Math.max(68, window.innerHeight - h - 70));

  return { x, y, w, h };
}

/* -------------------------
   Dock open indicator
-------------------------- */
function markIconOpen(id, isOpen) {
  const icon = document.querySelector(`.icon[data-open="${CSS.escape(id)}"]`);
  if (!icon) return;
  icon.classList.toggle("is-open", !!isOpen);
}

/* -------------------------
   Theme & SFX UI
-------------------------- */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  themeToggle.querySelector(".toggle__label").textContent = theme === "dark" ? "Dark" : "Light";
  themeToggle.querySelector(".toggle__icon").textContent = theme === "dark" ? "☾" : "☀";
}

function applySfx(on) {
  sfxToggle.setAttribute("aria-pressed", on ? "true" : "false");
  sfxToggle.querySelector(".toggle__label").textContent = on ? "SFX on" : "SFX off";
  sfxToggle.querySelector(".toggle__icon").textContent = on ? "♪" : "∅";
}

/* -------------------------
   Persistence
-------------------------- */
function loadState() {
  const defaults = {
    theme: "dark",
    sfx: false,
    open: {},
    layout: {},
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return {
      ...defaults,
      ...parsed,
      open: parsed.open || {},
      layout: parsed.layout || {},
    };
  } catch {
    return defaults;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* -------------------------
   Toast
-------------------------- */
let toastTimer = null;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1400);
}

/* -------------------------
   Escape helpers
-------------------------- */
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function escapeAttr(str) { return escapeHtml(str).replaceAll("`", ""); }

/* -------------------------
   Restore open windows
-------------------------- */
(function init() {
  const openIds = Object.keys(state.open || {});
  openIds.forEach((id) => openWindow(id));

  if (openIds.length === 0) openWindow("about");

  // ensure dock indicators match
  Object.keys(state.open || {}).forEach((id) => markIconOpen(id, true));
})();

/* -------------------------
   Eyes (follow cursor) — SVG pupils
-------------------------- */
(function initEyes(){
  const watcher = document.getElementById("watcher");
  const svg = document.getElementById("eyesSvg");
  if (!watcher || !svg) return;

  const pupilL = document.getElementById("pupilL");
  const pupilR = document.getElementById("pupilR");
  const shineL = document.getElementById("shineL");
  const shineR = document.getElementById("shineR");
  if (!pupilL || !pupilR) return;

  // Base centers in SVG units (match cx/cy in index.html)
  const base = {
    L: { x: 60,  y: 40 },
    R: { x: 180, y: 40 },
  };

  // Max travel inside eye (SVG units)
  const MAX = 10;

  let targetClient = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let raf = null;

  function clientToSvgPoint(clientX, clientY){
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 120, y: 40 };
    const inv = ctm.inverse();
    const sp = pt.matrixTransform(inv);
    return { x: sp.x, y: sp.y };
  }

  function movePupil(pupil, shine, center, target){
    const dx = target.x - center.x;
    const dy = target.y - center.y;
    const dist = Math.hypot(dx, dy) || 1;

    // Natural movement: farther cursor -> slightly more movement, but clamped
    const travel = Math.min(MAX, dist * 0.12);

    const nx = (dx / dist) * travel;
    const ny = (dy / dist) * travel;

    const cx = center.x + nx;
    const cy = center.y + ny;

    pupil.setAttribute("cx", cx.toFixed(2));
    pupil.setAttribute("cy", cy.toFixed(2));

    // Optional tiny shine offset (kept subtle)
    if (shine){
      shine.setAttribute("cx", (cx - 5).toFixed(2));
      shine.setAttribute("cy", (cy - 5).toFixed(2));
    }
  }

  function update(){
    raf = null;
    const t = clientToSvgPoint(targetClient.x, targetClient.y);

    movePupil(pupilL, shineL, base.L, t);
    movePupil(pupilR, shineR, base.R, t);
  }

  function onMove(e){
    const p = e.touches ? e.touches[0] : e;
    if (!p) return;
    targetClient.x = p.clientX;
    targetClient.y = p.clientY;
    if (!raf) raf = requestAnimationFrame(update);
  }

  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("touchstart", onMove, { passive: true });
  window.addEventListener("touchmove", onMove, { passive: true });
  window.addEventListener("resize", () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });

  // First paint
  update();
})();
