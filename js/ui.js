/**
 * ui.js
 * -----
 * Handles user input, matrix generation, and connecting UI with the Banker's Algorithm.
 * Relies on bankerAlgorithm.js for the logic layer.
 */

let banker = null; // Will hold the algorithm instance

// ====== DOM ELEMENTS ======
const numProcInput = document.getElementById("numProcesses");
const numResInput = document.getElementById("numResources");
const matrixContainer = document.getElementById("matrix-inputs");
const runBtn = document.getElementById("runSimulation");
const createBtn = document.getElementById("createMatrices");
const generateExampleBtn = document.getElementById("generateExample");
const safeSeqEl = document.getElementById("safe-sequence");
const stateEl = document.getElementById("system-state");

// ====== EVENT LISTENERS ======
createBtn.addEventListener("click", createMatrices);
generateExampleBtn.addEventListener("click", generateExample);

// ====== FUNCTIONS ======

/**
 * Creates dynamic input matrices for Allocation, Max, and Available.
 */
function createMatrices() {
  const n = parseInt(numProcInput.value);
  const m = parseInt(numResInput.value);

  if (n <= 0 || m <= 0) {
    alert("Please enter valid number of processes and resources!");
    return;
  }

  matrixContainer.innerHTML = "";
  matrixContainer.classList.remove("hidden");

  // Create table section titles
  const titles = ["Allocation", "Maximum", "Available"];
  titles.forEach((title, idx) => {
    const div = document.createElement("div");
    div.className = "mt-4";
    div.innerHTML = `<h3 class="font-semibold text-blue-700 mb-2">${title} Matrix</h3>`;
    div.appendChild(createMatrixTable(title.toLowerCase(), n, m, idx === 2));
    matrixContainer.appendChild(div);
  });
}

/**
 * Helper function to build an editable matrix table.
 */
function createMatrixTable(idPrefix, n, m, isAvailable = false) {
  const table = document.createElement("table");
  table.className = "border-collapse border border-gray-400";

  const tbody = document.createElement("tbody");
  const rows = isAvailable ? 1 : n;

  for (let i = 0; i < rows; i++) {
    const tr = document.createElement("tr");

    for (let j = 0; j < m; j++) {
      const td = document.createElement("td");
      td.className = "border border-gray-300";
      td.innerHTML = `<input type="number" id="${idPrefix}-${i}-${j}" class="w-16 p-1 text-center border border-gray-200" min="0" value="0">`;
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  return table;
}

/**
 * Populates the matrices with a sample dataset.
 */
function generateExample() {
  numProcInput.value = 5;
  numResInput.value = 3;
  createMatrices();

  const allocation = [
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2],
    [2, 1, 1],
    [0, 0, 2]
  ];

  const max = [
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2],
    [2, 2, 2],
    [4, 3, 3]
  ];

  const available = [3, 3, 2];

  fillMatrixInputs("allocation", allocation);
  fillMatrixInputs("maximum", max);
  fillMatrixInputs("available", [available]);
}

/**
 * Helper: fills input fields of a matrix from a 2D array.
 */
function fillMatrixInputs(prefix, data) {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[0].length; j++) {
      const cell = document.getElementById(`${prefix}-${i}-${j}`);
      if (cell) cell.value = data[i][j];
    }
  }
}

/**
 * Helper: reads values from an input matrix into a 2D array.
 */
function readMatrix(prefix, n, m) {
  const matrix = [];
  for (let i = 0; i < n; i++) {
    matrix[i] = [];
    for (let j = 0; j < m; j++) {
      const input = document.getElementById(`${prefix}-${i}-${j}`);
      matrix[i][j] = parseInt(input.value) || 0;
    }
  }
  return matrix;
}
