const boardEl = document.getElementById("board");
const detailPanelEl = document.getElementById("detailPanel");
const searchInputEl = document.getElementById("searchInput");
const sectorFilterEl = document.getElementById("sectorFilter");
const reloadBtnEl = document.getElementById("reloadBtn");

const NOTE_COLORS = ["yellow", "pink", "blue", "green", "purple"];

let companies = [];
let filteredCompanies = [];

async function loadCompanies() {
  try {
    const response = await fetch("./data/companies.json?ts=" + Date.now());
    if (!response.ok) throw new Error("Could not load companies.json");

    const data = await response.json();
    companies = Array.isArray(data) ? data : [];
    populateSectorFilter(companies);
    applyFilters();
  } catch (error) {
    console.error(error);
    boardEl.innerHTML = `
      <div class="empty-state">
        <h3>Could not load the report data.</h3>
        <p>Make sure <code>data/companies.json</code> exists and is valid JSON.</p>
      </div>
    `;
  }
}

function populateSectorFilter(items) {
  const existingValue = sectorFilterEl.value;
  const sectors = [...new Set(items.map(item => item.sector).filter(Boolean))].sort();

  sectorFilterEl.innerHTML = '<option value="all">All sectors</option>' +
    sectors.map(sector => `<option value="${escapeHtml(sector)}">${escapeHtml(sector)}</option>`).join("");

  if (sectors.includes(existingValue)) {
    sectorFilterEl.value = existingValue;
  }
}

function applyFilters() {
  const searchTerm = searchInputEl.value.trim().toLowerCase();
  const sectorValue = sectorFilterEl.value;

  filteredCompanies = companies.filter(company => {
    const matchesSector = sectorValue === "all" || company.sector === sectorValue;
    const blob = [
      company.name,
      company.sector,
      company.summary,
      company.round,
      company.location
    ].join(" ").toLowerCase();

    const matchesSearch = !searchTerm || blob.includes(searchTerm);
    return matchesSector && matchesSearch;
  });

  renderBoard(filteredCompanies);
}

function renderBoard(items) {
  if (!items.length) {
    boardEl.innerHTML = `
      <div class="empty-state">
        <h3>No sticky notes found.</h3>
        <p>Try changing the search or sector filter.</p>
      </div>
    `;
    return;
  }

  boardEl.innerHTML = items.map((company, index) => {
    const color = company.color && NOTE_COLORS.includes(company.color)
      ? company.color
      : NOTE_COLORS[index % NOTE_COLORS.length];

    return `
      <button class="note ${color}" data-id="${escapeHtml(company.id)}" type="button">
        <div>
          <h3>${escapeHtml(company.name)}</h3>
          <p>${escapeHtml(truncate(company.summary, 110))}</p>
        </div>
        <div class="note-meta">
          <span class="tag">${escapeHtml(company.sector || "Company")}</span>
          <span>${escapeHtml(company.round || "")}</span>
        </div>
      </button>
    `;
  }).join("");

  document.querySelectorAll(".note").forEach(note => {
    note.addEventListener("click", () => {
      const company = companies.find(item => item.id === note.dataset.id);
      if (company) renderDetails(company);
    });
  });
}

function renderDetails(company) {
  const articleLinks = (company.links || [])
    .map(link => `
      <a href="${escapeAttribute(link.url)}" target="_blank" rel="noopener noreferrer">
        ${escapeHtml(link.label || "Open link")}
      </a>
    `)
    .join("");

  detailPanelEl.innerHTML = `
    <h2 class="company-name">${escapeHtml(company.name)}</h2>
    <div class="tag">${escapeHtml(company.sector || "Company")}</div>
    <p class="company-summary">${escapeHtml(company.summary || "")}</p>

    <div class="meta-grid">
      <div class="meta-item">
        <strong>Funding round</strong>
        <span>${escapeHtml(company.round || "—")}</span>
      </div>
      <div class="meta-item">
        <strong>Amount</strong>
        <span>${escapeHtml(company.amount || "—")}</span>
      </div>
      <div class="meta-item">
        <strong>Location</strong>
        <span>${escapeHtml(company.location || "—")}</span>
      </div>
      <div class="meta-item">
        <strong>Report date</strong>
        <span>${escapeHtml(company.reportDate || "—")}</span>
      </div>
    </div>

    ${articleLinks ? `<div class="links">${articleLinks}</div>` : ""}

    ${company.notes ? `<div class="detail-notes"><strong>OpenClaw notes:</strong><br>${escapeHtml(company.notes)}</div>` : ""}
  `;
}

function truncate(text, maxLength) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength - 1) + "…" : text;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return String(value ?? "").replaceAll('"', "&quot;");
}

searchInputEl.addEventListener("input", applyFilters);
sectorFilterEl.addEventListener("change", applyFilters);
reloadBtnEl.addEventListener("click", loadCompanies);

loadCompanies();
