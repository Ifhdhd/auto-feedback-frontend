const API = "http://localhost:3000/api";

let cookies = [];

// LOGIN
async function login() {
  const account = document.getElementById("account").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ account, password })
  });

  const data = await res.json();

  if (!data.success) {
    alert("Login gagal");
    return;
  }

  cookies = data.cookies;

  alert("Login berhasil 🔥");

  loadTasks();
}

// LOAD TASK
async function loadTasks() {
  const res = await fetch(API + "/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ cookies })
  });

  const data = await res.json();

  renderTasks(data.data);
}

// AUTO
async function runAuto() {
  await fetch(API + "/auto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ cookies })
  });

  alert("Auto berjalan di background 🚀");
}

// RENDER
function renderTasks(tasks) {
  const container = document.getElementById("tasks");
  container.innerHTML = "";

  let done = 0;
  let pending = 0;

  tasks.forEach(t => {
    const isDone = t.status !== 2;

    if (isDone) done++;
    else pending++;

    const div = document.createElement("div");

    div.innerHTML = `
      <b>${t.userName}</b><br/>
      Debt: ${t.formatDebt}<br/>
      DPD: ${t.dpd}<br/>
      Status: ${isDone ? "✅ Done" : "❌ Pending"}
      <hr/>
    `;

    container.appendChild(div);
  });

  document.getElementById("summary").innerHTML =
    `Total: ${tasks.length} | Done: ${done} | Pending: ${pending}`;
}
