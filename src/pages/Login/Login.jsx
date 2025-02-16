import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      axios
        .get("http://localhost:1337/api/users/me", {
          headers: { Authorization: `${token}` },
        })
        .then((res) => {
          console.log("User already logged in:", res.data);
          navigate("/message");
        })
        .catch(() => {
          Cookies.remove("token");
        });
    }
  }, []);

  const loginSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:1337/api/auth/local", {
        identifier: username,
        password: password,
      });

      const token = res.data.jwt;
      Cookies.set("token", `Bearer ${token}`, { expires: 7 });
      Cookies.set("username", username, { expires: 7 });

      toast.success("Login successful!");
      navigate("/message");
    } catch (err) {
      toast.error("Invalid username or password");
      console.error("Error in login:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Welcome Back</h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="login-username" className="block text-gray-300 text-sm font-medium mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                id="login-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            onClick={loginSubmit}
            className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;