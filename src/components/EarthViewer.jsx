import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useEpicImagery } from '../hooks/useNasaApi';

// Import API key 
const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'dhiQLm9oIfQfnCaefEJgXYamze6E9tXi2zZa1SOR';

// Cache for dates and images to avoid redundant fetches
const dateCache = new Map();
const imageCache = new Map();

export default function EarthViewer() {
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [loadedThumbnails, setLoadedThumbnails] = useState(0);
  const mainImageRef = useRef(null);
  
  // Set initial date when available dates are loaded
  useEffect(() => {
    // Check if dates are in cache first
    if (dateCache.has('availableDates')) {
      const cachedDates = dateCache.get('availableDates');
      setAvailableDates(cachedDates);
      if (cachedDates.length > 0 && !selectedDate) {
        setSelectedDate(cachedDates[0]);
      }
      return;
    }

    // Otherwise fetch from API
    fetch(`https://api.nasa.gov/EPIC/api/natural/available?api_key=${API_KEY}`)
      .then(response => response.json())
      .then(dates => {
        const sortedDates = dates.sort().reverse();
        setAvailableDates(sortedDates);
        if (sortedDates.length > 0) {
          setSelectedDate(sortedDates[0]);
        }
        // Cache the dates
        dateCache.set('availableDates', sortedDates);
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
  const getImageUrl = (image, thumbnail = false) => {
    if (!image) return '';
    const formattedDate = formatDate(selectedDate);
    
    // Use lower quality for thumbnails to improve loading
    if (thumbnail) {
      return `https://api.nasa.gov/EPIC/archive/natural/${formattedDate}/thumbs/${image.image}.jpg?api_key=${API_KEY}`;
    }
    
    const url = `https://api.nasa.gov/EPIC/archive/natural/${formattedDate}/png/${image.image}.png?api_key=${API_KEY}`;
    
    // Cache image URLs
    const cacheKey = `${selectedDate}-${image.image}`;
    if (!imageCache.has(cacheKey)) {
      imageCache.set(cacheKey, url);
    }
    
    return url;
  };
  
  // Handle date change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setActiveImageIndex(0);
    setIsImageLoading(true);
    setShowThumbnails(false);
    setLoadedThumbnails(0);
  };
  
  // Navigation for images
  const goToNextImage = () => {
    if (activeImageIndex < epicData.length - 1) {
      setActiveImageIndex(activeImageIndex + 1);
      setIsImageLoading(true);
    } else {
      setActiveImageIndex(0); // Loop back to the first image
      setIsImageLoading(true);
    }
  };
  
  const goToPrevImage = () => {
    if (activeImageIndex > 0) {
      setActiveImageIndex(activeImageIndex - 1);
      setIsImageLoading(true);
    } else {
      setActiveImageIndex(epicData.length - 1); // Loop to the last image
      setIsImageLoading(true);
    }
  };

  // Preload the next and previous images for smoother navigation
  useEffect(() => {
    if (!epicData || epicData.length === 0) return;
    
    // Preload next image
    const nextIndex = (activeImageIndex + 1) % epicData.length;
    const prevIndex = activeImageIndex === 0 ? epicData.length - 1 : activeImageIndex - 1;
    
    const preloadImage = (index) => {
      const img = new Image();
      img.src = getImageUrl(epicData[index]);
    };
    
    preloadImage(nextIndex);
    preloadImage(prevIndex);
  }, [activeImageIndex, epicData]);

  // Handle main image load completion
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  // Show thumbnails after main image is loaded
  useEffect(() => {
    if (!isImageLoading && epicData && epicData.length > 0) {
      // Only show thumbnails after main image is loaded
      const timer = setTimeout(() => {
        setShowThumbnails(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isImageLoading, epicData]);

  // Limit the number of initial thumbnails to improve performance
  const visibleThumbnails = useMemo(() => {
    if (!epicData) return [];
    // Show only a limited number initially
    return epicData.slice(0, Math.min(epicData.length, 20));
  }, [epicData]);

  // Handle individual thumbnail load
  const handleThumbnailLoad = () => {
    setLoadedThumbnails(prev => prev + 1);
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
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-2 sm:mb-0">
            <img 
              src="/Nasa_Logo_Loading.svg" 
              alt="NASA Logo" 
              className="h-8 w-8 sm:h-10 sm:w-10" 
            />
            <h1 className="text-lg sm:text-xl font-bold">Earth from Space</h1>
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
              <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">EPIC: Earth Polychromatic Imaging Camera</h2>
              <p className="text-sm sm:text-base text-gray-300">Daily imagery of Earth from NASA's DSCOVR satellite</p>
            </div>
            <div className="w-full md:w-auto">
              <label htmlFor="date-select" className="block mb-2 text-sm sm:text-base">Select Date:</label>
              <select 
                id="date-select"
                value={selectedDate}
                onChange={handleDateChange}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white w-full text-sm sm:text-base"
              >
                {availableDates.map(date => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
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
              <div className="flex justify-center bg-black min-h-[30vh] sm:min-h-[50vh]">
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img 
                  ref={mainImageRef}
                  src={getImageUrl(activeImage)}
                  alt="Earth from Space" 
                  className={`max-h-[50vh] sm:max-h-[70vh] object-contain transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={handleImageLoad}
                />
              </div>
              
              {/* Image navigation controls */}
              <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4">
                <button 
                  onClick={goToPrevImage}
                  className="p-1 sm:p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={goToNextImage}
                  className="p-1 sm:p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Image counter */}
              <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-black bg-opacity-70 px-2 py-1 rounded text-xs sm:text-sm">
                {activeImageIndex + 1} / {epicData.length}
              </div>
            </div>
            
            {/* Image Information - Only show when image is loaded */}
            {!isImageLoading && (
              <div className="p-3 sm:p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-sm">
                  <div>
                    <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Capture Time</h3>
                    <p>{new Date(activeImage.date).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Coordinates</h3>
                    <p>Lat: {activeImage.centroid_coordinates.lat.toFixed(2)}°, Lon: {activeImage.centroid_coordinates.lon.toFixed(2)}°</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Sun Position</h3>
                    <div className="flex space-x-4">
                      <div>
                        <span className="text-gray-400 text-xs sm:text-sm">Azimuth:</span>
                        <p>{activeImage.sun_j2000_position.x.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs sm:text-sm">Elevation:</span>
                        <p>{activeImage.sun_j2000_position.y.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 bg-opacity-60 p-4 sm:p-8 rounded-lg text-center">
            <p className="text-base sm:text-xl">No EPIC images available for {new Date(selectedDate).toLocaleDateString()}</p>
            <p className="mt-2 text-sm text-gray-400">Please select a different date</p>
          </div>
        )}
        
        {/* Thumbnails - Only load after main image is visible */}
        {showThumbnails && epicData.length > 1 && (
          <div className="mt-4 sm:mt-6 transition-opacity duration-300">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-3">
              <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-0">Images from {new Date(selectedDate).toLocaleDateString()}</h3>
              <p className="text-xs sm:text-sm text-gray-400">{loadedThumbnails} of {visibleThumbnails.length} loaded</p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1 sm:gap-2">
              {visibleThumbnails.map((image, index) => (
                <div 
                  key={image.identifier} 
                  className={`
                    cursor-pointer overflow-hidden rounded bg-gray-900
                    ${index === activeImageIndex ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'}
                  `}
                  onClick={() => setActiveImageIndex(index)}
                >
                  {/* Use smaller thumbnail images for the grid to load faster */}
                  <img 
                    src={getImageUrl(image, true)} 
                    alt={`Earth at ${new Date(image.date).toLocaleTimeString()}`} 
                    className="w-full h-12 sm:h-16 object-cover"
                    loading="lazy"
                    onLoad={handleThumbnailLoad}
                  />
                </div>
              ))}
            </div>
            {epicData.length > 20 && (
              <p className="text-center mt-2 sm:mt-3 text-xs sm:text-sm text-gray-400">
                Showing 20 of {epicData.length} images
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8 sm:mt-12 py-4 sm:py-6 border-t border-gray-800 text-center text-gray-400">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs sm:text-sm">
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