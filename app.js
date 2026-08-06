// ============================================================
// APP.JS — toda a lógica de renderização e interatividade.
// Estado é mantido em memória + localStorage (persiste no navegador,
// não é enviado a nenhum servidor).
// ============================================================

const STORAGE_KEY = "cimatec_dashboard_state_v1";

let state = {
  employees: null,     // dados atuais (mutáveis, simulados)
  currentId: "carolina",
};

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.employees && parsed.employees.length) {
        state = parsed;
        return;
      }
    }
  } catch (e) { /* ignore corrupt storage */ }
  state = { employees: deepClone(EMPLOYEES_SEED), currentId: "carolina" };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getCurrent() {
  return state.employees.find(e => e.id === state.currentId) || state.employees[0];
}

// ---------- helpers ----------
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => t.classList.remove("show"), 2600);
}

function donutSVG(pct, color = "var(--purple)") {
  const r = 30, c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return `
  <svg class="donut" viewBox="0 0 74 74">
    <circle cx="37" cy="37" r="${r}" stroke="var(--border)" stroke-width="8" fill="none"/>
    <circle cx="37" cy="37" r="${r}" stroke="${color}" stroke-width="8" fill="none"
      stroke-dasharray="${c}" stroke-dashoffset="${offset}" stroke-linecap="round"
      transform="rotate(-90 37 37)"/>
  </svg>`;
}

// ---------- cards de "próximo passo": clique abre a explicação ----------
let openPathIdx = null;

function togglePathCard(idx) {
  openPathIdx = openPathIdx === idx ? null : idx;
  refreshCurrentPage();
}

function renderPathCards(paths) {
  return paths.map((p, i) => {
    const isOpen = openPathIdx === i;
    return `
      <div class="path-card ${isOpen ? "open" : ""}" onclick="togglePathCard(${i})">
        <div class="icon">${p.icon}</div>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        ${isOpen ? `<div class="path-detail">${p.detalhes || "Mais detalhes em breve."}</div>` : ""}
        <button class="path-btn ${p.tone}" onclick="event.stopPropagation(); showToast('Interesse registrado em: ${p.title.replace(/'/g, "")}')">${p.cta}</button>
        <span class="path-hint">${isOpen ? "▲ Clique para recolher" : "▼ Clique para saber mais"}</span>
      </div>`;
  }).join("");
}

function avatarUrl(e) {
  const bg = (e.accent || "#6c5ce7").replace("#", "");
  return `https://api.dicebear.com/8.x/avataaars/svg?seed=${encodeURIComponent(e.id)}&backgroundType=solid&backgroundColor=${bg}`;
}

// ---------- topbar ----------
function renderTopbar() {
  const e = getCurrent();
  document.getElementById("greeting").textContent = `Olá, ${e.name.split(" ")[0]}! 👋`;
  document.getElementById("userName").textContent = e.name;
  document.getElementById("userRole").textContent = e.role;
  document.getElementById("notifCount").textContent = e.notifications;
  document.getElementById("notifCount").style.display = e.notifications > 0 ? "flex" : "none";

  const av = document.getElementById("avatar");
  av.style.background = e.accent;
  av.innerHTML = `${e.initials}<img class="avatar-img" src="${avatarUrl(e)}" alt="${e.name}" onerror="this.remove()">`;

  document.getElementById("dicaDia").textContent = e.dica;

  const sel = document.getElementById("employeeSelect");
  sel.innerHTML = state.employees.map(emp =>
    `<option value="${emp.id}" ${emp.id === state.currentId ? "selected" : ""}>${emp.name}</option>`
  ).join("");
}

// ---------- página: início ----------
function renderInicio() {
  const e = getCurrent();
  const stepsHtml = e.journey.steps.map((s, i) => {
    const icon = s.status === "done" ? "✓" : s.status === "active" ? "🚩" : s.status === "next" ? "🚩" : "☆";
    return `
      <div class="step ${s.status}">
        <div class="step-circle">${icon}</div>
        <div class="step-label">${s.label}</div>
        <div class="step-sub">${s.sub}</div>
      </div>
      ${i < e.journey.steps.length - 1 ? `<div class="step-line ${s.status === 'done' ? 'filled' : ''}"></div>` : ""}
    `;
  }).join("");

  const pathsHtml = renderPathCards(e.nextPaths);

  const metasHtml = e.metas.map((m, idx) => `
    <div class="meta-item">
      <div class="meta-row">
        <div class="meta-icon">${m.icon}</div>
        <div class="meta-title">${m.title}</div>
        <div class="meta-pct">${m.progress}%</div>
      </div>
      <div class="bar"><div class="bar-fill" style="width:${m.progress}%"></div></div>
    </div>
  `).join("");

  const compHtml = e.competencias.map(c => `
    <div class="comp-item">
      <div class="comp-top"><span>${c.name}</span><span>${c.level}</span></div>
      <div class="bar"><div class="bar-fill" style="width:${c.pct}%"></div></div>
    </div>
  `).join("");

  const expHtml = e.experiencias.map(x => `
    <div class="exp-item">
      <div class="ic">${x.icon}</div>
      <div><strong>${x.title}</strong><span>${x.sub}</span></div>
    </div>
  `).join("") || `<p class="sim-note">Ainda sem experiências registradas.</p>`;

  document.getElementById("pageContent").innerHTML = `
    <div class="card">
      <div class="card-title"><h2>Sua Jornada no CIMATEC</h2></div>
      <div class="jornada-grid">
        <div class="steps-row">${stepsHtml}</div>
        <div class="progress-box">
          <div class="label">Progresso geral</div>
          <div class="progress-donut-wrap">
            <div class="progress-pct">${e.journey.progress}%</div>
            ${donutSVG(e.journey.progress)}
          </div>
          <div class="label" style="margin-top:4px;">da jornada concluída</div>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="paths-grid">${pathsHtml}</div>
        <button class="link-btn" style="margin-top:14px;" onclick="showToast('Abrindo todas as possibilidades...')">Ver todas as possibilidades →</button>
      </div>

      <div class="card">
        <div class="card-title">
          <h2>METAS PA</h2>
          <button class="link-btn" onclick="showToast('Exibindo todas as metas')">Ver todas</button>
        </div>
        ${metasHtml}
        <button class="add-meta-btn" id="addMetaBtn">+ Nova meta</button>
      </div>
    </div>

    <div class="grid-4">
      <div class="card">
        <div class="card-title"><h2>Desenvolvimento</h2><button class="link-btn" onclick="showToast('Exibindo desenvolvimento completo')">Ver tudo</button></div>
        <div class="stat-pair">
          <div><span class="stat-big">${e.dev.competencias}</span><div class="stat-label">Competências adquiridas</div></div>
          <div><span class="stat-big">${e.dev.certificacoes}</span><div class="stat-label">Certificações</div></div>
        </div>
        <div><span class="stat-big">${e.dev.horas}h</span><div class="stat-label">Horas de capacitação este mês</div></div>
      </div>

      <div class="card">
        <div class="card-title"><h2>Competências em destaque</h2><button class="link-btn" onclick="showToast('Exibindo todas as competências')">Ver todas</button></div>
        ${compHtml}
      </div>

      <div class="card">
        <div class="card-title"><h2>Experiências e Conquistas</h2><button class="link-btn" onclick="showToast('Exibindo todas as experiências')">Ver todas</button></div>
        ${expHtml}
      </div>

      <div class="card recon-box">
        <div class="card-title" style="justify-content:center;"><h2>Reconhecimento</h2></div>
        <div class="medal">🏅</div>
        <p><strong>Parabéns!</strong><br>Você recebeu <strong>${e.reconhecimentos}</strong> reconhecimentos</p>
        <button class="ver-recon-btn" onclick="showToast('Exibindo reconhecimentos')">Ver reconhecimentos</button>
      </div>
    </div>

    <div class="banner">
      <h3>Seu crescimento é o que move o CIMATEC!</h3>
      <div class="banner-item"><span class="ic">📖</span><div><strong>Aprenda sempre</strong><span>Novos cursos toda semana.</span></div></div>
      <div class="banner-item"><span class="ic">🤝</span><div><strong>Compartilhe conhecimento</strong><span>Ensine e cresça com outras pessoas.</span></div></div>
      <div class="banner-item"><span class="ic">💡</span><div><strong>Inove sempre</strong><span>Participe de projetos e faça a diferença.</span></div></div>
      <div class="banner-item"><span class="ic">🤝</span><div><strong>Conecte-se</strong><span>Aproveite nossas parcerias e eventos.</span></div></div>
    </div>
  `;

  document.getElementById("addMetaBtn").addEventListener("click", handleAddMeta);
}

// ---------- estado de edição por aba ----------
let editMode = {};

function toggleEdit(page) {
  editMode[page] = !editMode[page];
  renderTabPage(page);
}

function editToggleBtn(page) {
  return editMode[page]
    ? `<button class="sim-btn" id="editToggleBtn">✅ Concluir edição</button>`
    : `<button class="sim-btn secondary" id="editToggleBtn">✏️ Editar</button>`;
}

// ---------- helpers de campo/edição ----------
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function fieldHtml(label, type, path, value, min, max) {
  const attrs = type === "number" ? `min="${min}" max="${max}" step="1"` : "";
  return `
    <label class="edit-field">
      <span>${label}</span>
      <input type="${type}" data-field="${path}" value="${escapeHtml(value)}" ${attrs} />
    </label>`;
}

function setByPath(obj, path, value) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = isNaN(parts[i]) ? parts[i] : Number(parts[i]);
    cur = cur[p];
  }
  const last = parts[parts.length - 1];
  cur[isNaN(last) ? last : Number(last)] = value;
}

// aplica todos os inputs [data-field] visíveis na tela ao objeto do colaborador atual
function applyFieldsToCurrent() {
  const e = getCurrent();
  document.querySelectorAll("#pageContent [data-field]").forEach(input => {
    const path = input.dataset.field;
    let val = input.value;
    if (input.type === "number") {
      const min = input.min !== "" ? Number(input.min) : -Infinity;
      const max = input.max !== "" ? Number(input.max) : Infinity;
      val = clamp(Number(val) || 0, min, max);
    }
    setByPath(e, path, val);
  });
  saveState();
}

// remove um item de uma lista (metas / competencias / experiencias) pelo índice
function removeListItem(listName, idx) {
  applyFieldsToCurrent(); // preserva o que já foi digitado antes de remover
  const e = getCurrent();
  e[listName].splice(idx, 1);
  saveState();
  renderTabPage(listName === "metas" ? "metas" : listName);
}

function addListItem(listName) {
  applyFieldsToCurrent();
  const e = getCurrent();
  if (listName === "metas") e.metas.push({ icon: "🆕", title: "Nova meta", progress: 0 });
  if (listName === "competencias") e.competencias.push({ name: "Nova competência", level: "Básico", pct: 10 });
  if (listName === "experiencias") e.experiencias.push({ icon: "🆕", title: "Nova experiência", sub: "Descrição" });
  saveState();
  renderTabPage(listName);
}

// ---------- página: Minha Jornada ----------
function renderJornada() {
  const e = getCurrent();
  const editing = !!editMode.jornada;

  let inner;
  if (!editing) {
    const stepsHtml = e.journey.steps.map((s, i) => {
      const icon = s.status === "done" ? "✓" : s.status === "active" ? "🚩" : s.status === "next" ? "🚩" : "☆";
      return `
        <div class="step ${s.status}">
          <div class="step-circle">${icon}</div>
          <div class="step-label">${s.label}</div>
          <div class="step-sub">${s.sub}</div>
        </div>
        ${i < e.journey.steps.length - 1 ? `<div class="step-line ${s.status === 'done' ? 'filled' : ''}"></div>` : ""}
      `;
    }).join("");
    const pathsHtml = renderPathCards(e.nextPaths);
    inner = `
      <div class="jornada-grid">
        <div class="steps-row">${stepsHtml}</div>
        <div class="progress-box">
          <div class="label">Progresso geral</div>
          <div class="progress-donut-wrap">
            <div class="progress-pct">${e.journey.progress}%</div>
            ${donutSVG(e.journey.progress)}
          </div>
          <div class="label" style="margin-top:4px;">da jornada concluída</div>
        </div>
      </div>
      <div class="paths-grid">${pathsHtml}</div>
    `;
  } else {
    inner = `
      <div class="edit-grid">
        ${fieldHtml("Progresso geral da jornada (%)", "number", "journey.progress", e.journey.progress, 0, 100)}
      </div>
      <h3 class="edit-subtitle">Etapas da jornada</h3>
      <div class="edit-list">
        ${e.journey.steps.map((s, i) => `
          <div class="edit-row edit-row-3">
            ${fieldHtml("Etapa", "text", `journey.steps.${i}.label`, s.label)}
            ${fieldHtml("Status (texto)", "text", `journey.steps.${i}.sub`, s.sub)}
            <label class="edit-field">
              <span>Situação</span>
              <select data-field="journey.steps.${i}.status" data-select="true">
                ${["done","active","next","future"].map(opt => `<option value="${opt}" ${opt === s.status ? "selected" : ""}>${opt}</option>`).join("")}
              </select>
            </label>
          </div>
        `).join("")}
      </div>
      <h3 class="edit-subtitle">Caminhos sugeridos (próximo passo)</h3>
      <div class="edit-list">
        ${e.nextPaths.map((p, i) => `
          <div class="edit-row edit-row-3">
            ${fieldHtml("Título", "text", `nextPaths.${i}.title`, p.title)}
            ${fieldHtml("Descrição", "text", `nextPaths.${i}.desc`, p.desc)}
            ${fieldHtml("Texto do botão", "text", `nextPaths.${i}.cta`, p.cta)}
          </div>
        `).join("")}
      </div>
    `;
  }

  document.getElementById("pageContent").innerHTML = `
    <div class="card">
      <div class="card-title"><h2>Sua Jornada no CIMATEC</h2>${editToggleBtn("jornada")}</div>
      ${inner}
    </div>
  `;
  wireEditToggle("jornada");
  if (editing) wireSelectFields();
}

// ---------- página: Competências ----------
function renderCompetencias() {
  const e = getCurrent();
  const editing = !!editMode.competencias;

  let inner;
  if (!editing) {
    inner = `
      <div class="stat-pair" style="margin-bottom:20px;">
        <div><span class="stat-big">${e.dev.competencias}</span><div class="stat-label">Competências adquiridas</div></div>
        <div><span class="stat-big">${e.dev.certificacoes}</span><div class="stat-label">Certificações</div></div>
        <div><span class="stat-big">${e.dev.horas}h</span><div class="stat-label">Horas de capacitação este mês</div></div>
      </div>
      ${e.competencias.map(c => `
        <div class="comp-item">
          <div class="comp-top"><span>${c.name}</span><span>${c.level}</span></div>
          <div class="bar"><div class="bar-fill" style="width:${c.pct}%"></div></div>
        </div>
      `).join("")}
    `;
  } else {
    inner = `
      <div class="edit-grid">
        ${fieldHtml("Competências adquiridas", "number", "dev.competencias", e.dev.competencias, 0, 999)}
        ${fieldHtml("Certificações", "number", "dev.certificacoes", e.dev.certificacoes, 0, 999)}
        ${fieldHtml("Horas de capacitação (mês)", "number", "dev.horas", e.dev.horas, 0, 999)}
      </div>
      <h3 class="edit-subtitle">Competências em destaque</h3>
      <div class="edit-list">
        ${e.competencias.map((c, i) => `
          <div class="edit-row edit-row-3-del">
            ${fieldHtml("Competência", "text", `competencias.${i}.name`, c.name)}
            ${fieldHtml("Nível", "text", `competencias.${i}.level`, c.level)}
            ${fieldHtml("Progresso (%)", "number", `competencias.${i}.pct`, c.pct, 0, 100)}
            <button class="del-btn" data-remove="competencias" data-idx="${i}" title="Remover">🗑️</button>
          </div>
        `).join("")}
      </div>
      <button class="add-meta-btn" data-add="competencias">+ Nova competência</button>
    `;
  }

  document.getElementById("pageContent").innerHTML = `
    <div class="card">
      <div class="card-title"><h2>Competências</h2>${editToggleBtn("competencias")}</div>
      ${inner}
    </div>
  `;
  wireEditToggle("competencias");
  if (editing) wireListControls("competencias");
}

// ---------- página: Experiências ----------
function renderExperiencias() {
  const e = getCurrent();
  const editing = !!editMode.experiencias;

  let inner;
  if (!editing) {
    inner = e.experiencias.length
      ? e.experiencias.map(x => `
          <div class="exp-item">
            <div class="ic">${x.icon}</div>
            <div><strong>${x.title}</strong><span>${x.sub}</span></div>
          </div>
        `).join("")
      : `<p class="sim-note">Ainda sem experiências registradas.</p>`;
  } else {
    inner = `
      <div class="edit-list">
        ${e.experiencias.map((x, i) => `
          <div class="edit-row edit-row-3-del">
            ${fieldHtml("Emoji", "text", `experiencias.${i}.icon`, x.icon)}
            ${fieldHtml("Título", "text", `experiencias.${i}.title`, x.title)}
            ${fieldHtml("Detalhe", "text", `experiencias.${i}.sub`, x.sub)}
            <button class="del-btn" data-remove="experiencias" data-idx="${i}" title="Remover">🗑️</button>
          </div>
        `).join("")}
      </div>
      <button class="add-meta-btn" data-add="experiencias">+ Nova experiência</button>
    `;
  }

  document.getElementById("pageContent").innerHTML = `
    <div class="card">
      <div class="card-title"><h2>Experiências e Conquistas</h2>${editToggleBtn("experiencias")}</div>
      ${inner}
    </div>
  `;
  wireEditToggle("experiencias");
  if (editing) wireListControls("experiencias");
}

// ---------- página: METAS PA ----------
function renderMetas() {
  const e = getCurrent();
  const editing = !!editMode.metas;

  let inner;
  if (!editing) {
    inner = e.metas.map(m => `
      <div class="meta-item">
        <div class="meta-row">
          <div class="meta-icon">${m.icon}</div>
          <div class="meta-title">${m.title}</div>
          <div class="meta-pct">${m.progress}%</div>
        </div>
        <div class="bar"><div class="bar-fill" style="width:${m.progress}%"></div></div>
      </div>
    `).join("");
  } else {
    inner = `
      <div class="edit-list">
        ${e.metas.map((m, i) => `
          <div class="edit-row edit-row-3-del">
            ${fieldHtml("Emoji", "text", `metas.${i}.icon`, m.icon)}
            ${fieldHtml("Título da meta", "text", `metas.${i}.title`, m.title)}
            ${fieldHtml("Progresso (%)", "number", `metas.${i}.progress`, m.progress, 0, 100)}
            <button class="del-btn" data-remove="metas" data-idx="${i}" title="Remover">🗑️</button>
          </div>
        `).join("")}
      </div>
      <button class="add-meta-btn" data-add="metas">+ Nova meta</button>
    `;
  }

  document.getElementById("pageContent").innerHTML = `
    <div class="card">
      <div class="card-title"><h2>METAS PA</h2>${editToggleBtn("metas")}</div>
      ${inner}
    </div>
  `;
  wireEditToggle("metas");
  if (editing) wireListControls("metas");
}

// ---------- página: Reconhecimento ----------
function renderReconhecimento() {
  const e = getCurrent();
  const editing = !!editMode.reconhecimento;

  let inner;
  if (!editing) {
    inner = `
      <div class="recon-box">
        <div class="medal">🏅</div>
        <p><strong>Parabéns!</strong><br>Você recebeu <strong>${e.reconhecimentos}</strong> reconhecimentos</p>
      </div>
    `;
  } else {
    inner = `
      <div class="edit-grid">
        ${fieldHtml("Total de reconhecimentos", "number", "reconhecimentos", e.reconhecimentos, 0, 999)}
        ${fieldHtml("Notificações no sino", "number", "notifications", e.notifications, 0, 99)}
      </div>
    `;
  }

  document.getElementById("pageContent").innerHTML = `
    <div class="card">
      <div class="card-title"><h2>Reconhecimento</h2>${editToggleBtn("reconhecimento")}</div>
      ${inner}
    </div>
  `;
  wireEditToggle("reconhecimento");
}

// ---------- eventos comuns das páginas com edição ----------
function wireEditToggle(page) {
  const btn = document.getElementById("editToggleBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    if (editMode[page]) applyFieldsToCurrent(); // salva antes de sair do modo edição
    toggleEdit(page);
    renderTopbar();
    showToast(editMode[page] ? "Modo edição ativado" : `Dados de ${getCurrent().name.split(" ")[0]} salvos!`);
  });
}

function wireListControls(page) {
  document.querySelectorAll("[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => removeListItem(btn.dataset.remove, Number(btn.dataset.idx)));
  });
  document.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => addListItem(btn.dataset.add));
  });
}

function wireSelectFields() {
  // selects usam data-field igual aos inputs, applyFieldsToCurrent já cobre via querySelectorAll geral
}

// ---------- roteador das abas dinâmicas ----------
function renderTabPage(page) {
  if (page === "jornada") renderJornada();
  else if (page === "competencias") renderCompetencias();
  else if (page === "experiencias") renderExperiencias();
  else if (page === "metas") renderMetas();
  else if (page === "reconhecimento") renderReconhecimento();
  else renderPlaceholder(page);
}

// ---------- páginas ainda sem modelo de dados (placeholder) ----------
const PAGE_META = {
  oportunidades: { ic: "👤", title: "Oportunidades", desc: "Vagas internas e novos desafios recomendados para você." },
  documentos: { ic: "📁", title: "Documentos", desc: "Contratos, certificados e documentos pessoais." },
  feedback: { ic: "🔍", title: "Feedback", desc: "Feedbacks recebidos e enviados." },
};

function renderPlaceholder(page) {
  const m = PAGE_META[page];
  document.getElementById("pageContent").innerHTML = `
    <div class="placeholder">
      <div class="ic">${m.ic}</div>
      <h2>${m.title}</h2>
      <p>${m.desc}</p>
      <p class="sim-note">(Página de demonstração — ainda sem dados vinculados ao colaborador.)</p>
    </div>
  `;
}

// ---------- navegação ----------
function setActivePage(page) {
  document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.page === page));
  if (page === "inicio") renderInicio();
  else renderTabPage(page);
}

function simulateUpdate() {
  const e = getCurrent();

  // avança levemente as metas
  e.metas.forEach(m => { m.progress = clamp(m.progress + (2 + Math.floor(Math.random() * 8)), 0, 100); });

  // avança progresso geral da jornada
  e.journey.progress = clamp(e.journey.progress + (1 + Math.floor(Math.random() * 4)), 0, 100);

  // avança competências
  e.competencias.forEach(c => { c.pct = clamp(c.pct + Math.floor(Math.random() * 5), 0, 100); });

  // pequenas variações de indicadores
  e.dev.horas += Math.floor(Math.random() * 3);
  if (Math.random() > 0.6) e.dev.competencias += 1;
  if (Math.random() > 0.85) {
    e.dev.certificacoes += 1;
    e.reconhecimentos += 1;
    e.notifications += 1;
    showToast(`🎉 ${e.name.split(" ")[0]} conquistou uma nova certificação!`);
  } else {
    showToast("Dados atualizados com sucesso ✅");
  }

  saveState();
  refreshCurrentPage();
}

function resetData() {
  const idx = state.employees.findIndex(e => e.id === state.currentId);
  const seed = EMPLOYEES_SEED.find(e => e.id === state.currentId);
  state.employees[idx] = deepClone(seed);
  saveState();
  refreshCurrentPage();
  showToast("Dados restaurados para o estado original.");
}

function handleAddMeta() {
  const title = prompt("Descreva a nova meta:");
  if (!title) return;
  const e = getCurrent();
  e.metas.push({ icon: "🆕", title, progress: 0 });
  saveState();
  refreshCurrentPage();
  showToast("Nova meta adicionada!");
}

function refreshCurrentPage() {
  renderTopbar();
  const active = document.querySelector(".nav-item.active");
  const page = active ? active.dataset.page : "inicio";
  if (page === "inicio") renderInicio();
  else renderTabPage(page);
}

// ---------- init ----------
function init() {
  loadState();
  renderTopbar();
  renderInicio();

  document.getElementById("nav").addEventListener("click", (ev) => {
    const btn = ev.target.closest(".nav-item");
    if (!btn) return;
    setActivePage(btn.dataset.page);
  });

  document.getElementById("employeeSelect").addEventListener("change", (ev) => {
    state.currentId = ev.target.value;
    saveState();
    refreshCurrentPage();
  });

  document.getElementById("simulateBtn").addEventListener("click", simulateUpdate);
  document.getElementById("resetBtn").addEventListener("click", resetData);
}

document.addEventListener("DOMContentLoaded", init);
