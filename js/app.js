const problemId = "FB-" + Date.now();

document.getElementById("problemId").innerText =
  "Problem ID: " + problemId;

function saveProblem() {
  const data = {
    problemId,
    statement: document.getElementById("problemStatement").value,
    justification: document.getElementById("problemJustification").value,
    createdAt: new Date().toISOString(),
    analysis: {}
  };

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
