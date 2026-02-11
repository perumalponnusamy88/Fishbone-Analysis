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
const spineStartX = 150;
const spineEndX = 950;
const spineY = 250;

drawLine(spineStartX, spineY, spineEndX, spineY);
drawText(spineEndX - 10, spineY - 5, data.statement || "Problem Statement", "end");

/***********************
 * M DEFINITIONS
 ***********************/
const ms = ["Man", "Machine", "Method", "Material", "Measurement", "Environment"];

/***********************
 * BONE SETTINGS
 ***********************/
const topY = 130;
const bottomY = 370;

// 3 evenly spaced connection points on spine
const spinePoints = [400, 600, 800];

let hasRootCause = false;

/***********************
 * DRAW BONES
 ***********************/
ms.forEach((m, i) => {

  const isTop = i < 3;
  const index = i % 3;

  const startX = 250 + index * 220;
  const startY = isTop ? topY : bottomY;

  const spineX = spinePoints[index];
  const spineConnectY = spineY;

  // Draw bone line
  drawLine(startX, startY, spineX, spineConnectY);

  // Draw category name
  drawText(startX - 10, startY - 8, m);

  // Draw root causes
  const list = data.analysis[m] || [];
  list.forEach((p, idx) => {
    if (!p.rootCause) return;

    hasRootCause = true;

    const textOffset = isTop ? 18 : -18;
    const rootY = startY + (isTop ? 20 : -20) + idx * (isTop ? 14 : -14);

    drawText(startX - 10, rootY, shortText(p.rootCause));
  });
});

/***********************
 * EMPTY STATE
 ***********************/
if (!hasRootCause) {
  drawText(550, 290, "No root causes identified yet", "middle");
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
  line.setAttribute("stroke-width", "2");
  svg.appendChild(line);
}

function drawText(x, y, text, anchor = "start") {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
  t.setAttribute("x", x);
  t.setAttribute("y", y);
  t.setAttribute("font-size", "12");
  t.setAttribute("text-anchor", anchor);
  t.setAttribute("font-family", "Arial");
  t.textContent = text;
  svg.appendChild(t);
}

function shortText(text) {
  if (!text) return "";
  return text.length > 45 ? text.substring(0, 42) + "..." : text;
}

function goBack() {
  window.history.back();
}
