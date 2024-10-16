"use client"

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Map from "../map/map";
import { Timer } from "../timer/timer";
import Counter from "../counter/counter";
import Skip from "../skip/skip";
import Menu from "../menu/menu";
import { Box } from "@mui/material";
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
  const [incorrectlyGuessedStations, setIncorrectlyGuessedStations] = useState<string[]>([]); 
  const [gameStarted, setGameStarted] = useState(false);
  const [count, setCount] = useState(0); // Counter state
  const [countChange, setCountChange] = useState<number | null>(null); 
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

  const BerlinZoneJsonFiles: ZoneJsonFiles = {
    "Zone 1": `./zones/BerlinStationsZoneA.json`,
    "Zone 2": `./zones/BerlinStationsZoneB.json`,
  };
 
  useEffect(() => {
    const fetchStations = async () => {
      if (selectedCity) {
        try {
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

    fetchStations();
  }, [selectedCity]);
  
  const startNewRound = () => {
    if (selectedCity === 'London' || selectedCity === 'Madrid' || selectedCity === 'Berlin') { 
      let zoneJsonFiles: ZoneJsonFiles;

      if (selectedCity === 'London') {
        zoneJsonFiles = LondonZoneJsonFiles;
      } else if (selectedCity === 'Madrid') {
        zoneJsonFiles = MadridZoneJsonFiles;
      } else if (selectedCity === 'Berlin') {
        zoneJsonFiles = BerlinZoneJsonFiles;
      } else {
        return
      }

      const cumulativeProbabilities: number[] = [];
      let totalProbability = 0;
    
      Object.values(zoneProbabilities).forEach((probability) => {
        totalProbability += probability;
        cumulativeProbabilities.push(totalProbability);
      });
    
      const rand = Math.random();
      let selectedZone: string | undefined;
    
      Object.entries(zoneProbabilities).some(([zone, probability], index) => {
        if (rand < cumulativeProbabilities[index]) {
          selectedZone = zone;
          return true;
        }
        return false;
      });
    
      if (selectedZone && zoneJsonFiles[selectedZone]) {
        const jsonFilePath = zoneJsonFiles[selectedZone];
        const jsonFile = require(`${jsonFilePath}`);
        const stationNames = jsonFile.features.map((feature: any) => feature.properties.name);
    
        const availableStations = stationNames.filter(
          (station:any) => !correctlyGuessedStations.includes(station) && !incorrectlyGuessedStations.includes(station)
        );
    
        if (availableStations.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableStations.length);
          const selectedStation = availableStations[randomIndex];
    
          setRandomStation(selectedStation);
        }
      }
    } else {
      import(`../../data/${selectedCity}/${selectedCity}Stations.json`).then((data) => {
        const stationNames = data.features.map((feature: any) => feature.properties.name);
        setStations(stationNames);
      });

      const availableStations = stations.filter((station) => !correctlyGuessedStations.includes(station) && !incorrectlyGuessedStations.includes(station));
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
      setGuessedStation(''); 
      setCount(prevCount => prevCount + 5); 
      setCountChange(5); 
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
    
    if (count > 0) {
      setCount(count - 1);

      setCountChange(-1); 
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
    setIncorrectlyGuessedStations([]);
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
          incorrectGuesses={incorrectlyGuessedStations}
          disableZoom={disableZoom}
          handleLineIDs={handleLineIDs}
          resetMap={resetMap}
        />}
      </div>
      
      <div className={styles.container}>
        <Box className={styles.box1}>
          <div className={styles.title}>
            metroguessr
          </div>
          <Counter
            count={count}
            countChange={countChange}
          />
        </Box>
        <Box className={styles.box2}>
          <Menu cityChange={cityChange} resetGame={resetGame} disableButtons={disableButtons} enableButtons={enableButtons} isUsernameAllowed={isUsernameAllowed}/>
        </Box>
      </div>
      <div className={styles.box3Box4Container}>
        <div className={styles.box3}>
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