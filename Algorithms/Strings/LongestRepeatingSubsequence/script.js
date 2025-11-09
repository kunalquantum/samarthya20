/**
 * Visualizes the Longest Common Subsequence (LCS) algorithm by displaying the dynamic programming table and highlighting matching characters.
 */
function visualizeLCS() {
    // Clear previous visualization
    let visualization = document.getElementById('visualization');
    visualization.innerHTML = '';

    // Get input strings
    let s1 = document.getElementById('string1').value;
    let s2 = document.getElementById('string2').value;

    // Initialize variables
    let m = s1.length;
    let n = s2.length;
    let dp = new Array(m + 1).fill(null).map(() => new Array(n + 1).fill(0));

    // Build the dp array to store lengths of LCS
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (s1.charAt(i - 1) === s2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
            // Visualize each step with a delay
            visualizeStep(i, j, dp[i][j], visualization, s1.charAt(i - 1), s2.charAt(j - 1), i + j);
        }
    }
}

/**
 * Visualizes a single step of the LCS algorithm by creating and displaying a row with the characters being compared and highlighting them if they match.
 * @param {number} i - The current row index in the DP table.
 * @param {number} j - The current column index in the DP table.
 * @param {number} length - The length of the LCS at the current step.
 * @param {HTMLElement} visualization - The container element for the visualization.
 * @param {string} char1 - The character from the first string.
 * @param {string} char2 - The character from the second string.
 * @param {number} delayFactor - The delay factor for the animation.
 */
function visualizeStep(i, j, length, visualization, char1, char2, delayFactor) {
    // Create row for current step
    let row = document.createElement('div');
    row.classList.add('row');

    // Create box for character from string 1
    let box1 = document.createElement('div');
    box1.classList.add('char-box');
    box1.textContent = char1;

    // Create box for character from string 2
    let box2 = document.createElement('div');
    box2.classList.add('char-box');
    box2.textContent = char2;

    // Highlight the boxes if characters are equal
    if (char1 === char2) {
        box1.classList.add('highlight');
        box2.classList.add('highlight');
    }

    // Append boxes to row
    row.appendChild(box1);
    row.appendChild(box2);

    // Append row to visualization with delay
    setTimeout(() => {
        visualization.appendChild(row);
    }, delayFactor * 200); // Adjusted delay for smoother animation
}
