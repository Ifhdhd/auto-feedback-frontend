const API = "https://auto-feedback-backend.onrender.com/api";

let cookies = [];
let allTasks = [];
let renderIndex = 0;
const LIMIT = 10;

// =======================
// 🔐 LOGIN
// =======================
async function login() {
  const account = document.getElementById("account").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
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

  loadAllTasks();
}

// =======================
// 📥 LOAD SEMUA TASK
// =======================
async function loadAllTasks() {
  document.getElementById("loading").classList.remove("hidden");

  const res = await fetch(`${API}/tasks`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ cookies })
  });

  const data = await res.json();

  allTasks = data.data || [];
  renderIndex = 0;

  renderSummary(data.summary);

  document.getElementById("taskList").innerHTML = "";

  renderNext();

  document.getElementById("loading").classList.add("hidden");
}

// =======================
// 📦 RENDER PER BATCH
// =======================
function renderNext() {
  const container = document.getElementById("taskList");

  const next = allTasks.slice(renderIndex, renderIndex + LIMIT);

  next.forEach(t => {
    const badge = getStatusBadge(t);

    container.innerHTML += `
      <div class="task">
        <b>${t.userName}</b><br>
        💰 ${t.formatDebt}<br>
        📍 ${t.addressBo?.city || "-"}<br>
        ${badge}
      </div>
    `;
  });

  renderIndex += LIMIT;
}

// =======================
// 🎯 STATUS BADGE
// =======================
function getStatusBadge(t) {
  if (t.sisaHari === null) {
    return `<span class="badge yellow">Belum Feedback</span>`;
  }

  if (t.sisaHari <= 0) {
    return `<span class="badge red">Expired</span>`;
  }

  return `<span class="badge green">Aktif (${t.sisaHari} hari)</span>`;
}

// =======================
// 📊 SUMMARY
// =======================
function renderSummary(s) {
  if (!s) return;

  document.getElementById("summary").innerHTML = `
    Total: ${s.total} |
    ✅ Sudah: ${s.sudahFeedback} |
    ⏳ Belum: ${s.belumFeedback} |
    ❌ Expired: ${s.expired}
  `;
}

// =======================
// 🚀 AUTO FEEDBACK
// =======================
async function startAuto() {
  await fetch(`${API}/auto`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ cookies })
  });

  alert("Auto berjalan di background 🚀");
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
    renderNext();
  }
});
