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
  alert("Consolidated Action Plan – Phase 2");
}

function openFishbone() {
  alert("Fishbone Diagram – Phase 2");
}
function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.innerText = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}
