document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('messageInput');
    const messagesContainer = document.getElementById('messages');
    const sendButton = document.querySelector('button');

    const apiKey = 'AIzaSyDQii38f8YFiyDwkpY9Mtap2FmJh05ZwMk';
    const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // Pre-prompt message to initialize the chat context
    const prePrompt = `You are a tutor specializing in data structures and algorithms. Begin by asking the student a few questions to assess their current understanding of the subject. Based on their responses, determine their knowledge level (beginner, intermediate, advanced).\n\nQuestions:\n1. How familiar are you with data structures such as arrays, linked lists, or trees?\n2. Have you implemented algorithms like sorting or searching in your projects?\n3. What is your experience with algorithm complexity and Big-O notation?\n\nUse the student’s responses to tailor your teaching approach. \nBased on the student's current understanding, begin teaching a relevant topic. Provide explanations, examples, and code snippets as necessary. Ensure your explanations are clear and at an appropriate level for the student.\n\nFor example:\n- If the student is a beginner, start with basic concepts like arrays and linked lists.\n- For an intermediate student, delve into more complex structures such as balanced trees or graphs.\n- Advanced students might benefit from topics like advanced algorithms or optimization techniques.\n\nUse the following format:\n1. **Topic Introduction**: Briefly explain the concept.\n2. **Examples**: Provide practical examples and use cases.\n3. **Code Snippets**: Show relevant code snippets in Java or pseudocode.\n4. **Explanation**: Explain the code and how it relates to the topic.\n5. **Interactive Questions**: Ask the student questions to check their understanding.\nPeriodically test the student’s understanding with short quizzes or problems related to the topic being taught. Based on their performance, provide constructive feedback and areas for improvement.\n\nTest Example:\n1. Provide a problem related to the topic.\n2. Ask the student to solve it or explain their approach.\n3. Evaluate their response and provide feedback.\n\nFeedback Example:\n- If the student solves the problem correctly, acknowledge their success and provide additional advanced problems for practice.\n- If the student struggles, review the concept, offer additional explanations, and provide simpler practice problems.\n\nEncourage and reward the student for their progress and efforts. Highlight their strengths and suggest areas for further study.\nMotivate the student by acknowledging their progress and achievements. Set small goals and reward their accomplishments to keep them engaged.\n\nExamples of Rewards:\n- Praise for completing a challenging problem or understanding a complex concept.\n- Offer additional resources or advanced topics for further learning.\n\nEnsure that the rewards and feedback are constructive and encouraging.`;

    let isFirstInteraction = true;

    async function sendMessage(message, isPrePrompt = false) {
        if (message) {
            // Clear the input field
            messageInput.value = '';

            if (!isPrePrompt) {
                // Add user's message to the chatbox
                const userMessageElement = document.createElement('div');
                userMessageElement.classList.add('message', 'user-message');
                userMessageElement.textContent = message;
                messagesContainer.appendChild(userMessageElement);
                messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
            }

            try {
                // Send message to Gemini API
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
                                        text: isPrePrompt ? prePrompt : message
                                    }
                                ]
                            }
                        ]
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error(`Network response was not ok: ${errorText}`);
                }

                const data = await response.json();
                console.log('API Response:', data); // Debugging: Log API response

                // Extracting the response text from the API response
                const apiResponse = extractPlainTextResponse(data);

                // Only display the response if it's not the initial setup
                if (!isPrePrompt && !isFirstInteraction) {
                    // Format and display the response
                    await displayFormattedResponse(apiResponse);
                }

                // Set flag to false after the first interaction
                isFirstInteraction = false;

            } catch (error) {
                console.error('Error:', error);
            }
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

    async function displayFormattedResponse(responseText) {
        // Format the response with HTML tags for better presentation
        const formattedText = formatResponse(responseText);

        // Split the formatted response into chunks if necessary
        const chunks = splitTextIntoChunks(formattedText, 500); // Adjust chunk size as needed

        for (const chunk of chunks) {
            // Add bot's message to the chatbox
            const botMessageElement = document.createElement('div');
            botMessageElement.classList.add('message', 'bot-message');
            botMessageElement.innerHTML = chunk;
            messagesContainer.appendChild(botMessageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom

            await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between chunks
        }
    }

    function splitTextIntoChunks(text, chunkSize) {
        const chunks = [];
        for (let i = 0; i < text.length; i += chunkSize) {
            chunks.push(text.substring(i, Math.min(text.length, i + chunkSize)));
        }
        return chunks;
    }

    function formatResponse(responseText) {
        // Replace double newlines with paragraph breaks
        // Add bold tags and other formatting as needed
        return responseText
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Convert **bold** markers to HTML bold tags
            .replace(/\n\n/g, '<br><br>') // Convert double newlines to paragraph breaks
            .replace(/\n/g, '<br>'); // Convert single newlines to line breaks
    }

    async function initializeChat() {
        // Send pre-prompt message without showing it
        await sendMessage(prePrompt, true);

        // Optionally, send a welcome message to the user here
        await sendMessage('Hello! How can I assist you with data structures and algorithms today?');
    }

    sendButton.addEventListener('click', () => {
        const userMessage = messageInput.value.trim();
        if (userMessage) {
            // Send user's message to the chatbot
            sendMessage(userMessage);
        }
    });

    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const userMessage = messageInput.value.trim();
            if (userMessage) {
                // Send user's message to the chatbot
                sendMessage(userMessage);
            }
        }
    });

    // Initialize chat when the page loads
    initializeChat();
});
