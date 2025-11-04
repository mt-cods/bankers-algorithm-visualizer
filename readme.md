# 💻 Banker's Algorithm Visualizer

An interactive web-based tool that demonstrates **Banker’s Algorithm** for deadlock avoidance in Operating Systems.
The visualization shows how resources are allocated, requested, and released across processes step-by-step using animated transitions.

---

## 🚀 Features

* 🎨 **Interactive Visualization** – Watch resources move between processes dynamically.
* 🧮 **Automatic Safe Sequence Detection** – Runs the Banker’s Algorithm and highlights safe states.
* 🧩 **Matrix-based Input** – Enter **Allocation**, **Maximum**, and **Available** matrices manually or auto-generate examples.
* 🔁 **Step-by-Step Simulation** – Play, pause, or step through each allocation safely.
* 📊 **Clear Visual Cues** – Colors, animations, and matrix updates make each step easy to understand.

---

## 🛠️ Setup Instructions

1. **Download or Clone the Repository**

   ```bash
   git clone https://github.com/your-username/bankers-algorithm-visualizer.git
   cd bankers-algorithm-visualizer
   ```

2. **Run the Application Locally**
   Simply open the file `index.html` in any modern browser (no server setup required).
   ⚠️ Note: Internet connection is required to load Tailwind CSS via CDN.

3. **Folder Structure**

   ```
   bankers-algorithm-visualizer/
   ├── index.html
   ├── README.md
   └── js/
       ├── animation.js
       ├── bankerAlgorithm.js
       ├── main.js
       └── ui.js
   ```

---

## 🧭 User Interface Guide

| Section                | Description                                                                                        |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| **Input Parameters**   | Enter number of processes and resources, then click **Create Matrices**.                           |
| **Matrix Inputs**      | Fill in values for Allocation, Maximum, and Available matrices.                                    |
| **Run Simulation**     | Executes the Banker’s Algorithm and shows whether the system is in a *Safe* or *Unsafe* state.     |
| **Animation Controls** | Use **Play**, **Pause**, **Step Forward**, and **Step Back** to navigate through simulation steps. |
| **Statistics Panel**   | Displays the current step, safe sequence, and system state dynamically.                            |

---

## 🎞️ Animation Features

* **Colored Circles** – Represent instances of each resource type (A, B, C...).
* **Process Boxes** – Show each process and its current resource allocation.
* **Matrix Updates** – Allocation and Need matrices update in real time.
* **Color Codes:**

  * 🟦 Blue → Active Process
  * 🟩 Green → Completed Process
  * 🟧 Orange → Allocation Step
  * 🟥 Red → Unsafe or Blocked State

---

## 🌐 Browser Requirements

| Browser         | Minimum Version |
| --------------- | --------------- |
| Google Chrome   | 100+            |
| Mozilla Firefox | 95+             |
| Microsoft Edge  | 100+            |
| Safari          | 15+             |

> 💡 Works best on desktop browsers for optimal canvas rendering and performance.

---

## 📘 License

This project is open-source and free to use for educational and academic purposes.