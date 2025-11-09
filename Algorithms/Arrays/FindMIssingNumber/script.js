let array = [];
let n = 0;
let delay = 1000; // Delay in ms for step-by-step animation

const arrayContainer = document.getElementById("array-container");
const sumMethodResult = document.getElementById("sum-method-result");
const xorMethodResult = document.getElementById("xor-method-result");

const expectedSumBox = document.getElementById("expected-sum-result");
const expectedSumFormula = document.getElementById("expected-sum-formula");

const actualSumBox = document.getElementById("actual-sum-value");

const missingNumberBox = document.getElementById("missing-number-value");

const xorCalculationBox = document.getElementById("xor-detail");

/**
 * Resets the visualization to its initial state, clearing the array container and resetting text content.
 */
const resetVisualization = () => {
  arrayContainer.innerHTML = "";
  sumMethodResult.textContent = "-";
  xorMethodResult.textContent = "-";
  expectedSumBox.textContent = "Expected Sum: -";
  actualSumBox.textContent = "Actual Sum: -";
  missingNumberBox.textContent = "Missing Number: -";
  xorCalculationBox.textContent = "-";
};

/**
 * Visualizes the array by creating and displaying rectangle elements for each value.
 */
const visualizeArray = () => {
  resetVisualization();
  array.forEach(value => {
    const rect = document.createElement("div");
    rect.className = "rectangle";
    rect.textContent = value;
    rect.id = `rect-${value}`;
    arrayContainer.appendChild(rect);
  });
};

/**
 * Finds the missing number in the array using the sum method in a step-by-step manner, updating the visualization at each step.
 * @returns {Promise<number>} A promise that resolves with the missing number.
 */
const findMissingBySumStepByStep = () => {
  return new Promise((resolve) => {
    // Step 1: Calculate expected sum
    const expectedSum = (n * (n + 1)) / 2;
    expectedSumBox.textContent = `Expected Sum: ${expectedSum}`;
    setTimeout(() => {
      // Step 2: Calculate actual sum
      const actualSum = array.reduce((sum, num) => sum + num, 0);
      actualSumBox.textContent = `Actual Sum: ${actualSum}`;
      setTimeout(() => {
        // Step 3: Find the missing number
        const missingNumber = expectedSum - actualSum;
        missingNumberBox.textContent = `Missing Number: ${missingNumber}`;
        resolve(missingNumber);
      }, delay);
    }, delay);
  });
};

/**
 * Finds the missing number in the array using the XOR method in a step-by-step manner, updating the visualization at each step.
 * @returns {Promise<number>} A promise that resolves with the missing number.
 */
const findMissingByXORStepByStep = () => {
  return new Promise((resolve) => {
    // Step 4: XOR all numbers from 1 to n
    let xorFull = 0;
    for (let i = 1; i <= n; i++) {
      xorFull ^= i;
    }
    xorCalculationBox.textContent = `XOR of 1 to n: ${xorFull}`;
    setTimeout(() => {
      // XOR all elements in the array
      let xorArray = 0;
      for (let num of array) {
        xorArray ^= num;
      }
      xorCalculationBox.textContent += `\nXOR of array: ${xorArray}`;
      setTimeout(() => {
        // Find the missing number
        const missingNumber = xorFull ^ xorArray;
        xorMethodResult.textContent = missingNumber;
        resolve(missingNumber);
      }, delay);
    }, delay);
  });
};

/**
 * Starts the visualization process by parsing the input, visualizing the array, and finding the missing number using both sum and XOR methods.
 * @returns {Promise<void>}
 */
const startVisualization = async () => {
  const input = document.getElementById("array-input").value;
  array = input.split(",").map(Number).sort((a, b) => a - b);
  n = array.length + 1;

  visualizeArray();

  // Wait for both methods to complete and update results
  const missingBySum = await findMissingBySumStepByStep();
  const missingByXOR = await findMissingByXORStepByStep();

  sumMethodResult.textContent = missingBySum;
  xorMethodResult.textContent = missingByXOR;
};

// Event listener for start button
document.getElementById("start-visualization").addEventListener("click", startVisualization);
