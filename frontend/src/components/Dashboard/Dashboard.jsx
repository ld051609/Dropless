import React, { useEffect } from 'react';
import styles from './Dashboard.module.css';
import { useCountry } from '../../CountryContext'; // Import the custom hook
import Location from '../Location/Location';
const Dashboard = () => {
  const { country } = useCountry(); // Use the context to get the country
  const [weather, setWeather] = React.useState(null);
  const [temperature, setTemperature] = React.useState(null);
  const [renewableWater, setRenewableWater] = React.useState(null);
  const [weatherDes, setWeatherDes] = React.useState(null);

  const handleOnClick = async () => {
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
        setWeather(data.weather_condition);
        setTemperature(data.temperature);
        setRenewableWater(data.predicted_water_resource);
        setWeatherDes(data.description);
      
        console.log(data);
      });
    } else {
      console.error("Geolocation is not supported by this browser!");
    }
  };
  useEffect(() => {
    handleOnClick();
  }, [country]);

  return (
    <div className={styles.dashboardContainer}>
      
      <div className={styles.infoContainer}>
        <div className={styles.weatherBlock}>
          <h2 className={styles.infoTitle}>Weather</h2>
          <p className={styles.infoText}>{weatherDes || 'No data'}</p>
          <p className={styles.infoText}><strong>{weather || ''}</strong></p>
        </div>
        <div className={styles.temperatureBlock}>
          <h2 className={styles.infoTitle}>Temperature</h2>
          <div className={styles.temperatureContainer}>
            <input
              type="range"
              min="-50"
              max="50"
              value={temperature || 0}
              className={styles.slider}
              readOnly
            />
            <p className={styles.temperatureValue}>{temperature || 'No data'}°C</p>
          </div>
        </div>
      </div>
      <div className={styles.waterResourceBlock}>
        <h2 className={styles.infoTitle}>Predicted Water Resource</h2>
        <p className={styles.infoText}>{renewableWater || 'No data'}</p>
      </div>
    </div>
  );
};

export default Dashboard;
