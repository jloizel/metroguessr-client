"use client"

import { Box, Button, Modal, createTheme, useMediaQuery, } from "@mui/material";
import styles from "./page.module.css"
import { useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Game from "../../components/game/game2";
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
  // State variable to track whether the modal should be displayed
  const [openModal, setOpenModal] = useState(true);
  const [selectedCity, setSelectedCity] = useState(""); // State to track selected city
  const [isUsernameAllowed, setIsUsernameAllowed] = useState(true);
  
  // Function to handle user's choice of city
  const handleCitySelection = (city:string) => {
    setSelectedCity(city);
    setOpenModal(false); // Close the modal after city selection
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
    // Temporarily set the selected city to a different value
    setSelectedCity("");
    
    // Set the selected city to the desired value after a short delay
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

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 767,
        md: 1024,
        lg: 1200,
        xl: 1536,
      },
    },
  });
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const getTitleFontSize = () => {
    if (isMobile) {
      return '1.25rem';
    } else if (isTablet) {
      return '1.75rem';
    } else {
      return '2.25rem';
    }
  };

  const getTextFontSize = () => {
    if (isMobile) {
      return '14px';
    } else if (isTablet) {
      return '16px';
    } else {
      return '18px';
    }
  };

  const getHeader1FontSize = () => {
    if (isMobile) {
      return '16px';
    } else if (isTablet) {
      return '18px';
    } else {
      return '20px';
    }
  };

  const getHeader2FontSize = () => {
    if (isMobile) {
      return '16px';
    } else if (isTablet) {
      return '18px';
    } else {
      return '20px';
    }
  };

  const getContainerWidth  = () => {
    if (isMobile) {
      return '90%';
    } else {
      return '80%';
    }
  };
  
  return (
    <UsernameProvider>
      <div>
        {openModal && (
          <div className={styles.modalOverlay}>
            <Modal open={openModal} disableAutoFocus={true} className={styles.modal}>
              <Box className={styles.modalContent}>
                <div style={{ fontSize: getTitleFontSize(), fontWeight: 600 }}>metroguessr</div>
                <div style={{ fontSize: getHeader1FontSize(), fontWeight: 600 }}>
                  Try to guess as many metro stations as possible within the time limit.
                </div>
                <div className={styles.container}>
                  <div className={styles.box}>
                    <div style={{ fontSize: getTextFontSize(), fontWeight: 600 }}>+5</div>
                    <div style={{ fontSize: getTextFontSize(), fontWeight: 400 }}>points for every correct guess</div>
                  </div>
                  <div className={styles.box}>
                    <div style={{ fontSize: getTextFontSize(), fontWeight: 600 }}>-1</div>
                    <div style={{ fontSize: getTextFontSize(), fontWeight: 400 }}>point for every skip</div>
                  </div>
                </div>
                <div className={styles.usernameContainer}>
                  <div style={{ fontSize: getHeader2FontSize(), fontWeight: 600 }}>Username 👇</div>
                  <div>
                    <Username disableButtons={disableButtons} enableButtons={enableButtons}/>
                  </div>
                </div>
                <div style={{ fontSize: getHeader2FontSize(), fontWeight: 600 }}>Select Your City 📍</div>
                <div className={styles.buttonContainer} style={{width: getContainerWidth()}}>
                  <Button
                    onClick={() => handleCitySelection("London")}
                    className={styles.button}
                    disabled={!isUsernameAllowed} // Disable button if username is not allowed
                  >
                    London
                  </Button>
                  <Button
                    onClick={() => handleCitySelection("Lyon")}
                    className={styles.button}
                    disabled={!isUsernameAllowed} // Disable button if username is not allowed
                  >
                    Lyon
                  </Button>
                  <Button
                    onClick={() => handleCitySelection("Madrid")}
                    className={styles.button}
                    disabled={!isUsernameAllowed} // Disable button if username is not allowed
                  >
                    Madrid
                  </Button>
                  <Button
                    onClick={() => handleCitySelection("NewYorkCity")}
                    className={styles.button}
                    disabled={!isUsernameAllowed} // Disable button if username is not allowed
                  >
                    New York City
                  </Button>
                  <Button
                    onClick={() => handleCitySelection("Paris")}
                    className={styles.button}
                    disabled={!isUsernameAllowed} // Disable button if username is not allowed
                  >
                    Paris
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