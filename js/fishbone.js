const params = new URLSearchParams(window.location.search);
const pid = params.get("pid");
document.getElementById("pid").innerText = "Problem ID: " + pid;

const data = loadFromStorage(pid);
const svg = document.getElementById("fishboneSvg");

// Main spine
drawLine(100, 250, 900, 250);
drawText(910, 255, data.statement, "end");

// M positions
const ms = ["Man", "Machine", "Method", "Material", "Measurement", "Environment"];

ms.forEach((m, i) => {
  const y = i < 3 ? 150 : 350;
  const x = 250 + (i % 3) * 200;

  drawLine(x, y, 500, 250);
  drawText(x - 10, y - 5, m);

  if (data.analysis[m]) {
    data.analysis[m].forEach((p, idx) => {
      if (!p.rootCause) return;
      drawText(x - 10, y + 15 + idx * 14, shortText(p.rootCause));
    });
  }
});

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
  return text.length > 40 ? text.substring(0, 37) + "..." : text;
}

function goBack() {
  window.history.back();
}
