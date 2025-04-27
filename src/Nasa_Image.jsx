import React, { useEffect, useState } from 'react';

export default function Nasa() {
  // Define state variables for our API data, loading status, and error messages.
  const [data, setData] = useState(null); // Will hold the NASA APOD data.
  const [loading, setLoading] = useState(true); // Starts as true until data is fetched.
  const [error, setError] = useState(null); // Stores any error message.
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Today's date in YYYY-MM-DD format
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('nasaFavorites')) || []); // Favorites list
  const [recentImages, setRecentImages] = useState([]); // Recent images
  const [showRecent, setShowRecent] = useState(false); // Toggle for recent images panel
  const [dateInputOpen, setDateInputOpen] = useState(false); // Toggle for date selector

  const API_KEY = 'dhiQLm9oIfQfnCaefEJgXYamze6E9tXi2zZa1SOR';

  // Function to fetch data for a specific date
  const fetchImageForDate = (date) => {
    setLoading(true);
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch NASA data. Please try again later.');
        setLoading(false);
      });
  };

  // Function to fetch multiple recent images
  const fetchRecentImages = () => {
    // Get dates for the last 7 days
    const dates = Array(7).fill().map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i - 1); // -1 to exclude today
      return date.toISOString().split('T')[0];
    });

    Promise.all(
      dates.map(date => 
        fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`)
          .then(response => response.ok ? response.json() : null)
      )
    )
    .then(results => {
      setRecentImages(results.filter(Boolean));
    })
    .catch(err => {
      console.error("Error fetching recent images:", err);
    });
  };

  // Function to fetch a random image
  const fetchRandomImage = () => {
    setLoading(true);
    // Get a random date between NASA APOD start (June 16, 1995) and today
    const startDate = new Date('1995-06-16');
    const today = new Date();
    const randomTime = startDate.getTime() + Math.random() * (today.getTime() - startDate.getTime());
    const randomDate = new Date(randomTime).toISOString().split('T')[0];
    
    setSelectedDate(randomDate);
    fetchImageForDate(randomDate);
  };

  // Function to handle date changes
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    fetchImageForDate(newDate);
    setDateInputOpen(false);
  };

  // Function to toggle favorite status
  const toggleFavorite = () => {
    if (!data) return;
    
    const isFavorite = favorites.some(fav => fav.date === data.date);
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter(fav => fav.date !== data.date);
    } else {
      newFavorites = [...favorites, data];
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('nasaFavorites', JSON.stringify(newFavorites));
  };

  // Check if current image is in favorites
  const isFavorite = data && favorites.some(fav => fav.date === data.date);

  // Initial data fetch
  useEffect(() => {
    fetchImageForDate(selectedDate);
    fetchRecentImages();
  }, []); // Empty array means this runs only once.

  // If the app is still loading data, show a loading screen.
  if (loading) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center">
        <img
          src="/Nasa_Logo_Loading.svg"
          alt="NASA Logo Loading"
          className="w-32 h-32 animate-pulse"
        />
        <p className="text-white mt-4 text-lg">Loading today's cosmic wonder...</p>
      </div>
    );
  }

  // If an error occurred, show an error message with a "Try Again" button.
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

  // Determine if the media is a video or an image.
  const isVideo = data?.media_type === 'video';

  // Main content rendering.
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header Section */}
      <header className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-md p-4 z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-3 sm:mb-0">
            <img 
              src="/Nasa_Logo_Loading.svg" 
              alt="NASA Logo" 
              className="h-10 w-10" 
            />
            <h1 className="text-lg sm:text-xl font-bold">Astronomy Picture of the Day</h1>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Mars Rover link */}
            <a 
              href="/mars-rover" 
              className="bg-red-900 hover:bg-red-800 px-3 py-1 rounded-md transition-colors flex items-center text-sm sm:text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Mars Rover
            </a>

            {/* Earth View link */}
            <a 
              href="/earth-view" 
              className="bg-blue-900 hover:bg-blue-800 px-3 py-1 rounded-md transition-colors flex items-center text-sm sm:text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Earth View
            </a>
            
            {/* Date selector dropdown */}
            <div className="relative">
              <button 
                onClick={() => setDateInputOpen(!dateInputOpen)}
                className="flex items-center space-x-1 bg-gray-800 px-3 py-1 rounded-md hover:bg-gray-700 transition-colors text-sm sm:text-base"
              >
                <span>{new Date(selectedDate).toLocaleDateString()}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {dateInputOpen && (
                <div className="absolute right-0 mt-2 bg-gray-800 p-3 rounded-lg shadow-xl z-20 animate-fadeIn">
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={handleDateChange}
                    max={new Date().toISOString().split('T')[0]}
                    min="1995-06-16" // First APOD image date
                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                  />
                </div>
              )}
            </div>
            
            {/* Random image button */}
            <button 
              onClick={fetchRandomImage} 
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md transition-colors flex items-center"
              title="Get a random astronomy picture"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Random
            </button>
            
            {/* Recent images toggle */}
            <button 
              onClick={() => setShowRecent(!showRecent)} 
              className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md transition-colors"
              title="Browse recent daily images"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Recent Images Panel (Slide-in from right) */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-gray-900 transform transition-transform duration-300 ease-in-out z-50 ${showRecent ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h3 className="text-xl font-semibold">Recent Cosmic Wonders</h3>
          <button 
            onClick={() => setShowRecent(false)} 
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
          {recentImages.length > 0 ? (
            <div className="space-y-4">
              {recentImages.map((image, index) => (
                <div 
                  key={image.date} 
                  className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer transform transition hover:scale-[1.02]"
                  onClick={() => {
                    setSelectedDate(image.date);
                    fetchImageForDate(image.date);
                    setShowRecent(false);
                  }}
                >
                  <div className="h-32 bg-gray-700 overflow-hidden">
                    {image.media_type === 'image' ? (
                      <img 
                        src={image.url} 
                        alt={image.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="text-sm text-gray-400">{new Date(image.date).toLocaleDateString()}</div>
                    <div className="text-sm font-medium line-clamp-2">{image.title}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Loading recent images...</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto p-4 md:p-6 animate-fadeIn">
        {/* Title of the image/video */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-300">
            {data.title}
          </h2>
          
          {/* Favorite button */}
          <button 
            onClick={toggleFavorite} 
            className={`p-2 rounded-full transition-colors ${isFavorite ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-400 hover:text-yellow-400'}`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill={isFavorite ? "currentColor" : "none"} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        </div>
        
        {/* Media Display Section with enhanced animations */}
        <div className="bg-gray-800 bg-opacity-60 p-2 rounded-lg shadow-2xl overflow-hidden mb-6 transform transition-all hover:shadow-blue-900/20 group">
          {isVideo ? (
            // If the data is a video, use an iframe to embed it.
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
            // If the data is an image, display it with enhanced hover effects
            <div className="relative overflow-hidden rounded">
              <img
                src={data.url}
                alt={data.title}
                className="w-full transition-all duration-700 ease-in-out group-hover:scale-105"
              />
              {data.hdurl && (
                <a
                  href={data.hdurl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  View HD
                </a>
              )}
            </div>
          )}
        </div>
        
        {/* Copyright Information (if available) */}
        {data.copyright && (
          <p className="text-right text-gray-400 text-sm mb-6">
            © {data.copyright}
          </p>
        )}

        {/* Additional Information Cards with updated design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* "More Info" Card */}
          <div className="bg-gray-800 bg-opacity-60 rounded-lg p-4 shadow-lg hover:shadow-blue-900/10 transition-shadow">
            <h3 className="text-xl font-semibold mb-4 text-blue-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              More Info
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Date</p>
                <p>{new Date(data.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Media Type</p>
                <p className="capitalize flex items-center">
                  {data.media_type === 'image' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                  {data.media_type}
                </p>
              </div>
              {data.hdurl && (
                <div>
                  <p className="text-gray-400 text-sm">HD Available</p>
                  <a 
                    href={data.hdurl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View High Resolution
                  </a>
                </div>
              )}
              <div>
                <p className="text-gray-400 text-sm">Share</p>
                <div className="flex space-x-2 mt-1">
                  <button 
                    onClick={() => navigator.clipboard.writeText(window.location.href + `?date=${data.date}`)}
                    className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                    title="Copy link"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                  <a 
                    href={`https://twitter.com/intent/tweet?text=Check out this NASA Astronomy Picture of the Day: ${data.title}&url=${encodeURIComponent(window.location.href + `?date=${data.date}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                    title="Share on Twitter"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* "About This Image" Card */}
          <div className="bg-gray-800 bg-opacity-60 rounded-lg p-4 shadow-lg md:col-span-2 hover:shadow-blue-900/10 transition-shadow">
            <h3 className="text-xl font-semibold mb-4 text-blue-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About This Image
            </h3>
            <p className="text-gray-200 leading-relaxed">
              {data.explanation}
            </p>
          </div>
        </div>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4 text-blue-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Your Cosmic Favorites
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {favorites.map(fav => (
                <div 
                  key={fav.date} 
                  className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer transform transition hover:scale-105"
                  onClick={() => {
                    setSelectedDate(fav.date);
                    fetchImageForDate(fav.date);
                  }}
                >
                  <div className="h-28 bg-gray-700 overflow-hidden">
                    {fav.media_type === 'image' ? (
                      <img 
                        src={fav.url} 
                        alt={fav.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <div className="text-xs text-gray-400">{new Date(fav.date).toLocaleDateString()}</div>
                    <div className="text-xs font-medium truncate">{fav.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer Section */}
      <footer className="mt-12 py-6 border-t border-gray-800 text-center text-gray-400">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-sm">
            Data provided by the{" "}
            <a 
              href="https://apod.nasa.gov/apod/astropix.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              NASA Astronomy Picture of the Day API
            </a>
          </p>
          <p className="text-xs mt-2">
            <a 
              href="https://api.nasa.gov/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-400"
            >
              Explore more NASA APIs
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
