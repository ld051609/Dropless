import React from 'react';
import styles from './Location.module.css';
import { FaMapMarkerAlt } from 'react-icons/fa'; // Using Font Awesome icons
import { useCountry } from '../../CountryContext'; // Import the custom hook

const Location = () => {
  const GEOLOCATION_API_KEY = import.meta.env.VITE_GEOLOCATION_API_KEY;
  const [geolocation, setGeolocation] = React.useState({ latitude: null, longitude: null });
  const { country, updateCountry } = useCountry(); // Use the context

  const trackLocation = () => {
    // Implement your location tracking logic here
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setGeolocation({ latitude, longitude });
        fetchCountry(latitude, longitude);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  const fetchCountry = async (latitude, longitude) => {
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
  }

  return (
    <div className={styles.co}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          className={styles.inputField}
          placeholder="Enter your location..."
        />
        <button onClick={trackLocation} className={styles.iconButton}>
          <FaMapMarkerAlt />
        </button>
      </div>
    </div>
  );
}

export default Location;
