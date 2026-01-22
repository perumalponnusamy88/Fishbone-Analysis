const params = new URLSearchParams(window.location.search);
const pid = params.get("pid");
const m = params.get("m");

document.getElementById("mTitle").innerText = `M Analysis: ${m}`;
document.getElementById("pid").innerText = `Problem ID: ${pid}`;

const data = loadFromStorage(pid);
if (!data.analysis[m]) data.analysis[m] = [];

function addSubProblem() {
  const text = document.getElementById("subProblem").value.trim();
  if (!text) return alert("Enter problem");

  const problem = {
    id: "SP-" + Date.now(),
    statement: text,
    fiveWhy: {},
    rootCause: "",
    impact: "",
    actionPlan: {}
  };

  data.analysis[m].push(problem);
  saveToStorage(pid, data);
  document.getElementById("subProblem").value = "";
  renderList();
}

function renderList() {
  const container = document.getElementById("problemList");
  container.innerHTML = "";

  data.analysis[m].forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <strong>${p.statement}</strong><br>
      <button onclick="openFiveWhy('${p.id}')">5 Why Analysis</button>
    `;
    container.appendChild(div);
  });
}

function openFiveWhy(subId) {
  window.location.href =
    `five-why.html?pid=${pid}&m=${m}&sid=${subId}`;
}

function goBack() {
  window.location.href = "index.html";
}

renderList();
