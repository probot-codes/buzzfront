import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Send, LogOut } from 'lucide-react';
import { io } from "socket.io-client";
import toast from 'react-hot-toast';

const socket = io("http://localhost:1337", { transports: ["websocket"] });

const Message = () => {
  const [message, setMessage] = useState("");
  const [convo, setConvo] = useState([]);
  const navigate = useNavigate();
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [convo]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = Cookies.get("token");
        const username = Cookies.get("username");

        if (!token || !username) {
          toast.error("Please login to continue");
          navigate("/login");
          return;
        }

        const decodeJWT = (token) => {
          try {
            return JSON.parse(atob(token.split(".")[1]));
          } catch (e) {
            console.error("Error decoding JWT:", e);
            return null;
          }
        };

        const decodedToken = decodeJWT(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (!decodedToken || (decodedToken.exp && decodedToken.exp < currentTime)) {
          toast.error("Session expired. Please login again");
          Cookies.remove("token");
          Cookies.remove("username");
          navigate("/login");
          return;
        }

        const res = await axios.get(
          `http://localhost:1337/api/messages?filters[from][$eq]=${username}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const formattedMessages = res.data.data.flatMap((msg) => [
          { from: username, content: msg.content, time: msg.time },
          { from: "server", content: msg.content, time: msg.time },
        ]);

        setConvo(formattedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages");
      }
    };

    fetchMessages();

    socket.on("message", async (msg) => {
      const serverMessage = { from: "server", content: msg.content, time: msg.time };

      try {
        const token = Cookies.get("token");
        await axios.post(
          "http://localhost:1337/api/messages",
          { data: serverMessage },
          { headers: { Authorization: `${token}` } }
        );
        toast.success("New message received");
      } catch (error) {
        console.error("Error saving server message:", error);
        toast.error("Failed to save message");
      }

      setConvo((prev) => [...prev, serverMessage]);
    });

    return () => {
      socket.off("message");
    };
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("username");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const token = Cookies.get("token");
      const username = Cookies.get("username");

      if (!token || !username) {
        toast.error("Please login to continue");
        navigate("/login");
        return;
      }

      const decodeJWT = (token) => {
        try {
          return JSON.parse(atob(token.split(".")[1]));
        } catch (e) {
          console.error("Error decoding JWT:", e);
          return null;
        }
      };

      const decodedToken = decodeJWT(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (!decodedToken || (decodedToken.exp && decodedToken.exp < currentTime)) {
        toast.error("Session expired. Please login again");
        Cookies.remove("token");
        Cookies.remove("username");
        navigate("/login");
        return;
      }

      const currentTimeString = new Date().toLocaleTimeString("en-US", {
        hour12: false,
      });

      const newMessage = {
        content: message,
        time: currentTimeString,
        from: username,
      };

      await axios.post(
        "http://localhost:1337/api/messages",
        { data: newMessage },
        { headers: { Authorization: `${token}` } }
      );

      setConvo((prev) => [...prev, { from: username, content: message, time: currentTimeString }]);
      socket.emit("message", newMessage);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="bg-gray-800 p-4 shadow-lg flex justify-between items-center">
        <div className="flex-1 text-center">
          <h2 className="text-2xl font-bold text-white">Chat Room</h2>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      <div className="flex-1 p-4 overflow-hidden">
        <div className="bg-gray-800 rounded-lg shadow-xl h-[calc(100vh-12rem)] flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {convo.map((item, index) => (
                <div
                  key={index}
                  className={`flex ${
                    item.from === "server" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      item.from === "server"
                        ? "bg-gray-700 text-white"
                        : "bg-purple-600 text-white"
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">{item.from}</p>
                    <p className="break-words">{item.content}</p>
                    {item.time && (
                      <p className="text-xs opacity-75 mt-1">{item.time}</p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={sendMessage}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;