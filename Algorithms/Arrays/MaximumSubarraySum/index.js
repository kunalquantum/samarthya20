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

// Reset the visualization
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

// Highlight the subarray
const highlightSubarray = (start, end, className) => {
  document.querySelectorAll(".rectangle").forEach(rect => rect.classList.remove("subarray", "current", "max"));
  for (let i = start; i <= end; i++) {
    document.getElementById(`rect-${i}`).classList.add(className);
  }
};

// Update feedback
const updateFeedback = (currentElement) => {
  currentElementSpan.textContent = currentElement;
  currentMaxSpan.textContent = currentMax;
  maxSoFarSpan.textContent = maxSoFar;
  subarrayIndicesSpan.textContent = `[${start}, ${end}]`;
};

// Visualize the array
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

// Handle the next step
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
