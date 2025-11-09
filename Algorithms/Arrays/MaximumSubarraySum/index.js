let array = [];
let step = 0;
let currentMax = 0;
let maxSoFar = -Infinity;
let start = 0, end = 0, tempStart = 0;

const arrayContainer = document.getElementById("array-container");
const currentElementSpan = document.getElementById("current-element");
const currentMaxSpan = document.getElementById("current-max");
const maxSoFarSpan = document.getElementById("max-so-far");
const subarrayIndicesSpan = document.getElementById("subarray-indices");

/**
 * Resets the visualization to its initial state, clearing the array container and resetting text content.
 */
const resetVisualization = () => {
  step = 0;
  currentMax = 0;
  maxSoFar = -Infinity;
  start = end = tempStart = 0;
  arrayContainer.innerHTML = "";
  currentElementSpan.textContent = "-";
  currentMaxSpan.textContent = "-";
  maxSoFarSpan.textContent = "-";
  subarrayIndicesSpan.textContent = "-";
};

/**
 * Highlights a subarray of rectangles in the visualization.
 * @param {number} start - The starting index of the subarray to highlight.
 * @param {number} end - The ending index of the subarray to highlight.
 * @param {string} className - The CSS class to apply to the highlighted rectangles.
 */
const highlightSubarray = (start, end, className) => {
  document.querySelectorAll(".rectangle").forEach(rect => rect.classList.remove("subarray", "current", "max"));
  for (let i = start; i <= end; i++) {
    document.getElementById(`rect-${i}`).classList.add(className);
  }
};

/**
 * Updates the feedback display with the current state of the algorithm.
 * @param {number} currentElement - The current element being processed.
 */
const updateFeedback = (currentElement) => {
  currentElementSpan.textContent = currentElement;
  currentMaxSpan.textContent = currentMax;
  maxSoFarSpan.textContent = maxSoFar;
  subarrayIndicesSpan.textContent = `[${start}, ${end}]`;
};

/**
 * Visualizes the array by creating and displaying rectangle elements for each value.
 */
const visualizeArray = () => {
  arrayContainer.innerHTML = "";
  array.forEach((value, index) => {
    const rect = document.createElement("div");
    rect.className = "rectangle";
    rect.textContent = value;
    rect.id = `rect-${index}`;
    arrayContainer.appendChild(rect);
  });
};

/**
 * Executes the next step of Kadane's algorithm to find the maximum subarray sum.
 */
const nextStep = () => {
  if (step >= array.length) return;

  const currentElement = array[step];
  if (currentMax + currentElement > currentElement) {
    currentMax += currentElement;
  } else {
    currentMax = currentElement;
    tempStart = step;
  }

  if (currentMax > maxSoFar) {
    maxSoFar = currentMax;
    start = tempStart;
    end = step;
  }

  highlightSubarray(start, end, "max");
  document.getElementById(`rect-${step}`).classList.add("current");
  updateFeedback(currentElement);

  step++;
};

// Handle user input
document.getElementById("start-visualization").addEventListener("click", () => {
  const input = document.getElementById("array-input").value;
  array = input.split(",").map(Number);
  resetVisualization();
  visualizeArray();
});

document.getElementById("next-step").addEventListener("click", nextStep);
document.getElementById("reset").addEventListener("click", resetVisualization);
