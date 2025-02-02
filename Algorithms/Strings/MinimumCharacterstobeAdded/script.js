document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start');
    const inputString = document.getElementById('input-string');
    const stringContainer = document.getElementById('string-container');
    const pseudocodeDisplay = document.getElementById('pseudocode');
    const resultDisplay = document.getElementById('result');
    const delay = 1500;
    let currentStep = 0;

    const updatePseudocode = (step) => {
        const pseudocodeSteps = [
            "1. Start with the string.",
            "2. Check if the string is a palindrome.",
            "3. If not, identify the longest palindrome suffix.",
            "4. Add the remaining prefix in reverse order to the front.",
            "5. Display the palindrome and the added characters."
        ];

        pseudocodeDisplay.innerHTML = pseudocodeSteps.map((line, index) => {
            if (index === step) {
                return `<div class="highlight-text">${line}</div>`;
            } else {
                return `<div>${line}</div>`;
            }
        }).join('');
    };

    const visualizeString = (string, addedChars = '') => {
        stringContainer.innerHTML = '';
        const fullString = addedChars + string;
        fullString.split('').forEach((char, index) => {
            const div = document.createElement('div');
            div.className = 'element';
            div.textContent = char;
            div.id = `char-${index}`;
            stringContainer.appendChild(div);
        });
    };

    const isPalindrome = (str) => {
        return str === str.split('').reverse().join('');
    };

    const findPalindromePrefix = (str) => {
        for (let i = 0; i < str.length; i++) {
            const substring = str.slice(i);
            if (isPalindrome(substring)) {
                return str.slice(0, i).split('').reverse().join('');
            }
        }
        return '';
    };

    const reverseStringToMakePalindrome = async (str) => {
        let addedChars = '';
        let originalString = str;

        // Step 1: Check if it's already a palindrome
        updatePseudocode(currentStep);
        currentStep++;
        if (isPalindrome(str)) {
            resultDisplay.textContent = `The string is already a palindrome: ${str}`;
            return;
        }

        // Step 2: Find the longest palindrome suffix and get the prefix to add
        const prefixToAdd = findPalindromePrefix(str);
        addedChars = prefixToAdd;

        // Step 3: Visualize the process step-by-step
        for (let i = 0; i < prefixToAdd.length; i++) {
            updatePseudocode(currentStep);
            currentStep++;

            // Add new character to the front
            visualizeString(str, addedChars.slice(0, i + 1));
            const newCharElement = document.getElementById(`char-${i}`);
            newCharElement.classList.add('add-char');

            // Wait for animation to finish before continuing
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        resultDisplay.textContent = `Final Palindrome: ${addedChars + str}`;
    };

    startButton.addEventListener('click', function () {
        const inputText = inputString.value.trim();
        if (inputText === '') return;

        visualizeString(inputText);
        currentStep = 0;
        resultDisplay.textContent = '';

        reverseStringToMakePalindrome(inputText);
    });
});
