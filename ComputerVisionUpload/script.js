// The link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/kGC0alOa2/"; // Replace with your model's link

let model, labelContainer, maxPredictions;

/**
 * Loads the image model and initializes the application.
 * Sets up the file input and label container.
 * @returns {Promise<void>}
 */
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Set up the file input
    const fileUpload = document.getElementById("file-upload");
    fileUpload.addEventListener("change", handleFileUpload);

    // Set up the label container
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

/**
 * Handles the file upload event.
 * Reads the uploaded image file, displays it, and triggers the prediction.
 * @param {Event} event - The file upload event.
 */
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const image = new Image();
            image.src = e.target.result;
            image.onload = function () {
                // Display the uploaded image
                const imageContainer = document.getElementById("image-container");
                imageContainer.innerHTML = `<img src="${image.src}" alt="Uploaded Image" class="animate__animated animate__fadeIn" />`;

                // Predict the image
                predict(image);
            };
        };
        reader.readAsDataURL(file);
    }
}

/**
 * Runs the uploaded image through the image model to get predictions.
 * Updates the label container with the prediction results.
 * @param {HTMLImageElement} image - The image to be classified.
 * @returns {Promise<void>}
 */
async function predict(image) {
    // predict can take in an image, video, or canvas HTML element
    const prediction = await model.predict(image);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

// Initialize the model when the page loads
window.onload = init;
