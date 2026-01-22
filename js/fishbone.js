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
const pidEl = document.getElementById("pid");
const svg = document.getElementById("fishboneSvg");

pidEl.innerText = "Problem ID: " + pid;

/***********************
 * DATA LOAD
 ***********************/
const data = loadFromStorage(pid);
if (!data) {
  alert("Problem data not found");
  window.location.href = "index.html";
}

data.analysis = data.analysis || {};

/***********************
 * CLEAR SVG
 ***********************/
svg.innerHTML = "";

/***********************
 * DRAW MAIN SPINE
 ***********************/
drawLine(100, 250, 900, 250);
drawText(890, 245, data.statement || "Problem Statement", "end");

/***********************
 * M DEFINITIONS
 ***********************/
const ms = ["Man", "Machine", "Method", "Material", "Measurement", "Environment"];

let hasRootCause = false;

ms.forEach((m, i) => {
  const y = i < 3 ? 150 : 350;
  const x = 250 + (i % 3) * 200;

  // Bone
  drawLine(x, y, 500, 250);
  drawText(x - 10, y - 8, m);

  // Root causes
  const list = data.analysis[m] || [];
  list.forEach((p, idx) => {
    if (!p.rootCause) return;
    hasRootCause = true;
    drawText(x - 10, y + 15 + idx * 14, shortText(p.rootCause));
  });
});

/***********************
 * EMPTY STATE
 ***********************/
if (!hasRootCause) {
  drawText(500, 280, "No root causes identified yet", "middle");
}

/***********************
 * SVG HELPERS
 ***********************/
function drawLine(x1, y1, x2, y2) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", "#333");
  svg.appendChild(line);
}

function drawText(x, y, text, anchor = "start") {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
  t.setAttribute("x", x);
  t.setAttribute("y", y);
  t.setAttribute("font-size", "12");
  t.setAttribute("text-anchor", anchor);
  t.textContent = text;
  svg.appendChild(t);
}

function shortText(text) {
  if (!text) return "";
  return text.length > 40 ? text.substring(0, 37) + "..." : text;
}

function goBack() {
  window.history.back();
}
