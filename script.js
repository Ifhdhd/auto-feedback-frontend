const BASE = "https://auto-feedback-backend.onrender.com/api";

let COOKIES = [];

// =====================
// 🔐 LOGIN
// =====================
async function login() {
  const account = document.getElementById("account").value;
  const password = document.getElementById("password").value;

  const res = await fetch(BASE + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account, password })
  });

  const data = await res.json();

  if (!data.success) {
    alert("Login gagal");
    return;
  }

  COOKIES = data.cookies;
  alert("Login sukses");
}

// =====================
// 📋 LOAD TASK
// =====================
async function loadTasks() {
  if (!COOKIES.length) {
    alert("Login dulu!");
    return;
  }

  await fetch(BASE + "/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cookies: COOKIES })
  });

  pollResult();
}

// =====================
// 🔄 POLLING
// =====================
async function pollResult() {
  const res = await fetch(BASE + "/tasks/result");
  const data = await res.json();

  if (!data.success) {
    setTimeout(pollResult, 2000);
    return;
  }

  renderSummary(data.summary);
  renderList(data.data);
}

// =====================
// 📊 SUMMARY
// =====================
function renderSummary(s) {
  document.getElementById("summary").innerHTML = `
    <div class="badge total">Total: ${s.total}</div>
    <div class="badge done">Sudah: ${s.sudahFeedback}</div>
    <div class="badge pending">Belum: ${s.belumFeedback}</div>
    <div class="badge expired">Expired: ${s.expired}</div>
  `;
}

// =====================
// 📦 LIST
// =====================
function renderList(list) {
  const el = document.getElementById("list");

  el.innerHTML = list.map(t => {
    let statusClass = "belum";
    let text = "BELUM";

    if (t.feedbackStatus === "SUDAH") {
      statusClass = "sudah";
      text = `SUDAH (${t.sisaHari} hari)`;
    }

    if (t.feedbackStatus === "EXPIRED") {
      statusClass = "expired-text";
      text = "EXPIRED";
    }

    return `
      <div class="item">
        <div><b>${t.userName}</b></div>
        <div>${t.phoneNumber}</div>
        <div>${t.addressBo?.city || "-"}</div>
        <div class="status ${statusClass}">
          ${text}
        </div>
      </div>
    `;
  }).join("");
}

// =====================
// ⚡ AUTO FEEDBACK
// =====================
async function autoFeedback() {
  if (!COOKIES.length) {
    alert("Login dulu!");
    return;
  }

  await fetch(BASE + "/auto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cookies: COOKIES })
  });

  alert("Auto berjalan di background");
}
