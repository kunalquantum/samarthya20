let steps = [];
let currentStep = 0;
let stringInput = '';
let patternInput = '';
let backtrack = -1;
let starIdx = -1;
let stepInterval = null;

document.getElementById('startBtn').addEventListener('click', () => {
    stringInput = document.getElementById('string').value;
    patternInput = document.getElementById('pattern').value;

    if (!stringInput || !patternInput) return;

    steps = createSteps(stringInput, patternInput);
    currentStep = 0;

    updatePseudocode();
    updateVisualization();
    handleStep();
});

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        updatePseudocode();
        updateVisualization();
        handleStep();
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentStep < steps.length - 1) {
        currentStep++;
        updatePseudocode();
        updateVisualization();
        handleStep();
    }
});

document.getElementById('completeBtn').addEventListener('click', () => {
    if (stepInterval) clearInterval(stepInterval);

    stepInterval = setInterval(() => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            updatePseudocode();
            updateVisualization();
            handleStep();
        } else {
            clearInterval(stepInterval);
        }
    }, 1000); // Adjust the delay (1000 ms = 1 second) as needed
});

/**
 * Creates an array of steps for the string matching with wildcard algorithm.
 * @param {string} string - The input string to match against the pattern.
 * @param {string} pattern - The pattern containing wildcards ('?' and '*') to match against the string.
 * @returns {Array<Object>} An array of step objects, each representing a state in the matching process.
 */
function createSteps(string, pattern) {
    const steps = [];
    let i = 0, j = 0;
    let backtrack = -1;
    let starIdx = -1;

    while (i < string.length) {
        if (j < pattern.length && (pattern[j] === string[i] || pattern[j] === '?')) {
            steps.push({ i, j, action: 'Match' });
            i++;
            j++;
        } else if (j < pattern.length && pattern[j] === '*') {
            starIdx = j;
            backtrack = i;
            steps.push({ i, j, action: 'Wildcard *' });
            j++;
        } else if (starIdx !== -1) {
            j = starIdx + 1;
            i = backtrack + 1;
            backtrack++;
            steps.push({ i, j, action: 'Backtrack after *' });
        } else {
            steps.push({ i, j, action: 'Mismatch' });
            break;
        }
    }

    while (j < pattern.length && pattern[j] === '*') {
        steps.push({ i, j, action: 'Match * at the end' });
        j++;
    }

    if (i === string.length && j === pattern.length) {
        steps.push({ i, j, action: 'Match successful' });
    } else {
        steps.push({ i, j, action: 'Pattern mismatch' });
    }

    return steps;
}

/**
 * Updates the visualization of the string and pattern, highlighting the characters at the current step.
 */
function updateVisualization() {
    const step = steps[currentStep];
    const stringDisplay = document.getElementById('stringDisplay');
    const patternDisplay = document.getElementById('patternDisplay');

    let stringHTML = '';
    let patternHTML = '';

    for (let i = 0; i < stringInput.length; i++) {
        if (i === step.i) {
            stringHTML += `<span class="match">${stringInput[i]}</span>`;
        } else {
            stringHTML += `<span>${stringInput[i]}</span>`;
        }
    }

    for (let j = 0; j < patternInput.length; j++) {
        if (j === step.j) {
            patternHTML += `<span class="match">${patternInput[j]}</span>`;
        } else if (patternInput[j] === '*') {
            patternHTML += `<span class="wildcard">${patternInput[j]}</span>`;
        } else {
            patternHTML += `<span>${patternInput[j]}</span>`;
        }
    }

    stringDisplay.innerHTML = stringHTML;
    patternDisplay.innerHTML = patternHTML;
}

/**
 * Updates the pseudocode display to highlight the current step of the algorithm.
 */
function updatePseudocode() {
    const pseudocode = document.getElementById('pseudocode');
    const step = steps[currentStep];

    const pseudocodeLines = [
        '1. Initialize i = 0, j = 0, starIdx = -1, backtrack = -1',
        '2. While i < string.length:',
        '   a. If pattern[j] == string[i] or pattern[j] == "?", move both i and j',
        '   b. If pattern[j] == "*", mark starIdx and backtrack, move j forward',
        '   c. If mismatch and starIdx != -1, backtrack to starIdx + 1 and move i forward',
        '3. If pattern is exhausted and string is exhausted, match is successful.',
        '4. If pattern and string are not exhausted, match fails.',
    ];

    pseudocode.innerHTML = pseudocodeLines.map((line, index) => {
        if (index === currentStep) {
            return `<span class="highlight">${line}</span>`;
        } else {
            return line;
        }
    }).join('\n');
}

/**
 * Handles the animation for the current step of the string matching algorithm.
 */
function handleStep() {
    const step = steps[currentStep];

    // Clear previous animations
    clearAnimations();

    // Handle current step animation
    switch (step.action) {
        case 'Match':
            animateMatch(step);
            break;
        case 'Wildcard *':
            animateWildcard(step);
            break;
        case 'Mismatch':
            animateMismatch(step);
            break;
        case 'Backtrack after *':
            animateBacktrack(step);
            break;
        case 'Match * at the end':
            animateMatchEnd(step);
            break;
        case 'Pattern mismatch':
            animateFailure();
            break;
        case 'Match successful':
            animateSuccess();
            break;
    }
}

/**
 * Clears all animations from the string and pattern display.
 */
function clearAnimations() {
    const stringElements = document.querySelectorAll('#stringDisplay span');
    const patternElements = document.querySelectorAll('#patternDisplay span');

    stringElements.forEach(element => {
        element.classList.remove('match', 'mismatch', 'backtrack', 'wildcard');
    });

    patternElements.forEach(element => {
        element.classList.remove('match', 'mismatch', 'wildcard');
    });
}

/**
 * Animates a successful match between characters in the string and pattern.
 * @param {Object} step - The current step object.
 */
function animateMatch(step) {
    const stringElements = document.querySelectorAll('#stringDisplay span');
    const patternElements = document.querySelectorAll('#patternDisplay span');

    stringElements[step.i].classList.add('match');
    patternElements[step.j].classList.add('match');
}

/**
 * Animates a mismatch between characters in the string and pattern.
 * @param {Object} step - The current step object.
 */
function animateMismatch(step) {
    const stringElements = document.querySelectorAll('#stringDisplay span');
    const patternElements = document.querySelectorAll('#patternDisplay span');

    stringElements[step.i].classList.add('mismatch');
    patternElements[step.j].classList.add('mismatch');
}

/**
 * Animates the matching of a wildcard '*' at the end of the pattern.
 * @param {Object} step - The current step object.
 */
function animateMatchEnd(step) {
    const patternElements = document.querySelectorAll('#patternDisplay span');
    patternElements[step.j].classList.add('match');
}

/**
 * Animates the successful completion of the string matching algorithm.
 */
function animateSuccess() {
    const stringElements = document.querySelectorAll('#stringDisplay span');
    const patternElements = document.querySelectorAll('#patternDisplay span');

    stringElements.forEach(element => element.classList.add('match'));
    patternElements.forEach(element => element.classList.add('match'));
}

/**
 * Animates the failure of the string matching algorithm.
 */
function animateFailure() {
    const stringElements = document.querySelectorAll('#stringDisplay span');
    const patternElements = document.querySelectorAll('#patternDisplay span');

    stringElements.forEach(element => element.classList.add('mismatch'));
    patternElements.forEach(element => element.classList.add('mismatch'));
}
