import React from 'react';

export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* Loading Content */}
      <div className="text-center">
        {/* NASA Logo */}
        <div className="mb-8">
          <img 
            src="/Nasa_Logo_Loading.svg" 
            alt="NASA Logo" 
            className="w-16 h-16"
          />
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold neon-text">{message}</h2>
          <div className="flex justify-center space-x-2">
            <div className="w-1.5 h-1.5 bg-primary-color rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-primary-color rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-primary-color rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 