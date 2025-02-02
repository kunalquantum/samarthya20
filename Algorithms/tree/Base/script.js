// Select Elements
const treeInput = document.getElementById("tree-input");
const generateTreeBtn = document.getElementById("generate-tree");
const treeVisualization = document.getElementById("tree-visualization");
const prevStepBtn = document.getElementById("prev-step");
const nextStepBtn = document.getElementById("next-step");
const startVisualizationBtn = document.getElementById("start-visualization");

// Globals for Step Management
let steps = [];
let currentStep = 0;

// Generate Tree from Input
generateTreeBtn.addEventListener("click", () => {
    const input = treeInput.value.trim();
    if (!input) {
        alert("Please enter a valid input!");
        return;
    }

    const nodes = input.split(",").map(item => item.trim());
    const root = buildTree(nodes);
    visualizeTree(root);
    generateSteps(root);
});

// Build Tree from Input Array
function buildTree(nodes) {
    if (nodes.length === 0) return null;

    const root = { value: nodes[0], left: null, right: null };
    const queue = [root];
    let i = 1;

    while (i < nodes.length) {
        const current = queue.shift();

        if (nodes[i] !== "null") {
            current.left = { value: nodes[i], left: null, right: null };
            queue.push(current.left);
        }
        i++;

        if (i < nodes.length && nodes[i] !== "null") {
            current.right = { value: nodes[i], left: null, right: null };
            queue.push(current.right);
        }
        i++;
    }

    return root;
}

// Visualize Tree
function visualizeTree(root) {
    treeVisualization.innerHTML = ""; // Clear Previous Tree
    const treeData = [];
    createTreeData(root, 0, 0, treeData);
    const maxDepth = treeData.reduce((acc, node) => Math.max(acc, node.depth), 0);
    const unit = 80;

    treeData.forEach(node => {
        const div = document.createElement("div");
        div.className = "node";
        div.textContent = node.value;
        div.style.top = `${node.depth * unit}px`;
        div.style.left = `${50 + node.position * unit * (maxDepth - node.depth + 1)}px`;
        treeVisualization.appendChild(div);

        if (node.parent) {
            const line = document.createElement("div");
            line.className = "connector";
            const x1 = parseFloat(div.style.left) + 20;
            const y1 = parseFloat(div.style.top) + 20;
            const x2 = parseFloat(node.parent.style.left) + 20;
            const y2 = parseFloat(node.parent.style.top) + 20;

            const dx = x2 - x1;
            const dy = y2 - y1;
            const length = Math.sqrt(dx * dx + dy * dy);

            line.style.height = `${length}px`;
            line.style.left = `${x1}px`;
            line.style.top = `${y1}px`;
            line.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;

            treeVisualization.appendChild(line);
        }
    });
}

// Create Tree Data for Visualization
function createTreeData(node, depth, position, treeData, parentNode = null) {
    if (!node) return;

    const treeNode = { value: node.value, depth, position, parent: parentNode };
    treeData.push(treeNode);

    createTreeData(node.left, depth + 1, position - 1, treeData, treeNode);
    createTreeData(node.right, depth + 1, position + 1, treeData, treeNode);
}

// Generate Steps for Visualization
function generateSteps(root) {
    steps = [];
    currentStep = 0;

    function traverse(node) {
        if (!node) return;
        steps.push(node);
        traverse(node.left);
        traverse(node.right);
    }

    traverse(root);
    highlightStep();
}

// Highlight Current Step
function highlightStep() {
    const nodes = document.querySelectorAll(".node");
    nodes.forEach(node => node.classList.remove("highlight"));

    if (steps[currentStep]) {
        const currentNode = [...nodes].find(node => node.textContent === steps[currentStep].value);
        if (currentNode) currentNode.classList.add("highlight");
    }
}

// Control Button Handlers
prevStepBtn.addEventListener("click", () => {
    if (currentStep > 0) {
        currentStep--;
        highlightStep();
    }
});

nextStepBtn.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
        currentStep++;
        highlightStep();
    }
});

startVisualizationBtn.addEventListener("click", () => {
    currentStep = 0;
    const interval = setInterval(() => {
        if (currentStep >= steps.length - 1) {
            clearInterval(interval);
        }
        highlightStep();
        currentStep++;
    }, 1000);
});
