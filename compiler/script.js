document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('messageInput');
    const outputContainer = document.getElementById('output');
    const submitButton = document.getElementById('submitButton');
    const apiKey = 'AIzaSyCq3ri9RLPVt11Y8nGYO5vcoxeSPN6CSbk';
    const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    submitButton.addEventListener('click', async () => {
        const code = messageInput.value.trim();
        if (code) {
            await compileCode(code);
        } else {
            displayOutput('Please write some code before compiling.');
        }
    });

    async function compileCode(code) {
        outputContainer.textContent = 'Compiling...';

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: code
                                }
                            ]
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const apiResponse = extractPlainTextResponse(data);
            displayOutput(apiResponse);
        } catch (error) {
            console.log(error)
            console.error('Error:', error);
            displayOutput('An error occurred. Please try again later.');
        }
    }

    function extractPlainTextResponse(jsonResponse) {
        try {
            const candidates = jsonResponse.candidates || [];
            if (candidates.length > 0) {
                const firstCandidate = candidates[0];
                const content = firstCandidate.content || {};
                const parts = content.parts || [];
                if (parts.length > 0) {
                    return parts[0].text || 'No text found in response.';
                }
            }
        } catch (error) {
            console.error('Error parsing response:', error);
        }
        return 'No text found in response.';
    }

    function displayOutput(text) {
        outputContainer.textContent = text;
        outputContainer.scrollTop = outputContainer.scrollHeight; // Scroll to bottom
    }
});
