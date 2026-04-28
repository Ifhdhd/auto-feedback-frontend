const BASE_URL = "https://auto-feedback-backend.onrender.com/api";

let cookies = [];

// =====================
// 🔐 LOGIN
// =====================
async function login() {
  const account = document.getElementById("account").value;
  const password = document.getElementById("password").value;

  if (!account || !password) {
    alert("Isi semua field");
    return;
  }

  const res = await fetch(`${BASE_URL}/login`, {
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

  document.getElementById("loginBox").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  loadTasks();
}


// =====================
// 📋 LOAD TASK
// =====================
async function loadTasks() {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cookies })
  });

  const data = await res.json();

  if (!data.success) {
    alert("Gagal ambil data");
    return;
  }

  renderSummary(data.summary);
  renderTable(data.data);
}


// =====================
// ⚡ AUTO FEEDBACK
// =====================
async function runAuto() {
  await fetch(`${BASE_URL}/auto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cookies })
  });

  alert("Auto berjalan di background");
}


// =====================
// 📊 SUMMARY
// =====================
function renderSummary(s) {
  document.getElementById("total").innerText = s.total;
  document.getElementById("done").innerText = s.sudahFeedback;
  document.getElementById("pending").innerText = s.belumFeedback;
  document.getElementById("expired").innerText = s.expired;
}


// =====================
// 📄 TABLE
// =====================
function renderTable(tasks) {
  const table = document.getElementById("taskTable");
  table.innerHTML = "";

  tasks.forEach(t => {
    let statusText = "Belum";
    let statusClass = "status-pending";

    if (t.hasFeedback && t.sisaHari === 0) {
      statusText = "Expired";
      statusClass = "status-expired";
    } else if (t.hasFeedback) {
      statusText = "Sudah";
      statusClass = "status-done";
    }

    const row = `
      <tr>
        <td>${t.id}</td>
        <td>${t.customerName || "-"}</td>
        <td class="${statusClass}">${statusText}</td>
        <td>${t.sisaHari ?? "-"}</td>
      </tr>
    `;

    table.innerHTML += row;
  });
}
