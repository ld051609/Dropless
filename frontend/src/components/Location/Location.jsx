import React from 'react';
import styles from './Location.module.css';
import { FaMapMarkerAlt } from 'react-icons/fa'; // Using Font Awesome icons


const Location = () => {
  const GEOLOCATION_API_KEY = import.meta.env.VITE_GEOLOCATION_API_KEY;
  const [geolocation, setGeolocation] = React.useState({  latitude: null, longitude: null,  });
  const [country, setCountry] = React.useState(null);
  const trackLocation = () => {
    // Implement your location tracking logic here
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const {latitude, longitude} = position.coords;
        setGeolocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
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
      if(!response.ok) {
        throw new Error('Failed to fetch country');
      }
      const data = await response.json();
      console.log(data);
      const result = data.results[0].address_components.find(
        (component) => component.types.includes('country')
      );
      if (result){
        setCountry(result.long_name);
        console.log(result.long_name);
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
