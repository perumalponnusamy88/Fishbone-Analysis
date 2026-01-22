/***********************
 * URL PARAMS
 ***********************/
const params = new URLSearchParams(window.location.search);
const pid = params.get("pid");
const m = params.get("m");

if (!pid || !m) {
  alert("Invalid navigation");
  window.location.href = "index.html";
}

/***********************
 * DOM
 ***********************/
const titleEl = document.getElementById("mTitle");
const pidEl = document.getElementById("pid");
const listEl = document.getElementById("problemList");
const inputEl = document.getElementById("subProblem");

titleEl.innerText = `M Analysis: ${m}`;
pidEl.innerText = `Problem ID: ${pid}`;

/***********************
 * DATA LOAD
 ***********************/
const data = loadFromStorage(pid);
if (!data) {
  alert("Problem not found");
  window.location.href = "index.html";
}

data.analysis = data.analysis || {};
data.analysis[m] = data.analysis[m] || [];

/***********************
 * ADD SUB-PROBLEM
 ***********************/
function addSubProblem() {
  const text = inputEl.value.trim();
  if (!text) {
    alert("Enter sub-problem statement");
    return;
  }

  data.analysis[m].push({
    id: "SP-" + Date.now(),
    statement: text,
    fiveWhy: {},
    rootCause: "",
    impact: "",
    actionPlan: {}
  });

  data.status = "In Progress";
  data.lastUpdated = new Date().toISOString();

  saveToStorage(pid, data);
  inputEl.value = "";
  renderList();
}

/***********************
 * RENDER LIST
 ***********************/
function renderList() {
  listEl.innerHTML = "";

  if (!data.analysis[m].length) {
    listEl.innerHTML = "<p class='muted'>No problems added yet.</p>";
    return;
  }

  data.analysis[m].forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <strong>${p.statement}</strong><br>
      <button class="secondary" onclick="openFiveWhy('${p.id}')">
        5 Why Analysis
      </button>
    `;
    listEl.appendChild(div);
  });
}

/***********************
 * NAVIGATION
 ***********************/
function openFiveWhy(subId) {
  window.location.href =
    `five-why.html?pid=${pid}&m=${m}&sid=${subId}`;
}

function goBack() {
  window.location.href = "index.html";
}

/***********************
 * INIT
 ***********************/
renderList();
