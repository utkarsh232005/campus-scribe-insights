import React from 'react';
import { Link } from 'react-router-dom';
import { School } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4 py-24 text-center">
        <School className="mx-auto h-20 w-20 text-blue-500 animate-float" />
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mt-4">
          Welcome to College Report Portal
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          Streamlining annual report submissions for faculty and administrators.
        </p>
        <div className="mt-8 flex justify-center">
          <Link to="/login">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full">
              Get Started
            </button>
          </Link>
        </div>
        <div className="mt-12">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} College Report Portal. All rights reserved.
          </p>
        </div>
      </div>
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
