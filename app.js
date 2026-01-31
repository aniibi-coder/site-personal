/* XP Monitor Desktop — single page
   - power button: OFF -> BOOT -> DESKTOP
   - icons open windows
   - simple window manager (drag, focus, close, minimize)
*/
(() => {
  const CV_FILE = "CV_Maksim_Shmelev_Ecommerce.pdf";

  const el = (sel, root=document) => root.querySelector(sel);
  const els = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

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

  const state = {
    windows: new Map(),  // id -> {id, title, type, minimized, el}
  };

  // ----- Desktop icons model
  const DESKTOP_ITEMS = [
    { id:"mycomputer", label:"My Computer", kind:"system", glyph:"pc", open:"mycomputer" },
    { id:"mydocs", label:"My Documents", kind:"folder", glyph:"folder", open:"mydocs" },
    { id:"network", label:"Network\nNeighborhood", kind:"system", glyph:"net", open:"network" },
    { id:"cv", label:"CV.pdf", kind:"file", glyph:"pdf", open:"cv" },
    { id:"recycle", label:"Recycle Bin", kind:"system", glyph:"bin", open:"recycle" },
    { id:"about", label:"About.txt", kind:"file", glyph:"txt", open:"about" },
  ];

  function iconGlyph(g){
    const map = {
      folder: "g-folder",
      pdf: "g-pdf",
      bin: "g-bin",
      pc: "g-pc",
      doc: "g-doc",
      net: "g-net",
      txt: "g-txt",
    };
    return map[g] || "g-doc";
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
      os.dataset.power = "off";
      overlayOff.style.display = "grid";
      overlayBoot.classList.remove("is-on");
      overlayBoot.setAttribute("aria-hidden","true");
      startMenu.hidden = true;
      startBtn.setAttribute("aria-expanded","false");
      // close windows
      state.windows.forEach(w => w.el.remove());
      state.windows.clear();
      taskbarTasks.innerHTML = "";
      activeId = null;
    }
    if(stateName === "boot"){
      overlayOff.style.display = "none";
      overlayBoot.classList.add("is-on");
      overlayBoot.setAttribute("aria-hidden","false");
      os.dataset.power = "off";
    }
    if(stateName === "on"){
      overlayBoot.classList.remove("is-on");
      overlayBoot.setAttribute("aria-hidden","true");
      os.dataset.power = "on";
    }
  }

  function powerOn(){
    if(powerState !== "off") return;
    setPower("boot");
    // boot delay
    setTimeout(() => setPower("on"), 900);
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
  startBtn.addEventListener("click", () => {
    toggleStart();
  });

  // close start menu on outside click
  document.addEventListener("mousedown", (e) => {
    if(startMenu.hidden) return;
    const within = startMenu.contains(e.target) || startBtn.contains(e.target);
    if(!within){
      startMenu.hidden = true;
      startBtn.setAttribute("aria-expanded","false");
    }
  });

  // start menu actions
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
    // tasks
    els(".task", taskbarTasks).forEach(t => t.classList.toggle("is-active", t.dataset.win === id));
  }

  function removeWindow(id){
    const w = state.windows.get(id);
    if(!w) return;
    w.el.remove();
    state.windows.delete(id);
    // remove task button
    const t = el(`.task[data-win="${CSS.escape(id)}"]`, taskbarTasks);
    if(t) t.remove();
    // focus last
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
      const parent = wm.getBoundingClientRect();
      ox = r.left - parent.left;
      oy = r.top - parent.top;
      e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
      if(!dragging) return;
      const parent = wm.getBoundingClientRect();
      const maxX = parent.width - winEl.offsetWidth;
      const maxY = parent.height - winEl.offsetHeight - 44; // taskbar
      const nx = clamp(ox + (e.clientX - sx), 0, Math.max(0, maxX));
      const ny = clamp(oy + (e.clientY - sy), 0, Math.max(0, maxY));
      winEl.style.left = nx + "px";
      winEl.style.top = ny + "px";
    });

    window.addEventListener("mouseup", () => dragging = false);
  }

  function createWindow({id, title, bodyHtml, w=640, h=420, x=210, y=90}){
    // if exists: restore + focus
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

    const handle = win.querySelector(".window__titlebar");
    dragMake(win, handle);

    const meta = { id, title, type:"window", minimized:false, el:win };
    state.windows.set(id, meta);
    addTaskButton(meta);
    focusWindow(id);
  }

  // ----- Explorer templates
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

  // ----- Open items
  function openItem(key){
    if(powerState !== "on") return;

    const baseX = 170 + Math.floor(Math.random()*60);
    const baseY = 70 + Math.floor(Math.random()*70);

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
            • LinkedIn: <i>(add your link in app.js)</i><br/>
            • Email: <i>(add your email in app.js)</i><br/><br/>
            Tip: You can also open Contact folder.
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
            (We can put fun easter-eggs later.)
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
                <div style="opacity:.75; font-size:12px;">(You can replace these lines with your exact bullets.)</div>
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
                Tip: add links to demos (GitHub, Notion, Figma) inside these project windows.
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
            <br/><br/>
            Want this window to show a live iframe preview? Tell me the final URL.
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
                <div style="opacity:.75; font-size:12px;">(Add files later if you want, or keep as text.)</div>
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
            (Tell me your real email + LinkedIn and I will hardcode them.)
          </div>
        `
      });
      return;
    }
  }

  // Desktop double-click support
  desktopIcons.addEventListener("dblclick", (e) => {
    const btn = e.target.closest(".desk-ico");
    if(!btn) return;
    openItem(btn.dataset.open);
  });

  // deselect desktop icons on empty click
  el("#desktop").addEventListener("mousedown", (e) => {
    if(e.target.closest(".desk-ico")) return;
    els(".desk-ico", desktopIcons).forEach(x => x.classList.remove("is-selected"));
  });

  // fake mute button
  el("#muteBtn").addEventListener("click", () => {
    const b = el("#muteBtn");
    b.textContent = (b.textContent.includes("🔊") ? "🔇" : "🔊");
  });

  // clock
  function tick(){
    const d = new Date();
    const hh = String(d.getHours()).padStart(2,"0");
    const mm = String(d.getMinutes()).padStart(2,"0");
    clock.textContent = `${hh}:${mm}`;
  }
  setInterval(tick, 1000);
  tick();

  // init
  renderDesktopIcons();
  setPower("off"); // IMPORTANT: nothing opens on start, screen is OFF

  // keyboard: Esc closes start menu
  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape"){
      if(!startMenu.hidden){
        startMenu.hidden = true;
        startBtn.setAttribute("aria-expanded","false");
      }
    }
    // Enter on selected desktop icon = open
    if(e.key === "Enter" && powerState === "on"){
      const selected = el(".desk-ico.is-selected", desktopIcons);
      if(selected) openItem(selected.dataset.open);
    }
  });
})();
