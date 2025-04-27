import React, { useState } from 'react';
import { useMarsRoverPhotos } from '../hooks/useNasaApi';

export default function MarsRover() {
  const [selectedRover, setSelectedRover] = useState('curiosity');
  const [sol, setSol] = useState(1000);
  const { photos, loading, error } = useMarsRoverPhotos(selectedRover, sol);
  const [activePhoto, setActivePhoto] = useState(null);

  const rovers = [
    { id: 'curiosity', name: 'Curiosity', launched: 'November 26, 2011', landed: 'August 6, 2012' },
    { id: 'opportunity', name: 'Opportunity', launched: 'July 7, 2003', landed: 'January 25, 2004' },
    { id: 'spirit', name: 'Spirit', launched: 'June 10, 2003', landed: 'January 4, 2004' },
    { id: 'perseverance', name: 'Perseverance', launched: 'July 30, 2020', landed: 'February 18, 2021' }
  ];

  const handleSolChange = (e) => {
    setSol(parseInt(e.target.value));
  };

  const handleRoverChange = (roverId) => {
    setSelectedRover(roverId);
    setActivePhoto(null);
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white mt-4 text-lg">Loading Mars rover photos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <div className="text-center p-8 bg-gray-800 rounded-lg">
          <h2 className="text-2xl mb-4">Houston, we have a problem</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-black text-white animate-fadeIn">
      {/* Header */}
      <header className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-md p-4 z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-2 sm:mb-0">
            <img 
              src="/Nasa_Logo_Loading.svg" 
              alt="NASA Logo" 
              className="h-8 w-8 sm:h-10 sm:w-10" 
            />
            <h1 className="text-lg sm:text-xl font-bold">Mars Rover Photos</h1>
          </div>
          <div className="flex items-center">
            <a href="/" className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md transition-colors text-sm sm:text-base">
              Back to APOD
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-3 md:p-6">
        {/* Controls */}
        <div className="bg-gray-800 bg-opacity-60 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Select a Mars Rover</h2>
              <div className="flex flex-wrap gap-2">
                {rovers.map(rover => (
                  <button
                    key={rover.id}
                    onClick={() => handleRoverChange(rover.id)}
                    className={`px-2 sm:px-3 py-1 text-sm sm:text-base rounded-md transition-colors ${
                      selectedRover === rover.id
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    }`}
                  >
                    {rover.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full md:w-auto">
              <label htmlFor="sol" className="block mb-2 text-sm sm:text-base">
                Mars Sol: {sol}
              </label>
              <input
                id="sol"
                type="range"
                min="1"
                max="3000"
                value={sol}
                onChange={handleSolChange}
                className="w-full md:w-64 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Selected Rover Info */}
        {selectedRover && (
          <div className="bg-gray-800 bg-opacity-60 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              {rovers.find(r => r.id === selectedRover).name} Rover
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
              <div>
                <p className="text-gray-400">Launched:</p>
                <p>{rovers.find(r => r.id === selectedRover).launched}</p>
              </div>
              <div>
                <p className="text-gray-400">Landed on Mars:</p>
                <p>{rovers.find(r => r.id === selectedRover).landed}</p>
              </div>
            </div>
          </div>
        )}

        {/* Photo Gallery */}
        {photos.length > 0 ? (
          <>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Photos from Sol {sol}</h3>
            
            {/* Selected photo view */}
            {activePhoto && (
              <div className="mb-4 sm:mb-8 bg-gray-800 bg-opacity-60 rounded-lg overflow-hidden">
                <div className="relative">
                  <img 
                    src={activePhoto.img_src} 
                    alt={`Mars from ${selectedRover}`}
                    className="w-full object-contain max-h-[50vh] sm:max-h-[70vh]"
                  />
                  <button 
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black bg-opacity-70 p-1 sm:p-2 rounded-full"
                    onClick={() => setActivePhoto(null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-gray-400">Date:</span> {new Date(activePhoto.earth_date).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="text-gray-400">Camera:</span> {activePhoto.camera.full_name} ({activePhoto.camera.name})
                    </div>
                    <div>
                      <span className="text-gray-400">Sol:</span> {activePhoto.sol}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Thumbnail grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
              {photos.slice(0, 20).map(photo => (
                <div 
                  key={photo.id} 
                  className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
                  onClick={() => setActivePhoto(photo)}
                >
                  <div className="h-32 sm:h-40 overflow-hidden bg-black flex items-center justify-center">
                    <img 
                      src={photo.img_src} 
                      alt={`Mars from ${selectedRover}`} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs truncate text-gray-400">
                      {activePhoto && activePhoto.id === photo.id ? photo.camera.full_name : photo.camera.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {photos.length > 20 && (
              <p className="text-center mt-4 sm:mt-6 text-sm text-gray-400">
                Showing 20 of {photos.length} photos
              </p>
            )}
          </>
        ) : (
          <div className="bg-gray-800 bg-opacity-60 p-4 sm:p-8 rounded-lg text-center">
            <p className="text-base sm:text-xl">No photos found for this rover on Sol {sol}</p>
            <p className="mt-2 text-sm sm:text-base text-gray-400">Try a different sol or rover</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8 sm:mt-12 py-4 sm:py-6 border-t border-gray-800 text-center text-gray-400">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs sm:text-sm">
            Data provided by the{" "}
            <a 
              href="https://api.nasa.gov/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              NASA Mars Rover Photos API
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
} 