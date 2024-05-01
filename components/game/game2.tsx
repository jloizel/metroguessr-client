"use client"

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./page.module.css";
import Map from "../map/map3";
import { Timer } from "../timer/timer3";
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
  const [lineIDs, setLineIDs] = useState<any[]>([])
  const [resetMap, setResetMap] = useState(false)


  const zoneProbabilities = {
    "Zone 1": 0.6,
    "Zone 2": 0.25,
    "Zone 3": 0.1,
    "Zone 4": 0.05
  };

  interface ZoneJsonFiles {
    [key: string]: string;
  }
  
  const LondonZoneJsonFiles: ZoneJsonFiles = {
    "Zone 1": `./zones/LondonStationsZone1.json`,
    "Zone 2": `./zones/LondonStationsZone2.json`,
    "Zone 3": `./zones/LondonStationsZone3.json`,
    "Zone 4": `./zones/LondonStationsZone4.json`
  };

  const MadridZoneJsonFiles: ZoneJsonFiles = {
    "Zone 1": `./zones/MadridStationsZoneA.json`,
    "Zone 2": `./zones/MadridStationsZoneB1.json`,
    "Zone 3": `./zones/MadridStationsZoneB2.json`,
    "Zone 4": `./zones/MadridStationsZoneB3.json`
  };
 
  useEffect(() => {
    const fetchStations = async () => {
      if (selectedCity) {
        try {
          // Dynamically import station data based on the selected city
          const cityStations = await import(
            `../../data/${selectedCity}/${selectedCity}Stations.json`
          );
          const stationNames = cityStations.features.map(
            (feature: any) => feature.properties.name
          );
          setStations(stationNames);
        } catch (error) {
          console.error("Error fetching station data:", error);
        }
      }
    };

    // Fetch stations when selectedCity changes
    fetchStations();
  }, [selectedCity]);
  
  const startNewRound = () => {
    if (selectedCity === 'London' || selectedCity === 'Madrid') { 
      let zoneJsonFiles: ZoneJsonFiles;

      if (selectedCity === 'London') {
        zoneJsonFiles = LondonZoneJsonFiles;
      } else if (selectedCity === 'Madrid') {
        zoneJsonFiles = MadridZoneJsonFiles;
      } else {
        // Handle other cities if needed
        return;
      }

      const cumulativeProbabilities: number[] = [];
      let totalProbability = 0;
    
      // Calculate cumulative probabilities for zones
      Object.values(zoneProbabilities).forEach((probability) => {
        totalProbability += probability;
        cumulativeProbabilities.push(totalProbability);
      });
    
      const rand = Math.random();
      let selectedZone: string | undefined;
    
      // Determine selected zone based on random value
      Object.entries(zoneProbabilities).some(([zone, probability], index) => {
        if (rand < cumulativeProbabilities[index]) {
          selectedZone = zone;
          return true;
        }
        return false;
      });
    
      if (selectedZone && zoneJsonFiles[selectedZone]) {
        const jsonFilePath = zoneJsonFiles[selectedZone];
        // Dynamically require the JSON file
        const jsonFile = require(`${jsonFilePath}`);
        const stationNames = jsonFile.features.map((feature: any) => feature.properties.name);
    
        // Filter out stations that have been guessed before
        const availableStations = stationNames.filter(
          (station:any) => !correctlyGuessedStations.includes(station) && !incorrectlyGuessedStations.includes(station)
        );
    
        if (availableStations.length > 0) {
          // Choose a random station from available stations
          const randomIndex = Math.floor(Math.random() * availableStations.length);
          const selectedStation = availableStations[randomIndex];
    
          // Set the random station
          setRandomStation(selectedStation);
        }
      }
    } else {
      import(`../../data/${selectedCity}/${selectedCity}Stations.json`).then((data) => {
        const stationNames = data.features.map((feature: any) => feature.properties.name);
        setStations(stationNames);
      });

      const availableStations = stations.filter((station) => !correctlyGuessedStations.includes(station) && !incorrectlyGuessedStations.includes(station));
      // Select a random station from the available stations
      const randomIndex = Math.floor(Math.random() * availableStations.length);
      const selectedStation = availableStations[randomIndex];
      setRandomStation(selectedStation);
    }
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
    setResetMap(true)
  };

  const handleModalClose = () => {
    setPlayAgain(true)
    setTimeEnded(true)
  };   

  const handleTimeEnded = () => {
    setTimeEnded(true)
    // setGameStarted(false)
    setRevealStation(true)
  }

  const handleLineIDs = (lineIDs:any[]) => {
    setLineIDs(lineIDs)
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
          handleLineIDs={handleLineIDs}
          resetMap={resetMap}
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
            lineIDs={lineIDs}
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