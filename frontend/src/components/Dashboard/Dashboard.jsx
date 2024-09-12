import React, { useEffect } from 'react';
import styles from './Dashboard.module.css';
import { useCountry } from '../../CountryContext'; // Import the custom hook


const getWaterStatus = (renewableWater) => {
  if (renewableWater < 500) {
    return { status: 'Absolute Water Scarcity', color: '#FF0000' }; // Red
  } else if (renewableWater < 1000) {
    return { status: 'Water Scarcity', color: '#FFA500' }; // Orange
  } else if (renewableWater < 1700) {
    return { status: 'Water Stress', color: '#FFFF00' }; // Yellow
  } else {
    return { status: 'Water Abundant', color: '#00FF00' }; // Green
  }
};

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

  const waterStatus = renewableWater ? getWaterStatus(renewableWater) : { status: 'No Data', color: '#CCCCCC' };


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
        <div className={styles.waterResourceContainer}>
          <div
            className={styles.waterResourceBar}
            style={{ 
              background: `linear-gradient(to right, #FF0000 0%, #FFA500 ${renewableWater / 1000}%, #FFFF00 50%, #00FF00 100%)`,
              width: `${Math.min(renewableWater / 1700 * 100, 100)}%` 
            }}
          >
            <p className={styles.waterStatusText}>
              {waterStatus.status} - {renewableWater !== null ? `${renewableWater} m³` : 'No data'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
