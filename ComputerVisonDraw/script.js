// The link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/kGC0alOa2/";

let model, labelContainer, maxPredictions;
let canvas, ctx;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let predictInProgress = false; // Flag to track if prediction is in progress

// Load the image model
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        // load the model and metadata
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    } catch (error) {
        console.error('Error loading model:', error);
        labelContainer.innerHTML = "Failed to load the image model. Please refresh the page to try again.";
        return;
    }

    // Set up the canvas
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    // Set up event listeners for drawing
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endDrawing);

    // Set up the submit button
    const submitBtn = document.getElementById("submit-btn");
    submitBtn.addEventListener("click", submitDrawing);

    // Set up the redraw button
    const redrawBtn = document.getElementById("redraw-btn");
    redrawBtn.addEventListener("click", clearCanvas);

    // Set up the label container
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

// Function to start drawing
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

// Function to draw on canvas
function draw(e) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

// Function to end drawing
function endDrawing() {
    isDrawing = false;
}

// Function to submit drawing for classification
async function submitDrawing() {
    if (predictInProgress) return; // Prevent multiple predictions
    predictInProgress = true;

    try {
        await predict(canvas);
    } catch (error) {
        console.error('Prediction error:', error);
        labelContainer.innerHTML = "Failed to classify the drawing. Please try again.";
    }

    predictInProgress = false;
}

// Function to clear the canvas and redraw
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    labelContainer.innerHTML = ""; // Clear previous predictions
}

// Function to predict image from canvas
async function predict(canvas) {
    const prediction = await model.predict(canvas);
    if (prediction.length > 0) {
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
    } else {
        labelContainer.innerHTML = "No prediction available.";
    }
}

// Initialize the model and canvas when the page loads
window.onload = init;
