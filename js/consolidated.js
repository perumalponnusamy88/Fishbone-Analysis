const params = new URLSearchParams(window.location.search);
const pid = params.get("pid");

document.getElementById("pid").innerText = "Problem ID: " + pid;

const data = loadFromStorage(pid);
const container = document.getElementById("actionTable");

function renderTable() {
  let html = `
  <table border="1" width="100%">
    <tr>
      <th>M</th>
      <th>Problem</th>
      <th>Root Cause</th>
      <th>Impact %</th>
      <th>Corrective</th>
      <th>Preventive</th>
      <th>Owner</th>
      <th>Target</th>
      <th>Status</th>
    </tr>`;

  for (const m in data.analysis) {
    data.analysis[m].forEach(p => {
      if (!p.rootCause) return;

      html += `
      <tr>
        <td>${m}</td>
        <td>${p.statement}</td>
        <td>${p.rootCause}</td>
        <td>${p.impact}</td>
        <td>${p.actionPlan.corrective}</td>
        <td>${p.actionPlan.preventive}</td>
        <td>${p.actionPlan.owner}</td>
        <td>${p.actionPlan.targetDate}</td>
        <td class="status-${p.actionPlan.status}">${p.actionPlan.status}</td>
      </tr>`;
    });
  }

  html += "</table>";
  container.innerHTML = html;
}

function saveFinal() {
  data.finalSummary = {
    plan: finalPlan.value,
    challenges: finalChallenges.value,
    timeline: finalTimeline.value
  };

  saveToStorage(pid, data);
  alert("Final implementation saved");
}

renderTable();
