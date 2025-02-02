let array = [];
let leaders = [];
let delay = 1500; // Delay in ms for a slower, deliberate step-by-step animation

const arrayContainer = document.getElementById("array-container");
const leadersDisplay = document.getElementById("leaders");
const pseudocodeDisplay = document.getElementById("pseudocode");

const resetVisualization = () => {
  arrayContainer.innerHTML = "";
  leadersDisplay.textContent = "-";
  leaders = [];
  pseudocodeDisplay.textContent = "";
};

// Visualize the array as bars
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

// Highlight the current element being processed
const highlightElement = (index) => {
  const rects = document.querySelectorAll(".rectangle");
  rects.forEach((rect, i) => {
    if (i === index) {
      rect.classList.add("selected");
    } else {
      rect.classList.remove("selected");
    }
  });
};

// Show current step in pseudocode
const displayPseudocode = (step) => {
  const pseudocodeSteps = [
    `1. Initialize max_right = -∞`,
    `2. Traverse the array from right to left`,
    `3. For each element arr[i], check if arr[i] >= max_right`,
    `4. If true, mark arr[i] as a leader and update max_right`,
    `5. After traversal, print the leaders`
  ];

  pseudocodeDisplay.textContent = pseudocodeSteps[step];
};

// Step-by-step update for Leaders in Array
const findLeaders = () => {
  return new Promise((resolve) => {
    let max_right = -Infinity; // Step 1: Initialize max_right as -∞
    displayPseudocode(0);

    // Traverse the array from right to left
    for (let i = array.length - 1; i >= 0; i--) {
      highlightElement(i); // Step 2: Highlight current element being processed
      displayPseudocode(1);

      setTimeout(() => {
        // Step 3: Check if the current element is a leader
        if (array[i] >= max_right) {
          leaders.push(array[i]); // Step 4: Mark it as a leader
          max_right = array[i]; // Step 4: Update max_right to the current element
          displayPseudocode(2); // Show pseudocode for checking
        }

        // After each iteration, check if it's the last element
        setTimeout(() => {
          if (i === 0) {
            leaders.reverse(); // Step 5: Reverse the leaders to show them in left-to-right order
            leadersDisplay.textContent = leaders.join(", ");
            displayPseudocode(4); // Final pseudocode step after all iterations
            resolve();
          }
        }, delay);
      }, delay);
    }
  });
};

// Start visualization with real-time interaction
const startVisualization = async () => {
  const input = document.getElementById("array-input").value;
  array = input.split(",").map(Number); // Parse input into array

  visualizeArray(); // Step 1: Visualize the array
  displayPseudocode(0); // Show initial pseudocode for initialization

  // Step 2: Start finding leaders
  await findLeaders();
};

// Event listener for start button
document.getElementById("start-visualization").addEventListener("click", startVisualization);
