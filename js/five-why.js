const params = new URLSearchParams(window.location.search);
const pid = params.get("pid");
const m = params.get("m");
const sid = params.get("sid");

const data = loadFromStorage(pid);
const problem = data.analysis[m].find(p => p.id === sid);

document.getElementById("problemText").innerText =
  problem.statement;

function saveFiveWhy() {
  problem.fiveWhy = {
    w1: w1.value,
    w2: w2.value,
    w3: w3.value,
    w4: w4.value,
    w5: w5.value
  };

  problem.rootCause = rootCause.value;
  problem.impact = impact.value;

  saveToStorage(pid, data);
  alert("5 Why saved");
}

function goBack() {
  window.history.back();
}
