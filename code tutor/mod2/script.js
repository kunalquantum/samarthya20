document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('messageInput');
    const messagesContainer = document.getElementById('messages');
    const sendButton = document.getElementById('sendBtn');
    const aiResponseContainer = document.getElementById('aiResponse');

    const apiKey = 'AIzaSyDsAeiqwjwPZeqYl4naROx4HeMU1UIW3Nk'; // Replace with your Gemini API key
    const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const steps = [
        {
            prompt: "Step 1: Assessing the Help Needed",
            response: "Hi! What area or topic in data structures would you like help with today? Do you have a specific concept, such as stacks, queues, linked lists, or trees, that you want to understand better?"
        },
        {
            prompt: "Step 2: Simple Explanation with Real-Life Analogies",
            response: "Once the user mentions their topic, the bot will provide a simple explanation using real-life examples. For example, for stacks: \"Imagine a stack as a pile of plates in a cafeteria. You add plates to the top of the stack, and when you need one, you take the plate from the top. This is called the Last In, First Out (LIFO) principle, which means the last item you add is the first one you remove.\""
        },
        {
            prompt: "Step 3: Asking for Doubts",
            response: "Does that explanation make sense? Do you have any questions or doubts about how stacks work?"
        },
        {
            prompt: "Step 4: Providing Code Based on Comfort Language",
            response: "What is your preferred programming language (e.g., Python, Java, C++)? I’ll provide a simple code example in that language for you."
        },
        {
            prompt: "Step 5: Explaining Code Line by Line",
            response: "Once the user provides their preferred language, the bot will give a small code example and explain each line step by step."
        },
        {
            prompt: "Step 6: Iterative Example with User Interaction",
            response: "Now, let’s work on a slightly more complex example. We will use a stack to reverse a string. Let’s break it down step by step: 1. Initialize an empty stack. 2. Push each character of the string onto the stack. 3. Pop each character from the stack to form the reversed string."
        },
        {
            prompt: "Step 7: Small Quiz (Fill in the blanks)",
            response: "Let’s test your understanding with a small quiz. Please fill in the blanks: 1. A stack follows the _______ (LIFO/FIFO) principle. 2. To add an element to the stack, we use the _______ operation. 3. In the code, \`stack.pop()\` removes an item from the _______ of the stack."
        },
        {
            prompt: "Step 8: Feedback on Quiz Performance",
            response: "You’ve completed the quiz! Let me check your answers… If you answered incorrectly, the bot explains why the answer was wrong and clarifies the correct answer using examples and real-life analogies."
        },
        {
            prompt: "Step 9: Suggesting the Next Topic",
            response: "Based on your quiz performance, I’ll suggest the next topic to learn: - If you scored well, let's move on to **Queues** or **Linked Lists**. - If you struggled with any concepts, we can revisit **Stacks** or start with simpler topics like **Arrays** or **Lists**."
        }
    ];

    let currentStep = 0;

    async function sendMessage(message) {
        if (message) {
            const userMessageElement = document.createElement('div');
            userMessageElement.classList.add('message', 'user-message');
            userMessageElement.textContent = message;
            messagesContainer.appendChild(userMessageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            try {
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: steps[currentStep].response
                                    }
                                ]
                            }
                        ]
                    })
                });

                const data = await response.json();
                const apiResponse = extractPlainTextResponse(data);
                await displayFormattedResponse(apiResponse);
                currentStep++;

                if (currentStep < steps.length) {
                    await sendMessage(steps[currentStep].prompt);
                }

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
        const formattedText = formatResponse(responseText);
        const chunks = splitTextIntoChunks(formattedText, 500);
        aiResponseContainer.innerHTML = ''; // Clear previous AI response
        for (const chunk of chunks) {
            const botMessageElement = document.createElement('div');
            botMessageElement.classList.add('bot-message', 'message');
            botMessageElement.innerHTML = chunk;
            aiResponseContainer.appendChild(botMessageElement);
            aiResponseContainer.scrollTop = aiResponseContainer.scrollHeight;
            await new Promise(resolve => setTimeout(resolve, 500)); // Delay between chunks for effect
        }
    }

    function formatResponse(responseText) {
        return responseText
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
    }

    function splitTextIntoChunks(text, chunkSize) {
        const chunks = [];
        for (let i = 0; i < text.length; i += chunkSize) {
            chunks.push(text.substring(i, Math.min(text.length, i + chunkSize)));
        }
        return chunks;
    }

    sendButton.addEventListener('click', () => {
        const userMessage = messageInput.value.trim();
        if (userMessage) {
            sendMessage(userMessage);
            messageInput.value = ''; // Clear input after sending message
        }
    });

    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const userMessage = messageInput.value.trim();
            if (userMessage) {
                sendMessage(userMessage);
                messageInput.value = ''; // Clear input after sending message
            }
        }
    });

    async function initializeChat() {
        // Start with the first prompt
        await sendMessage(steps[currentStep].prompt);
    }

    initializeChat();
});
