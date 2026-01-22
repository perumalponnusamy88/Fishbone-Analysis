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

/***********************
 * INITIAL UI STATE
 ***********************/
problemIdEl.innerText = "No problem selected";

/***********************
 * HELPERS
 ***********************/
function setActiveProblem(pid) {
  localStorage.setItem("activeProblemId", pid);
}

function getActiveProblem() {
  return localStorage.getItem("activeProblemId");
}

function generateProblemId() {
  const account = accountInput.value.trim().toUpperCase();
  const month = monthInput.value.trim();

  if (!account || !month) {
    alert("Account and Month-Year are required");
    return null;
  }

  return `${account}_${month}`;
}

/***********************
 * SAVE / UPDATE PROBLEM
 ***********************/
function saveProblem() {

  if (!problemId) {
    problemId = generateProblemId();
    if (!problemId) return;
    addToProblemIndex(problemId);
  }

  const existing = loadFromStorage(problemId);

  const data = {
    problemId,
    account: accountInput.value,
    month: monthInput.value,
    doneBy: doneByInput.value,
    accountManager: accountManagerInput.value,
    statement: problemStatement.value,
    justification: problemJustification.value,
    status: existing?.status || "In Progress",
    createdAt: existing?.createdAt || new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    analysis: existing?.analysis || {}
  };

  saveToStorage(problemId, data);
  setActiveProblem(problemId);

  problemIdEl.innerText = "Problem ID: " + problemId;

  loadExistingProblems();
  loadExistingProblemsIntoDropdown();

  if (typeof toast === "function") {
    toast("Problem saved successfully");
  } else {
    alert("Problem saved successfully");
  }
}

/***********************
 * NAVIGATION GUARD
 ***********************/
function ensureProblemSelected() {
  if (!problemId) {
    alert("Please save or open a problem first");
    return false;
  }
  return true;
}

function openM(mName) {
  if (!ensureProblemSelected()) return;
  window.location.href = `m-analysis.html?pid=${problemId}&m=${mName}`;
}

function openConsolidated() {
  if (!ensureProblemSelected()) return;
  window.location.href = `consolidated.html?pid=${problemId}`;
}

function openFishbone() {
  if (!ensureProblemSelected()) return;
  window.location.href = `fishbone.html?pid=${problemId}`;
}

/***********************
 * EXISTING PROBLEMS (CARD LIST)
 ***********************/
function loadExistingProblems() {
  const list = document.getElementById("problemList");
  if (!list) return;

  let index = getProblemIndex();

  // Migration safety
  if (!index.length && typeof rebuildProblemIndex === "function") {
    index = rebuildProblemIndex();
  }

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
      <small>${data.statement || "No statement yet"}</small><br>
      <small>Status: <b>${data.status || "In Progress"}</b></small><br>
      <small>Last Updated: ${new Date(data.lastUpdated).toLocaleString()}</small><br>
      <button class="secondary" onclick="openProblem('${pid}')">Resume</button>
    `;
    list.appendChild(div);
  });
}

/***********************
 * OPEN EXISTING PROBLEM
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
 * NEW vs EXISTING MODE
 ***********************/
function toggleMode() {
  const mode = document.querySelector("input[name='mode']:checked").value;
  document.getElementById("existingSelector").style.display =
    mode === "existing" ? "block" : "none";
}

function loadExistingProblemsIntoDropdown() {
  const dropdown = document.getElementById("existingDropdown");
  if (!dropdown) return;

  const index = getProblemIndex();
  dropdown.innerHTML = "<option value=''>Select...</option>";

  index.forEach(pid => {
    const data = loadFromStorage(pid);
    if (!data) return;

    const option = document.createElement("option");
    option.value = pid;
    option.textContent = `${pid} (${data.status || "In Progress"})`;
    dropdown.appendChild(option);
  });
}

function loadSelectedProblem() {
  const pid = document.getElementById("existingDropdown").value;
  if (!pid) return;
  openProblem(pid);
}

/***********************
 * INIT
 ***********************/
loadExistingProblems();
loadExistingProblemsIntoDropdown();

const activePid = getActiveProblem();
if (activePid) {
  openProblem(activePid);
}
