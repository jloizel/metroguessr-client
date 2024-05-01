"use client"

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./page.module.css";
import Map from "../map/map2";
import { Timer } from "../timer/timer";
import Counter from "../counter/counter";
import Skip from "../skip/skip";
import Menu from "../menu/menu";
import { Box, createTheme, useMediaQuery } from "@mui/material";
import ReactGA from 'react-ga4';
import { random } from "turf";

interface GameProps {
  selectedCity: string;
  cityChange: (city:string) => void
  disableButtons: () => void
  enableButtons: () => void
  isUsernameAllowed: boolean
}

const Game: React.FC<GameProps> = ({selectedCity, cityChange, disableButtons, enableButtons, isUsernameAllowed}) => {
  const [guessedStation, setGuessedStation] = useState<string>("");
  const [randomStation, setRandomStation] = useState<string>("");
  const [correctGuess, setCorrectGuess] = useState(false);
  const [correctlyGuessedStations, setCorrectlyGuessedStations] = useState<string[]>([]);
  const [incorrectlyGuessedStations, setIncorrectlyGuessedStations] = useState<string[]>([]); // Array to store incorrectly guessed stations
  const [gameStarted, setGameStarted] = useState(false);
  const [count, setCount] = useState(0); // Counter state
  const [countChange, setCountChange] = useState<number | null>(null); // Track count change
  const [stations, setStations] = useState<string[]>([]);
  const [skipClickCount, skipSetClickCount] = useState(0);
  const [showSkip, setShowSkip] = useState(true);
  const [playAgain, setPlayAgain] = useState(false);
  const [disableZoom, setDisableZoom] = useState(false);
  const [timeEnded, setTimeEnded] = useState(false);
  const [lastRandomStation, setLastRandomStation] = useState<string>("");
  const [revealStation, setRevealStation] = useState(false)
  const [skipPressed, setSkipPressed] = useState(false);



  // useEffect(() => {
  //   ReactGA.send("pageview");
  // }, []);
 
  useEffect(() => {
    if (selectedCity === 'Lyon') {
      import('../../data/Lyon/LyonStations.json').then((data) => {
        const stationNames = data.features.map((feature: any) => feature.properties.name);
        setStations(stationNames);
      });
    } else if (selectedCity === 'London') {
      import('../../data/London/LondonStations.json').then((data) => {
        const stationNames = data.features.map((feature: any) => feature.properties.name);
        setStations(stationNames);
      });
    } else if (selectedCity === 'Paris') {
      import('../../data/Paris/ParisStations.json').then((data) => {
        const stationNames = data.features.map((feature: any) => feature.properties.name);
        setStations(stationNames);
      });
    } else if (selectedCity === 'NewYorkCity') {
      import('../../data/NewYorkCity/NewYorkCityStations.json').then((data) => {
        const stationNames = data.features.map((feature: any) => feature.properties.name);
        setStations(stationNames);
      });
    }
  }, [selectedCity]);
  
  const startNewRound = () => {
    // Filter out stations that have already been guessed correctly
    // setSkipPressed(false)
    const availableStations = stations.filter((station) => !correctlyGuessedStations.includes(station) && !incorrectlyGuessedStations.includes(station));
     // Select a random station from the available stations
     const randomIndex = Math.floor(Math.random() * availableStations.length);
     const selectedStation = availableStations[randomIndex];
     setRandomStation(selectedStation);
    //  setSkipPressed(false)
  };

  const handleStartClick = () => {
    startNewRound();
    setGameStarted(true);
    setTimeEnded(false)
  };

  useEffect(() => {
    // Effect to set the lastRandomStation when the timer reaches 0
    if (timeEnded && randomStation !== "") {
      setLastRandomStation(randomStation);
    }
  }, [timeEnded, randomStation]);


  const numberCorrectGuesses = correctlyGuessedStations.length

  const guessedStationCleaned = guessedStation ? guessedStation.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/-/gi," ") : '';
  const randomStationCleaned = randomStation ? randomStation.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/-/gi," ") : '';

  const handleGuessSubmit = (guess: string, isCorrect: boolean) => {
    if (isCorrect) {
      // setGuessedStation(""); // Clear guessed station
      setDisableZoom(true);
      setCorrectlyGuessedStations((prevStations) => [...prevStations, randomStation]); //stores correctlyGuessedStations in an array so styling doesn't reset on new guess
      setCorrectGuess(true);
      setGuessedStation(''); // Reset the guessed station to an empty string
      setCount(prevCount => prevCount + 5); // Increase count by 5 on correct guess
      setCountChange(5); // Update count change
      // setTimeout(() => {
      startNewRound();
      // }, 1000);
    } else {
      setCorrectGuess(false);
    }
  };
  
  //allow station to be guessed by pressing the "enter" key
  const handleKeyPress = () => {
    if (typeof window !== "undefined") {
    let fader = document.getElementById("fader") as HTMLInputElement; //this is used to show the count change with a fade-in-out animation
    // handleGuess()
    fader.classList.remove(styles.hidden);
    fader.classList.add(styles.fade);

    setTimeout(function () {
      fader.classList.remove(styles.fade);
      fader.classList.add(styles.hidden);
    }, 2000);
  }
  };

  

  // Function to handle skip button click
  const handleSkipClick = () => {
    if (typeof window !== "undefined") {
    let fader = document.getElementById("fader") as HTMLInputElement;
    setDisableZoom(true);
    setSkipPressed(true)
    // makeSkipPressed()
    startNewRound()
    setIncorrectlyGuessedStations(prevStations => [...prevStations, randomStation]); // Add incorrectly guessed station to the array
    setGuessedStation("");
    
    // Decrement count by 1
    if (count > 0) {
      setCount(count - 1);

      setCountChange(-1); // Update count change
      fader.classList.remove(styles.hidden);
      fader.classList.add(styles.fade);

      setTimeout(function () {
        fader.classList.remove(styles.fade);
        fader.classList.add(styles.hidden);
      }, 2000);
    }
    // setTimeout(() => {
    // }, 5000); // Call the startNewRound function when skip button is clicked
    skipSetClickCount(prevCount => prevCount + 1);
  };
}

useEffect(() => {
  if (randomStation) {
    setIncorrectlyGuessedStations(prevStations => [...prevStations, randomStation]);
  }
}, [randomStation]);

// useEffect(() => {
//   if (randomStation && correctGuess) {
//     setCorrectlyGuessedStations(prevStations => [...prevStations, randomStation]);
//   }
// }, [randomStation, correctGuess]);


  const resetGame = () => {
    setGuessedStation("");
    setRandomStation("");
    setCorrectGuess(false);
    setCorrectlyGuessedStations([]);
    setIncorrectlyGuessedStations([]); // Reset the array for incorrectly guessed stations
    setGameStarted(false);
    setCount(0);
    setShowSkip(true)
    setTimeEnded(false)
    setRandomStation(lastRandomStation !== "" ? lastRandomStation : "");
  };

  const handleModalClose = () => {
    setPlayAgain(true)
    setTimeEnded(true)
  };   

  const handleTimeEnded = () => {
    setTimeEnded(true)
    setGameStarted(false)
    setRevealStation(true)
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
      return '1rem';
    } else if (isTablet) {
      return '1.625rem';
    } else {
      return '2.25rem';
    }
  };

  const getBoxMargin = () => {
    if (isMobile) {
      return '15px';
    } else if (isTablet) {
      return '25px';
    } else {
      return '35px';
    }
  };

  const getTopMargin = () => {
    if (isMobile) {
      return '30px';
    } else if (isTablet) {
      return '30px';
    } else {
      return '20px';
    }
  };

  const getBoxTopMargin = () => {
    if (isMobile) {
        return '10px';
    } else if (isTablet) {
        return '11px';
    } else {
        return '12px';
    }
  };

  return (
    <div>
      <div className={styles.mapContainer}>
        {selectedCity && <Map 
          randomStation={randomStation} 
          guessedStation={guessedStation} 
          correctGuess={correctGuess} 
          correctlyGuessedStations={correctlyGuessedStations}
          gameStarted={gameStarted}
          selectedCity={selectedCity}
          skipClickCount={skipClickCount}
          incorrectGuesses={incorrectlyGuessedStations}
          disableZoom={disableZoom}
          timeEnded={timeEnded}
          handleTimeEnded={handleTimeEnded}
          lastRandomStation={lastRandomStation}
          revealStation={revealStation}
        />}
      </div>
      
      <div className={styles.container}>
        <Box 
          className={styles.box1}
          sx={{ marginLeft: getBoxMargin() }}
          >
          <h1 
            className={styles.title}
            style={{ fontSize: getTitleFontSize(), fontWeight: 600}}
            >metroguessr</h1>
          <Counter
            count={count}
            countChange={countChange}
          />
        </Box>
        <Box 
          className={styles.box2}
          sx={{ marginRight: getBoxMargin(), marginTop: getBoxTopMargin() }}
          >
          <Menu cityChange={cityChange} resetGame={resetGame} disableButtons={disableButtons} enableButtons={enableButtons} isUsernameAllowed={isUsernameAllowed}/>
        </Box>
      </div>
      <div className={styles.box3Box4Container}>
        <div 
        className={styles.box3}
        style={{ marginTop: getTopMargin() }}
        >
          <Timer 
            guessedStation={guessedStation} 
            onChange={setGuessedStation} 
            onKeyPress={handleKeyPress}
            onClick={handleStartClick}
            count={count}
            resetGame={resetGame}
            stations={stations}
            skipClickCount={skipClickCount}
            numberCorrectGuesses={numberCorrectGuesses}
            selectedCity={selectedCity}
            randomStation={randomStation}
            randomStationCleaned={randomStationCleaned}
            correctGuess={correctGuess}
            onSkip={handleSkipClick} 
            incorrectGuesses={incorrectlyGuessedStations}
            gameStarted={gameStarted}
            handleModalClose={handleModalClose}
            handleGuessSubmit={handleGuessSubmit}
            handleTimeEnded={handleTimeEnded}
            timeEnded={timeEnded}
          />
        </div>
        {/* <div className={styles.box4}>
          {gameStarted && !playAgain && <Skip onClick={handleSkipClick}/>}
        </div> */}
      </div>
    </div>
  );
};

export default Game;