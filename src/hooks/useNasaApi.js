import { useState, useEffect } from 'react';

// Use environment variable with fallback
const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'dhiQLm9oIfQfnCaefEJgXYamze6E9tXi2zZa1SOR';

export function useApod(date) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, [date]);

  return { data, loading, error };
}

export function useMarsRoverPhotos(rover = 'curiosity', sol = 1000) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${API_KEY}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(result => {
        setPhotos(result.photos);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch Mars rover photos. Please try again later.');
        setLoading(false);
      });
  }, [rover, sol]);

  return { photos, loading, error };
}

export function useEarthImagery(date = '2023-01-01', lat = 29.78, lon = -95.33) {
  const [imagery, setImagery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.nasa.gov/planetary/earth/imagery?lon=${lon}&lat=${lat}&date=${date}&api_key=${API_KEY}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(result => {
        setImagery(result);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch Earth imagery. Please try again later.');
        setLoading(false);
      });
  }, [date, lat, lon]);

  return { imagery, loading, error };
}

export function useEpicImagery(date = '2023-01-01') {
  const [epicData, setEpicData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.nasa.gov/EPIC/api/natural/date/${date}?api_key=${API_KEY}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(result => {
        setEpicData(result);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch EPIC imagery. Please try again later.');
        setLoading(false);
      });
  }, [date]);

  return { epicData, loading, error };
} 