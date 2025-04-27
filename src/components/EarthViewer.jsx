import React, { useState, useEffect } from 'react';
import { useEpicImagery } from '../hooks/useNasaApi';

// Import API key 
const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'dhiQLm9oIfQfnCaefEJgXYamze6E9tXi2zZa1SOR';

export default function EarthViewer() {
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Set initial date when available dates are loaded
  useEffect(() => {
    fetch(`https://api.nasa.gov/EPIC/api/natural/available?api_key=${API_KEY}`)
      .then(response => response.json())
      .then(dates => {
        setAvailableDates(dates.sort().reverse());
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }
      })
      .catch(error => console.error('Error fetching available dates:', error));
  }, []);
  
  const { epicData, loading, error } = useEpicImagery(selectedDate);
  
  // Format date for image URL (YYYY/MM/DD)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  };
  
  // Build image URL from the EPIC data
  const getImageUrl = (image) => {
    if (!image) return '';
    const formattedDate = formatDate(selectedDate);
    return `https://api.nasa.gov/EPIC/archive/natural/${formattedDate}/png/${image.image}.png?api_key=${API_KEY}`;
  };
  
  // Handle date change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setActiveImageIndex(0);
  };
  
  // Navigation for images
  const goToNextImage = () => {
    if (activeImageIndex < epicData.length - 1) {
      setActiveImageIndex(activeImageIndex + 1);
    } else {
      setActiveImageIndex(0); // Loop back to the first image
    }
  };
  
  const goToPrevImage = () => {
    if (activeImageIndex > 0) {
      setActiveImageIndex(activeImageIndex - 1);
    } else {
      setActiveImageIndex(epicData.length - 1); // Loop to the last image
    }
  };
  
  if (loading || availableDates.length === 0) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white mt-4 text-lg">Loading Earth imagery...</p>
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

  const activeImage = epicData[activeImageIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white animate-fadeIn">
      {/* Header */}
      <header className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-md p-4 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="/Nasa_Logo_Loading.svg" 
              alt="NASA Logo" 
              className="h-10 w-10" 
            />
            <h1 className="text-xl font-bold m-2">Earth from Space</h1>
          </div>
          <div className="flex items-center space-x-3">
            <a href="/" className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md transition-colors">
              Back to APOD
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Controls */}
        <div className="bg-gray-800 bg-opacity-60 p-4 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-3">EPIC: Earth Polychromatic Imaging Camera</h2>
              <p className="text-gray-300">Daily imagery of Earth from NASA's DSCOVR satellite</p>
            </div>
            <div>
              <label htmlFor="date-select" className="block mb-2">Select Date:</label>
              <select 
                id="date-select"
                value={selectedDate}
                onChange={handleDateChange}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white w-full"
              >
                {availableDates.map(date => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Image Display */}
        {epicData.length > 0 ? (
          <div className="bg-gray-800 bg-opacity-60 rounded-lg overflow-hidden">
            <div className="relative">
              <div className="flex justify-center bg-black">
                <img 
                  src={getImageUrl(activeImage)} 
                  alt="Earth from Space" 
                  className="max-h-[70vh] object-contain"
                />
              </div>
              
              {/* Image navigation controls */}
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <button 
                  onClick={goToPrevImage}
                  className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={goToNextImage}
                  className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Image counter */}
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 px-3 py-1 rounded text-sm">
                {activeImageIndex + 1} / {epicData.length}
              </div>
            </div>
            
            {/* Image Information */}
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Capture Time</h3>
                  <p>{new Date(activeImage.date).toLocaleTimeString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Coordinates</h3>
                  <p>Lat: {activeImage.centroid_coordinates.lat.toFixed(2)}°, Lon: {activeImage.centroid_coordinates.lon.toFixed(2)}°</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Sun Position</h3>
                  <div className="flex space-x-4">
                    <div>
                      <span className="text-gray-400 text-sm">Azimuth:</span>
                      <p>{activeImage.sun_j2000_position.x.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Elevation:</span>
                      <p>{activeImage.sun_j2000_position.y.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-semibold mb-2">About EPIC</h3>
                <p className="text-gray-300">
                  The EPIC camera takes images of the sunlit side of Earth for various Earth science monitoring purposes. 
                  Images are taken using different spectral filters and are approximately 3 hours apart.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 bg-opacity-60 p-8 rounded-lg text-center">
            <p className="text-xl">No EPIC images available for {new Date(selectedDate).toLocaleDateString()}</p>
            <p className="mt-2 text-gray-400">Please select a different date</p>
          </div>
        )}
        
        {/* Thumbnails */}
        {epicData.length > 1 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">All images from {new Date(selectedDate).toLocaleDateString()}</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {epicData.map((image, index) => (
                <div 
                  key={image.identifier} 
                  className={`
                    cursor-pointer overflow-hidden rounded
                    ${index === activeImageIndex ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'}
                  `}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img 
                    src={getImageUrl(image)} 
                    alt={`Earth at ${new Date(image.date).toLocaleTimeString()}`} 
                    className="w-full h-16 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-800 text-center text-gray-400">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-sm">
            Data provided by the{" "}
            <a 
              href="https://epic.gsfc.nasa.gov/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              NASA EPIC (Earth Polychromatic Imaging Camera)
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
} 