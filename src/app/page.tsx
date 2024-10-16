"use client"

import { Box, Button, Modal, createTheme, useMediaQuery, } from "@mui/material";
import styles from "./page.module.css"
import { useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Game from "../../components/game/game";
import ReactGA from 'react-ga4';
import Username from "../../components/username/username";
import axios from "axios";
import { UsernameProvider } from "../../components/username/usernameContext";
import { getAllUsernames } from "./API";
import Poll from "../../components/poll/poll";

const googleAnalyticsId = process.env.REACT_APP_GOOGLE_ANALYTICS_ID || "";
ReactGA.initialize("G-3X86Z3FZ9P")
ReactGA.send({ hitType: "pageview", page: "/landingpage", title: "Landing Page" });

if (googleAnalyticsId) {
  // Initialize Google Analytics with your tracking ID
  ReactGA.initialize(googleAnalyticsId);

  // Send a pageview event
  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname,
  });
}

export default function App() {
  const [openModal, setOpenModal] = useState(true);
  const [selectedCity, setSelectedCity] = useState(""); 
  const [isUsernameAllowed, setIsUsernameAllowed] = useState(true);
  
  const handleCitySelection = (city:string) => {
    setSelectedCity(city);
    setOpenModal(false); 

    // Save the selected city in local storage
    localStorage.setItem("selectedCity", city);
    ReactGA.event({
      category: 'Button Click',
      action: `Clicked on ${city}`,
      label: 'City Button',
    });
  };

  // Effect to check if the modal has been shown before
  useEffect(() => {
    const modalShownBefore = localStorage.getItem("modalShownBefore");
    if (!modalShownBefore) {
      setOpenModal(true);
    }
  }, []);

  const handleCityChange = (city:string) => {
    setSelectedCity("");
    
    setTimeout(() => {
      setSelectedCity(city);
    }, 10);
  };

  const disableButtons = () => {
    setIsUsernameAllowed(false)
  }

  const enableButtons = () => {
    setIsUsernameAllowed(true)
  }

  
  return (
    <UsernameProvider>
      <div>
        {openModal && (
          <div className={styles.modalOverlay}>
            <Modal open={openModal} disableAutoFocus={true} className={styles.modal}>
              <Box className={styles.modalContent}>
                <div className={styles.title}>metroguessr</div>
                <div className={styles.header1}>
                  Try to guess as many metro stations as possible within the time limit.
                </div>
                <div className={styles.container}>
                  <div className={styles.box}>
                    <div className={styles.text1}>+5</div>
                    <div className={styles.text2}>points for every correct guess</div>
                  </div>
                  <div className={styles.box}>
                    <div className={styles.text1}>-1</div>
                    <div className={styles.text2}>point for every skip</div>
                  </div>
                </div>
                <div className={styles.usernameContainer}>
                  <div className={styles.header2}>Username 👇</div>
                  <div>
                    <Username disableButtons={disableButtons} enableButtons={enableButtons}/>
                  </div>
                </div>
                <div className={styles.header2}>Select Your City 📍</div>
                <div className={styles.buttonContainer}>
                  <Button
                    onClick={() => handleCitySelection("Barcelona")}
                    className={styles.button}
                    disabled={!isUsernameAllowed} 
                  >
                    Barcelona
                  </Button>
                  <Button
                    onClick={() => handleCitySelection("Berlin")}
                    className={styles.button}
                    disabled={!isUsernameAllowed} 
                  >
                    Berlin
                  </Button>
                  <Button
                    onClick={() => handleCitySelection("London")}
                    className={styles.button}
                    disabled={!isUsernameAllowed} 
                  >
                    London
                  </Button>
                  <Button
                    onClick={() => handleCitySelection("Lyon")}
                    className={styles.button}
                    disabled={!isUsernameAllowed} 
                  >
                    Lyon
                  </Button>
                  <Button
                    onClick={() => handleCitySelection("Madrid")}
                    className={styles.button}
                    disabled={!isUsernameAllowed} 
                  >
                    Madrid
                  </Button>
                  <Button
                    onClick={() => handleCitySelection("NewYorkCity")}
                    className={styles.button}
                    disabled={!isUsernameAllowed} 
                  >
                    New York City
                  </Button>
                  <Button
                    onClick={() => handleCitySelection("Paris")}
                    className={styles.button}
                    disabled={!isUsernameAllowed} 
                  >
                    Paris
                  </Button>
                  <Button
                    onClick={() => handleCitySelection("Rome")}
                    className={styles.button}
                    disabled={!isUsernameAllowed} 
                  >
                    Rome
                  </Button>
                </div>
                {/* <div style={{ fontSize: '1.25rem', fontWeight: 400 }}>More coming soon ⏳</div> */}
                <Poll />
              </Box>
            </Modal>
          </div>
        )}
        <Game selectedCity={selectedCity} cityChange={handleCityChange} disableButtons={disableButtons} enableButtons={enableButtons} isUsernameAllowed={isUsernameAllowed}/>
      </div>
    </UsernameProvider>
  );
};