const newsEndpoint = "https://news-chat-app.azurewebsites.net/api/query";

document.addEventListener("DOMContentLoaded", function () {
    const chatHistory = [];
    const chatHistoryContainer = document.getElementById('chat-history');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const clearButton = document.getElementById('clear-button');

    async function fetchChatResponse(userMessage) {
        const startTime = performance.now();
        // Prepare the request payload
        requestData = { "message": userMessage, "chatHistory": chatHistory };
        console.log("Request Data:", JSON.stringify(requestData));
        try {
            // Send the request to the server endpoint
            const response = await fetch(newsEndpoint, {
                method: "POST",
                headers: {
                     "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(requestData)
            });
            const responsePayload = await response.json();
            console.log("Response Data:", responsePayload);
            const endTime = performance.now();
            const elapsedTime = Math.round((endTime - startTime)) + "ms";

            // Check if the response is cached
            const cached = responsePayload.cached;
            let details = `\n (Time: ${elapsedTime})`;
            if (cached) {
                details += " (Cached)";
            }

            // Append user message and response to chat history
            chatHistory.push([userMessage, responsePayload.response + details]);

            // Update the chatbot display with the new chat history
            updateChatHistory(chatHistory);
        } catch (error) {
            console.error("Error:", error);
        }

        // Clear the input box after sending the message
        document.getElementById("user-input").value = "";

    }

    function updateChatHistory() {
        chatHistoryContainer.innerHTML = '';
        chatHistory.forEach(([userMessage, response]) => {
            const userMessageElement = document.createElement('div');
            userMessageElement.className = 'message user-message';
            userMessageElement.textContent = userMessage;

            const botResponseElement = document.createElement('div');
            botResponseElement.className = 'message bot-response';
            botResponseElement.textContent = response;

            chatHistoryContainer.appendChild(userMessageElement);
            chatHistoryContainer.appendChild(botResponseElement);
        });
        chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
    }

    sendButton.addEventListener('click', async () => {
        const userMessage = userInput.value;
        if (!userMessage) return;

        await fetchChatResponse(userMessage);
        updateChatHistory();
        userInput.value = '';
    });

    clearButton.addEventListener('click', () => {
        chatHistory.length = 0;
        updateChatHistory();
    });

    // Handle 'Enter' key press for submitting
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });
});

