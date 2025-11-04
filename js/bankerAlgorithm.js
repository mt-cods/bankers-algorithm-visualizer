/**
 * bankerAlgorithm.js
 * -------------------
 * Standalone function to simulate Banker's Algorithm
 * and generate all visualization steps.
 *
 * Author: Your Name
 * Date: Fall Semester 2025-26
 */

function runBankersAlgorithm(allocation, max, available) {
  const numProcesses = allocation.length;
  const numResources = available.length;

  // Deep copies to simulate without mutating originals
  const allocationLocal = JSON.parse(JSON.stringify(allocation));
  const availableLocal = [...available];
  const work = [...availableLocal];
  const needLocal = Array.from({ length: numProcesses }, () =>
    Array(numResources).fill(0)
  );

  const finish = Array(numProcesses).fill(false);
  const safeSeq = [];
  const steps = [];

  // Recompute Need matrix dynamically (zero for finished)
  const recomputeNeed = () => {
    for (let i = 0; i < numProcesses; i++) {
      for (let j = 0; j < numResources; j++) {
        needLocal[i][j] = finish[i] ? 0 : max[i][j] - allocationLocal[i][j];
      }
    }
  };

  recomputeNeed();

  const canExecute = (i) => {
    for (let j = 0; j < numResources; j++) {
      if (needLocal[i][j] > work[j]) return false;
    }
    return !finish[i];
  };

  let madeProgress = true;

  while (safeSeq.length < numProcesses && madeProgress) {
    madeProgress = false;

    for (let i = 0; i < numProcesses; i++) {
      if (!finish[i] && canExecute(i)) {
        // === Before Execution Snapshot ===
        steps.push({
          process: i,
          allocation: JSON.parse(JSON.stringify(allocationLocal)),
          need: JSON.parse(JSON.stringify(needLocal)),
          available: [...availableLocal],
          work: [...work],
          completed: false,
        });

        // Simulate execution (release allocated resources)
        for (let j = 0; j < numResources; j++) {
          work[j] += allocationLocal[i][j];
        }

        finish[i] = true;
        safeSeq.push(i);
        madeProgress = true;

        // Update available and allocation
        const availableAfter = [...availableLocal];
        for (let j = 0; j < numResources; j++) {
          availableAfter[j] += allocationLocal[i][j];
          allocationLocal[i][j] = 0;
        }

        for (let j = 0; j < numResources; j++) {
          availableLocal[j] = availableAfter[j];
        }
        const requested = needLocal[i].slice();
        recomputeNeed();
        
        // === After Execution Snapshot ===
        steps.push({
          process: i,
          allocation: JSON.parse(JSON.stringify(allocationLocal)),
          need: JSON.parse(JSON.stringify(needLocal)),
          requested,
          available: [...availableLocal],
          work: [...work],
          completed: true,
        });
      }
    }
  }

  const safe = safeSeq.length === numProcesses;

  return {
    safe,
    sequence: safeSeq,
    steps,
  };
}

// Export for use in animation.js or main.js
if (typeof module !== "undefined") {
  module.exports = runBankersAlgorithm;
}