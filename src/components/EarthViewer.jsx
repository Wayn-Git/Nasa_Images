import React, { useState } from 'react';
import { useEarthImages } from '../hooks/useNasaApi';
import LoadingScreen from './LoadingScreen';

export default function EarthViewer() {
  const [selectedDate, setSelectedDate] = useState('');
  const [activeImage, setActiveImage] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const { images, loading, error } = useEarthImages(selectedDate);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setActiveImage(null);
  };

  if (loading) {
    return <LoadingScreen message="Loading Earth images..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 glass-card rounded-lg max-w-md mx-4">
          <h2 className="text-2xl mb-4 neon-text">Connection Error</h2>
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 glass-card p-4 z-10 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src="/Nasa_Logo_Loading.svg" 
                alt="NASA Logo" 
                className="h-12 w-12"
              />
            </div>
            <h1 className="text-2xl font-bold neon-text">Earth Viewer</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="cyber-button"
            >
              {showInfo ? 'Hide Info' : 'Show Info'}
            </button>
            <a href="/" className="cyber-button">
              Back to APOD
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Controls */}
        <div className="glass-card p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold mb-4 neon-text">Select a Date</h2>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="cyber-input w-full"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            {showInfo && (
              <div>
                <h2 className="text-xl font-bold mb-4 neon-text">About EPIC</h2>
                <p className="text-text-color">
                  The Earth Polychromatic Imaging Camera (EPIC) provides daily natural-color views of Earth from its position at Lagrange point 1, approximately 1.5 million kilometers from Earth.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        {images.length > 0 ? (
          <>
            <h3 className="text-xl font-bold mb-4 neon-text">
              Earth from Space - {new Date(selectedDate).toLocaleDateString()}
            </h3>
            
            {/* Selected image view */}
            {activeImage && (
              <div className="glass-card rounded-lg overflow-hidden mb-6">
                <div className="relative">
                  <img 
                    src={activeImage.image} 
                    alt="Earth from space"
                    className="w-full object-contain max-h-[70vh]"
                  />
                  <button 
                    className="absolute top-4 right-4 bg-background-dark p-2 rounded-full hover:bg-primary-color transition-colors"
                    onClick={() => setActiveImage(null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="cyber-data">
                      <div className="cyber-data-label">Date</div>
                      <div className="cyber-data-value">{new Date(activeImage.date).toLocaleDateString()}</div>
                    </div>
                    <div className="cyber-data">
                      <div className="cyber-data-label">Time</div>
                      <div className="cyber-data-value">{new Date(activeImage.date).toLocaleTimeString()}</div>
                    </div>
                    <div className="cyber-data">
                      <div className="cyber-data-label">Caption</div>
                      <div className="cyber-data-value">{activeImage.caption}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Thumbnail grid */}
            <div className="cyber-grid">
              {images.map(image => (
                <div 
                  key={image.identifier} 
                  className="cyber-grid-item glass-card cursor-pointer"
                  onClick={() => setActiveImage(image)}
                >
                  <div className="aspect-square overflow-hidden bg-black">
                    <img 
                      src={image.thumbnail} 
                      alt="Earth from space" 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-text-color opacity-75">
                      {new Date(image.date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="glass-card p-8 rounded-lg text-center">
            <p className="text-xl neon-text">No images available for this date</p>
            <p className="mt-2 text-text-color opacity-75">Try selecting a different date</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 py-8 border-t border-primary-color text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-text-color">
            Data provided by the{" "}
            <a 
              href="https://api.nasa.gov/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-color hover:text-secondary-color transition-colors inline-flex items-center"
            >
              NASA EPIC API
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