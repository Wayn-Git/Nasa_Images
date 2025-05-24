import React, { useState } from 'react';
import { useMarsRoverPhotos } from '../hooks/useNasaApi';
import LoadingScreen from './LoadingScreen';

export default function MarsRover() {
  const [selectedRover, setSelectedRover] = useState('curiosity');
  const [sol, setSol] = useState(1000);
  const { photos, loading, error } = useMarsRoverPhotos(selectedRover, sol);
  const [activePhoto, setActivePhoto] = useState(null);
  const [showStats, setShowStats] = useState(false);

  const rovers = [
    { id: 'curiosity', name: 'Curiosity', launched: 'November 26, 2011', landed: 'August 6, 2012', status: 'Active' },
    { id: 'opportunity', name: 'Opportunity', launched: 'July 7, 2003', landed: 'January 25, 2004', status: 'Mission Complete' },
    { id: 'spirit', name: 'Spirit', launched: 'June 10, 2003', landed: 'January 4, 2004', status: 'Mission Complete' },
    { id: 'perseverance', name: 'Perseverance', launched: 'July 30, 2020', landed: 'February 18, 2021', status: 'Active' }
  ];

  const handleSolChange = (e) => {
    setSol(parseInt(e.target.value));
  };

  const handleRoverChange = (roverId) => {
    setSelectedRover(roverId);
    setActivePhoto(null);
  };

  if (loading) {
    return <LoadingScreen message="Loading Mars rover photos..." />;
  }

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

  const selectedRoverInfo = rovers.find(r => r.id === selectedRover);

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
            <h1 className="text-2xl font-bold neon-text">Mars Rover Photos</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowStats(!showStats)}
              className="cyber-button"
            >
              {showStats ? 'Hide Stats' : 'Show Stats'}
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
              <h2 className="text-xl font-bold mb-4 neon-text">Select a Mars Rover</h2>
              <div className="grid grid-cols-2 gap-3">
                {rovers.map(rover => (
                  <button
                    key={rover.id}
                    onClick={() => handleRoverChange(rover.id)}
                    className={`cyber-button ${
                      selectedRover === rover.id
                        ? 'bg-primary-color text-background-dark'
                        : ''
                    }`}
                  >
                    {rover.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="sol" className="block mb-4 text-lg neon-text">
                Mars Sol: {sol}
              </label>
              <input
                id="sol"
                type="range"
                min="1"
                max="3000"
                value={sol}
                onChange={handleSolChange}
                className="cyber-input w-full"
              />
            </div>
          </div>
        </div>

        {/* Rover Stats */}
        {showStats && selectedRoverInfo && (
          <div className="glass-card p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold mb-4 neon-text">
              {selectedRoverInfo.name} Mission Stats
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="cyber-data">
                <div className="cyber-data-label">Launch Date</div>
                <div className="cyber-data-value">{selectedRoverInfo.launched}</div>
              </div>
              <div className="cyber-data">
                <div className="cyber-data-label">Landing Date</div>
                <div className="cyber-data-value">{selectedRoverInfo.landed}</div>
              </div>
              <div className="cyber-data">
                <div className="cyber-data-label">Status</div>
                <div className="cyber-data-value">{selectedRoverInfo.status}</div>
              </div>
            </div>
          </div>
        )}

        {/* Photo Gallery */}
        {photos.length > 0 ? (
          <>
            <h3 className="text-xl font-bold mb-4 neon-text">Photos from Sol {sol}</h3>
            
            {/* Selected photo view */}
            {activePhoto && (
              <div className="glass-card rounded-lg overflow-hidden mb-6">
                <div className="relative">
                  <img 
                    src={activePhoto.img_src} 
                    alt={`Mars from ${selectedRover}`}
                    className="w-full object-contain max-h-[70vh]"
                  />
                  <button 
                    className="absolute top-4 right-4 bg-background-dark p-2 rounded-full hover:bg-primary-color transition-colors"
                    onClick={() => setActivePhoto(null)}
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
                      <div className="cyber-data-value">{new Date(activePhoto.earth_date).toLocaleDateString()}</div>
                    </div>
                    <div className="cyber-data">
                      <div className="cyber-data-label">Camera</div>
                      <div className="cyber-data-value">{activePhoto.camera.full_name}</div>
                    </div>
                    <div className="cyber-data">
                      <div className="cyber-data-label">Sol</div>
                      <div className="cyber-data-value">{activePhoto.sol}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Thumbnail grid */}
            <div className="cyber-grid">
              {photos.slice(0, 20).map(photo => (
                <div 
                  key={photo.id} 
                  className="cyber-grid-item glass-card cursor-pointer"
                  onClick={() => setActivePhoto(photo)}
                >
                  <div className="aspect-square overflow-hidden bg-black">
                    <img 
                      src={photo.img_src} 
                      alt={`Mars from ${selectedRover}`} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-text-color opacity-75">
                      {photo.camera.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {photos.length > 20 && (
              <p className="text-center mt-6 text-sm text-text-color opacity-75">
                Showing 20 of {photos.length} photos
              </p>
            )}
          </>
        ) : (
          <div className="glass-card p-8 rounded-lg text-center">
            <p className="text-xl neon-text">No photos found for this rover on Sol {sol}</p>
            <p className="mt-2 text-text-color opacity-75">Try a different sol or rover</p>
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
              NASA Mars Rover Photos API
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