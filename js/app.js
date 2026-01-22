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
