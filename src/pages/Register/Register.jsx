import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Lock, User, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const res = await axios.get("http://localhost:1337/api/users/me", {
            headers: { Authorization: token },
          });
          console.log("User already logged in:", res.data);
          navigate("/message");
        } catch (err) {
          console.error("Invalid token, logging out user.");
          Cookies.remove("token");
          Cookies.remove("username");
        }
      }
    };
    checkAuth();
  }, []);

  const registerSubmit = async () => {
    if (!username.trim() || !password.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:1337/api/auth/local/register",
        {
          username,
          password,
          email,
        }
      );
      toast.success("Registration successful!");

      const res_login = await axios.post(
        "http://localhost:1337/api/auth/local",
        {
          identifier: username,
          password,
        }
      );

      const token = res_login.data.jwt;
      Cookies.set("token", `Bearer ${token}`, { expires: 1 });
      Cookies.set("username", username, { expires: 1 });

      navigate("/message");
    } catch (err) {
      toast.error("Registration failed. Please try again.");
      console.error("Error in Register", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Create Account</h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="register-username" className="block text-gray-300 text-sm font-medium mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                id="register-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Choose a username"
              />
            </div>
          </div>

          <div>
            <label htmlFor="register-email" className="block text-gray-300 text-sm font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                id="register-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="register-password" className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                id="register-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Choose a password"
              />
            </div>
          </div>

          <button
            onClick={registerSubmit}
            className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;