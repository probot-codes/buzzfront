import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, LogIn, UserPlus } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl font-bold mb-8">
            Welcome to BUZZ
          </h1>
          <p className="text-xl mb-12 text-gray-300">
            Join our community and start connecting with people around the world
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
              <div className="flex justify-center mb-6">
                <LogIn className="w-12 h-12 text-purple-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Login</h2>
              <p className="mb-6 text-gray-400">Already have an account? Sign in to continue</p>
              <Link
                to="/login"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Sign In
              </Link>
            </div>

            <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
              <div className="flex justify-center mb-6">
                <UserPlus className="w-12 h-12 text-purple-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Register</h2>
              <p className="mb-6 text-gray-400">New to Buzz? Create an account to get started.</p>
              <Link
                to="/register"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>

            <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
              <div className="flex justify-center mb-6">
                <MessageCircle className="w-12 h-12 text-purple-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Messages</h2>
              <p className="mb-6 text-gray-400">Access your messages and stay connected with friends.</p>
              <Link
                to="/message"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                View Messages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;