const BASE_URL = "https://auto-feedback-backend.onrender.com/api";

let cookies = [];
let allTasks = [];
let chart;

// =====================
// AUTO LOGIN
// =====================
window.onload = () => {
  const saved = localStorage.getItem("cookies");
  if (saved) {
    cookies = JSON.parse(saved);
    showDashboard();
    loadTasks();
  }
};

// =====================
// LOGIN
// =====================
async function login() {
  const account = document.getElementById("account").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ account, password })
  });

  const data = await res.json();

  if (!data.success) return alert("Login gagal");

  cookies = data.cookies;
  localStorage.setItem("cookies", JSON.stringify(cookies));

  showDashboard();
  loadTasks();
}

function logout() {
  localStorage.removeItem("cookies");
  location.reload();
}

function showDashboard() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
}

// =====================
// LOAD TASK
// =====================
async function loadTasks() {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ cookies })
  });

  const data = await res.json();

  allTasks = data.data;

  renderSummary(data.summary);
  renderTable(allTasks);
  renderChart(data.summary);

  startRealtimeCountdown();
}

// =====================
// AUTO FEEDBACK
// =====================
async function runAuto() {
  await fetch(`${BASE_URL}/auto`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ cookies })
  });

  alert("Auto jalan background");
}

// =====================
// SUMMARY
// =====================
function renderSummary(s) {
  total.innerText = s.total;
  done.innerText = s.sudahFeedback;
  pending.innerText = s.belumFeedback;
  expired.innerText = s.expired;
}

// =====================
// TABLE
// =====================
function renderTable(tasks) {
  const table = document.getElementById("taskTable");
  table.innerHTML = "";

  tasks.forEach(t => {
    let status = "Belum";
    let cls = "status-pending";

    if (t.hasFeedback && t.sisaHari === 0) {
      status = "Expired";
      cls = "status-expired";
    } else if (t.hasFeedback) {
      status = "Sudah";
      cls = "status-done";
    }

    const warn = t.sisaHari <= 3 ? "warning" : "";

    table.innerHTML += `
      <tr class="${warn}">
        <td>${t.id}</td>
        <td>${t.customerName || "-"}</td>
        <td class="${cls}">${status}</td>
        <td class="countdown" data-time="${t.sisaHari}">${t.sisaHari ?? "-"}</td>
      </tr>
    `;
  });
}

// =====================
// 🔍 SEARCH
// =====================
function filterTable() {
  const q = document.getElementById("search").value.toLowerCase();

  const filtered = allTasks.filter(t =>
    (t.customerName || "").toLowerCase().includes(q) ||
    String(t.id).includes(q)
  );

  renderTable(filtered);
}

// =====================
// 📊 CHART
// =====================
function renderChart(s) {
  const ctx = document.getElementById("chart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Done", "Pending", "Expired"],
      datasets: [{
        data: [s.sudahFeedback, s.belumFeedback, s.expired],
        backgroundColor: ["#22c55e", "#eab308", "#ef4444"]
      }]
    }
  });
}

// =====================
// ⏱ REALTIME COUNTDOWN
// =====================
function startRealtimeCountdown() {
  setInterval(() => {
    document.querySelectorAll(".countdown").forEach(el => {
      let val = parseInt(el.innerText);
      if (!isNaN(val) && val > 0) {
        el.innerText = val; // tetap hari (bisa upgrade ke jam nanti)
      }
    });
  }, 1000);
}
