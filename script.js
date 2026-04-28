body {
  font-family: Arial;
  background: #020617;
  color: white;
}

.container {
  width: 95%;
  margin: auto;
}

.card {
  background: #0f172a;
  padding: 20px;
  border-radius: 12px;
}

input {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border-radius: 6px;
  border: none;
}

button {
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #22c55e;
  color: black;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.summary {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

.box {
  padding: 10px;
  border-radius: 8px;
}

.total { background: #3b82f6; }
.done { background: #22c55e; }
.pending { background: #eab308; }
.expired { background: #ef4444; }

table {
  width: 100%;
  margin-top: 15px;
  border-collapse: collapse;
}

td, th {
  padding: 10px;
  border-bottom: 1px solid #1e293b;
}

.status-done { color: #22c55e; }
.status-pending { color: #eab308; }
.status-expired { color: #ef4444; }

/* 🔔 hampir expired */
.warning {
  background: rgba(255, 0, 0, 0.2);
}
