const API = "https://auto-feedback-backend.onrender.com/api";

let cookies = [];
let page = 1;
let loading = false;
let hasMore = true;

// =====================
// 🔐 LOGIN
// =====================
async function login() {
  const account = document.getElementById("account").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account, password })
  });

  const data = await res.json();

  if (!data.success) {
    alert("Login gagal");
    return;
  }

  cookies = data.cookies.map(c => c.split(";")[0]);

  document.getElementById("actionBox").classList.remove("hidden");
  alert("Login berhasil");
}

// =====================
// 📋 LOAD TASK (ASYNC)
// =====================
async function loadTasks() {
  page = 1;
  hasMore = true;
  document.getElementById("taskList").innerHTML = "";
  fetchPage();
}

// =====================
// 📄 FETCH PER PAGE
// =====================
async function fetchPage() {
  if (loading || !hasMore) return;

  loading = true;
  document.getElementById("loading").style.display = "block";

  const res = await fetch(API + "/tasks/result?page=" + page, {
    method: "GET"
  });

  const data = await res.json();

  renderSummary(data.summary);

  if (data.data.length === 0) {
    hasMore = false;
  } else {
    renderTasks(data.data);
    page++;
  }

  loading = false;
  document.getElementById("loading").style.display = "none";
}

// =====================
// 🧠 SUMMARY
// =====================
function renderSummary(s) {
  document.getElementById("summaryBox").classList.remove("hidden");

  document.getElementById("summary").innerHTML = `
    Total: ${s.total} |
    ✅ Sudah: ${s.sudahFeedback} |
    ❌ Belum: ${s.belumFeedback} |
    ⏰ Expired: ${s.expired}
  `;
}

// =====================
// 🎯 RENDER TASK
// =====================
function renderTasks(tasks) {
  const list = document.getElementById("taskList");

  tasks.forEach(t => {
    const el = document.createElement("div");
    el.className = "task";

    el.innerHTML = `
      <b>${t.userName}</b><br>
      💰 ${t.formatDebt}<br>
      📅 Sisa: ${t.sisaHari ?? "-"} hari<br>
      📍 ${t.addressBo?.city || "-"}
    `;

    list.appendChild(el);
  });
}

// =====================
// 🔥 AUTO FEEDBACK
// =====================
async function startAuto() {
  await fetch(API + "/auto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cookies })
  });

  alert("Auto jalan di background 🔥");
}

// =====================
// 🔄 INFINITE SCROLL
// =====================
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 50
  ) {
    fetchPage();
  }
});
