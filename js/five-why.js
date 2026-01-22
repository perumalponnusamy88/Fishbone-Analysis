/***********************
 * URL PARAMS
 ***********************/
const params = new URLSearchParams(window.location.search);
const pid = params.get("pid");
const m = params.get("m");
const sid = params.get("sid");

if (!pid || !m || !sid) {
  alert("Invalid navigation");
  window.history.back();
}

/***********************
 * DATA LOAD
 ***********************/
const data = loadFromStorage(pid);
if (!data || !data.analysis || !data.analysis[m]) {
  alert("Analysis data not found");
  window.history.back();
}

const problem = data.analysis[m].find(p => p.id === sid);
if (!problem) {
  alert("Sub-problem not found");
  window.history.back();
}

/***********************
 * DOM
 ***********************/
document.getElementById("problemText").innerText = problem.statement;

/***********************
 * SAVE 5 WHY
 ***********************/
function saveFiveWhy() {

  problem.fiveWhy = {
    w1: document.getElementById("w1").value,
    w2: document.getElementById("w2").value,
    w3: document.getElementById("w3").value,
    w4: document.getElementById("w4").value,
    w5: document.getElementById("w5").value
  };

  problem.rootCause = document.getElementById("rootCause").value;
  problem.impact = document.getElementById("impact").value;

  problem.actionPlan = {
    corrective: document.getElementById("corrective").value,
    preventive: document.getElementById("preventive").value,
    owner: document.getElementById("owner").value,
    targetDate: document.getElementById("targetDate").value,
    challenges: document.getElementById("challenges").value,
    status: document.getElementById("status").value
  };

  data.status = "In Progress";
  data.lastUpdated = new Date().toISOString();

  saveToStorage(pid, data);
  alert("5 Why analysis saved");
}

function goBack() {
  window.history.back();
}
