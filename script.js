const BASE_URL = "http://localhost:3000/api";

let TOKEN = localStorage.getItem("token");

// =====================
// 🔐 LOGIN
// =====================
async function login() {
  const account = document.getElementById("account").value;
  const password = document.getElementById("password").value;

  const res = await fetch(BASE_URL + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ account, password })
  });

  const result = await res.json();

  if (result.success) {
    TOKEN = result.token;
    localStorage.setItem("token", TOKEN);

    alert("Login sukses ✅");
  } else {
    alert("Login gagal ❌");
  }
}

// =====================
// 📋 LOAD TASKS
// =====================
async function loadTasks() {
  if (!TOKEN) {
    alert("Login dulu!");
    return;
  }

  const res = await fetch(BASE_URL + "/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ token: TOKEN })
  });

  const result = await res.json();

  if (!result.success) {
    alert("Session expired, login ulang");
    return;
  }

  renderTasks(result.data);
}

// =====================
// 🔥 AUTO
// =====================
async function runAuto() {
  if (!TOKEN) {
    alert("Login dulu!");
    return;
  }

  await fetch(BASE_URL + "/auto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ token: TOKEN })
  });

  alert("Auto jalan di background 🚀");
}

// =====================
// 🎨 RENDER TABLE
// =====================
function renderTasks(tasks) {
  const table = document.getElementById("taskTable");
  const summary = document.getElementById("summary");

  table.innerHTML = "";

  let done = 0;
  let pending = 0;

  tasks.forEach(t => {
    const isDone = t.promiseStatus === 1; // asumsi ini tanda sudah feedback

    if (isDone) done++;
    else pending++;

    const row = `
      <tr>
        <td>${t.id}</td>
        <td>${t.userName}</td>
        <td>${t.dpd}</td>
        <td>${t.formatDebt}</td>
        <td class="${isDone ? "success" : "pending"}">
          ${isDone ? "DONE" : "PENDING"}
        </td>
      </tr>
    `;

    table.innerHTML += row;
  });

  summary.innerHTML = `
    Total: ${tasks.length} |
    ✅ Done: ${done} |
    ⏳ Pending: ${pending}
  `;
}
