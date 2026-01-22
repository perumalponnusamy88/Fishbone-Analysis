/***********************
 * GLOBAL STATE
 ***********************/
let problemId = null;

/***********************
 * DOM REFERENCES
 ***********************/
const problemIdEl = document.getElementById("problemId");
const problemStatement = document.getElementById("problemStatement");
const problemJustification = document.getElementById("problemJustification");

const accountInput = document.getElementById("account");
const monthInput = document.getElementById("month");
const doneByInput = document.getElementById("doneBy");
const accountManagerInput = document.getElementById("accountManager");

const existingSelector = document.getElementById("existingSelector");
const existingDropdown = document.getElementById("existingDropdown");

/***********************
 * BASIC HELPERS
 ***********************/
function setActiveProblem(pid) {
  localStorage.setItem("activeProblemId", pid);
}

function getActiveProblem() {
  return localStorage.getItem("activeProblemId");
}

/***********************
 * MODE TOGGLE
 ***********************/
function toggleMode() {
  const mode = document.querySelector("input[name='mode']:checked").value;
  existingSelector.style.display = mode === "existing" ? "block" : "none";
}

/***********************
 * SAVE PROBLEM
 ***********************/
function saveProblem() {
  if (!problemStatement.value.trim()) {
    alert("Please enter a problem statement");
    return;
  }

  if (!problemId) {
    problemId = "FB-" + Date.now();
    addToProblemIndex(problemId);
  }

  const data = {
    problemId,
    account: accountInput.value,
    month: monthInput.value,
    doneBy: doneByInput.value,
    accountManager: accountManagerInput.value,
    statement: problemStatement.value,
    justification: problemJustification.value,
    analysis: loadFromStorage(problemId)?.analysis || {}
  };

  saveToStorage(problemId, data);
  setActiveProblem(problemId);

  problemIdEl.innerText = "Problem ID: " + problemId;

  loadExistingProblems();
  loadExistingProblemsIntoDropdown();
}

/***********************
 * LOAD EXISTING PROBLEMS (CARDS)
 ***********************/
function loadExistingProblems() {
  const list = document.getElementById("problemList");
  const index = getProblemIndex();

  if (!index.length) {
    list.innerHTML = "<p class='muted'>No existing problems</p>";
    return;
  }

  list.innerHTML = "";

  index.forEach(pid => {
    const data = loadFromStorage(pid);
    if (!data) return;

    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <strong>${pid}</strong><br>
      <small>${data.statement || ""}</small><br>
      <button class="secondary" onclick="openProblem('${pid}')">Open</button>
    `;
    list.appendChild(div);
  });
}

/***********************
 * DROPDOWN
 ***********************/
function loadExistingProblemsIntoDropdown() {
  existingDropdown.innerHTML = "<option value=''>Select...</option>";

  getProblemIndex().forEach(pid => {
    const option = document.createElement("option");
    option.value = pid;
    option.textContent = pid;
    existingDropdown.appendChild(option);
  });
}

function loadSelectedProblem() {
  const pid = existingDropdown.value;
  if (!pid) return;
  openProblem(pid);
}

/***********************
 * OPEN PROBLEM
 ***********************/
function openProblem(pid) {
  const data = loadFromStorage(pid);
  if (!data) return;

  problemId = pid;
  setActiveProblem(pid);

  problemIdEl.innerText = "Problem ID: " + pid;

  accountInput.value = data.account || "";
  monthInput.value = data.month || "";
  doneByInput.value = data.doneBy || "";
  accountManagerInput.value = data.accountManager || "";
  problemStatement.value = data.statement || "";
  problemJustification.value = data.justification || "";
}

/***********************
 * NAVIGATION
 ***********************/
function openM(m) {
  if (!problemId) {
    alert("Save or open a problem first");
    return;
  }
  window.location.href = `m-analysis.html?pid=${problemId}&m=${m}`;
}

function openConsolidated() {
  if (!problemId) return alert("Save or open a problem first");
  window.location.href = `consolidated.html?pid=${problemId}`;
}

function openFishbone() {
  if (!problemId) return alert("Save or open a problem first");
  window.location.href = `fishbone.html?pid=${problemId}`;
}

/***********************
 * INIT (ONLY ONCE)
 ***********************/
loadExistingProblems();
loadExistingProblemsIntoDropdown();

const activePid = getActiveProblem();
if (activePid) {
  openProblem(activePid);
}
