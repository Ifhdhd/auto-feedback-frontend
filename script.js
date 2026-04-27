function log(text) {
    const logBox = document.getElementById("log");
    logBox.innerText += text + "\n";
    logBox.scrollTop = logBox.scrollHeight;
}

function setStatus(text) {
    document.getElementById("status").innerText = text;
}

function runBot() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    setStatus("Running...");
    log("Login...");

    fetch("http://127.0.0.1:5000/run", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        log("Selesai!");
        log(JSON.stringify(data, null, 2));
        setStatus("Done ✅");
    })
    .catch(err => {
        log("Error: " + err);
        setStatus("Error ❌");
    });
}
