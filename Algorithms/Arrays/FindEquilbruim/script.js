let array = [];
let totalSum = 0;
let leftSum = 0;
let rightSum = 0;
let delay = 1000; // Delay in ms for step-by-step animation

const arrayContainer = document.getElementById("array-container");
const equilibriumIndexDisplay = document.getElementById("equilibrium-index");

const leftSumBox = document.getElementById("left-sum");
const rightSumBox = document.getElementById("right-sum");

const resetVisualization = () => {
  arrayContainer.innerHTML = "";
  equilibriumIndexDisplay.textContent = "-";
  leftSumBox.textContent = "Left Sum: -";
  rightSumBox.textContent = "Right Sum: -";
};

// Visualize the array
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

// Highlight the current index being evaluated
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

// Step-by-step update for Equilibrium Index algorithm
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

// Start visualization with real-time interaction
const startVisualization = async () => {
  const input = document.getElementById("array-input").value;
  array = input.split(",").map(Number);

  visualizeArray();

  // Find equilibrium index
  await findEquilibriumIndex();
};

// Event listener for start button
document.getElementById("start-visualization").addEventListener("click", startVisualization);
