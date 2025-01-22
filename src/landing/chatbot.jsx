import React, { useState, useRef } from 'react';
import './chatbot.css'; // Assuming your CSS file is named chatbot.css

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [chatVisible, setChatVisible] = useState(false); // State to manage chat visibility
    const chatBodyRef = useRef(null);

    const submitQuery = async () => {
        const trimmedInput = userInput.trim();
        if (trimmedInput === "") return;

        setUserInput("");

        setMessages((prevMessages) => [
            ...prevMessages,
            { text: trimmedInput, type: 'user' }
        ]);

        try {
            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: trimmedInput }),
            });

            const data = await response.json();
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: data.response, type: 'bot' }
            ]);
        } catch (error) {
            console.error('Error communicating with the API:', error);
        }


        scrollToBottom();
    };

    const scrollToBottom = () => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    };

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitQuery();
        }
    };

    return (
        <div className="chatbot-wrapper">
            {/* Chatbot icon */}
            <div className="chatbot-icon" onClick={() => setChatVisible(!chatVisible)}>
                💬
            </div>

            {/* Chat container */}
            {chatVisible && (
                <div className="chat-container">
                    <div className="chat-header">
                        EverNorthBot
                        <button className="close-btn" onClick={() => setChatVisible(false)} aria-label="Close chat">
                            ✖
                        </button>
                    </div>
                    <div className="chat-body" ref={chatBodyRef}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`${msg.type}-message`}>
                                <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={userInput}
                            placeholder="Type your query..."
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                        />
                        <button onClick={submitQuery}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
