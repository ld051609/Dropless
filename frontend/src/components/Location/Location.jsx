import React, { useState } from 'react';
import styles from './Location.module.css';
import { FaMapMarkerAlt } from 'react-icons/fa'; // Using Font Awesome icons
import { useCountry } from '../../CountryContext'; // Import the custom hook

const Location = () => {
  const GEOLOCATION_API_KEY = import.meta.env.VITE_GEOLOCATION_API_KEY;
  const [geolocation, setGeolocation] = useState({ latitude: null, longitude: null });
  const { country, updateCountry } = useCountry(); // Use the context
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(''); // Store input field value

  // Track the user's current location if no country is entered
  const trackLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setGeolocation({ latitude, longitude });
        fetchCountryByCoords(latitude, longitude);
        setLoading(false);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  // Fetch country based on coordinates
  const fetchCountryByCoords = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GEOLOCATION_API_KEY}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch country');
      }
      const data = await response.json();
      const result = data.results[0].address_components.find(
        (component) => component.types.includes('country')
      );
      if (result) {
        console.log(result.long_name);  
        updateCountry(result.long_name); // Update the context with the new country
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch country based on input value (if provided)
  const fetchCountryByInput = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${inputValue}&key=${GEOLOCATION_API_KEY}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch country');
      }
      const data = await response.json();
      const result = data.results[0].address_components.find(
        (component) => component.types.includes('country')
      );
      if (result) {
        console.log(result.long_name);
        updateCountry(result.long_name); // Update the context with the country from input
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle form submission or button click
  const handleSubmit = () => {
    if (inputValue.trim() !== '') {
      // If input is provided, use it to fetch the country
      fetchCountryByInput();
      setInputValue(''); // Clear the input field

    } else {
      // If input is empty, use the current location
      trackLocation();
      setInputValue(''); // Clear the input field
    }
  };

  return (
    <div className={styles.co}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // Update inputValue state
          className={styles.inputField}
          placeholder="Enter country or track your location..."
        />
        <button onClick={handleSubmit} className={styles.iconButton} disabled={loading}>
          <FaMapMarkerAlt />
        </button>
      </div>
      {loading && <p>Fetching location...</p>}
    </div>
  );
};

export default Location;
