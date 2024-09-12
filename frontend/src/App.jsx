import React from 'react';
import Map from './components/Map/Map';
import Location from './components/Location/Location';
import Chatbot from './components/Chatbot/Chatbot';
import styles from './App.module.css';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './components/Dashboard/Dashboard';

const App = () => {
  return (
    <div className={styles.container}>
      {/* Navbar on the left side */}
      <div className={styles.navbar}>
        <Navbar/>
      </div>
      
      {/* Main content area on the right side */}
      <div className={styles.mainContent}>
        <div className={styles.feature0}>
    
            {/* <Location/> */}
        </div>

        <div className={styles.container1}> 
            <Map/>
        </div>

        <div className={styles.container2}>
          <div className={styles.feature2}> 
            <Chatbot/>
          </div>
          <div className={styles.feature3}> 
            <h1 className={styles.title}>Dashboard Summary</h1>
            <Location />
            <Dashboard/>
          </div>
        </div>
      </div>

    </div>
  );
};

export default App;
