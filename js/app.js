let problemId = null;

// DOM references
const problemIdEl = document.getElementById("problemId");
const problemStatement = document.getElementById("problemStatement");
const problemJustification = document.getElementById("problemJustification");

// Initial UI state
problemIdEl.innerText = "No problem selected";

// Save or update problem
function saveProblem() {

  if (!problemStatement.value.trim()) {
    alert("Please enter a problem statement");
    return;
  }

  // Generate ID only once
  if (!problemId) {
    problemId = "FB-" + Date.now();
    addToProblemIndex(problemId);
  }

  const data = {
    problemId,
    statement: problemStatement.value,
    justification: problemJustification.value,
    createdAt: new Date().toISOString(),
    analysis: loadFromStorage(problemId)?.analysis || {}
  };

  saveToStorage(problemId, data);

  problemIdEl.innerText = "Problem ID: " + problemId;

  if (typeof toast === "function") {
    toast("Problem saved successfully");
  } else {
    alert("Problem saved successfully");
  }

  loadExistingProblems();
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
  problemIdEl.innerText = "Problem ID: " + pid;
  problemStatement.value = data.statement || "";
  problemJustification.value = data.justification || "";
}

// Init
loadExistingProblems();
