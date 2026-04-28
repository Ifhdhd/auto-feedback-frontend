const BASE = "https://auto-feedback-backend.onrender.com/api";

let cookies = [];

// ======================
// LOGIN
// ======================
async function login() {
  const account = document.getElementById("account").value;
  const password = document.getElementById("password").value;

  setStatus("🔐 Login...");

  try {
    const res = await fetch(BASE + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ account, password })
    });

    const data = await res.json();

    if (!data.success) {
      setStatus("❌ Login gagal");
      return;
    }

    cookies = data.cookies;

    setStatus("✅ Login sukses, klik Load Data");

  } catch (err) {
    setStatus("❌ Error: " + err.message);
  }
}

// ======================
// LOAD TASKS
// ======================
async function loadTasks() {

  if (cookies.length === 0) {
    setStatus("⚠️ Login dulu!");
    return;
  }

  setStatus("📥 Mengambil data...");

  try {
    const res = await fetch(BASE + "/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ cookies })
    });

    const data = await res.json();

    if (!data.success) {
      setStatus("❌ Gagal ambil data");
      return;
    }

    renderTasks(data.data || []);
    setStatus("✅ Total: " + data.total);

  } catch (err) {
    setStatus("❌ Error: " + err.message);
  }
}

// ======================
// AUTO FEEDBACK
// ======================
async function autoFeedback() {

  if (cookies.length === 0) {
    setStatus("⚠️ Login dulu!");
    return;
  }

  setStatus("⚡ Menjalankan auto...");

  await fetch(BASE + "/auto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ cookies })
  });

  setStatus("🚀 Auto berjalan di background");
}

// ======================
// RENDER DATA
// ======================
function renderTasks(tasks) {
  const el = document.getElementById("taskList");

  if (!tasks.length) {
    el.innerHTML = "<p>Tidak ada data</p>";
    return;
  }

  el.innerHTML = tasks.map(t => `
    <div class="task">
      <b>${t.userName || "-"}</b><br>
      ID: ${t.id}<br>
      Debt: ${t.formatDebt}<br>
      DPD: ${t.dpd}<br>
      📍 ${t.addressBo?.city || "-"}
    </div>
  `).join("");
}

// ======================
// STATUS
// ======================
function setStatus(text) {
  document.getElementById("status").innerText = text;
}
