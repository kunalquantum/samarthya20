document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.getElementById('startButton');
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  const description = document.getElementById('description');
  const matrixTable = document.getElementById('matrix');
  let steps = [];
  let currentStep = 0;

  // Function to compute Edit Distance and store steps
  function computeEditDistance(str1, str2) {
      const len1 = str1.length;
      const len2 = str2.length;
      const matrix = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0));

      for (let i = 0; i <= len1; i++) {
          for (let j = 0; j <= len2; j++) {
              if (i === 0) {
                  matrix[i][j] = j; // Insertions
              } else if (j === 0) {
                  matrix[i][j] = i; // Deletions
              } else {
                  const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                  matrix[i][j] = Math.min(matrix[i - 1][j - 1] + cost, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);

                  // Record the operation
                  if (cost === 1) {
                      steps.push({ i, j, operation: 'Substitute' });
                  } else if (i > 0 && matrix[i][j] === matrix[i - 1][j] + 1) {
                      steps.push({ i, j, operation: 'Delete' });
                  } else if (j > 0 && matrix[i][j] === matrix[i][j - 1] + 1) {
                      steps.push({ i, j, operation: 'Insert' });
                  }
              }
          }
      }

      return matrix;
  }

  // Function to visualize the matrix
  function visualizeMatrix(matrix, i, j, operation) {
      matrixTable.innerHTML = '';
      const len1 = matrix.length;
      const len2 = matrix[0].length;
      for (let row = 0; row < len1; row++) {
          let rowHtml = '<tr>';
          for (let col = 0; col < len2; col++) {
              const value = matrix[row][col];
              let cellClass = '';
              if (row === i && col === j) {
                  if (operation === 'Substitute') cellClass = 'substitute';
                  if (operation === 'Delete') cellClass = 'delete';
                  if (operation === 'Insert') cellClass = 'insert';
              }
              rowHtml += `<td class="${cellClass}">${value}</td>`;
          }
          rowHtml += '</tr>';
          matrixTable.innerHTML += rowHtml;
      }
  }

  // Function to show the current step explanation
  function showStepDescription() {
      const step = steps[currentStep];
      description.innerHTML = `Step ${currentStep + 1}: Operation: ${step.operation} at position (${step.i}, ${step.j})<br>Explanation: `;

      if (step.operation === 'Substitute') {
          description.innerHTML += "The characters at position " + step.i + " in String 1 and " + step.j + " in String 2 are different. We substitute the character in String 1 to match String 2.";
      } else if (step.operation === 'Delete') {
          description.innerHTML += "A character exists in String 1 but not in String 2. We delete this character from String 1.";
      } else if (step.operation === 'Insert') {
          description.innerHTML += "A character exists in String 2 but not in String 1. We insert this character into String 1 to match String 2.";
      }
  }

  // Button click event handlers
  startButton.addEventListener('click', function () {
      const str1 = document.getElementById('string1').value;
      const str2 = document.getElementById('string2').value;

      // Reset steps and current step
      steps = [];
      currentStep = 0;

      // Compute Edit Distance
      const matrix = computeEditDistance(str1, str2);

      // Visualize matrix
      visualizeMatrix(matrix, 0, 0, 'Insert');
      showStepDescription();

      // Enable "Next" button
      nextButton.disabled = false;
  });

  prevButton.addEventListener('click', function () {
      if (currentStep > 0) {
          currentStep--;
          showStepDescription();
          const step = steps[currentStep];
          visualize
