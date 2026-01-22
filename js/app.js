let problemId = null;

document.getElementById("problemId").innerText =
  "Problem ID: " + problemId;

function saveProblem() {

  // If new problem, generate ID once
  if (!problemId) {
    problemId = "FB-" + Date.now();
    addToProblemIndex(problemId);
  }

  const data = {
    problemId,
    statement: problemStatement.value,
    justification: problemJustification.value,
    createdAt: new Date().toISOString(),
    analysis: {}
  };

  saveToStorage(problemId, data);
  toast("Problem saved successfully");
}


  saveToStorage(problemId, data);
  alert("Problem saved successfully");
}

function openM(mName) {
  window.location.href = `m-analysis.html?pid=${problemId}&m=${mName}`;
}

function openConsolidated() {
  window.location.href = `consolidated.html?pid=${problemId}`;
}

function openFishbone() {
  window.location.href = `fishbone.html?pid=${problemId}`;
}
function loadExistingProblems() {
  const list = document.getElementById("problemList");
  const index = getProblemIndex();

  if (index.length === 0) {
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
      <button onclick="openProblem('${pid}')">Open</button>
    `;
    list.appendChild(div);
  });
}

function openProblem(pid) {
  const data = loadFromStorage(pid);
  if (!data) return;

  problemId = pid;
  document.getElementById("problemId").innerText = "Problem ID: " + pid;
  problemStatement.value = data.statement || "";
  problemJustification.value = data.justification || "";
}
loadExistingProblems();
