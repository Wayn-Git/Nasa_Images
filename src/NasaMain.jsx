import React, { useEffect, useState } from 'react';
import nasaLogo from "./assets/nasaLogo.svg";


export default function Nasa() {
  // State variables for storing data, loading state, and any errors.
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect runs once when the component mounts.
  useEffect(() => {
    fetch('https://api.nasa.gov/planetary/apod?api_key=dhiQLm9oIfQfnCaefEJgXYamze6E9tXi2zZa1SOR')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Convert the response into JSON.
      })
      .then(result => {
        setData(result);   // Save the fetched data.
        setLoading(false); // Data is loaded.
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch NASA data. Please try again later.');
        setLoading(false);
      });
  }, []);

  // If data is still loading, display a loading screen.
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="relative">
          <img
            src={nasaLogo}
            alt="NASA Logo Loading"
            className="w-32 h-32 animate-float neon-text"
          />
          <div className="absolute inset-0 animate-glow rounded-full"></div>
        </div>
        <p className="text-text-color mt-4 text-lg neon-text animate-pulse">Loading today's cosmic wonder...</p>
      </div>
    );
  }

  // If an error occurred, display an error message with a "Try Again" button.
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 glass-card rounded-lg max-w-md mx-4">
          <h2 className="text-2xl mb-4 neon-text">Houston, we have a problem</h2>
          <p className="text-text-color">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-6 py-3 bg-gradient-to-r from-primary-color to-secondary-color hover:from-secondary-color hover:to-primary-color rounded-md transition duration-300 neon-border"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Check if the media type is a video.
  const isVideo = data?.media_type === 'video';

  // Main content rendering.
  return (
    <div className="min-h-screen relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-background-dark opacity-50"></div>
      </div>

      {/* Header Section */}
      <header className="sticky top-0 glass-card p-4 z-10 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={nasaLogo}
                alt="NASA Logo"
                className="h-12 w-12 animate-float"
              />
              <div className="absolute inset-0 animate-glow rounded-full"></div>
            </div>
            <h1 className="text-2xl font-bold neon-text">Astronomy Picture of the Day</h1>
          </div>
          <div className="text-sm text-text-color bg-card-bg px-4 py-2 rounded-full">
            {data.date}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Media Display */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold neon-text text-center lg:text-left">
              {data.title}
            </h2>
            
            <div className="glass-card p-2 rounded-lg overflow-hidden">
              {isVideo ? (
                <div className="aspect-video rounded overflow-hidden">
                  <iframe
                    src={data.url}
                    title={data.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <img
                  src={data.url}
                  alt={data.title}
                  className="w-full rounded transition-all duration-500 hover:scale-105 cursor-pointer"
                  onClick={() => window.open(data.hdurl || data.url, '_blank')}
                />
              )}
            </div>

            {data.copyright && (
              <p className="text-right text-text-color text-sm">
                © {data.copyright}
              </p>
            )}
          </div>

          {/* Right Column - Info Cards */}
          <div className="space-y-6">
            {/* "More Info" Card */}
            <div className="glass-card rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-6 neon-text">More Info</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-text-color text-sm opacity-75">Date</p>
                  <p className="text-lg">{data.date}</p>
                </div>
                <div>
                  <p className="text-text-color text-sm opacity-75">Media Type</p>
                  <p className="text-lg capitalize">{data.media_type}</p>
                </div>
                {data.hdurl && (
                  <div>
                    <p className="text-text-color text-sm opacity-75">HD Available</p>
                    <a 
                      href={data.hdurl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-lg text-primary-color hover:text-secondary-color transition-colors inline-flex items-center"
                    >
                      View High Resolution
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* "About This Image" Card */}
            <div className="glass-card rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-6 neon-text">About This Image</h3>
              <p className="text-text-color leading-relaxed">
                {data.explanation}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="mt-12 py-8 border-t border-primary-color text-center relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-text-color">
            Data provided by the{" "}
            <a 
              href="https://apod.nasa.gov/apod/astropix.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-color hover:text-secondary-color transition-colors inline-flex items-center"
            >
              NASA Astronomy Picture of the Day API
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
