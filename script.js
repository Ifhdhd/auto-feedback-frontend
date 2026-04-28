const BASE_URL = "https://auto-feedback-backend.onrender.com";

let cookies = JSON.parse(localStorage.getItem("cookies")) || [];
let allData = [];
let autoRefresh = false;
let interval;


// =====================
// 🔐 LOGIN
// =====================
async function login() {
  const account = document.getElementById("account").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ account, password })
  });

  const data = await res.json();

  if (data.cookies) {
    cookies = data.cookies.map(c => c.split(";")[0]);
    localStorage.setItem("cookies", JSON.stringify(cookies));

    alert("✅ Login berhasil");
  } else {
    alert("❌ Login gagal");
  }
}


// =====================
// 📥 LOAD TASK
// =====================
async function loadTasks() {
  if (!cookies.length) {
    alert("❌ login dulu");
    return;
  }

  document.getElementById("progress").style.width = "20%";

  await fetch(`${BASE_URL}/api/tasks`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ cookies })
  });

  document.getElementById("progress").style.width = "60%";

  setTimeout(getResult, 2000);
}


// =====================
// 🔄 AMBIL HASIL
// =====================
async function getResult() {
  const res = await fetch(`${BASE_URL}/api/tasks/result`);
  const data = await res.json();

  allData = data.data || [];

  renderSummary(data.summary || {});
  renderTable();

  document.getElementById("progress").style.width = "100%";
}


// =====================
// 🔥 AUTO FEEDBACK
// =====================
async function runAuto() {
  if (!cookies.length) {
    alert("❌ login dulu");
    return;
  }

  if (!confirm("Jalankan auto feedback?")) return;

  try {
    const res = await fetch(`${BASE_URL}/api/auto`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ cookies })
    });

    const data = await res.json();

    alert("🚀 " + data.message);

  } catch (err) {
    alert("❌ gagal auto");
  }
}


// =====================
// 📊 SUMMARY
// =====================
function renderSummary(s) {
  document.getElementById("stat-total").innerText = `Total: ${s.total || 0}`;
  document.getElementById("stat-sudah").innerText = `Sudah: ${s.sudahFeedback || 0}`;
  document.getElementById("stat-belum").innerText = `Belum: ${s.belumFeedback || 0}`;
  document.getElementById("stat-expired").innerText = `Expired: ${s.expired || 0}`;
}


// =====================
// 🔍 TABLE + SEARCH
// =====================
function renderTable() {
  const keyword = document.getElementById("search").value.toLowerCase();

  const tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";

  allData
    .filter(d => (d.userName || "").toLowerCase().includes(keyword))
    .forEach(item => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${item.userName || "-"}</td>
        <td>${item.dpd || "-"}</td>
        <td>${item.formatDebt || "-"}</td>
        <td>${getBadge(item.feedbackStatus)}</td>
        <td>${item.sisaHari ?? "-"}</td>
      `;

      tbody.appendChild(tr);
    });
}


// =====================
// 🎨 BADGE
// =====================
function getBadge(status) {
  if (status === "SUDAH") {
    return `<span class="badge sudah-badge">SUDAH</span>`;
  }
  if (status === "EXPIRED") {
    return `<span class="badge expired-badge">EXPIRED</span>`;
  }
  return `<span class="badge belum-badge">BELUM</span>`;
}


// =====================
// 🔄 AUTO REFRESH
// =====================
function toggleAutoRefresh() {
  autoRefresh = !autoRefresh;

  if (autoRefresh) {
    interval = setInterval(getResult, 3000);
    alert("🔄 Auto refresh ON");
  } else {
    clearInterval(interval);
    alert("⛔ Auto refresh OFF");
  }
}
