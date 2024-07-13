import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useLocation } from "react-router-dom";

const socket = io("http://localhost:8000");

const Chat = () => {
  const { state } = useLocation();
  const clanName = state && state.clanName;

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchRecentChats = async () => {
      try {
        const response = await axios.post("http://localhost:8000/clanChat", {
          clanName: clanName,
        });

        const newMessages = response.data.map((item) => ({
          content: item.content,
          sender: item.sender,
          timestamp: item.timestamp,
        }));

        setMessages(newMessages); // Set messages directly

        console.log(response.data);
      } catch (error) {
        console.error("Error fetching recent chats:", error);
      }
    };

    fetchRecentChats();

    socket.on("a user joined", () => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: "a user joined" },
      ]);
      scrollToBottom();
    });

    socket.on("disconnected", () => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: "a user disconnected" },
      ]);
      scrollToBottom();
    });

    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      scrollToBottom();
    });

    return () => {
      socket.off("a user joined");
      socket.off("disconnected");
      socket.off("chat message");
    };
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      const newMessage = {
        content: messageInput,
        sender: "You",
        timestamp: new Date().toISOString(),
      };
      try {
        await axios.post("http://localhost:8000/sendMessage", {
          clanName: clanName,
          message: newMessage,
        });

        socket.emit("chat message", newMessage);
        setMessageInput("");
        scrollToBottom(); // Scroll to bottom after sending message
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <ul id="messages">
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.sender}</strong> (
            {new Date(msg.timestamp).toLocaleString()}): {msg.content}
          </li>
        ))}
        <div ref={messagesEndRef} /> {/* Scroll to bottom ref */}
      </ul>
      <form id="form" onSubmit={sendMessage}>
        <input
          id="messageInput"
          autoComplete="off"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      <style jsx>{`
        body {
          margin: 0;
          padding-bottom: 3rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
        }

        #form {
          background: rgba(0, 0, 0, 0.15);
          padding: 0.25rem;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          height: 3rem;
          box-sizing: border-box;
          backdrop-filter: blur(10px);
        }

        #messageInput {
          border: none;
          padding: 0 1rem;
          flex-grow: 1;
          border-radius: 2rem;
          margin: 0.25rem;
        }

        #messageInput:focus {
          outline: none;
        }

        #form > button {
          background: #333;
          border: none;
          padding: 0 1rem;
          margin: 0.25rem;
          border-radius: 3px;
          outline: none;
          color: #fff;
          cursor: pointer;
        }

        #messages {
          list-style-type: none;
          margin: 0;
          padding: 0;
          overflow-y: auto;
          max-height: calc(100vh - 120px); /* Adjust max height as per your design */
        }

        #messages > li {
          padding: 0.5rem 1rem;
        }

        #messages > li:nth-child(odd) {
          background: #efefef;
        }
      `}</style>
    </div>
  );
};

export default Chat;
