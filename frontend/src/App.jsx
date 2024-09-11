import React from 'react'
import Map from './components/Map/Map'
import Location from './components/Location/Location'
import Chatbot from './components/Chatbot/Chatbot'
import styles from './App.module.css'
const App = () => {
  return (
    <div className={styles.container}>
      <div className={styles.container1}> 
        <div className={styles.feature1}>
          <Location/>
          <Map/>
        </div>
      </div>

      <div className={styles.container2}>
        <div className={styles.feature2}> 
          <div className={styles.chatbotTag}>
            {/* <img src="public/Robot04.png" alt='chatbot' className={styles.chatbotImg}/> */}
            <p className={styles.chatbotText}>Emergency Chatbot</p>
          </div>
          <Chatbot/>
        </div>
        <div className={styles.feature3}> 
            <div className={styles.footerContent}>
              <p>© 2021 - All rights reserved</p>
            </div>
        </div>

      </div>
    
    </div>
  )
}

export default App
