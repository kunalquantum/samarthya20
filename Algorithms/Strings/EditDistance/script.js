document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.getElementById('startButton');
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  const description = document.getElementById('description');
  const matrixTable = document.getElementById('matrix');
  let steps = [];
  let currentStep = 0;
  let matrix = [];

  /**
   * Computes the Edit Distance between two strings using dynamic programming and stores the steps of the computation.
   * @param {string} str1 - The first string.
   * @param {string} str2 - The second string.
   * @returns {number[][]} A 2D array (matrix) representing the dynamic programming table used to compute the edit distance.
   */
  function computeEditDistance(str1, str2) {
      const len1 = str1.length;
      const len2 = str2.length;
      const localMatrix = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0));
      steps = []; // Reset steps

      for (let i = 0; i <= len1; i++) {
          for (let j = 0; j <= len2; j++) {
              if (i === 0) {
                  localMatrix[i][j] = j; // Cost of insertions
                  if (j > 0) steps.push({ i, j, operation: 'Insert', value: j });
              } else if (j === 0) {
                  localMatrix[i][j] = i; // Cost of deletions
                  if (i > 0) steps.push({ i, j, operation: 'Delete', value: i });
              } else {
                  const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                  const substitutionCost = localMatrix[i - 1][j - 1] + cost;
                  const deletionCost = localMatrix[i - 1][j] + 1;
                  const insertionCost = localMatrix[i][j - 1] + 1;

                  localMatrix[i][j] = Math.min(substitutionCost, deletionCost, insertionCost);

                  // Record the operation that resulted in the minimum cost
                  if (localMatrix[i][j] === substitutionCost) {
                      steps.push({ i, j, operation: cost === 1 ? 'Substitute' : 'No operation', value: localMatrix[i][j] });
                  } else if (localMatrix[i][j] === deletionCost) {
                      steps.push({ i, j, operation: 'Delete', value: localMatrix[i][j] });
                  } else {
                      steps.push({ i, j, operation: 'Insert', value: localMatrix[i][j] });
                  }
              }
          }
      }
      return localMatrix;
  }

  /**
   * Visualizes the edit distance matrix as an HTML table and highlights the cell for the current step.
   * @param {number[][]} matrixToVisualize - The matrix to display.
   * @param {number} highlightI - The row index of the cell to highlight.
   * @param {number} highlightJ - The column index of the cell to highlight.
   * @param {string} operation - The operation performed at the highlighted cell.
   */
  function visualizeMatrix(matrixToVisualize, highlightI, highlightJ, operation) {
      matrixTable.innerHTML = '';
      const len1 = matrixToVisualize.length;
      const len2 = matrixToVisualize[0].length;
      for (let row = 0; row < len1; row++) {
          let rowHtml = '<tr>';
          for (let col = 0; col < len2; col++) {
              const value = matrixToVisualize[row][col];
              let cellClass = '';
              if (row === highlightI && col === highlightJ) {
                  cellClass = operation.toLowerCase().replace(' ', '-');
              }
              rowHtml += `<td class="${cellClass}">${value}</td>`;
          }
          rowHtml += '</tr>';
          matrixTable.innerHTML += rowHtml;
      }
  }

  /**
   * Displays a description of the current step in the edit distance calculation.
   */
  function showStepDescription() {
      if (currentStep < 0 || currentStep >= steps.length) return;
      const step = steps[currentStep];
      description.innerHTML = `Step ${currentStep + 1} of ${steps.length}: Operation: <strong>${step.operation}</strong> at position (${step.i}, ${step.j})<br>Explanation: `;

      if (step.operation === 'Substitute') {
          description.innerHTML += `Characters are different. Substitute character, cost increases. New value: ${step.value}.`;
      } else if (step.operation === 'Delete') {
          description.innerHTML += `Delete character from String 1. Cost increases by 1. New value: ${step.value}.`;
      } else if (step.operation === 'Insert') {
          description.innerHTML += `Insert character into String 1. Cost increases by 1. New value: ${step.value}.`;
      } else if (step.operation === 'No operation') {
          description.innerHTML += `Characters are the same. No operation needed, cost does not change. Value: ${step.value}.`;
      }
  }

  // Event Listeners
  startButton.addEventListener('click', function () {
      const str1 = document.getElementById('string1').value;
      const str2 = document.getElementById('string2').value;
      currentStep = 0;
      matrix = computeEditDistance(str1, str2);

      if (steps.length > 0) {
        const firstStep = steps[0];
        visualizeMatrix(matrix, firstStep.i, firstStep.j, firstStep.operation);
        showStepDescription();
      } else {
        visualizeMatrix(matrix, -1, -1, '');
      }

      nextButton.disabled = steps.length <= 1;
      prevButton.disabled = true;
  });

  prevButton.addEventListener('click', function () {
      if (currentStep > 0) {
          currentStep--;
          const step = steps[currentStep];
          visualizeMatrix(matrix, step.i, step.j, step.operation);
          showStepDescription();
      }
      nextButton.disabled = false;
      if (currentStep === 0) {
          prevButton.disabled = true;
      }
  });

  nextButton.addEventListener('click', function() {
      if (currentStep < steps.length - 1) {
          currentStep++;
          const step = steps[currentStep];
          visualizeMatrix(matrix, step.i, step.j, step.operation);
          showStepDescription();
      }
      prevButton.disabled = false;
      if (currentStep === steps.length - 1) {
          nextButton.disabled = true;
      }
  });
});
