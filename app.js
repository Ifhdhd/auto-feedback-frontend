const BASE = "https://auto-feedback-backend.onrender.com";

let cookies = [];

// =====================
// LOGIN
// =====================
async function login() {
  const account = document.getElementById("account").value;
  const password = document.getElementById("password").value;

  const res = await fetch(BASE + "/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account, password })
  });

  const data = await res.json();

  if (data.success) {
    cookies = data.cookies;
    alert("Login berhasil");
  } else {
    alert("Login gagal");
  }
}

// =====================
// LOAD TASK (STEP 1)
// =====================
async function loadTasks() {
  document.getElementById("status").innerText = "Loading tasks...";

  await fetch(BASE + "/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cookies })
  });

  // lanjut polling
  getResult();
}

// =====================
// AMBIL RESULT (STEP 2)
// =====================
async function getResult() {

  let done = false;

  while (!done) {
    const res = await fetch(BASE + "/api/tasks/result");
    const data = await res.json();

    // kalau belum ada data, tunggu
    if (!data.total || data.total === 0) {
      document.getElementById("status").innerText = "Menunggu data...";
      await delay(2000);
      continue;
    }

    // kalau sudah ada
    done = true;

    document.getElementById("status").innerText = "Selesai";
    document.getElementById("total").innerText = "Total: " + data.total;

    renderList(data.data);
  }
}

// =====================
// RENDER DATA
// =====================
function renderList(list) {
  const el = document.getElementById("list");
  el.innerHTML = "";

  list.forEach(item => {
    const div = document.createElement("div");

    div.innerHTML = `
      <hr>
      <b>${item.userName}</b><br>
      HP: ${item.phoneNumber}<br>
      Debt: ${item.formatDebt}<br>
      Status: ${item.feedbackStatus}<br>
      Kota: ${item.addressBo?.city || "-"}
    `;

    el.appendChild(div);
  });
}

// =====================
function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}
