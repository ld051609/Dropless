import React, { useState } from "react";
import axios from "axios";
import styles from "./Chatbot.module.css"; // Import the CSS module
import { IoIosSend } from "react-icons/io";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const testSendMessage = async () => {
    const testChatbot = "Hello! I am a chatbot. How can I help you?";
    setMessages([...messages, { sender: "User", text: "Hello" }, { sender: "Bot", text: testChatbot }]);
  }

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const sendMessage = () => {
    if (!inputMessage) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const userMessage = {
          message: inputMessage,
          latitude: latitude,
          longitude: longitude
        };

        try {
          const response = await axios.post("http://localhost:5000/chatbot", userMessage);
          const botResponse = response.data.message;

          setMessages([...messages, { sender: "User", text: inputMessage }, { sender: "Bot", text: botResponse }]);
          setInputMessage("");
        } catch (error) {
          console.error("Error sending message:", error);
        }
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
      <div className={styles.chatbotWindow}>
        <div className={styles.chatbotHeader}>
        </div>
        <div className={styles.chatbotMessages}>
          {messages.map((message, index) => (
            <div key={index} className={`${styles.message} ${styles[message.sender.toLowerCase()]}`}>
              <strong>{message.sender}:</strong> {message.text}
            </div>
          ))}
        </div>

        <div className={styles.chatbotInput}>
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className={styles.inputField}
          />
          <button onClick={testSendMessage}>
            <IoIosSend className={styles.chatIcon} size={24}/>

          </button>
        </div>
      </div>
      
  );
};

export default Chatbot;
