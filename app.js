/* XP Desktop Portfolio (vanilla JS)
   - Draggable resizable windows
   - Explorer-like folders with file list
   - Taskbar buttons + Start menu
   - Persists window layout in localStorage
*/

const STORAGE_KEY = "xp_desktop_portfolio_v1";

// Asset icons (local, no external deps)
const ICONS = {
  folder: "./assets/icons/folder.png",
  pdf: "./assets/icons/pdf.png",
  txt: "./assets/icons/txt.png",
  mail: "./assets/icons/mail.png",
  phone: "./assets/icons/phone.png",
  linkedin: "./assets/icons/linkedin.png",
  computer: "./assets/icons/computer.png",
  recycle: "./assets/icons/recycle.png",
};


// ---- Data (from your CV PDF) ----
// Source: CV_Maksim_Shmelev_Ecommerce.pdf
const PROFILE = {
  name: "Maksim Shmelev",
  headline: "E-commerce Specialist",
  locations: "Bordeaux / Paris / EU Remote (UTC+1)",
  email: "shmelevmaksim4studies@gmail.com",
  phone: "+33 777 101 576",
  linkedin: "https://www.linkedin.com/in/maksim-shmelev/",
  cvUrl: "CV_Maksim_Shmelev_Ecommerce.pdf",

  education: [
    {
      title: "MSc Marketing (Brand & Product management)",
      org: "KEDGE Business School — Bordeaux, France",
      dates: "Sep 2025 – Jul 2027",
      notes: ["Google Analytics", "Marketing decision making", "Data analytics & AI", "Financial performance"],
    },
    {
      title: "Marketplace Manager (256h)",
      org: "Yandex Practicum",
      dates: "Jul 2024",
      notes: ["Data analysis", "Marketplace management", "E-commerce basics"],
    },
    {
      title: "Professional Certificate: Digital Marketing & E-commerce",
      org: "Google",
      dates: "Jun 2024",
      notes: ["Marketing analytics", "Online advertising", "E-commerce management"],
    },
    {
      title: "BSc Economics & Management (English-taught)",
      org: "Plekhanov Russian University of Economics — Moscow, Russia",
      dates: "Sep 2021 – Jul 2025",
      notes: ["Marketing", "Statistics", "Econometrics", "Business analysis", "Product design"],
    },
  ],

  experience: [
    {
      title: "Product Manager",
      org: "Fuh! (Startup Degree program)",
      dates: "Feb 2025 – Aug 2025",
      bullets: [
        "Co-launched a subscription-based mental health startup (go-to-market, branding, product strategy).",
        "Analyzed user behavior, engagement and retention to identify growth and UX issues.",
        "Turned early user feedback and performance data into actionable product improvements.",
      ],
    },
    {
      title: "E-commerce Intern",
      org: "Socialist LLC",
      dates: "Oct 2024 – Feb 2025",
      bullets: [
        "Built media plans and performance briefs for Vivienne Sabo, Air Tokyo, Surf Coffee.",
        "Increased orders by 21% on Wildberries by optimizing SEO keywords; supported product publication (content/compliance).",
        "Optimized marketplace ads (bids/budgets/targeting), created banners & product cards; delivered analytics and competitor benchmarking.",
      ],
    },
    {
      title: "Researcher",
      org: "PRUE — Innovation management with AI",
      dates: "Jun 2023 – Jun 2024",
      bullets: [
        "Gathered and cleaned industry datasets for training/validating analytical research models.",
        "Compared ML behaviour under different settings to achieve target requirements.",
      ],
    },
  ],

  projects: [
    {
      name: "Ridekit.fr (in progress) — Founder",
      meta: "Aug 2025",
      desc: "Interactive ski/snowboard gear recommender with selective options that lead to affiliate links.",
    },
    {
      name: "Mental AI-Assistant Startup — Founding member",
      meta: "Feb 2024",
      desc: "Helped found an AI-based mental health assistant; led financial modeling, budget allocation and IT development.",
    },
    {
      name: "Clothing brand — Founder",
      meta: "Oct 2023",
      desc: "Created a brand and website for selling clothing; handled early promo and supplier/logistics setup.",
    },
  ],

  certificates: [
    { name: "KEDGE Merit Scholarship", meta: "Jun 2025" },
    { name: "Startup Grant — $10,000 Government Innovation Fund (5th wave)", meta: "Jul 2024" },
    { name: "Full study scholarship — Plekhanov University", meta: "Sep 2024" },
    { name: "Google Digital Marketing & E-commerce", meta: "Jun 2024" },
    { name: "Yandex Practicum — Marketplace Manager (256h)", meta: "Jul 2024" },
  ],

  skillsLine:
    "Marketplace ads (bids/budgets/targeting); KPI analytics (CTR/CVR/ROAS/ACoS); Pricing & competitor benchmarking; GA4; Excel (Advanced).",

  languagesLine: "Russian (native), English (C1 · IELTS 7.5), French (A2).",
};

// ---- Window registry ----
const WINDOWS = {
  about: {
    title: "Readme.txt",
    w: 640,
    h: 520,
    html: () => `
      <h2>${escapeHtml(PROFILE.name)} — ${escapeHtml(PROFILE.headline)}</h2>
      <p><span class="kbd">${escapeHtml(PROFILE.locations)}</span></p>
      <div class="hr"></div>
      <p>
        Welcome! This portfolio is a Windows XP–style desktop.
        Open folders on the left, or use the <strong>Start</strong> menu.
      </p>
      <p>
        Quick actions:
        <ul>
          <li>Open <strong>CV.pdf</strong> to view/download my resume.</li>
          <li>Open <strong>Experience</strong> for roles + education.</li>
          <li>Open <strong>Projects</strong> for my initiatives.</li>
        </ul>
      </p>
      <div class="hr"></div>
      <p style="color:var(--muted)">Tip: drag windows by the titlebar. Press <span class="kbd">Esc</span> to close the active window.</p>
    `,
  },

  cv: {
    title: "CV.pdf",
    w: 860,
    h: 640,
    html: () => `
      <h2>CV.pdf</h2>
      <p style="color:var(--muted)">If the PDF preview doesn’t load, use: <a href="${escapeAttr(PROFILE.cvUrl)}" target="_blank" rel="noopener">Open in a new tab</a>.</p>
      <div class="hr"></div>
      <iframe class="pdf" src="${escapeAttr(PROFILE.cvUrl)}" title="CV PDF viewer"></iframe>
    `,
  },

  folder_experience: {
    title: "Experience",
    w: 820,
    h: 620,
    html: () => explorerView({
      path: "C:\\Users\\Maksim\\Experience",
      items: [
        { type: "file", icon: "txt", name: "Work_Experience.txt", meta: "TXT", open: "experience_txt" },
        { type: "file", icon: "txt", name: "Education.txt", meta: "TXT", open: "education_txt" },
        { type: "file", icon: "txt", name: "Skills.txt", meta: "TXT", open: "skills_txt" },
      ],
    }),
  },

  folder_projects: {
    title: "Projects",
    w: 820,
    h: 620,
    html: () => explorerView({
      path: "C:\\Users\\Maksim\\Projects",
      items: [
        { type: "file", icon: "txt", name: "Ridekit_fr.txt", meta: "TXT", open: "proj_ridekit" },
        { type: "file", icon: "txt", name: "Mental_AI_Assistant.txt", meta: "TXT", open: "proj_ai" },
        { type: "file", icon: "txt", name: "Clothing_Brand.txt", meta: "TXT", open: "proj_clothing" },
      ],
    }),
  },

  folder_certificates: {
    title: "Certificates",
    w: 760,
    h: 560,
    html: () => explorerView({
      path: "C:\\Users\\Maksim\\Certificates",
      items: PROFILE.certificates.map(c => ({
        type: "file",
        icon: "txt",
        name: c.name,
        meta: c.meta,
        open: "cert_list", // one window for list; openWindow will focus if already open
      })),
    }),
  },

  folder_contact: {
    title: "Contact",
    w: 560,
    h: 440,
    html: () => explorerView({
      path: "C:\\Users\\Maksim\\Contact",
      items: [
        { type: "link", icon: "mail", name: PROFILE.email, meta: "Email", href: `mailto:${PROFILE.email}` },
        { type: "link", icon: "phone", name: PROFILE.phone, meta: "Phone", href: `tel:${PROFILE.phone.replace(/\s+/g, "")}` },
        { type: "link", icon: "linkedin", name: "LinkedIn", meta: "URL", href: PROFILE.linkedin },
      ],
    }),
  },

  // Text windows
  experience_txt: {
    title: "Work_Experience.txt",
    w: 820,
    h: 620,
    html: () => `
      <h2>Work experience</h2>
      <div class="hr"></div>
      ${PROFILE.experience.map(x => `
        <h3>${escapeHtml(x.title)} — ${escapeHtml(x.org)}</h3>
        <p style="color:var(--muted);margin-top:-2px">${escapeHtml(x.dates)}</p>
        <ul>${x.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>
      `).join("")}
    `,
  },

  education_txt: {
    title: "Education.txt",
    w: 760,
    h: 600,
    html: () => `
      <h2>Education</h2>
      <div class="hr"></div>
      ${PROFILE.education.map(e => `
        <h3>${escapeHtml(e.title)}</h3>
        <p style="color:var(--muted);margin-top:-2px">${escapeHtml(e.org)} · ${escapeHtml(e.dates)}</p>
        <ul>${(e.notes || []).map(n => `<li>${escapeHtml(n)}</li>`).join("")}</ul>
      `).join("")}
    `,
  },

  skills_txt: {
    title: "Skills.txt",
    w: 680,
    h: 520,
    html: () => `
      <h2>Skills</h2>
      <div class="hr"></div>
      <p><strong>Core:</strong> ${escapeHtml(PROFILE.skillsLine)}</p>
      <p><strong>Languages:</strong> ${escapeHtml(PROFILE.languagesLine)}</p>
    `,
  },

  proj_ridekit: {
    title: "Ridekit_fr.txt",
    w: 720,
    h: 520,
    html: () => projectView(PROFILE.projects[0]),
  },
  proj_ai: {
    title: "Mental_AI_Assistant.txt",
    w: 720,
    h: 520,
    html: () => projectView(PROFILE.projects[1]),
  },
  proj_clothing: {
    title: "Clothing_Brand.txt",
    w: 720,
    h: 520,
    html: () => projectView(PROFILE.projects[2]),
  },

  cert_list: {
    title: "Certificates",
    w: 760,
    h: 560,
    html: () => `
      <h2>Certificates & Scholarships</h2>
      <p style="color:var(--muted)">A quick list from my CV.</p>
      <div class="hr"></div>
      <ul>
        ${PROFILE.certificates.map(c => `<li><strong>${escapeHtml(c.name)}</strong> — <span style="color:var(--muted)">${escapeHtml(c.meta)}</span></li>`).join("")}
      </ul>
    `,
  },
};

function projectView(p){
  return `
    <h2>${escapeHtml(p.name)}</h2>
    <p style="color:var(--muted)">${escapeHtml(p.meta)}</p>
    <div class="hr"></div>
    <p>${escapeHtml(p.desc)}</p>
  `;
}

function iconHtml(token){
  const key = (token || "txt").toString();
  const src = ICONS[key];
  if(!src) return escapeHtml(key);
  return `<img src="${src}" alt="" aria-hidden="true">`;
}

function explorerView({path, items}){
  return `
    <div class="explorerbar">
      <strong>Address</strong>
      <div class="explorerbar__path">${escapeHtml(path)}</div>
    </div>

    <div class="filelist" data-filelist>
      ${items.map((it, idx) => `
        <div class="file" data-idx="${idx}" data-type="${escapeAttr(it.type)}"
             ${it.open ? `data-open="${escapeAttr(it.open)}"` : ""}
             ${it.href ? `data-href="${escapeAttr(it.href)}"` : ""}>
          <div class="file__icon" aria-hidden="true">${iconHtml(it.icon)}</div>
          <div class="file__name">${escapeHtml(it.name)}</div>
          <div class="file__meta">${escapeHtml(it.meta || "")}</div>
        </div>
      `).join("")}
    </div>

    <p style="color:var(--muted);margin-top:10px">
      Double‑click a file to open.
    </p>
  `;
}

// ---- DOM ----
const windowsEl = document.getElementById("windows");
const toastEl = document.getElementById("toast");
const taskButtonsEl = document.getElementById("taskButtons");
const clockEl = document.getElementById("clock");
const startBtn = document.getElementById("startBtn");
const startMenu = document.getElementById("startMenu");
const resetLayoutBtn = document.getElementById("resetLayout");

let zTop = 20;
let activeWindowId = null;
const state = loadState();

// ---- Desktop icon bindings ----
const welcomeCard = document.getElementById("welcomeCard");
const welcomeCloseBtn = document.getElementById("welcomeClose");

// Hide welcome panel if user closed it previously
if (welcomeCard && localStorage.getItem("xp_welcome_hidden") === "1") {
  welcomeCard.style.display = "none";
}
welcomeCloseBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  localStorage.setItem("xp_welcome_hidden", "1");
  if (welcomeCard) welcomeCard.style.display = "none";
});

document.querySelectorAll("[data-open]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-open");
    if (!id) return;
    openWindow(id);
  });
});

// ---- Start menu ----
function setStartMenu(open){
  startBtn.setAttribute("aria-expanded", open ? "true" : "false");
  startMenu.hidden = !open;
}
startBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  setStartMenu(!startMenu.hidden);
});
window.addEventListener("click", () => setStartMenu(false));
startMenu.addEventListener("click", (e) => {
  e.stopPropagation();
  const btn = e.target.closest("button[data-open]");
  if (btn){
    const id = btn.getAttribute("data-open");
    setStartMenu(false);
    openWindow(id);
  }
});

resetLayoutBtn?.addEventListener("click", () => {
  state.layout = {};
  saveState();

  const ids = Object.keys(state.open || {});
  let offset = 0;
  ids.forEach((id) => {
    const w = document.getElementById(`win-${id}`);
    if (!w) return;

    const rect = getInitialRect(id, WINDOWS[id] || { w: 640, h: 520 }, offset);
    w.style.left = `${rect.x}px`;
    w.style.top = `${rect.y}px`;
    w.style.width = `${rect.w}px`;
    w.style.height = `${rect.h}px`;

    rememberWindowRect(id, w);
    offset += 1;
  });

  toast("Windows reset");
});

// ---- Clock ----
function pad2(n){ return String(n).padStart(2, "0"); }
function updateClock(){
  const d = new Date();
  clockEl.textContent = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
updateClock();
setInterval(updateClock, 10_000);

// ---- Window open/close/focus ----
function openWindow(id){
  const def = WINDOWS[id];
  if (!def) return;

  const existing = document.getElementById(`win-${id}`);
  if (existing){
    focusWindow(id, existing);
    toast(`${def.title}`);
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
        <button class="winbtn" data-action="min" type="button" aria-label="Minimize">_</button>
        <button class="winbtn winbtn--close" data-action="close" type="button" aria-label="Close">X</button>
      </div>
    </div>
    <div class="window__content">${def.html()}</div>
  `;

  windowsEl.appendChild(win);
  state.open[id] = true;
  saveState();

  // Actions
  win.querySelector('[data-action="close"]').addEventListener("click", () => closeWindow(id));
  win.querySelector('[data-action="min"]').addEventListener("click", () => minimizeWindow(id));

  // Focus on click
  win.addEventListener("mousedown", () => focusWindow(id, win));

  // Drag + resize persistence
  enableDrag(win, id);
  enableResizePersistence(win, id);

  // Explorer behaviour
  setupExplorerInteractions(win);

  // Taskbar button
  addTaskButton(id, def.title);

  focusWindow(id, win);
  toast(def.title);
}

function closeWindow(id){
  const win = document.getElementById(`win-${id}`);
  if (!win) return;
  disableResizePersistence(id);
  win.remove();
  delete state.open[id];
  saveState();
  removeTaskButton(id);
  if (activeWindowId === id) activeWindowId = null;
  toast("Closed");
}

function minimizeWindow(id){
  const win = document.getElementById(`win-${id}`);
  if (!win) return;
  win.setAttribute("aria-hidden", "true");
  win.style.display = "none";
  setTaskActive(id, false);
  if (activeWindowId === id) activeWindowId = null;
}

function restoreWindow(id){
  const win = document.getElementById(`win-${id}`);
  if (!win) return;
  win.removeAttribute("aria-hidden");
  win.style.display = "flex";
  focusWindow(id, win);
}

function focusWindow(id, el){
  activeWindowId = id;
  el.style.zIndex = `${++zTop}`;
  setTaskActive(id, true);

  // mark others inactive
  document.querySelectorAll(".taskbtn").forEach(b => {
    if (b.getAttribute("data-win") !== id) b.classList.remove("is-active");
  });
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && activeWindowId){
    closeWindow(activeWindowId);
  }
});

// ---- Taskbar buttons ----
function addTaskButton(id, title){
  const existing = taskButtonsEl.querySelector(`.taskbtn[data-win="${cssEscape(id)}"]`);
  if (existing) return;

  const btn = document.createElement("button");
  btn.className = "taskbtn is-active";
  btn.type = "button";
  btn.setAttribute("data-win", id);
  btn.textContent = title;

  btn.addEventListener("click", () => {
    const win = document.getElementById(`win-${id}`);
    if (!win) return;
    const hidden = win.style.display === "none";
    if (hidden) restoreWindow(id);
    else {
      // toggle focus/minimize like XP-ish
      if (activeWindowId === id) minimizeWindow(id);
      else focusWindow(id, win);
    }
  });

  taskButtonsEl.appendChild(btn);
}

function removeTaskButton(id){
  const btn = taskButtonsEl.querySelector(`.taskbtn[data-win="${cssEscape(id)}"]`);
  if (btn) btn.remove();
}

function setTaskActive(id, on){
  const btn = taskButtonsEl.querySelector(`.taskbtn[data-win="${cssEscape(id)}"]`);
  if (!btn) return;
  btn.classList.toggle("is-active", !!on);
}

// ---- Explorer interactions ----
function setupExplorerInteractions(winEl){
  const list = winEl.querySelector("[data-filelist]");
  if (!list) return;

  let selectedEl = null;

  const select = (row) => {
    if (selectedEl) selectedEl.classList.remove("is-selected");
    selectedEl = row;
    if (selectedEl) selectedEl.classList.add("is-selected");
  };

  list.addEventListener("click", (e) => {
    const row = e.target.closest(".file");
    if (!row) return;
    select(row);
  });

  list.addEventListener("dblclick", (e) => {
    const row = e.target.closest(".file");
    if (!row) return;

    const openId = row.getAttribute("data-open");
    const href = row.getAttribute("data-href");

    if (openId) openWindow(openId);
    else if (href) window.open(href, "_blank", "noopener");
  });
}

// ---- Dragging + layout persistence ----
function enableDrag(win, id){
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

    const nx = clamp(winX + dx, 6, maxX);
    const ny = clamp(winY + dy, 6, maxY);

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

// Resizing persistence
const _resizeObservers = new Map();
function enableResizePersistence(win, id){
  try{
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => rememberWindowRect(id, win));
    ro.observe(win);
    _resizeObservers.set(id, ro);
  } catch(_){}
}
function disableResizePersistence(id){
  const ro = _resizeObservers.get(id);
  if (!ro) return;
  try{ ro.disconnect(); } catch(_){ }
  _resizeObservers.delete(id);
}

function rememberWindowRect(id, win){
  const r = win.getBoundingClientRect();
  state.layout[id] = {
    x: Math.round(r.left),
    y: Math.round(r.top),
    w: Math.round(r.width),
    h: Math.round(r.height),
  };
  saveState();
}

function getInitialRect(id, def, cascadeIndex = null){
  const saved = state.layout[id];
  if (saved) return saved;

  const w = def.w || 720;
  const h = def.h || 560;

  const openedCount = cascadeIndex !== null ? cascadeIndex : Object.keys(state.open || {}).length;
  const baseX = Math.round((window.innerWidth - w) / 2);
  const baseY = 60;

  const x = clamp(baseX + openedCount * 18, 10, Math.max(10, window.innerWidth - w - 10));
  const y = clamp(baseY + openedCount * 18, 10, Math.max(10, window.innerHeight - h - 60));

  return { x, y, w, h };
}

// ---- Persistence ----
function loadState(){
  const defaults = { open: {}, layout: {} };
  try{
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
function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ---- Toast ----
let toastTimer = null;
function toast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1200);
}

// ---- Helpers ----
function clamp(v,a,b){ return Math.max(a, Math.min(b,v)); }
function escapeHtml(str){
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function escapeAttr(str){ return escapeHtml(str).replaceAll("`", ""); }
function cssEscape(s){
  try{ return CSS.escape(s); } catch { return String(s).replace(/[^a-zA-Z0-9_-]/g, "\\$"); }
}

// ---- Init ----
(function init(){
  // Restore previously open windows (if any)
  const openIds = Object.keys(state.open || {});
  openIds.forEach((id) => openWindow(id));

  // Do NOT auto-open anything on first load.
  // (User will open folders/files via desktop icons or the Start menu.)
})();
