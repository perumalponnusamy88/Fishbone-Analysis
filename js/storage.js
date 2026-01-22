/*************************
 * BASIC STORAGE
 *************************/
function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadFromStorage(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

/*************************
 * PROBLEM INDEX
 *************************/
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

/*************************
 * MIGRATION / RECOVERY
 * (Very important)
 *************************/
function rebuildProblemIndex() {
  const index = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    // Accept old FB-* IDs and new ACCOUNT_MM-YY IDs
    if (key && (key.startsWith("FB-") || key.includes("_"))) {
      index.push(key);
    }
  }

  localStorage.setItem("problemIndex", JSON.stringify(index));
  return index;
}
