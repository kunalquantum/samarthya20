document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start');
    const textInput = document.getElementById('text-input');
    const patternInput = document.getElementById('pattern-input');
    const textContainer = document.getElementById('text-container');
    const patternContainer = document.getElementById('pattern-container');
    const lpsContainer = document.getElementById('lps-container');
    const pseudocodeDisplay = document.getElementById('pseudocode');
    const resultDisplay = document.getElementById('result');
    const delay = 1500;
    let currentStep = 0;

    const updatePseudocode = (step) => {
        const pseudocodeSteps = [
            "1. Preprocess the pattern to build the LPS array.",
            "2. Use the LPS array to search the pattern in the text.",
            "3. Update the search indices in both the text and pattern.",
            "4. On mismatch, skip comparisons using the LPS array."
        ];

        pseudocodeDisplay.innerHTML = pseudocodeSteps.map((line, index) => {
            if (index === step) {
                return `<div class="highlight">${line}</div>`;
            } else {
                return `<div>${line}</div>`;
            }
        }).join('');
    };

    const visualizeString = (str, container, highlightIndex = -1) => {
        container.innerHTML = '';
        str.split('').forEach((char, index) => {
            const div = document.createElement('div');
            div.className = 'char-box';
            div.textContent = char;
            if (index === highlightIndex) {
                div.classList.add('highlight');
            }
            container.appendChild(div);
        });
    };

    const buildLPS = (pattern) => {
        const lps = Array(pattern.length).fill(0);
        let length = 0; 
        let i = 1;

        while (i < pattern.length) {
            if (pattern[i] === pattern[length]) {
                length++;
                lps[i] = length;
                i++;
            } else {
                if (length > 0) {
                    length = lps[length - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }
        return lps;
    };

    const visualizeLPS = (lps, container, highlightIndex = -1) => {
        container.innerHTML = '';
        lps.forEach((value, index) => {
            const div = document.createElement('div');
            div.className = 'lps-box';
            div.textContent = value;
            if (index === highlightIndex) {
                div.classList.add('highlight');
            }
            container.appendChild(div);
        });
    };

    const kmpSearch = async (text, pattern) => {
        const lps = buildLPS(pattern);
        let i = 0; // index for text
        let j = 0; // index for pattern

        // Step 1: Visualize text and pattern
        visualizeString(text, textContainer);
        visualizeString(pattern, patternContainer);
        visualizeLPS(lps, lpsContainer);

        updatePseudocode(currentStep);
        currentStep++;

        // Step 2: Start searching
        while (i < text.length) {
            // Case 1: Match
            if (text[i] === pattern[j]) {
                visualizeString(text, textContainer, i); // Highlight text[i]
                visualizeString(pattern, patternContainer, j); // Highlight pattern[j]
                await new Promise(resolve => setTimeout(resolve, delay));

                i++;
                j++;

                // If we have matched the full pattern
                if (j === pattern.length) {
                    resultDisplay.textContent = `Pattern found at index ${i - j}`;
                    return;
                }
            }
            // Case 2: Mismatch
            else {
                if (j !== 0) {
                    // Use LPS to skip some comparisons
                    updatePseudocode(currentStep);
                    currentStep++;
                    j = lps[j - 1];
                    visualizeString(pattern, patternContainer, j); // Update pattern pointer
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    i++;
                    visualizeString(text, textContainer, i); // Update text pointer
                    updatePseudocode(currentStep);
                    currentStep++;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        resultDisplay.textContent = "Pattern not found.";
    };

    startButton.addEventListener('click', function () {
        const text = textInput.value.trim();
        const pattern = patternInput.value.trim();
        if (text === '' || pattern === '') return;

        resultDisplay.textContent = '';
        currentStep = 0;
        kmpSearch(text, pattern);
    });
});
