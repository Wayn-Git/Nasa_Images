import React, { useEffect, useState } from 'react';

export default function Nasa() {
  // Define state variables for our API data, loading status, and error messages.
  const [data, setData] = useState(null); // Will hold the NASA APOD data.
  const [loading, setLoading] = useState(true); // Starts as true until data is fetched.
  const [error, setError] = useState(null); // Stores any error message.

  // useEffect runs once when the component mounts.
  useEffect(() => {
    // Fetch data from the NASA API.
    fetch('https://api.nasa.gov/planetary/apod?api_key=dhiQLm9oIfQfnCaefEJgXYamze6E9tXi2zZa1SOR')
      .then(response => {
        // Check if the response is successful.
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Convert the response into JSON.
        return response.json();
      })
      .then(result => {
        // Save the data into our state and mark loading as finished.
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        // If there’s an error, log it and update our error state.
        console.error(err);
        setError('Failed to fetch NASA data. Please try again later.');
        setLoading(false);
      });
  }, []); // Empty array means this runs only once.

  // If the app is still loading data, show a loading screen.
  if (loading) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center">
        <img
          src="public\/Nasa_Logo_Loading.svg"
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
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="public\/Nasa_Logo_Loading.svg" 
              alt="NASA Logo" 
              className="h-10 w-10" 
            />
            <h1 className="text-xl font-bold m-2">Astronomy Picture of the Day</h1>
          </div>
          <div className="text-sm">
            {data.date}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Title of the image/video */}
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300 text-center">
          {data.title}
        </h2>
        
        {/* Media Display Section */}
        <div className="bg-gray-800 bg-opacity-60 p-2 rounded-lg shadow-2xl overflow-hidden mb-6">
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
            // If the data is an image, display it and allow users to click to view the high-res version.
            <img
              src={data.url}
              alt={data.title}
              className="w-full rounded transition-all duration-500 hover:scale-105 cursor-pointer"
              onClick={() => window.open(data.hdurl || data.url, '_blank')}
            />
          )}
        </div>
        
        {/* Copyright Information (if available) */}
        {data.copyright && (
          <p className="text-right text-gray-400 text-sm mb-6">
            © {data.copyright}
          </p>
        )}

        {/* Additional Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* "More Info" Card */}
          <div className="bg-gray-800 bg-opacity-60 rounded-lg p-4 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-blue-300">More Info</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Date</p>
                <p>{data.date}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Media Type</p>
                <p className="capitalize">{data.media_type}</p>
              </div>
              {data.hdurl && (
                <div>
                  <p className="text-gray-400 text-sm">HD Available</p>
                  <a 
                    href={data.hdurl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View High Resolution
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* "About This Image" Card */}
          <div className="bg-gray-800 bg-opacity-60 rounded-lg p-4 shadow-lg md:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-blue-300">About This Image</h3>
            <p className="text-gray-200 leading-relaxed">
              {data.explanation}
            </p>
          </div>
        </div>
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
        </div>
      </footer>
    </div>
  );
}
