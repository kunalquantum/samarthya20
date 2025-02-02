document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start-button');
    const inputString = document.getElementById('input-string');
    const arrayContainer = document.getElementById('array-container');
    const pseudocodeElement = document.getElementById('pseudocode');
    const resultElement = document.getElementById('result');
    
    let words = [];
    let currentStep = 0;
    const delay = 1500;

    // Update pseudocode based on the step
    const updatePseudocode = (step) => {
        const pseudocodeSteps = [
            "1. Split the string into words.",
            "2. Initialize two pointers: left (beginning) and right (end).",
            "3. While left < right:",
            "    a. Swap words[left] and words[right] using a temporary variable.",
            "    b. Move the pointers closer to each other (left++ and right--).",
            "4. Join the words back into a string.",
            "5. Output the final reversed string."
        ];
        
        pseudocodeElement.innerHTML = pseudocodeSteps.map((line, index) => {
            if (index === step) {
                return `<div class="highlight">${line}</div>`;
            } else {
                return `<div>${line}</div>`;
            }
        }).join('');
    };

    // Visualize the array (words) as elements
    const visualizeWords = () => {
        arrayContainer.innerHTML = '';
        words.forEach((word, index) => {
            const div = document.createElement('div');
            div.className = 'element';
            div.textContent = word;
            div.id = `word-${index}`;
            arrayContainer.appendChild(div);
        });
    };

    // Perform the reversal step by step
    const reverseWords = async () => {
        let left = 0;
        let right = words.length - 1;
        
        // Total steps: left < right
        while (left < right) {
            updatePseudocode(currentStep);
            currentStep++;

            // Highlight the words being swapped
            const leftElement = document.getElementById(`word-${left}`);
            const rightElement = document.getElementById(`word-${right}`);
            leftElement.classList.add('swap');
            rightElement.classList.add('swap');
            
            // Wait for animation before swap
            await new Promise(resolve => setTimeout(resolve, delay));

            // Swap words
            [words[left], words[right]] = [words[right], words[left]];
            
            // Update words display after swap
            visualizeWords();
            
            // Remove highlight
            leftElement.classList.remove('swap');
            rightElement.classList.remove('swap');
            
            left++;
            right--;
        }

        // Final step: join and display the result
        updatePseudocode(currentStep);
        resultElement.textContent = `Reversed string: ${words.join(' ')}`;
    };

    // Start button event listener
    startButton.addEventListener('click', function () {
        const inputText = inputString.value.trim();
        
        if (inputText === '') return;

        words = inputText.split(' ');
        currentStep = 0;
        resultElement.textContent = '';
        
        visualizeWords();
        reverseWords();
    });
});
