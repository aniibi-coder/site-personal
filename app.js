/* Desktop-portfolio template (vanilla JS)
   - draggable windows
   - z-index focus
   - dark mode + sfx toggles (WebAudio beep)
   - remembers layout in localStorage
*/

const STORAGE_KEY = "desktop_portfolio_v1";

const SITE = {
  name: "Your Name",
  tagline: "illustrator / animator / developer",
  email: "you@example.com",
  location: "Based in …",
  languages: ["English", "Русский"],
  interests: ["game dev", "music", "snowboarding", "…"],
  socials: [
    { label: "GitHub", href: "https://github.com/yourname" },
    { label: "YouTube", href: "https://youtube.com/@yourname" },
    { label: "Instagram", href: "https://instagram.com/yourname" },
    { label: "LinkedIn", href: "https://linkedin.com/in/yourname" },
  ],
  tools: ["Figma", "Photoshop", "After Effects", "Blender"],
  dev: ["JavaScript", "HTML/CSS", "React", "Node.js"],
  projects: [
    {
      title: "Project One",
      meta: "2026 • web app",
      desc: "Коротко: что это и какой результат.",
      tags: ["frontend", "design"],
      links: [
        { label: "Live", href: "https://example.com" },
        { label: "Repo", href: "https://github.com/yourname/project" },
      ],
    },
    {
      title: "Project Two",
      meta: "2025 • animation",
      desc: "Коротко: что ты сделал(а).",
      tags: ["animation", "2D"],
      links: [{ label: "Watch", href: "https://youtube.com/" }],
    },
  ],
  downloads: [
    {
      title: "Wallpaper Pack",
      meta: "PNG • free for personal use",
      desc: "Ссылка на zip или папку.",
      href: "#",
    },
    {
      title: "Sticker Pack",
      meta: "PNG • free for personal use",
      desc: "Ещё один айтем.",
      href: "#",
    },
  ],
};

const WINDOWS = {
  about: {
    title: "about",
    w: 560,
    h: 520,
    html: () => `
      <h2>hi! i'm ${escapeHtml(SITE.name)}</h2>
      <p><span class="kbd">${escapeHtml(SITE.tagline)}</span></p>

      <div class="hr"></div>

      <p>${escapeHtml(SITE.location)}</p>

      <h3>what i do</h3>
      <ul>
        <li>illustration / animation / web dev</li>
        <li>website wireframes & UI</li>
        <li>frontend development</li>
      </ul>

      <h3>languages</h3>
      <div class="pills">
        ${SITE.languages.map(l => `<span class="pill">${escapeHtml(l)}</span>`).join("")}
      </div>

      <h3>other interests</h3>
      <div class="pills">
        ${SITE.interests.map(i => `<span class="pill">${escapeHtml(i)}</span>`).join("")}
      </div>

      <div class="hr"></div>
      <p>Tip: drag windows by the titlebar. Press <span class="kbd">Esc</span> to close the active window.</p>
    `,
  },

  links: {
    title: "links",
    w: 520,
    h: 460,
    html: () => `
      <h2>links</h2>
      <p>Clicking any link opens a new tab.</p>
      <div class="hr"></div>

      <div class="cards">
        ${SITE.socials.map(s => `
          <div class="card">
            <div class="card__title">${escapeHtml(s.label)}</div>
            <div class="card__meta">${escapeHtml(s.href)}</div>
            <a href="${escapeAttr(s.href)}" target="_blank" rel="noopener">open</a>
          </div>
        `).join("")}
      </div>
    `,
  },

  work: {
    title: "work",
    w: 640,
    h: 560,
    html: () => `
      <h2>work</h2>
      <p>Accepting work offers via email: <a href="mailto:${escapeAttr(SITE.email)}">${escapeHtml(SITE.email)}</a></p>

      <h3>tools</h3>
      <div class="pills">
        ${SITE.tools.map(t => `<span class="pill">${escapeHtml(t)}</span>`).join("")}
      </div>

      <h3>development</h3>
      <div class="pills">
        ${SITE.dev.map(d => `<span class="pill">${escapeHtml(d)}</span>`).join("")}
      </div>

      <div class="hr"></div>

      <h3>projects</h3>
      <div class="cards">
        ${SITE.projects.map(p => `
          <div class="card">
            <div class="card__title">${escapeHtml(p.title)}</div>
            <div class="card__meta">${escapeHtml(p.meta)}</div>
            <p>${escapeHtml(p.desc)}</p>
            <div class="pills">
              ${(p.tags || []).map(t => `<span class="pill">${escapeHtml(t)}</span>`).join("")}
            </div>
            <div class="hr"></div>
            ${(p.links || []).map(l => `
              <a href="${escapeAttr(l.href)}" target="_blank" rel="noopener">${escapeHtml(l.label)}</a>
            `).join(" · ")}
          </div>
        `).join("")}
      </div>
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

      <h3>Can I use your downloads?</h3>
      <p>Yes for personal use (replace this text with your terms).</p>

      <h3>What stack do you use?</h3>
      <p>${escapeHtml(SITE.dev.join(", "))}</p>
    `,
  },

  contact: {
    title: "contact",
    w: 520,
    h: 420,
    html: () => `
      <h2>yayy mail!</h2>
      <p>Самый простой способ связаться — email.</p>
      <div class="hr"></div>

      <p><strong>Email:</strong> <a href="mailto:${escapeAttr(SITE.email)}">${escapeHtml(SITE.email)}</a></p>

      <div class="hr"></div>
      <a class="btnlink" href="mailto:${escapeAttr(SITE.email)}?subject=Hello%20from%20your%20website" target="_self">Open mail app</a>
    `,
  },

  downloads: {
    title: "downloads",
    w: 640,
    h: 560,
    html: () => `
      <h2>downloads</h2>
      <p>Free downloadable content (personal use). Replace with your links.</p>
      <div class="hr"></div>

      <div class="cards">
        ${SITE.downloads.map(d => `
          <div class="card">
            <div class="card__title">${escapeHtml(d.title)}</div>
            <div class="card__meta">${escapeHtml(d.meta)}</div>
            <p>${escapeHtml(d.desc)}</p>
            <a href="${escapeAttr(d.href)}" target="_blank" rel="noopener">download</a>
          </div>
        `).join("")}
      </div>
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

const mobileNotice = document.getElementById("mobileNotice");
const noticeOk = document.getElementById("noticeOk");

const state = loadState();

/* z-index stacking */
let zTop = 20;
let activeWindowId = null;

brandText.textContent = `hi! i'm ${SITE.name}`;
hintText.textContent = SITE.tagline;

applyTheme(state.theme);
applySfx(state.sfx);

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
   Desktop icons click
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
  saveState();
  beep(440, 40);
  toast(state.sfx ? "SFX: on" : "SFX: off");
});

resetLayoutBtn.addEventListener("click", () => {
  state.layout = {};
  saveState();
  // Move all open windows to defaults (nice cascade)
  const ids = Object.keys(state.open || {});
  let x = 260, y = 110;
  ids.forEach((id) => {
    const w = document.getElementById(`win-${id}`);
    if (!w) return;
    w.style.left = `${x}px`;
    w.style.top = `${y}px`;
    x += 24; y += 24;
    rememberWindowRect(id, w);
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

  // Close button
  win.querySelector(".winbtn--close").addEventListener("click", () => closeWindow(id));

  // Focus on click
  win.addEventListener("mousedown", () => focusWindow(id, win));

  // Drag
  enableDrag(win, id);

  focusWindow(id, win);
  beep(740, 28);
}

function closeWindow(id) {
  const win = document.getElementById(`win-${id}`);
  if (!win) return;
  win.remove();
  delete state.open[id];
  saveState();
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
   Dragging
-------------------------- */
function enableDrag(win, id) {
  const handle = win.querySelector("[data-drag-handle]");
  if (!handle) return;

  let dragging = false;
  let startX = 0, startY = 0;
  let winX = 0, winY = 0;

  const onDown = (e) => {
    // ignore clicks on buttons inside titlebar
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

    // clamp inside viewport a bit
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

function getInitialRect(id, def) {
  // layout stored?
  const saved = state.layout[id];
  if (saved) return saved;

  // cascade default
  const openedCount = Object.keys(state.open).length;
  const x = 260 + openedCount * 22;
  const y = 110 + openedCount * 22;

  const w = def.w || 560;
  const h = def.h || 520;

  return { x, y, w, h };
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
   Mobile notice
-------------------------- */
function maybeShowMobileNotice() {
  const small = window.matchMedia("(max-width: 860px)").matches;
  if (!small) return;
  mobileNotice.hidden = false;
}
noticeOk.addEventListener("click", () => (mobileNotice.hidden = true));

/* -------------------------
   Restore open windows
-------------------------- */
(function init() {
  maybeShowMobileNotice();

  // restore windows user had open
  const openIds = Object.keys(state.open || {});
  openIds.forEach((id) => openWindow(id));

  // if none open, open "about" by default
  if (openIds.length === 0) openWindow("about");
})();
