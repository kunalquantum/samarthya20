let array = [];
let totalWater = 0;
let delay = 1000; // Delay in ms for step-by-step animation

const arrayContainer = document.getElementById("array-container");
const totalWaterTrapped = document.getElementById("total-water-trapped");

const leftMaxBox = document.getElementById("left-max");
const rightMaxBox = document.getElementById("right-max");
const waterTrappedBox = document.getElementById("water-trapped");

const resetVisualization = () => {
  arrayContainer.innerHTML = "";
  totalWaterTrapped.textContent = "-";
  leftMaxBox.textContent = "Left Max: -";
  rightMaxBox.textContent = "Right Max: -";
  waterTrappedBox.textContent = "Water Trapped: -";
};

// Visualize the array
const visualizeArray = () => {
  resetVisualization();
  array.forEach(value => {
    const rect = document.createElement("div");
    rect.className = "rectangle";
    rect.style.height = `${value * 20}px`;
    rect.textContent = value;
    rect.id = `rect-${value}`;
    arrayContainer.appendChild(rect);
  });
};

// Step-by-step update for Trapping Rain Water algorithm
const calculateWaterTrapped = () => {
  return new Promise((resolve) => {
    let left = 0;
    let right = array.length - 1;
    let leftMax = 0;
    let rightMax = 0;
    totalWater = 0;
    let waterAtCurrentStep = 0;

    // Step-by-step traversal with left and right pointers
    const updateStep = () => {
      if (left > right) {
        waterTrappedBox.textContent = `Water Trapped: ${totalWater}`;
        totalWaterTrapped.textContent = totalWater;
        resolve(totalWater);
        return;
      }

      if (array[left] <= array[right]) {
        leftMax = Math.max(leftMax, array[left]);
        waterAtCurrentStep = leftMax - array[left] > 0 ? leftMax - array[left] : 0;
        totalWater += waterAtCurrentStep;
        leftMaxBox.textContent = `Left Max: ${leftMax}`;
        waterTrappedBox.textContent = `Water Trapped: ${waterAtCurrentStep}`;
        left++;
      } else {
        rightMax = Math.max(rightMax, array[right]);
        waterAtCurrentStep = rightMax - array[right] > 0 ? rightMax - array[right] : 0;
        totalWater += waterAtCurrentStep;
        rightMaxBox.textContent = `Right Max: ${rightMax}`;
        waterTrappedBox.textContent = `Water Trapped: ${waterAtCurrentStep}`;
        right--;
      }

      setTimeout(updateStep, delay);
    };

    updateStep();
  });
};

// Start visualization with real-time interaction
const startVisualization = async () => {
  const input = document.getElementById("array-input").value;
  array = input.split(",").map(Number);

  visualizeArray();

  // Calculate water trapped
  await calculateWaterTrapped();
};

// Event listener for start button
document.getElementById("start-visualization").addEventListener("click", startVisualization);
