let problemId = null;

// DOM references
const accountInput = document.getElementById("account");
const monthInput = document.getElementById("month");
const doneByInput = document.getElementById("doneBy");
const accountManagerInput = document.getElementById("accountManager");


// Initial UI state
problemIdEl.innerText = "No problem selected";

// Save or update problem
function saveProblem() {

  if (!problemId) {
    problemId = generateProblemId();
    if (!problemId) return;

    addToProblemIndex(problemId);
  }

  const data = {
    problemId,
    account: accountInput.value,
    month: monthInput.value,
    doneBy: doneByInput.value,
    accountManager: accountManagerInput.value,
    status: "In Progress",
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    analysis: loadFromStorage(problemId)?.analysis || {}
  };

  saveToStorage(problemId, data);
  setActiveProblem(problemId);
  loadExistingProblems();
}


  // Generate ID only once
  if (!problemId) {
 function generateProblemId() {
  const account = accountInput.value.trim().toUpperCase();
  const month = monthInput.value.trim();

  if (!account || !month) {
    alert("Account and Month-Year are required");
    return null;
  }

  return `${account}_${month}`;
}

    addToProblemIndex(problemId);
  }

const data = {
  problemId,
  statement: problemStatement.value,
  justification: problemJustification.value,
  createdAt: data?.createdAt || new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
  status: "In Progress",
  analysis: loadFromStorage(problemId)?.analysis || {}
};

  saveToStorage(problemId, data);

  problemIdEl.innerText = "Problem ID: " + problemId;

  if (typeof toast === "function") {
    toast("Problem saved successfully");
  } else {
    alert("Problem saved successfully");
  }

  div.innerHTML = `
  <strong>${pid}</strong><br>
  <small>${data.statement || "No statement yet"}</small><br>
  <small>Status: <b>${data.status || "Not Started"}</b></small><br>
  <small>Last Updated: ${new Date(data.lastUpdated || data.createdAt).toLocaleString()}</small><br>
  <button class="secondary" onclick="openProblem('${pid}')">Resume</button>
`;
}

// Navigation guards
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
const activePid = getActiveProblem();
if (activePid) {
  openProblem(activePid);
}
// Load existing problems
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
      <small>${data.statement || "No statement yet"}</small><br>
      <button class="secondary" onclick="openProblem('${pid}')">Open</button>
    `;
    list.appendChild(div);
  });
}

// Open existing problem
function openProblem(pid) {
  const data = loadFromStorage(pid);
  if (!data) return;

  problemId = pid;
  setActiveProblem(pid);

  problemIdEl.innerText = "Problem ID: " + pid;
  problemStatement.value = data.statement || "";
  problemJustification.value = data.justification || "";
}

// Init
loadExistingProblems();

function setActiveProblem(pid) {
  localStorage.setItem("activeProblemId", pid);
}

function getActiveProblem() {
  return localStorage.getItem("activeProblemId");
}
function toggleMode() {
  const mode = document.querySelector("input[name='mode']:checked").value;
  document.getElementById("existingSelector").style.display =
    mode === "existing" ? "block" : "none";
}

function loadExistingProblemsIntoDropdown() {
  const dropdown = document.getElementById("existingDropdown");
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
