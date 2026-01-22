/***********************
 * URL PARAMS
 ***********************/
const params = new URLSearchParams(window.location.search);
const pid = params.get("pid");

if (!pid) {
  alert("Invalid navigation");
  window.location.href = "index.html";
}

/***********************
 * DOM
 ***********************/
document.getElementById("pid").innerText = "Problem ID: " + pid;
const container = document.getElementById("actionTable");

/***********************
 * DATA LOAD
 ***********************/
const data = loadFromStorage(pid);
if (!data || !data.analysis) {
  container.innerHTML = "<p class='muted'>No analysis data found.</p>";
}

/***********************
 * RENDER TABLE
 ***********************/
function renderTable() {
  let hasData = false;

  let html = `
  <table width="100%">
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
      hasData = true;

      html += `
      <tr>
        <td>${m}</td>
        <td>${p.statement}</td>
        <td>${p.rootCause}</td>
        <td>${p.impact}</td>
        <td>${p.actionPlan?.corrective || ""}</td>
        <td>${p.actionPlan?.preventive || ""}</td>
        <td>${p.actionPlan?.owner || ""}</td>
        <td>${p.actionPlan?.targetDate || ""}</td>
        <td class="status-${p.actionPlan?.status || ""}">
          ${p.actionPlan?.status || ""}
        </td>
      </tr>`;
    });
  }

  html += "</table>";

  if (!hasData) {
    container.innerHTML = "<p class='muted'>No action plans available.</p>";
    return;
  }

  container.innerHTML = html;

  data.status = "Completed";
  data.lastUpdated = new Date().toISOString();
  saveToStorage(pid, data);
}

/***********************
 * FINAL SUMMARY SAVE
 ***********************/
function saveFinal() {
  data.finalSummary = {
    plan: document.getElementById("finalPlan").value,
    challenges: document.getElementById("finalChallenges").value,
    timeline: document.getElementById("finalTimeline").value
  };

  saveToStorage(pid, data);
  alert("Final implementation saved");
}

/***********************
 * INIT
 ***********************/
renderTable();
