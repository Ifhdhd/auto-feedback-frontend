let cookies = [];
let page = 1;
let loading = false;
let finished = false;

// =======================
// 🔐 LOGIN
// =======================
async function login() {
  console.log("LOGIN DIKLIK");

  const account = document.getElementById("account").value;
  const password = document.getElementById("password").value;

  if (!account || !password) {
    alert("Isi dulu!");
    return;
  }

  try {
    const res = await fetch("https://auto-feedback-backend.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ account, password })
    });

    const data = await res.json();
    console.log(data);

    if (!data.success) {
      alert("Login gagal");
      return;
    }

    cookies = data.cookies;

    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");

    loadTasks(); // 🔥 auto load

  } catch (err) {
    alert("Error: " + err.message);
  }
}

// =======================
// 📋 LOAD TASKS (SCROLL)
// =======================
async function loadTasks() {
  if (loading || finished) return;

  loading = true;
  document.getElementById("loading").classList.remove("hidden");

  try {
    const res = await fetch("https://auto-feedback-backend.onrender.com/api/tasks", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ cookies })
    });

    const data = await res.json();
    console.log("TASK:", data);

    if (!data.success) return;

    renderSummary(data.summary);
    renderTasks(data.data);

    if (data.data.length === 0) finished = true;

  } catch (err) {
    console.log(err);
  }

  loading = false;
  document.getElementById("loading").classList.add("hidden");
}

// =======================
// 📊 SUMMARY
// =======================
function renderSummary(s) {
  document.getElementById("summary").innerHTML = `
    Total: ${s.total} |
    ✅ Sudah: ${s.sudahFeedback} |
    ❌ Belum: ${s.belumFeedback} |
    ⏰ Expired: ${s.expired}
  `;
}

// =======================
// 📦 RENDER TASK
// =======================
function renderTasks(tasks) {
  const el = document.getElementById("taskList");

  tasks.forEach(t => {
    const div = document.createElement("div");
    div.className = "task";

    div.innerHTML = `
      <b>${t.userName}</b><br>
      📞 ${t.phoneNumber}<br>
      💰 ${t.formatDebt}<br>
      ⏳ Sisa: ${t.sisaHari || "-"} hari
    `;

    el.appendChild(div);
  });
}

// =======================
// 🔥 AUTO FEEDBACK
// =======================
async function startAuto() {
  if (!cookies.length) {
    alert("Login dulu!");
    return;
  }

  alert("Auto berjalan di backend...");

  fetch("https://auto-feedback-backend.onrender.com/api/auto", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ cookies })
  });
}

// =======================
// 🔄 INFINITE SCROLL
// =======================
window.addEventListener("scroll", () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
    loadTasks();
  }
});
