/**
 * main.js
 * -------
 * Central controller for the Banker's Algorithm Visualizer.
 * Connects UI, Algorithm, and Animation modules together.
 */

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Banker's Algorithm Visualizer Loaded");
    Animation.init("simulationCanvas"); // Initialize canvas from animation.js
    setupButtons(); // Attach global event listeners
});

/**
 * Sets up all high-level control buttons and app state.
 */
function setupButtons() {
    const runBtn = document.getElementById("runSimulation");
    const resetBtn = document.getElementById("resetForm");
    const exportBtn = document.getElementById("exportScreenshot");

    if (runBtn) {
        runBtn.addEventListener("click", () => {
            // Get matrices from UI (functions from ui.js)
            const n = parseInt(document.getElementById("numProcesses").value);
            const m = parseInt(document.getElementById("numResources").value);

            const allocation = readMatrix("allocation", n, m);
            const max = readMatrix("maximum", n, m);
            const available = readMatrix("available", 1, m)[0];

            // Run Banker’s Algorithm
            const result = runBankersAlgorithm(allocation, max, available);

            // Update system status text
            const stateEl = document.getElementById("system-state");
            const seqEl = document.getElementById("safe-sequence");

            if (result.safe) {console.log();
                stateEl.textContent = "Safe State";
                stateEl.className = "text-green-600 font-semibold";
                seqEl.textContent = result.sequence.map(i => `P${i}`).join(" → ");

                // Load animation data and display first step
                console.log(result.steps);
                Animation.loadSteps(result.steps);
                Animation.showStep(0);

                // Reset current step counter
                document.getElementById("current-step").textContent = `1/${result.steps.length}`;
            } else {
                stateEl.textContent = "Unsafe State";
                stateEl.className = "text-red-600 font-semibold";
                seqEl.textContent = "No Safe Sequence Found";
                Animation.reset();
            }
        });
    }

    // Reset button → clears matrix and canvas
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            document.getElementById("matrix-inputs").innerHTML = "";
            Animation.reset();
            document.getElementById("safe-sequence").textContent = "N/A";
            document.getElementById("system-state").textContent = "Idle";
            document.getElementById("current-step").textContent = "0";
        });
    }

    // Export Screenshot functionality
    if (exportBtn) {
        exportBtn.addEventListener("click", exportCanvasAsImage);
    }
    // === Animation Control Buttons ===
    const playBtn = document.getElementById("playBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const stepForwardBtn = document.getElementById("stepForwardBtn");
    const stepBackBtn = document.getElementById("stepBackBtn");

    let autoPlayInterval = null;
    let playSpeed = 1000; // milliseconds per step

    if (playBtn) {
        playBtn.addEventListener("click", () => {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(() => {
                Animation.nextStep();
                const current = Animation.getCurrentStepIndex();
                if (current === Animation.getTotalSteps() - 1) clearInterval(autoPlayInterval);
            }, playSpeed);
        });
    }

    if (pauseBtn) {
        pauseBtn.addEventListener("click", () => {
            clearInterval(autoPlayInterval);
            console.log("⏸ Animation paused");
        });
    }

    if (stepForwardBtn) {
        stepForwardBtn.addEventListener("click", () => {
            Animation.nextStep();
        });
    }

    if (stepBackBtn) {
        stepBackBtn.addEventListener("click", () => {
            Animation.prevStep();
        });
    }

}