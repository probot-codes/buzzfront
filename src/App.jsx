import React from 'react';
import { Route, Routes, Link, useLocation } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { Home as HomeIcon } from 'lucide-react';
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Message from "./pages/Message/Message";

function App() {
  const location = useLocation();
  const showHomeButton = location.pathname !== '/';

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            duration: 3000,
          },
          error: {
            duration: 4000,
          },
        }}
      />
      {showHomeButton && (
        <div className="fixed top-4 left-4 z-50">
          <Link
            to="/"
            className="bg-gray-800 p-3 rounded-full text-white hover:bg-gray-700 transition-colors shadow-lg flex items-center justify-center"
            title="Return to Home"
          >
            <HomeIcon className="w-6 h-6" />
          </Link>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/message" element={<Message />} />
      </Routes>
    </>
  );
}

export default App;