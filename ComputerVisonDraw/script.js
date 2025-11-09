// The link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/kGC0alOa2/";

let model, labelContainer, maxPredictions;
let canvas, ctx;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let predictInProgress = false; // Flag to track if prediction is in progress

/**
 * Loads the image model and initializes the application.
 * Sets up the canvas, event listeners, and label container.
 * @returns {Promise<void>}
 */
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

/**
 * Starts the drawing process on the canvas.
 * @param {MouseEvent} e - The mouse event.
 */
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

/**
 * Draws a line on the canvas based on the mouse movement.
 * @param {MouseEvent} e - The mouse event.
 */
function draw(e) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

/**
 * Ends the drawing process on the canvas.
 */
function endDrawing() {
    isDrawing = false;
}

/**
 * Submits the drawing on the canvas for classification.
 * @returns {Promise<void>}
 */
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

/**
 * Clears the canvas and the prediction results.
 */
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    labelContainer.innerHTML = ""; // Clear previous predictions
}

/**
 * Predicts the class of the drawing on the canvas using the loaded model.
 * @param {HTMLCanvasElement} canvas - The canvas element containing the drawing.
 * @returns {Promise<void>}
 */
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
