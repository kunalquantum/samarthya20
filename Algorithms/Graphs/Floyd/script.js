document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('startButton');
    const pseudocodeContainer = document.getElementById('pseudocode');
    const resultContainer = document.getElementById('result');
    const nodeInput = document.getElementById('node-input');
    const edgeInput = document.getElementById('edge-input');
    const addNodeButton = document.getElementById('add-nodes');
    const addEdgeButton = document.getElementById('add-edges');
    const delay = 1500;

    const nodes = new vis.DataSet([]);
    const edges = new vis.DataSet([]);
    const container = document.getElementById('graph-container');
    const data = { nodes, edges };
    const options = {
        edges: {
            color: '#000000',
            font: {
                align: 'top'
            },
            arrows: 'to'
        },
        nodes: {
            shape: 'circle',
            color: '#FFFFFF',
            font: { size: 18 }
        },
        physics: false
    };

    const network = new vis.Network(container, data, options);

    let graph = [];
    let steps = [];
    let currentStep = 0;

    /**
     * Initializes an empty graph matrix with Infinity for all distances, except for the distance from a node to itself, which is 0.
     */
    function initializeGraph() {
        graph = [];
        nodes.forEach(node => {
            graph.push(new Array(nodes.length).fill(Infinity));
        });
        nodes.forEach((node, index) => {
            graph[index][index] = 0; // Distance to itself is 0
        });
    }

    /**
     * Updates the graph visualization with the new distances from the provided matrix.
     * @param {number[][]} matrix - The distance matrix to use for updating the graph.
     */
    function updateGraph(matrix) {
        edges.forEach(edge => {
            const weight = matrix[edge.from][edge.to];
            edge.label = weight === Infinity ? '∞' : weight;
        });
        network.setData({ nodes, edges });
    }

    /**
     * Updates the pseudocode display to highlight the current step of the algorithm.
     * @param {number} step - The step number to highlight.
     */
    function updatePseudocode(step) {
        const pseudocodeSteps = [
            "1. Initialize the distance matrix from the graph.",
            "2. For each vertex k, check if there's a shorter path from i to j through k.",
            "3. Update the distance matrix if a shorter path is found.",
            "4. Repeat for all vertices.",
            "5. Display the final shortest distance matrix."
        ];

        pseudocodeContainer.innerHTML = pseudocodeSteps
            .map((line, index) => {
                if (index === step) {
                    return `<div class="highlight">${line}</div>`; // Highlight the ongoing step
                } else {
                    return `<div>${line}</div>`;
                }
            })
            .join("");
    }

    /**
     * Performs the Floyd-Warshall algorithm to find the shortest paths between all pairs of nodes in the graph.
     * @returns {Promise<number[][]>} A promise that resolves with the final shortest distance matrix.
     */
    async function floydWarshall() {
        const matrix = graph.map(row => row.slice()); // Copy graph to avoid modifying original
        const n = matrix.length;

        steps = [];

        for (let k = 0; k < n; k++) {
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    // Check for shorter path
                    if (matrix[i][k] + matrix[k][j] < matrix[i][j]) {
                        steps.push({ i, j, k, newDist: matrix[i][k] + matrix[k][j] });
                        matrix[i][j] = matrix[i][k] + matrix[k][j];
                    }
                }
            }
        }

        return matrix;
    }

    /**
     * Displays the final shortest distance matrix in the result container.
     * @param {number[][]} finalMatrix - The final shortest distance matrix to display.
     */
    function showResult(finalMatrix) {
        resultContainer.innerHTML = 'Final Shortest Distance Matrix:<br>';
        let resultText = '';
        finalMatrix.forEach(row => {
            resultText += row.map(val => val === Infinity ? '∞' : val).join(' ') + '<br>';
        });
        resultContainer.innerHTML += resultText;
    }

    /**
     * Steps through the Floyd-Warshall algorithm, animating the changes to the graph and pseudocode at each step.
     * @returns {Promise<void>}
     */
    async function stepThrough() {
        const finalMatrix = await floydWarshall();

        for (let i = 0; i < steps.length; i++) {
            const { i: row, j: col, k, newDist } = steps[i];
            const updatedMatrix = graph.map(row => row.slice());
            updatedMatrix[row][col] = newDist;
            updateGraph(updatedMatrix);
            updatePseudocode(i + 1);
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        showResult(finalMatrix);
    }

    // Add nodes from user input
    addNodeButton.addEventListener('click', function () {
        const nodeNames = nodeInput.value.split(',').map(name => name.trim());
        nodeNames.forEach((name, index) => {
            nodes.add({ id: index, label: name });
        });
        initializeGraph();
    });

    // Add edges from user input
    addEdgeButton.addEventListener('click', function () {
        const edgeData = edgeInput.value.split(',').map(item => item.trim());
        if (edgeData.length === 3) {
            const [node1, node2, weight] = edgeData;
            const node1Index = nodes.getIds().find(id => nodes.get(id).label === node1);
            const node2Index = nodes.getIds().find(id => nodes.get(id).label === node2);
            edges.add({ from: node1Index, to: node2Index, label: weight });
            graph[node1Index][node2Index] = parseInt(weight, 10);
        }
    });

    // Start the visualization
    startButton.addEventListener('click', function () {
        steps = [];
        currentStep = 0;
        stepThrough();
    });
});
