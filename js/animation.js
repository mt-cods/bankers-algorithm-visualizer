// animation.js
// ---------------------------------------------
// Displays how the matrices (Allocation, Need, Available, Work, and Instances Held)
// evolve at each step of the Banker's Algorithm, highlighting allocation changes
// and animating released resources moving upward.

const Animation = (() => {
    let canvas, ctx;
    const lineHeight = 22;
    const leftMargin = 20;
    const topMargin = 30;

    let steps = [];
    let currentStep = 0;
    let animating = false;

    const animationDuration = 4000; // ms (smooth 4s animation)
    let prevStep = null, nextStep = null, start = null;

    const clearCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

    const writeText = (text, x, y, color = "black", font = "14px monospace") => {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = "left";
        ctx.fillText(text, x, y);
    };

    // ---------- MATRIX / VECTOR DRAWING ----------
    const drawMatrix = (label, matrix, startX, startY, color = "black", prevMatrix = null) => {
        writeText(label, startX, startY, color, "bold 14px monospace");
        matrix.forEach((row, i) => {
            writeText(
                `P${i}: [${row
                    .map((val, j) => {
                        if (prevMatrix && prevMatrix[i]) {
                            const diff = val - prevMatrix[i][j];
                            if (diff > 0) return `${val}(+${diff})`;
                            if (diff < 0) return `${val}(${diff})`;
                        }
                        return val;
                    })
                    .join(", ")}]`,
                startX + 20,
                startY + (i + 1) * lineHeight,
                "#000"
            );
        });
        return startY + (matrix.length + 1.5) * lineHeight;
    };

    const drawVector = (label, vector, startX, startY, color = "black") => {
        writeText(`${label}: [${vector.join(", ")}]`, startX, startY, color);
        return startY + lineHeight * 1.5;
    };

    // ---------- INSTANCES (PER PROCESS) ----------
    const drawInstancesMatrix = (allocation, startX, startY) => {
        writeText("Instances Held per Process (per Resource)", startX, startY, "#8A2BE2", "bold 14px monospace");

        const circleRadius = 6;
        const spacingX = 20;
        const spacingGroup = 80;
        const rowHeight = lineHeight;
        const resourceColors = ["#4B0082", "#1E90FF", "#28A745", "#FF8C00", "#DC3545"];

        const numResources = allocation[0].length;

        // Draw headers
        let headerX = startX + 80;
        const headerY = startY + rowHeight;
        for (let r = 0; r < numResources; r++) {
            const color = resourceColors[r % resourceColors.length];
            writeText(String.fromCharCode(65 + r), headerX + 10, headerY, color, "bold 13px monospace");
            headerX += spacingGroup;
        }

        // Draw rows
        allocation.forEach((row, i) => {
            const y = startY + (i + 2) * rowHeight;
            writeText(`P${i}:`, startX + 20, y + 4, "#555");
            let x = startX + 80;

            row.forEach((count, rIndex) => {
                const color = resourceColors[rIndex % resourceColors.length];
                for (let k = 0; k < count; k++) {
                    ctx.beginPath();
                    ctx.arc(x + k * spacingX, y, circleRadius, 0, 2 * Math.PI);
                    ctx.fillStyle = color;
                    ctx.fill();
                    ctx.closePath();
                }
                x += spacingGroup;
            });
        });

        return startY + (allocation.length + 2.5) * lineHeight;
    };

    // ---------- INSTANCES (PER RESOURCE) ----------
    const drawInstancesPerResource = (allocation, available, startX, startY) => {
        const circleRadius = 7;
        const spacingX = 20;
        const rowHeight = lineHeight * 1.6;
        const resourceColors = ["#4B0082", "#1E90FF", "#28A745", "#FF8C00", "#DC3545"];

        const numResources = allocation[0].length;
        let y = startY + rowHeight;

        for (let r = 0; r < numResources; r++) {
            const color = resourceColors[r % resourceColors.length];
            const totalAvailable = available[r];
            writeText(`Resource ${String.fromCharCode(65 + r)}:`, startX + 20, y + 4, color, "bold 14px monospace");

            let x = startX + 160;
            for (let k = 0; k < totalAvailable; k++) {
                ctx.beginPath();
                ctx.arc(x + k * spacingX, y, circleRadius, 0, 2 * Math.PI);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.closePath();
            }
            if (totalAvailable === 0) writeText("(none)", x, y + 4, "#999", "italic 12px monospace");
            y += rowHeight;
        }
        return y + 10;
    };

    // ---------- DRAW A STEP ----------
    const drawStep = (stepIndex) => {
        clearCanvas();
        if (stepIndex < 0 || stepIndex >= steps.length) return;
        const step = steps[stepIndex];
        const prev = stepIndex > 0 ? steps[stepIndex - 1] : null;
        let y = topMargin;

        writeText(`Step ${stepIndex + 1}/${steps.length}`, leftMargin, y, "#1E90FF", "bold 16px monospace");
        y += 30;
        // Calculate max requirement = allocation + need
        const allocRow = step.allocation[step.process];
        const needRow = step.need[step.process];
        const maxReq = allocRow.map((a, idx) => a + needRow[idx]);

        writeText(
            `Process Executed: P${step.process} (Max Required: [${maxReq.join(", ")}])`,
            leftMargin,
            y,
            "#28A745"
        );
        y += 25;


        y = drawInstancesMatrix(step.allocation, leftMargin, y + 10);
        y = drawInstancesPerResource(step.allocation, step.available, leftMargin, y + 20);

        const allocationX = leftMargin;
        const needX = leftMargin + 350; // Adjust spacing as needed (depends on column width)
        const matrixY = y;

        drawMatrix("Allocation Matrix", step.allocation, allocationX, matrixY, "#000", prev ? prev.allocation : null);
        drawMatrix("Need Matrix", step.need, needX, matrixY, "#000");

        // After drawing horizontally, increase y to move below both
        y = matrixY + (step.allocation.length + 3) * 25; // Adjust height spacing
        y = drawVector("Available", step.available, leftMargin, y, "#000");
        y = drawVector("Work", step.work, leftMargin, y, "#000");

        if (step.completed)
            writeText(`✅ Process P${step.process} completed and released resources.`, leftMargin, y + 20, "#28A745");
    };

    // ---------- ANIMATION ----------
    const drawAnimatedTransition = (prev, next, t) => {
        const ease = (x) => x; // linear interpolation
        const factor = ease(t);

        const circleRadius = 6;
        const spacingX = 20;
        const spacingGroup = 80;
        const rowHeight = 25;
        const resourceColors = ["#4B0082", "#1E90FF", "#28A745", "#FF8C00", "#DC3545"];

        const numProcesses = prev.allocation.length;
        const numResources = prev.allocation[0].length;

        const processStartY = topMargin;
        const availableStartY = processStartY + (numProcesses + 4) * rowHeight + 60;

        const phase = factor < 0.5 ? "allocate" : "release";
        const localT = phase === "allocate" ? factor * 2 : (factor - 0.5) * 2;

        writeText(
            phase === "allocate"
                ? "Animating Resource Allocation..."
                : "Animating Resource Release...",
            leftMargin,
            topMargin + 20,
            phase === "allocate" ? "#28A745" : "#8A2BE2",
            "bold 15px monospace"
        );

        // 🟣 Draw AVAILABLE section
        for (let r = 0; r < numResources; r++) {
            const color = resourceColors[r % resourceColors.length];
            const labelY = availableStartY + r * (rowHeight * 1.5);

            const prevAvail = prev.available ? prev.available[r] : 0;
            const nextAvail = next.available ? next.available[r] : prevAvail;

            // During allocation, show remaining = prevAvail - need
            const needForActive =
                phase === "allocate" && next.requested
                    ? next.requested[r]
                    : next.requested[r];

            const currentAvail =
                phase === "allocate"
                    ? Math.max(prevAvail - needForActive, 0)
                    : Math.max(prevAvail - needForActive, 0);

            writeText(
                `Resource ${String.fromCharCode(65 + r)}:`,
                leftMargin + 20,
                labelY + 4,
                color,
                "bold 13px monospace"
            );

            let x = leftMargin + 160;
            for (let k = 0; k < currentAvail; k++) {
                ctx.beginPath();
                ctx.arc(x + k * spacingX, labelY, circleRadius, 0, 2 * Math.PI);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.closePath();
            }
        }

        // Draw processes
        prev.allocation.forEach((row, i) => {
            const yProc = processStartY + (i + 2) * rowHeight;
            let x = leftMargin + 80;

            // 🏷️ Draw process label
            writeText(
                `P${i}`,              
                leftMargin + 20,      
                yProc + 4,
                "#000",
                "bold 13px monospace" 
            );


            row.forEach((count, rIndex) => {
                const color = resourceColors[rIndex % resourceColors.length];
                const targetY = availableStartY + rIndex * (rowHeight * 1.5);
                const targetXStart = leftMargin + 180;

                const prevAlloc = prev.allocation[i][rIndex];
                const nextAlloc = next.allocation[i][rIndex];
                const need = prev.need ? prev.need[i][rIndex] : Math.max(nextAlloc - prevAlloc, 0);

                if (i === next.process) {
                    // Allocation phase
                    if (phase === "allocate") {
                        // Draw existing allocations
                        for (let k = 0; k < prevAlloc; k++) {
                            ctx.beginPath();
                            ctx.arc(x + k * spacingX, yProc, circleRadius, 0, 2 * Math.PI);
                            ctx.fillStyle = color;
                            ctx.fill();
                            ctx.closePath();
                        }

                        // Animate new allocations
                        for (let k = 0; k < need; k++) {
                            const startX = targetXStart + k * spacingX;
                            const startY = targetY;
                            const endX = x + (prevAlloc + k) * spacingX;
                            const endY = yProc;

                            const curX = startX + (endX - startX) * localT;
                            const curY = startY - (startY - endY) * localT;

                            ctx.beginPath();
                            ctx.arc(curX, curY, circleRadius, 0, 2 * Math.PI);
                            ctx.fillStyle = color;
                            ctx.fill();
                            ctx.closePath();
                        }
                    }

                    // Release phase
                    if (phase === "release") {
                        // Release phase — move ALL (allocated + need) instances out
                        const maxInstances = prevAlloc + (prev.need ? prev.need[i][rIndex] : 0);

                        for (let k = 0; k < maxInstances; k++) {
                            const startX = x + k * spacingX;
                            const startY = yProc;

                            const requested = next.requested ? next.requested[rIndex] || 0 : 0;
                            const nextAvail = next.available ? next.available[rIndex] : 0;
                            const endX = targetXStart + (nextAvail - requested + k) * spacingX;
                            const endY = targetY;

                            const curX = startX + (endX - startX) * localT;
                            const curY = startY + (endY - startY) * localT;

                            ctx.beginPath();
                            ctx.arc(curX, curY, circleRadius, 0, 2 * Math.PI);
                            ctx.fillStyle = color;
                            ctx.fill();
                            ctx.closePath();
                        }
                    }

                } else {
                    // Unchanged processes
                    const allocCount = next.allocation[i][rIndex];
                    for (let k = 0; k < allocCount; k++) {
                        ctx.beginPath();
                        ctx.arc(x + k * spacingX, yProc, circleRadius, 0, 2 * Math.PI);
                        ctx.fillStyle = color;
                        ctx.fill();
                        ctx.closePath();
                    }
                }

                x += spacingGroup;
            });
        });

        // Resource labels
        for (let r = 0; r < numResources; r++) {
            const color = resourceColors[r % resourceColors.length];
            const labelY = availableStartY + r * (rowHeight * 1.5);
            writeText(
                `Resource ${String.fromCharCode(65 + r)}`,
                leftMargin + 20,
                labelY + 4,
                color,
                "bold 13px monospace"
            );
        }
    };


    // ---------- FRAME LOOP ----------
    const frame = (timestamp) => {
        const elapsed = timestamp - start;
        const t = Math.min(elapsed / animationDuration, 1);
        clearCanvas();

        // During animation, draw only moving dots and static available resources
        if (t < 1) {
            drawAnimatedTransition(prevStep, nextStep, t);
        } else {
            animating = false;
            drawStep(currentStep);
            document.getElementById("current-step").textContent = `${currentStep + 1}/${steps.length}`;
        }


        if (t < 1) {
            requestAnimationFrame(frame);
        } else {
            animating = false;
            drawStep(currentStep);
            document.getElementById("current-step").textContent = `${currentStep + 1}/${steps.length}`;
        }
    };

    const animateTransition = (prev, next) => {
        animating = true;
        prevStep = prev;
        nextStep = next;
        start = performance.now();
        requestAnimationFrame(frame);
    };

    // ---------- PUBLIC API ----------
    return {
        init(canvasId) {
            canvas = document.getElementById(canvasId);
            ctx = canvas.getContext("2d");
            this.reset();
        },
        reset() {
            steps = [];
            currentStep = 0;
            clearCanvas();
            writeText("Awaiting simulation...", 20, 50, "#666");
        },
        loadSteps(simulationSteps) {
            steps = simulationSteps;
            currentStep = 0;
            drawStep(0);
        },
        showStep(index) {
            if (index >= 0 && index < steps.length) {
                const prev = steps[currentStep];
                const next = steps[index];

                if (prev && next.completed && !animating && index > currentStep) {
                    currentStep = index;
                    animateTransition(prev, next);
                } else {
                    currentStep = index;
                    drawStep(currentStep);
                    document.getElementById("current-step").textContent = `${currentStep + 1}/${steps.length}`;
                }
            }
        },
        nextStep() {
            if (currentStep < steps.length - 1 && !animating) this.showStep(currentStep + 1);
        },
        prevStep() {
            if (currentStep > 0 && !animating) this.showStep(currentStep - 1);
        },
        getCurrentStepIndex() {
            return currentStep;
        },
        getTotalSteps() {
            return steps.length;
        }
    };
})();
