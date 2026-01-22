function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadFromStorage(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}
function getProblemIndex() {
  return JSON.parse(localStorage.getItem("problemIndex") || "[]");
}

function addToProblemIndex(pid) {
  const index = getProblemIndex();
  if (!index.includes(pid)) {
    index.push(pid);
    localStorage.setItem("problemIndex", JSON.stringify(index));
  }
}
