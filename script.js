let cookies = [];
let page = 1;
let loading = false;
let finished = false;

// =====================
// LOGIN
// =====================
async function login() {
  const account = document.getElementById("account").value;
  const password = document.getElementById("password").value;

  const res = await fetch("https://auto-feedback-backend.onrender.com/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account, password })
  });

  const data = await res.json();

  if (!data.success) {
    alert("Login gagal");
    return;
  }

  // ✅ simpan cookies
  cookies = data.cookies.map(c => c.split(";")[0]);

  // tampil dashboard
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  // ✅ AUTO LOAD setelah login
  resetAndLoad();
}

// =====================
// RESET + LOAD
// =====================
function resetAndLoad() {
  page = 1;
  finished = false;
  document.getElementById("list").innerHTML = "";
  loadTasks();
}

// =====================
// LOAD TASKS
// =====================
async function loadTasks() {
  if (loading || finished) return;

  loading = true;
  document.getElementById("loading").style.display = "block";

  const res = await fetch("https://auto-feedback-backend.onrender.com/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cookies, page })
  });

  const data = await res.json();

  document.getElementById("loading").style.display = "none";
  loading = false;

  if (!data.data || data.data.length === 0) {
    finished = true;
    return;
  }

  render(data.data);

  // summary
  document.getElementById("summary").innerText =
    `Total: ${data.summary.total} | Done: ${data.summary.sudahFeedback} | Pending: ${data.summary.belumFeedback}`;

  page++;
}

// =====================
// RENDER UI
// =====================
function render(tasks) {
  const list = document.getElementById("list");

  tasks.forEach(t => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <b>${t.userName}</b><br>
      Debt: ${t.formatDebt}<br>
      DPD: ${t.dpd}<br>
      Sisa Hari: 
      <span class="${t.sisaHari <= 0 ? 'expired' : 'ok'}">
        ${t.sisaHari}
      </span>
    `;

    list.appendChild(div);
  });
}

// =====================
// AUTO FEEDBACK
// =====================
async function startAuto() {
  await fetch("https://auto-feedback-backend.onrender.com/api/auto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cookies })
  });

  alert("Auto berjalan di background");
}

// =====================
// REFRESH
// =====================
function refresh() {
  resetAndLoad();
}

// =====================
// INFINITE SCROLL
// =====================
window.onscroll = () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
    loadTasks();
  }
};
