/* Desktop-portfolio template (vanilla JS)
   - draggable windows
   - z-index focus
   - dark mode + sfx toggles (WebAudio beep)
   - remembers layout in localStorage
*/

const STORAGE_KEY = "desktop_portfolio_v1";

const LANG_KEY = "desktop_portfolio_lang_v1";

function detectLang() {
  const nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
  return nav.startsWith("fr") ? "fr" : "en";
}

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
      dates: "oct. 2024 — fév. 2025",
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
      dates: "fév. 2025 — août 2025",
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
      dates: "Depuis sept. 2025",
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
      dates: "sept. 2021 — août 2025",
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
      date: "juil. 2024",
      bullets: ["Marketplace data analysis", "E-commerce fundamentals", "Media planning & ad management"],
    },
    {
      title: "Google Digital Marketing & E-commerce",
      org: "Google",
      date: "juin 2024",
      bullets: ["Marketing basics", "Digital marketing"],
    },
  ],
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/maksim-shmelev/" },
  ],
  cvUrl: "assets/CV_2026-01-22_Maksim_Shmelev.pdf",
};

const SITE_FR = {
  ...SITE,
  tagline: "Marketing & E-commerce • orienté data",
  role: "Stagiaire e-commerce",
  location: "France / Bordeaux (ouvert aux opportunités)",
  languages: [
    { name: "Anglais", level: "IELTS 7.5" },
    { name: "Français", level: "A2" },
  ],
  summary:
    "Stagiaire avec une expérience en marketing & e-commerce. À l’aise avec les données : analyse des performances de campagnes, optimisation des funnels et amélioration de l’expérience client.",
  skills: [
    "Excel / Office / PowerPoint (reporting & analyse)",
    "Analyse et optimisation des performances de campagnes",
    "Suivi du funnel client & de l’engagement",
    "Analyse des retours utilisateurs (avis, rétention, satisfaction)",
    "Planification détaillée (Calendar / Notion / Teams)",
    "Outils IA : ChatGPT, Grok, Gemini (workflow quotidien)",
    "Figma / Photoshop / DaVinci Resolve / Premiere Pro",
  ],
  experience: [
    {
      title: "Stagiaire e-commerce",
      company: "Socialist",
      place: "Moscou, Russie",
      dates: "oct. 2024 — fév. 2025",
      bullets: [
        "Analyse et collecte de données produit ; préparation de rapports de performance hebdomadaires",
        "Suivi de l’engagement client et de la conversion tout au long du funnel",
        "Analyse des avis et retours clients afin d’identifier la satisfaction et les axes d’amélioration",
        "Aide à la mise en ligne de nouveaux produits et au paramétrage de campagnes publicitaires",
        "Gestion des niveaux de prix via les KPI et l’analyse concurrentielle",
      ],
    },
    {
      title: "Chef de produit",
      company: "Fuh!",
      place: "Moscou, Russie",
      dates: "fév. 2025 — août 2025",
      bullets: [
        "Planification d’actions publicitaires pour une startup de service psychologique par abonnement",
        "Création d’un brand book et contribution au positionnement produit",
        "Travail sur le développement produit : analyse des performances et des problèmes utilisateurs",
        "Collecte et revue des premiers retours utilisateurs après les bêta-tests",
        "Analyse de l’engagement et de la rétention lors du lancement de l’abonnement",
        "Collaboration avec l’équipe pour améliorer le produit et personnaliser l’expérience client",
      ],
    },
  ],
  education: [
    {
      title: "Master : Brand & Product Management",
      org: "KEDGE Business School, Bordeaux",
      dates: "Depuis sept. 2025",
      bullets: [
        "Prise de parole en public",
        "Marketing digital",
        "Performance financière",
        "Analyse des schémas de comportement client",
      ],
    },
    {
      title: "Licence : Management des organisations",
      org: "Université russe d’économie Plekhanov, Moscou",
      dates: "sept. 2021 — août 2025",
      bullets: [
        "Programme entièrement enseigné en anglais",
        "Compétences en finance / management / marketing",
        "Participation à un programme d’entrepreneuriat",
      ],
    },
  ],
  certifications: [
    {
      title: "Marketplace Manager — Formation professionnelle (256h)",
      org: "Yandex Practicum",
      date: "juil. 2024",
      bullets: ["Analyse de données marketplace", "Fondamentaux du e-commerce", "Médiaplanning & gestion de publicité"],
    },
    {
      title: "Google Digital Marketing & E-commerce",
      org: "Google",
      date: "juin 2024",
      bullets: ["Bases du marketing", "Marketing digital"],
    },
  ],
};
function getSite() {
  return state.lang === "fr" ? SITE_FR : SITE;
}




const WINDOWS = {
  about: {
    title: "about",
    w: 620,
    h: 560,
    html: () => `
      <h2>hi! i'm ${escapeHtml(getSite().name)}</h2>
      <p><span class="kbd">${escapeHtml(getSite().role)}</span> · <span class="kbd">${escapeHtml(getSite().tagline)}</span></p>
      <p style="margin-top:10px;color:var(--muted)">${escapeHtml(getSite().summary)}</p>

      <div class="hr"></div>

      <h3>${t('about_skills')}</h3>
      <ul>
        ${getSite().skills.map(s => `<li>${escapeHtml(s)}</li>`).join("")}
      </ul>

      <h3>${t('about_languages')}</h3>
      <div class="pills">
        ${getSite().languages.map(l => `<span class="pill">${escapeHtml(l.name)} · ${escapeHtml(l.level)}</span>`).join("")}
      </div>

      <div class="hr"></div>
      <p>${t('tip_drag_html')}</p>
    `,
  },

  work: {
    title: "work",
    w: 720,
    h: 600,
    html: () => `
      <h2>${t('work_title')}</h2>
      <div class="cards">
        ${getSite().experience.map(job => `
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

      <h3>${t('work_education')}</h3>
      <div class="cards">
        ${getSite().education.map(ed => `
          <div class="card">
            <div class="card__title">${escapeHtml(ed.title)}</div>
            <div class="card__meta">${escapeHtml(ed.org)} · ${escapeHtml(ed.dates)}</div>
            <ul>
              ${ed.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
            </ul>
          </div>
        `).join("")}
      </div>

      <h3>${t('work_certifications')}</h3>
      <div class="cards">
        ${getSite().certifications.map(c => `
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
      <h2>${t('links_title')}</h2>
      <div class="hr"></div>

      <div class="cards">
        <div class="card">
          <div class="card__title">LinkedIn</div>
          <div class="card__meta">@maksim-shmelev</div>
          <a href="${escapeAttr(getSite().linkedin)}" target="_blank" rel="noopener">${t('links_open')}</a>
        </div>

        <div class="card">
          <div class="card__title">Email</div>
          <div class="card__meta">${escapeHtml(getSite().email)}</div>
          <a href="mailto:${escapeAttr(getSite().email)}">${t('links_write')}</a>
        </div>

        <div class="card">
          <div class="card__title">CV (PDF)</div>
          <div class="card__meta">${escapeHtml(getSite().cvUrl)}</div>
          <a href="${escapeAttr(getSite().cvUrl)}" target="_blank" rel="noopener">${t('links_open')}</a>
        </div>
      </div>
    `,
  },

  contact: {
    title: "contact",
    w: 520,
    h: 440,
    html: () => `
      <h2>${t('contact_title')}</h2>
      <p>${t('contact_hint')}</p>
      <div class="hr"></div>

      <p><strong>Email:</strong> <a href="mailto:${escapeAttr(getSite().email)}">${escapeHtml(getSite().email)}</a></p>
      <p><strong>Phone:</strong> <a href="tel:${escapeAttr(getSite().phone.replace(/\s+/g,''))}">${escapeHtml(getSite().phone)}</a></p>
      <p><strong>LinkedIn:</strong> <a href="${escapeAttr(getSite().linkedin)}" target="_blank" rel="noopener">@maksim-shmelev</a></p>

      <div class="hr"></div>
      <a class="btnlink" href="mailto:${escapeAttr(getSite().email)}?subject=Hello%20from%20your%20website" target="_self">${t('open_mail')}</a>
    `,
  },

  downloads: {
    title: "downloads",
    w: 640,
    h: 520,
    html: () => `
      <h2>${t('downloads_title')}</h2>
      <p>${t('downloads_hint')}</p>
      <div class="hr"></div>

      <div class="cards">
        <div class="card">
          <div class="card__title">CV — Maksim SHMELEV</div>
          <div class="card__meta">PDF</div>
          <p>${t('downloads_card_p')}</p>
          <a href="${escapeAttr(getSite().cvUrl)}" target="_blank" rel="noopener">${t('links_open')}</a>
        </div>
      </div>

      <div class="hr"></div>
      <p style="color:var(--muted);font-family:var(--mono);font-size:12px">${t("downloads_tip_html")}</p>
    `,
  },

  faq: {
    title: "faq",
    w: 520,
    h: 460,
    html: () => `
      <h2>${t('faq_title')}</h2>

      <h3>${t('faq_q1')}</h3>
      <p>${t('faq_a1')}</p>

      <h3>${t('faq_q2')}</h3>
      <p>${t('faq_a2')}</p>

      <h3>${t('faq_q3')}</h3>
      <p>${escapeHtml(getSite().skills.slice(0,6).join(" · "))}</p>
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
const langToggle = document.getElementById("langToggle");
const resetLayoutBtn = document.getElementById("resetLayout");

const brandText = document.getElementById("brandText");
const hintText = document.getElementById("hintText");

const state = loadState();
// language: saved > browser
state.lang = state.lang || localStorage.getItem(LANG_KEY) || detectLang();
localStorage.setItem(LANG_KEY, state.lang);

const I18N = {
  en: {
    lang_label: "EN",
    theme_dark: "Dark",
    theme_light: "Light",
    sfx_on: "SFX on",
    sfx_off: "SFX off",
    reset: "Reset",

    win_about: "about",
    win_work: "work",
    win_links: "links",
    win_faq: "faq",
    win_contact: "contact",
    win_downloads: "downloads",

    dock_about: "about",
    dock_work: "work",
    dock_links: "links",
    dock_faq: "faq",
    dock_contact: "contact",
    dock_downloads: "downloads",

    about_skills: "skills",
    about_languages: "languages",
    tip_drag_html: 'Tip: drag windows by the titlebar. Press <span class="kbd">Esc</span> to close the active window.',

    work_title: "work experience",
    work_education: "education",
    work_certifications: "certifications",

    links_title: "links",
    links_open: "open",
    links_write: "write",

    contact_title: "contact",
    contact_hint: "Best way to reach me — email.",
    open_mail: "Open mail app",

    downloads_title: "downloads",
    downloads_hint: "CV and other files.",
    downloads_card_p: "Download the latest version of my CV.",
    downloads_tip_html: 'Tip: to make the CV link work on GitHub Pages, keep the PDF at <span class="kbd">assets/</span>.',

    faq_title: "faq",
    faq_q1: "Do you check DMs?",
    faq_a1: "Usually no — email is best.",
    faq_q2: "What roles are you interested in?",
    faq_a2: "Marketing / E-commerce internships (data-driven) and product / growth roles.",
    faq_q3: "What tools do you use?",

    buddy_title: "classical music rat",
    buddy_subtitle: "click to play / pause",
    buddy_title_attr: "Play / pause Andante",

    toast_sfx_on: "SFX: on",
    toast_sfx_off: "SFX: off",
    toast_layout_reset: "Layout reset",
    toast_audio_play: "♪ Andante — playing",
    toast_audio_pause: "Andante — paused",
  },
  fr: {
    lang_label: "FR",
    theme_dark: "Sombre",
    theme_light: "Clair",
    sfx_on: "SFX activé",
    sfx_off: "SFX désactivé",
    reset: "Réinitialiser",

    win_about: "à propos",
    win_work: "parcours",
    win_links: "liens",
    win_faq: "FAQ",
    win_contact: "contact",
    win_downloads: "téléchargements",

    dock_about: "à propos",
    dock_work: "parcours",
    dock_links: "liens",
    dock_faq: "FAQ",
    dock_contact: "contact",
    dock_downloads: "téléchargements",

    about_skills: "compétences",
    about_languages: "langues",
    tip_drag_html: 'Astuce : déplace les fenêtres en faisant glisser la barre du haut. Appuie sur <span class="kbd">Échap</span> pour fermer la fenêtre active.',

    work_title: "expérience professionnelle",
    work_education: "formation",
    work_certifications: "certifications",

    links_title: "liens",
    links_open: "ouvrir",
    links_write: "écrire",

    contact_title: "contact",
    contact_hint: "Le plus simple pour me contacter : email.",
    open_mail: "Ouvrir l’app Mail",

    downloads_title: "téléchargements",
    downloads_hint: "CV et autres fichiers.",
    downloads_card_p: "Télécharger la dernière version de mon CV.",
    downloads_tip_html: 'Astuce : pour que le lien du CV fonctionne sur GitHub Pages, garde le PDF dans <span class="kbd">assets/</span>.',

    faq_title: "FAQ",
    faq_q1: "Tu lis tes messages privés ?",
    faq_a1: "En général non — l’email est le mieux.",
    faq_q2: "Quels rôles t’intéressent ?",
    faq_a2: "Stages en marketing / e-commerce (orientés data) et rôles produit / growth.",
    faq_q3: "Quels outils utilises-tu ?",

    buddy_title: "rat de musique classique",
    buddy_subtitle: "clic = play / pause",
    buddy_title_attr: "Lecture / pause Andante",

    toast_sfx_on: "SFX : activé",
    toast_sfx_off: "SFX : désactivé",
    toast_layout_reset: "Disposition réinitialisée",
    toast_audio_play: "♪ Andante — lecture",
    toast_audio_pause: "Andante — pause",
  },
};

function t(key) {
  const dict = I18N[state.lang] || I18N.en;
  return dict[key] ?? I18N.en[key] ?? key;
}



/* z-index stacking */
let zTop = 20;
let activeWindowId = null;

brandText.textContent = state.lang === "fr" ? `salut ! je suis ${getSite().name}` : `hi! i'm ${getSite().name}`;
hintText.textContent = getSite().tagline;

applyTheme(state.theme);
applySfx(state.sfx);

applyLang(state.lang);

function applyLang(lang) {
  state.lang = (lang === "fr") ? "fr" : "en";
  localStorage.setItem(LANG_KEY, state.lang);
  document.documentElement.setAttribute("lang", state.lang);

  // top texts
  brandText.textContent = state.lang === "fr"
    ? `salut ! je suis ${getSite().name}`
    : `hi! i'm ${getSite().name}`;
  hintText.textContent = getSite().tagline;

  // topbar buttons text
  if (langToggle) {
    langToggle.querySelector(".toggle__label").textContent = t("lang_label");
    langToggle.setAttribute("aria-pressed", state.lang === "fr" ? "true" : "false");
  }
  if (resetLayoutBtn) resetLayoutBtn.textContent = t("reset");

  // update titles (tooltips)
  themeToggle.title = state.lang === "fr" ? "Thème" : "Theme";
  sfxToggle.title = state.lang === "fr" ? "Effets sonores" : "Sound effects";
  if (langToggle) langToggle.title = state.lang === "fr" ? "Langue" : "Language";

  // dock labels
  const map = {
    about: "dock_about",
    work: "dock_work",
    links: "dock_links",
    faq: "dock_faq",
    contact: "dock_contact",
    downloads: "dock_downloads",
  };
  document.querySelectorAll('.icon[data-open]').forEach((btn) => {
    const id = btn.getAttribute("data-open");
    const el = btn.querySelector(".icon__label");
    if (el && map[id]) el.textContent = t(map[id]);
  });

  // buddy labels
  const buddyTitle = document.querySelector("#ratCard .buddy__title");
  const buddySubtitle = document.querySelector("#ratCard .buddy__subtitle");
  const buddyImg = document.querySelector("#ratCard .buddy__img");
  const ratBtn = document.getElementById("ratCard");
  if (buddyTitle) buddyTitle.textContent = t("buddy_title");
  if (buddySubtitle) buddySubtitle.textContent = t("buddy_subtitle");
  if (buddyImg) buddyImg.alt = t("buddy_title");
  if (ratBtn) ratBtn.title = t("buddy_title_attr");

  // re-render open windows
  document.querySelectorAll(".window").forEach((w) => {
    const wid = w.id?.replace(/^win-/, "");
    if (!wid) return;
    const titleEl = w.querySelector(".titlebar__title");
    if (titleEl) titleEl.textContent = t(`win_${wid}`);
    const contentEl = w.querySelector(".window__content");
    if (contentEl && WINDOWS[wid] && typeof WINDOWS[wid].html === "function") {
      contentEl.innerHTML = WINDOWS[wid].html();
    }
  });

  // refresh toggles
  applyTheme(state.theme);
  applySfx(state.sfx);
}

if (langToggle) {
  langToggle.addEventListener("click", () => {
    applyLang(state.lang === "fr" ? "en" : "fr");
    saveState();
    beep(700, 30);
  });
}


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
        toast(t("toast_audio_play"));
      } else {
        a.pause();
        toast(t("toast_audio_pause"));
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
        toast(t("toast_audio_play"));
      } else {
        a.pause();
        toast(t("toast_audio_pause"));
      }
    } catch (e){
      // Usually autoplay permission; user gesture already happened, but just in case.
      toast("Audio blocked — tap again");
    }
  });
}
  saveState();
  beep(440, 40);
  toast(state.sfx ? t("toast_sfx_on") : t("toast_sfx_off"));
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
  toast(t("toast_layout_reset"));
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
  win.setAttribute("aria-label", t(`win_${id}`));

  win.style.width = `${rect.w}px`;
  win.style.height = `${rect.h}px`;
  win.style.left = `${rect.x}px`;
  win.style.top = `${rect.y}px`;
  win.style.zIndex = `${++zTop}`;

  win.innerHTML = `
    <div class="titlebar" data-drag-handle>
      <div class="titlebar__title">${escapeHtml(t(`win_${id}`))}</div>
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
  themeToggle.querySelector(".toggle__label").textContent = theme === "dark" ? t("theme_dark") : t("theme_light");
  themeToggle.querySelector(".toggle__icon").textContent = theme === "dark" ? "☾" : "☀";
}

function applySfx(on) {
  sfxToggle.setAttribute("aria-pressed", on ? "true" : "false");
  sfxToggle.querySelector(".toggle__label").textContent = on ? t("sfx_on") : t("sfx_off");
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
    lang: null,
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
