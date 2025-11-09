let array = [];
let totalSum = 0;
let leftSum = 0;
let rightSum = 0;
let delay = 1000; // Delay in ms for step-by-step animation

const arrayContainer = document.getElementById("array-container");
const equilibriumIndexDisplay = document.getElementById("equilibrium-index");

const leftSumBox = document.getElementById("left-sum");
const rightSumBox = document.getElementById("right-sum");

/**
 * Resets the visualization to its initial state, clearing the array container and resetting text content.
 */
const resetVisualization = () => {
  arrayContainer.innerHTML = "";
  equilibriumIndexDisplay.textContent = "-";
  leftSumBox.textContent = "Left Sum: -";
  rightSumBox.textContent = "Right Sum: -";
};

/**
 * Visualizes the array by creating and displaying rectangle elements for each value.
 */
const visualizeArray = () => {
  resetVisualization();
  array.forEach((value, index) => {
    const rect = document.createElement("div");
    rect.className = "rectangle";
    rect.style.height = `${Math.abs(value) * 20}px`;
    rect.textContent = value;
    rect.id = `rect-${index}`;
    arrayContainer.appendChild(rect);
  });
};

/**
 * Highlights the rectangle at the specified index to indicate it's being evaluated.
 * @param {number} index - The index of the rectangle to highlight.
 */
const highlightIndex = (index) => {
  const rects = document.querySelectorAll(".rectangle");
  rects.forEach((rect, i) => {
    if (i === index) {
      rect.classList.add("selected");
    } else {
      rect.classList.remove("selected");
    }
  });
};

/**
 * Finds the equilibrium index of the array in a step-by-step manner, updating the visualization at each step.
 * @returns {Promise<number>} A promise that resolves with the equilibrium index, or -1 if none is found.
 */
const findEquilibriumIndex = () => {
  return new Promise((resolve) => {
    totalSum = array.reduce((acc, num) => acc + num, 0);
    leftSum = 0;
    let rightSum = totalSum;

    // Traverse the array to find the equilibrium index
    for (let i = 0; i < array.length; i++) {
      rightSum -= array[i];

      // Highlight current index being evaluated
      highlightIndex(i);

      leftSumBox.textContent = `Left Sum: ${leftSum}`;
      rightSumBox.textContent = `Right Sum: ${rightSum}`;

      // Check for equilibrium index
      if (leftSum === rightSum) {
        equilibriumIndexDisplay.textContent = i;
        resolve(i);
        return;
      }

      leftSum += array[i];

      setTimeout(() => {
        if (i === array.length - 1) {
          equilibriumIndexDisplay.textContent = "No Equilibrium Index";
          resolve(-1);
        }
      }, delay);
    }
  });
};

/**
 * Starts the visualization process by parsing the input, visualizing the array, and finding the equilibrium index.
 * @returns {Promise<void>}
 */
const startVisualization = async () => {
  const input = document.getElementById("array-input").value;
  array = input.split(",").map(Number);

  visualizeArray();

  // Find equilibrium index
  await findEquilibriumIndex();
};

// Event listener for start button
document.getElementById("start-visualization").addEventListener("click", startVisualization);
