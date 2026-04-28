const API = "https://auto-feedback-backend.onrender.com/api";

let cookies = [];
let allTasks = [];
let renderIndex = 0;
const LIMIT = 10; // jumlah tampil per scroll

// =======================
// 🔐 LOGIN + AUTO LOAD
// =======================
async function login() {
  const account = document.getElementById("account").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account, password })
  });

  const data = await res.json();

  if (!data.success) {
    alert("Login gagal");
    return;
  }

  cookies = data.cookies;

  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");

  // 🔥 langsung load semua data
  loadAllTasks();
}

// =======================
// 📥 LOAD SEMUA DATA SEKALI
// =======================
async function loadAllTasks() {
  document.getElementById("loading").classList.remove("hidden");

  const res = await fetch(`${API}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cookies }) // ❗ TANPA page
  });

  const data = await res.json();

  allTasks = data.data || [];
  renderIndex = 0;

  renderSummary(data.summary);

  document.getElementById("taskList").innerHTML = "";

  renderNextBatch();

  document.getElementById("loading").classList.add("hidden");
}

// =======================
// 📦 RENDER BERTAHAP (SCROLL)
// =======================
function renderNextBatch() {
  const container = document.getElementById("taskList");

  const next = allTasks.slice(renderIndex, renderIndex + LIMIT);

  next.forEach(t => {
    container.innerHTML += `
      <div class="task">
        <b>${t.userName}</b><br>
        💰 ${t.formatDebt}<br>
        📍 ${t.addressBo?.city || "-"}<br>
        ⏳ Sisa: ${t.sisaHari ?? "-"} hari
      </div>
    `;
  });

  renderIndex += LIMIT;
}

// =======================
// 📊 SUMMARY
// =======================
function renderSummary(s) {
  if (!s) return;

  document.getElementById("summary").innerHTML = `
    Total: ${s.total} |
    Sudah: ${s.sudahFeedback} |
    Belum: ${s.belumFeedback} |
    Expired: ${s.expired}
  `;
}

// =======================
// 🔥 AUTO FEEDBACK
// =======================
async function startAuto() {
  await fetch(`${API}/auto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cookies })
  });

  alert("Auto berjalan 🚀");
}

// =======================
// 🔄 REFRESH
// =======================
function resetData() {
  loadAllTasks();
}

// =======================
// 📜 SCROLL LOAD
// =======================
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    renderNextBatch();
  }
});
