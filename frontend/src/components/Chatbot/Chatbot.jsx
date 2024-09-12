import React, { useState } from "react";
import styles from "./Chatbot.module.css"; // Import the CSS module
import { IoIosSend } from "react-icons/io";
import { FaWater } from "react-icons/fa"; // Water droplet icon

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const sendMessage = async () => {
    if (!inputMessage) return;

    const userMessage = {
      message: inputMessage,
      latitude: null,
      longitude: null
    };

    try {
      const response = await fetch("http://localhost:5000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userMessage)
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const botResponse = data.message;

      setMessages([...messages, { sender: "User", text: inputMessage }, { sender: "Bot", text: botResponse }]);
      setInputMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sendWaterResourceRequest = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const userMessage = {
          message: "Find nearest water resources",
          latitude: latitude,
          longitude: longitude
        };

        try {
          const response = await fetch("http://localhost:5000/chatbot", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(userMessage)
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          const botResponse = data.water_sources; // Updated to handle water sources

          // Format the response message
          let formattedResponse;
          if (Array.isArray(botResponse) && botResponse.length > 0) {
            formattedResponse = botResponse.map((source, index) => (
              <div key={index} className={styles.waterSource}>
                <strong>{source.name}</strong><br />
                Address: {source.address}<br />
                Distance: {source.distance.toFixed(2)} km<br />
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  View on Google Maps
                </a>
              </div>
            ));
          } else {
            formattedResponse = "No water sources found nearby.";
          }

          setMessages([...messages, { sender: "User", text: "Find nearest water resources" }, { sender: "Bot", text: formattedResponse }]);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div>
    <div className={styles.chatbotTag}>
    <p className={styles.chatbotText}>Emergency Chatbot</p>
    </div>
    <div className={styles.chatbotWindow}>
      <div className={styles.chatbotHeader}>
        {/* Add header content here if needed */}
      </div>
      <div className={styles.chatbotMessages}>
        {messages.map((message, index) => (
          <div key={index} className={`${styles.message} ${styles[message.sender.toLowerCase()]}`}>
            <strong>{message.sender}:</strong> 
            <div className={styles.messageText}>
              {typeof message.text === 'string' ? message.text : message.text}
            </div>
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
        <button onClick={sendMessage}>
          <IoIosSend className={styles.chatIcon} size={24} />
        </button>
        <button onClick={sendWaterResourceRequest} className={styles.waterButton}>
          <FaWater className={styles.waterIcon} size={24} />
        </button>
      </div>
    </div>
    </div>
  );
};

export default Chatbot;
