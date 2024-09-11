import React from 'react';
import styles from './Dashboard.module.css';
import { useCountry } from '../../CountryContext'; // Import the custom hook

const Dashboard = () => {
  const { country } = useCountry(); // Use the context to get the country

  const handleOnClick = async () => {
    // Get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);

        // Send the user's location to the server
        const response = await fetch("http://localhost:5000/notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            lat: latitude,
            lon: longitude,
            country: country || "Unknown", // Use the country from context or default to "Unknown"
            to_number: "+16477653730" // Replace with the recipient's phone number
          })
        });

        // Handle response
        const data = await response.json();
        console.log(data);
      });
    } else {
      console.error("Geolocation is not supported by this browser!");
    }
  };

  return (
    <div>
      <button className={styles.button} onClick={handleOnClick}>Click me</button>
    </div>
  );
};

export default Dashboard;
