/* Realistic monitor -> boot -> fullscreen XP desktop
   - Start with monitor OFF (nothing opens)
   - Click power: boot flicker inside monitor screen
   - Then animate desktop to full-screen
   - Shut down returns to monitor OFF
*/
(() => {
  const CV_FILE = "CV_Maksim_Shmelev_Ecommerce.pdf";

  const el = (sel, root=document) => root.querySelector(sel);
  const els = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

  const intro = el("#intro");
  const screenCutout = el("#screenCutout");
  const screen = el("#screen");
  const overlayOff = el("#overlayOff");
  const overlayBoot = el("#overlayBoot");
  const os = el("#os");
  const powerBtn = el("#powerBtn");

  const startBtn = el("#startBtn");
  const startMenu = el("#startMenu");
  const taskbarTasks = el("#taskbarTasks");
  const wm = el("#wm");
  const desktopIcons = el("#desktopIcons");
  const clock = el("#clock");

  let powerState = "off"; // off | boot | on
  let zTop = 10;
  let activeId = null;

  const state = { windows: new Map() };

  // ----- Desktop icons
  const DESKTOP_ITEMS = [
    { id:"mycomputer", label:"My Computer", glyph:"pc", open:"mycomputer" },
    { id:"mydocs", label:"My Documents", glyph:"folder", open:"mydocs" },
    { id:"network", label:"Network\nNeighborhood", glyph:"net", open:"network" },
    { id:"cv", label:"CV.pdf", glyph:"pdf", open:"cv" },
    { id:"recycle", label:"Recycle Bin", glyph:"bin", open:"recycle" },
    { id:"about", label:"About.txt", glyph:"txt", open:"about" },
  ];

  function iconGlyph(g){
    return ({
      folder: "g-folder",
      pdf: "g-pdf",
      bin: "g-bin",
      pc: "g-pc",
      doc: "g-doc",
      net: "g-net",
      txt: "g-txt",
    })[g] || "g-doc";
  }

  function renderDesktopIcons(){
    desktopIcons.innerHTML = "";
    DESKTOP_ITEMS.forEach(item => {
      const b = document.createElement("button");
      b.className = "desk-ico";
      b.type = "button";
      b.dataset.open = item.open;
      b.innerHTML = `
        <div class="desk-ico__glyph" aria-hidden="true">
          <div class="${iconGlyph(item.glyph)}"></div>
        </div>
        <div class="desk-ico__label">${item.label.replace(/\n/g,"<br>")}</div>
      `;
      b.addEventListener("click", () => selectOnly(b));
      b.addEventListener("dblclick", () => openItem(item.open));
      desktopIcons.appendChild(b);
    });
  }
  function selectOnly(btn){
    els(".desk-ico", desktopIcons).forEach(x => x.classList.remove("is-selected"));
    btn.classList.add("is-selected");
  }

  // ----- Power sequence
  function setPower(stateName){
    powerState = stateName;

    if(stateName === "off"){
      document.body.classList.remove("mode-desktop");
      os.classList.remove("is-floating");
      os.style.opacity = "0";
      os.style.pointerEvents = "none";
      os.dataset.power = "off";

      overlayOff.style.display = "grid";
      overlayBoot.classList.remove("is-on");
      overlayBoot.setAttribute("aria-hidden","true");
      screen.classList.remove("is-booting");

      // close windows
      state.windows.forEach(w => w.el.remove());
      state.windows.clear();
      taskbarTasks.innerHTML = "";
      activeId = null;

      // close start menu
      startMenu.hidden = true;
      startBtn.setAttribute("aria-expanded","false");
      return;
    }

    if(stateName === "boot"){
      overlayOff.style.display = "none";
      overlayBoot.classList.add("is-on");
      overlayBoot.setAttribute("aria-hidden","false");
      screen.classList.add("is-booting");
      os.dataset.power = "off";
      return;
    }

    if(stateName === "on"){
      overlayBoot.classList.remove("is-on");
      overlayBoot.setAttribute("aria-hidden","true");
      screen.classList.remove("is-booting");
      os.dataset.power = "on";
      os.style.opacity = "1";
      os.style.pointerEvents = "auto";
      return;
    }
  }

  function animateDesktopToFullscreen(){
    // Make OS fixed full-screen and animate from screenCutout rect to full viewport
    const r = screenCutout.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Compute scale based on screen size
    const sx = r.width / vw;
    const sy = r.height / vh;

    // Translate from center of viewport to center of cutout
    const cx = r.left + r.width/2;
    const cy = r.top + r.height/2;
    const dx = cx - vw/2;
    const dy = cy - vh/2;

    os.classList.add("is-floating");
    os.style.transformOrigin = "center center";
    os.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    os.style.borderRadius = "0px";

    // Force reflow so transition/animation is smooth
    void os.offsetWidth;

    // Animate to full screen
    os.animate([
      { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
      { transform: `translate(0px, 0px) scale(1, 1)` }
    ], { duration: 650, easing: "cubic-bezier(.2,.9,.2,1)", fill: "forwards" });

    // Hide monitor after zoom starts
    document.body.classList.add("mode-desktop");
    // Ensure OS is interactive
    os.style.pointerEvents = "auto";
  }

  function powerOn(){
    if(powerState !== "off") return;
    setPower("boot");

    // Boot duration then on
    setTimeout(() => {
      setPower("on");
      // small pause then zoom to fullscreen
      setTimeout(() => animateDesktopToFullscreen(), 140);
    }, 1050);
  }

  powerBtn.addEventListener("click", () => {
    if(powerState === "off") powerOn();
    else setPower("off");
  });

  // ----- Start menu
  function toggleStart(){
    if(powerState !== "on") return;
    const open = !startMenu.hidden;
    startMenu.hidden = open;
    startBtn.setAttribute("aria-expanded", String(!open));
  }
  startBtn.addEventListener("click", toggleStart);

  document.addEventListener("mousedown", (e) => {
    if(startMenu.hidden) return;
    const within = startMenu.contains(e.target) || startBtn.contains(e.target);
    if(!within){
      startMenu.hidden = true;
      startBtn.setAttribute("aria-expanded","false");
    }
  });

  startMenu.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open], [data-poweroff]");
    if(!btn) return;
    if(btn.dataset.poweroff){
      setPower("off");
      return;
    }
    const key = btn.dataset.open;
    startMenu.hidden = true;
    startBtn.setAttribute("aria-expanded","false");
    openItem(key);
  });

  // ----- Window manager
  function focusWindow(id){
    const w = state.windows.get(id);
    if(!w) return;
    activeId = id;
    zTop += 1;
    w.el.style.zIndex = String(zTop);
    state.windows.forEach(x => x.el.classList.toggle("is-active", x.id === id));
    els(".task", taskbarTasks).forEach(t => t.classList.toggle("is-active", t.dataset.win === id));
  }

  function removeWindow(id){
    const w = state.windows.get(id);
    if(!w) return;
    w.el.remove();
    state.windows.delete(id);
    const t = el(`.task[data-win="${CSS.escape(id)}"]`, taskbarTasks);
    if(t) t.remove();
    const last = Array.from(state.windows.values()).sort((a,b) => (+a.el.style.zIndex) - (+b.el.style.zIndex)).pop();
    if(last) focusWindow(last.id);
    else activeId = null;
  }

  function minimizeWindow(id){
    const w = state.windows.get(id);
    if(!w) return;
    w.minimized = true;
    w.el.style.display = "none";
    const t = el(`.task[data-win="${CSS.escape(id)}"]`, taskbarTasks);
    if(t) t.classList.remove("is-active");
    activeId = null;
  }

  function restoreWindow(id){
    const w = state.windows.get(id);
    if(!w) return;
    w.minimized = false;
    w.el.style.display = "block";
    focusWindow(id);
  }

  function addTaskButton(w){
    const b = document.createElement("button");
    b.className = "task";
    b.type = "button";
    b.dataset.win = w.id;
    b.innerHTML = `<span>${w.title}</span>`;
    b.addEventListener("click", () => {
      const ww = state.windows.get(w.id);
      if(!ww) return;
      if(ww.minimized) restoreWindow(w.id);
      else if(activeId === w.id) minimizeWindow(w.id);
      else focusWindow(w.id);
    });
    taskbarTasks.appendChild(b);
  }

  function dragMake(winEl, handleEl){
    let dragging = false;
    let sx=0, sy=0, ox=0, oy=0;

    handleEl.addEventListener("mousedown", (e) => {
      if(e.button !== 0) return;
      dragging = true;
      focusWindow(winEl.dataset.id);
      sx = e.clientX; sy = e.clientY;

      const r = winEl.getBoundingClientRect();
      ox = r.left;
      oy = r.top;
      e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
      if(!dragging) return;
      const maxX = window.innerWidth - winEl.offsetWidth;
      const maxY = window.innerHeight - winEl.offsetHeight - 44; // taskbar
      const nx = clamp(ox + (e.clientX - sx), 0, Math.max(0, maxX));
      const ny = clamp(oy + (e.clientY - sy), 0, Math.max(0, maxY));
      winEl.style.left = nx + "px";
      winEl.style.top = ny + "px";
    });

    window.addEventListener("mouseup", () => dragging = false);
  }

  function createWindow({id, title, bodyHtml, w=640, h=420, x=210, y=90}){
    if(state.windows.has(id)){
      const existing = state.windows.get(id);
      if(existing.minimized) restoreWindow(id);
      else focusWindow(id);
      return;
    }

    const win = document.createElement("div");
    win.className = "window";
    win.dataset.id = id;
    win.style.width = w + "px";
    win.style.height = h + "px";
    win.style.left = x + "px";
    win.style.top = y + "px";
    zTop += 1;
    win.style.zIndex = String(zTop);

    win.innerHTML = `
      <div class="window__titlebar">
        <div class="window__title">${title}</div>
        <div class="wbtns">
          <button class="wbtn" data-act="min" title="Minimize" aria-label="Minimize">–</button>
          <button class="wbtn" data-act="close" title="Close" aria-label="Close">×</button>
        </div>
      </div>
      <div class="window__body">
        <div class="window__content">${bodyHtml}</div>
      </div>
    `;

    win.addEventListener("mousedown", () => focusWindow(id));
    win.querySelectorAll(".wbtn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const act = btn.dataset.act;
        if(act === "close") removeWindow(id);
        if(act === "min") minimizeWindow(id);
      });
    });

    wm.appendChild(win);
    dragMake(win, win.querySelector(".window__titlebar"));

    const meta = { id, title, minimized:false, el:win };
    state.windows.set(id, meta);
    addTaskButton(meta);
    focusWindow(id);
  }

  // Explorer templates
  function explorerLeft(pinned=true){
    return `
      <div class="explorer__left">
        <div class="box">
          <div class="box__h">Search</div>
          <div class="box__b">
            <div style="display:grid; gap:8px;">
              <div>• My Documents</div>
              <div>• My Computer</div>
            </div>
          </div>
        </div>
        ${pinned ? `
        <div class="box">
          <div class="box__h">Pinned</div>
          <div class="box__b">
            <div style="display:grid; gap:8px;">
              <div>• CV.pdf</div>
              <div>• LinkedIn</div>
              <div>• Email</div>
            </div>
          </div>
        </div>` : ``}
      </div>
    `;
  }

  function fileTile({label, kind, action, hint=""}){
    const glyph = ({
      folder:"g-folder", pdf:"g-pdf", txt:"g-txt", pc:"g-pc", net:"g-net", bin:"g-bin", doc:"g-doc"
    })[kind] || "g-doc";
    return `
      <div class="file" data-action="${action}">
        <div class="file__g"><div class="${glyph}"></div></div>
        <div class="file__l">${label}</div>
        ${hint ? `<div class="file__hint">${hint}</div>`:``}
      </div>
    `;
  }

  function bindFileActions(winId){
    const win = state.windows.get(winId)?.el;
    if(!win) return;
    win.querySelectorAll("[data-action]").forEach(node => {
      node.addEventListener("dblclick", () => openItem(node.dataset.action));
    });
  }

  // Open items
  function openItem(key){
    if(powerState !== "on") return;

    const baseX = 160 + Math.floor(Math.random()*70);
    const baseY = 70 + Math.floor(Math.random()*80);

    if(key === "cv"){
      createWindow({
        id:"win-cv",
        title:"CV.pdf",
        w: 760,
        h: 520,
        x: baseX,
        y: baseY,
        bodyHtml: `
          <div class="pdfwrap">
            <div>
              If the PDF doesn't load inside the window, <a href="${CV_FILE}" target="_blank" rel="noopener">open it in a new tab</a>.
            </div>
            <div class="pdf">
              <iframe src="${CV_FILE}" title="CV PDF"></iframe>
            </div>
          </div>
        `
      });
      return;
    }

    if(key === "about"){
      createWindow({
        id:"win-about",
        title:"About.txt",
        w: 520,
        h: 360,
        x: baseX,
        y: baseY,
        bodyHtml: `
          <div style="font-size:14px; line-height:1.45;">
            <b>Maksim Shmelev</b><br/>
            E-commerce · Digital Marketing<br/><br/>
            Looking for a <b>6-month internship in Paris</b> (EU Remote possible).<br/><br/>
            Double-click folders to explore: Projects, Experience, Certificates, Contact.
          </div>
        `
      });
      return;
    }

    if(key === "mydocs"){
      createWindow({
        id:"win-mydocs",
        title:"My Documents",
        w: 760,
        h: 520,
        x: baseX,
        y: baseY,
        bodyHtml: `
          <div class="explorer">
            ${explorerLeft(true)}
            <div class="explorer__right">
              <div class="filegrid">
                ${fileTile({label:"Experience", kind:"folder", action:"experience"})}
                ${fileTile({label:"Projects", kind:"folder", action:"projects"})}
                ${fileTile({label:"Certificates", kind:"folder", action:"certificates"})}
                ${fileTile({label:"Contact", kind:"folder", action:"contact"})}
              </div>
            </div>
          </div>
        `
      });
      bindFileActions("win-mydocs");
      return;
    }

    if(key === "mycomputer"){
      createWindow({
        id:"win-mycomputer",
        title:"My Computer",
        w: 760,
        h: 520,
        x: baseX,
        y: baseY,
        bodyHtml: `
          <div class="explorer">
            ${explorerLeft(false)}
            <div class="explorer__right">
              <div style="font-weight:900; margin-bottom:10px;">Hard Drives</div>
              <div class="filegrid">
                ${fileTile({label:"C: Career", kind:"folder", action:"experience", hint:"roles & impact"})}
                ${fileTile({label:"D: Projects", kind:"folder", action:"projects", hint:"cases & demos"})}
                ${fileTile({label:"E: Education", kind:"folder", action:"certificates", hint:"degrees & certs"})}
                ${fileTile({label:"CV.pdf", kind:"pdf", action:"cv", hint:"open PDF"})}
              </div>
            </div>
          </div>
        `
      });
      bindFileActions("win-mycomputer");
      return;
    }

    if(key === "network"){
      createWindow({
        id:"win-network",
        title:"Network Neighborhood",
        w: 620,
        h: 420,
        x: baseX,
        y: baseY,
        bodyHtml: `
          <div style="font-size:14px; line-height:1.5;">
            <b>Quick links</b><br/><br/>
            • LinkedIn: <i>(put your link in Contact)</i><br/>
            • Email: <i>(put your email in Contact)</i><br/><br/>
            Tip: Open Contact folder.
          </div>
        `
      });
      return;
    }

    if(key === "recycle"){
      createWindow({
        id:"win-bin",
        title:"Recycle Bin",
        w: 560,
        h: 360,
        x: baseX,
        y: baseY,
        bodyHtml: `
          <div style="font-size:14px; line-height:1.5;">
            Nothing to delete here 🙂<br/><br/>
            (Easter-eggs later.)
          </div>
        `
      });
      return;
    }

    if(key === "experience"){
      createWindow({
        id:"win-experience",
        title:"Experience",
        w: 780,
        h: 520,
        x: baseX,
        y: baseY,
        bodyHtml: `
          <div class="explorer">
            ${explorerLeft(true)}
            <div class="explorer__right">
              <div style="font-weight:900; margin-bottom:10px;">Roles</div>
              <div style="display:grid; gap:10px; font-size:14px; line-height:1.45;">
                <div><b>Fuh!</b> — Product Manager (2025)</div>
                <div><b>Socialist LLC</b> — E-commerce Intern (2024–2025)</div>
                <div><b>PRUE</b> — Research project (2023–2024)</div>
                <div style="opacity:.75; font-size:12px;">(Replace with exact bullets.)</div>
              </div>
            </div>
          </div>
        `
      });
      return;
    }

    if(key === "projects"){
      createWindow({
        id:"win-projects",
        title:"Projects",
        w: 780,
        h: 520,
        x: baseX,
        y: baseY,
        bodyHtml: `
          <div class="explorer">
            ${explorerLeft(true)}
            <div class="explorer__right">
              <div class="filegrid">
                ${fileTile({label:"Ridekit", kind:"folder", action:"ridekit", hint:"in progress"})}
                ${fileTile({label:"Portfolio OS", kind:"txt", action:"about", hint:"this website"})}
                ${fileTile({label:"Open CV", kind:"pdf", action:"cv", hint:"PDF"})}
              </div>
              <div style="margin-top:14px; font-size:13px; color:rgba(11,15,20,.7);">
                Add links to demos (GitHub, Notion, Figma) inside project windows.
              </div>
            </div>
          </div>
        `
      });
      bindFileActions("win-projects");
      return;
    }

    if(key === "ridekit"){
      createWindow({
        id:"win-ridekit",
        title:"Ridekit",
        w: 640,
        h: 420,
        x: baseX,
        y: baseY,
        bodyHtml: `
          <div style="font-size:14px; line-height:1.5;">
            <b>Ridekit</b> — gear & trip assistant (in progress).<br/><br/>
            Put your link here:<br/>
            <code style="background:rgba(0,0,0,.06); padding:4px 6px; border-radius:6px;">https://ridekit.fr</code>
          </div>
        `
      });
      return;
    }

    if(key === "certificates"){
      createWindow({
        id:"win-certs",
        title:"Certificates",
        w: 760,
        h: 500,
        x: baseX,
        y: baseY,
        bodyHtml: `
          <div class="explorer">
            ${explorerLeft(true)}
            <div class="explorer__right">
              <div style="font-weight:900; margin-bottom:10px;">Certificates</div>
              <div style="display:grid; gap:10px; font-size:14px; line-height:1.45;">
                <div>• Google Digital Marketing & E-commerce</div>
                <div>• Yandex Practicum (Digital Marketing)</div>
              </div>
            </div>
          </div>
        `
      });
      return;
    }

    if(key === "contact"){
      createWindow({
        id:"win-contact",
        title:"Contact",
        w: 620,
        h: 420,
        x: baseX,
        y: baseY,
        bodyHtml: `
          <div style="font-size:14px; line-height:1.6;">
            <b>Contact</b><br/><br/>
            Email: <span style="font-weight:900;">your.email@example.com</span><br/>
            LinkedIn: <span style="font-weight:900;">linkedin.com/in/your-handle</span><br/><br/>
            (Send me your real email + LinkedIn and I'll set it.)
          </div>
        `
      });
      return;
    }
  }

  // Desktop interactions
  desktopIcons.addEventListener("dblclick", (e) => {
    const btn = e.target.closest(".desk-ico");
    if(!btn) return;
    openItem(btn.dataset.open);
  });

  el("#desktop").addEventListener("mousedown", (e) => {
    if(e.target.closest(".desk-ico")) return;
    els(".desk-ico", desktopIcons).forEach(x => x.classList.remove("is-selected"));
  });

  el("#muteBtn").addEventListener("click", () => {
    const b = el("#muteBtn");
    b.textContent = (b.textContent.includes("🔊") ? "🔇" : "🔊");
  });

  // Clock
  function tick(){
    const d = new Date();
    clock.textContent = String(d.getHours()).padStart(2,"0") + ":" + String(d.getMinutes()).padStart(2,"0");
  }
  setInterval(tick, 1000); tick();

  // Keyboard
  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && !startMenu.hidden){
      startMenu.hidden = true;
      startBtn.setAttribute("aria-expanded","false");
    }
    if(e.key === "Enter" && powerState === "on"){
      const selected = el(".desk-ico.is-selected", desktopIcons);
      if(selected) openItem(selected.dataset.open);
    }
  });

  // Init: IMPORTANT => nothing opens, monitor OFF
  renderDesktopIcons();
  setPower("off");
})();
