    "use client"

import React, { useEffect, useState, useRef } from "react";
import styles from "./page.module.css";
import { Result } from "../result/result";
import { Autocomplete, Box, TextField, createTheme, keyframes, makeStyles, useMediaQuery } from "@mui/material";
import { AutocompleteChangeReason } from '@mui/material';
import Skip from "../skip/skip";
import { useForm } from "react-hook-form"
import LyonStyles from "./css/Lyon.module.css"
import LondonStyles from "./css/London.module.css"
import ParisStyles from "./css/Paris.module.css"
import NewYorkCityStyles from "./css/NYC.module.css"
import MadridStyles from "./css/Madrid.module.css"

interface TimerProps {
  guessedStation: string;
  onChange: (value: string) => void;
  onClick: () => void;
  count: number;
  resetGame: () => void;
  stations: string[];
  skipClickCount: number;
  numberCorrectGuesses: number;
  selectedCity: string;
  randomStation: string
  randomStationCleaned: string;
  // handleGuess: () => void
  onKeyPress: () => void
  correctGuess: boolean
  onSkip: () => void;
  incorrectGuesses: string[]
  gameStarted: boolean;
  handleModalClose: () => void
  handleGuessSubmit: (guess: string, isCorrect: boolean) => void; // Updated signature
  handleTimeEnded: () => void
  timeEnded: boolean
  // skipPressed: boolean
  lineIDs: any[]
}

export const Timer: React.FC<TimerProps> = ({guessedStation, onChange, onClick, count, resetGame, stations, skipClickCount, numberCorrectGuesses, selectedCity, randomStation, randomStationCleaned, onKeyPress, onSkip, incorrectGuesses, gameStarted, handleModalClose, handleGuessSubmit, handleTimeEnded, timeEnded, lineIDs}) => {
  
  const [running, setRunning] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const [shakeAnimation, setShakeAnimation] = useState(false);
  const [playAgain, setPlayAgain] = useState(false);
  const [showForm, setShowForm] = useState(false);  
  const [resetInputField, setResetInputField] = useState(false);
  const [enterPressed, setEnterPressed] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [backspacePressed, setBackspacePressed] = useState(false);
  const [guessMade, setGuessMade] = useState(false)
  const [prevInputValue, setPrevInputValue] = useState<string | null>(null);
  const [showError, setShowError] = useState(false)
  const [resetHover, setResetHover] = useState(false);
  const [showTryAgainButton, setShowTryAgainButton] = useState(false);
  const [skipPressed, setSkipPressed] = useState(false);
  const [skippedStation, setSkippedStation] = useState<string | null>(null);
  const [skippedStations, setSkippedStations] = useState<string[]>([]);
  const [correctStation, setCorrectStation] = useState<string | null>(null);
  const [correctStations, setCorrectStations] = useState<string[]>([]);
  const [correctGuess, setCorrectGuess] = useState(false)

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldRef = useRef<HTMLInputElement>(null);

  const shaker = keyframes`
  0% { transform: translateX(0) }
  25% { transform: translateX(10px) }
  50% { transform: translateX(-10px) }
  75% { transform: translateX(10px) }
  100% { transform: translateX(0) }
`;
 
const initialTime = 60 * 1000; // Initial time set in seconds
const [time, setTime] = useState(initialTime);

// function addHiddenClassToLabels() {
//   const labelElements = document.querySelectorAll(`[id^="label_"]`);
//     labelElements.forEach((element) => {
//       element.classList.add(styles.labelHidden); // Add the "Hidden" class from your CSS module
//     });
// }




useEffect(() => {
  let interval: NodeJS.Timeout | undefined;

  if (gameStarted && !startTime) {
    // Start the timer
    setStartTime(Date.now());
  }

  if (gameStarted) {
    interval = setInterval(() => {
      const now = Date.now();
      setElapsedTime(now - (startTime || 0));
    }, 10); // Update elapsed time every 10 milliseconds
    // addHiddenLabelClass()
  } else {
    // removeSkippedLabelClass()
    // removeCorrectLabelClass()
    // addHiddenLabelClass()
    clearInterval(interval);
    setStartTime(null); // Reset start time when game stops
    setElapsedTime(0); // Reset elapsed time
  }

  return () => {
    if (interval) {
      clearInterval(interval);
    }
  };
}, [gameStarted, startTime]);

const remainingTime = Math.max(initialTime - elapsedTime, 0);

let stylesName:any = null; // Initialize with empty string
if (selectedCity === "Lyon") {
  stylesName = LyonStyles; // Provide appropriate class name for Lyon
} else if (selectedCity === "London") {
  stylesName = LondonStyles; // Provide appropriate class name for London
} else if (selectedCity === "Paris") {
  stylesName = ParisStyles; // Provide appropriate class name for London
} else if (selectedCity === "NewYorkCity") {
  stylesName = NewYorkCityStyles; // Provide appropriate class name for London
} else if (selectedCity === "Madrid") {
  stylesName = MadridStyles; // Provide appropriate class name for London
}

if (typeof window !== "undefined") { 
  const markerId = `marker_${randomStation}`
  const markerElement = document.getElementById(markerId)
  const stationName = markerElement?.dataset.stationName
  const labelId = `label_${randomStation}`;
  const labelElement = document.getElementById(labelId);
}




function showGuessMarker() {
  if (typeof document !== "undefined") {
    const markerId = `marker_${randomStation}`
    const markerElement = document.getElementById(markerId)

    if (markerElement && stylesName) {
      const markerLineId = markerElement.dataset.lineProperty
      const markerStationName = markerElement.dataset.stationName
      markerElement.className = stylesName[markerLineId + "guess"]
    }
  }
}

// function showCorrectMarker() {
//   if (typeof document !== "undefined") {
//     const markerId = `marker_${randomStation}`
//     const markerElement = document.getElementById(markerId)

//     if (markerElement && stylesName) {
//       const markerLineId = markerElement.dataset.lineProperty
//       const markerStationName = markerElement.dataset.stationName
//       markerElement.classList.remove(stylesName[markerLineId + "guess"]);
//       markerElement.className = stylesName[markerLineId + "correct"]
//     }
//   }
// }

function showCorrectMarker(station: string): void {
  if (typeof document !== "undefined") {
    const markerId = `marker_${station}`;
    const markerElement = document.getElementById(markerId);
  if (markerElement && stylesName) {
    const markerLineId = markerElement.dataset.lineProperty
    markerElement.classList.add(stylesName[markerLineId + "correct"])
  }
}}


// function showSkipMarker() {
//   if (typeof document !== "undefined") {
//     const markerId = `marker_${randomStation}`
//     const markerElement = document.getElementById(markerId)

//     if (markerElement && stylesName) {
//       const markerLineId = markerElement.dataset.lineProperty
//       const markerStationName = markerElement.dataset.stationName
//       markerElement.classList.remove(stylesName[markerLineId + "guess"]);
//       markerElement.className = stylesName[markerLineId + "skip"]
//     }
//   }
// }

function showSkipMarker(station: string): void {
  if (typeof document !== "undefined") {
    const markerId = `marker_${station}`;
    const markerElement = document.getElementById(markerId);
    if (markerElement && stylesName) {
      const classList = markerElement.classList;
    if (classList.length > 0) {
        const firstClass = classList.item(0);
        if (firstClass) {
            classList.remove(firstClass);
        }
    }
    const markerLineId = markerElement.dataset.lineProperty
    markerElement.classList.remove(stylesName[markerLineId + "guess"]);
    markerElement.classList.add(stylesName[markerLineId + "skip"])
    }
}}

useEffect(() => {
  if (randomStation && gameStarted) {
    showGuessMarker()
  }
})

// useEffect(() => {
//   if (randomStation === stationName) {
//     showGuessMarker()
//   } else if (guessedStation === randomStation && correctGuess) {
//     showCorrectMarker()
//   } else if (correctStations.includes(randomStation)) {
//     showCorrectMarker()
//   } else if (incorrectGuesses.includes(randomStation)) {
//     showSkipMarker()
//   }
// }, [randomStation, guessedStation, correctGuess, incorrectGuesses])

function addHiddenLabelClass() {
  if (typeof document !== "undefined") {
    const labelId = `label_${randomStation}`;
    const labelElement = document.getElementById(labelId);
    if (labelElement) {
      labelElement.classList.add(styles.labelHidden)
    }
  }
}

function removeHiddenLabelClass() {
  if (typeof document !== "undefined") {
    const labelId = `label_${randomStation}`;
    const labelElement = document.getElementById(labelId);
  if (labelElement) {
    labelElement.classList.remove(styles.labelHidden)
  }
}
}

function addRevealedLabelClass() {
  if (typeof document !== "undefined") {
    const labelId = `label_${randomStation}`;
    const labelElement = document.getElementById(labelId);
  if (labelElement) {
    const classList = labelElement.classList;
    if (classList.length > 0) {
        const firstClass = classList.item(0);
        if (firstClass) {
            classList.remove(firstClass);
        }
    }
    labelElement.classList.remove(styles.labelHidden);
    labelElement.classList.add(styles.labelSkipped)
  }
}}

function addSkippedLabelClass(station: string): void {
  if (typeof document !== "undefined") {
    const labelId = `label_${station}`;
    const labelElement = document.getElementById(labelId);
    if (labelElement) {
      const classList = labelElement.classList;
    if (classList.length > 0) {
        const firstClass = classList.item(0);
        if (firstClass) {
            classList.remove(firstClass);
        }
    }
    labelElement.classList.remove(styles.labelHidden);
    labelElement.classList.add(styles.labelSkipped)
    }
}}

function removeSkippedLabelClass() {
  if (typeof document !== "undefined") {
    const labelId = `label_${randomStation}`;
    const labelElement = document.getElementById(labelId);
  if (labelElement) {
    const classList = labelElement.classList;
    if (classList.length > 0) {
        const firstClass = classList.item(0);
        if (firstClass) {
            classList.remove(firstClass);
        }
    }
    labelElement.classList.remove(styles.labelHidden);
    labelElement.classList.add(styles.labelSkipped)
  }
}}

function addGuessedLabelClass(station: string): void {
  if (typeof document !== "undefined") {
    const labelId = `label_${station}`;
    const labelElement = document.getElementById(labelId);
  if (labelElement) {
    labelElement.classList.remove(styles.labelHidden);
    labelElement.classList.add(styles.labelGuessed)
    labelElement.className = styles.labelGuessed
  }
}}

function removeCorrectLabelClass() {
  if (typeof document !== "undefined") {
    const labelId = `label_${randomStation}`;
    const labelElement = document.getElementById(labelId);
  if (labelElement) {
    labelElement.classList.add(styles.labelSkipped)
  }
}}

useEffect(() => {
  if (remainingTime === 0) {
    addRevealedLabelClass()
    setShowResults(true);
    handleTimeEnded();
    setShowTryAgainButton(true);
  } else if (remainingTime === 0 && !guessMade) {
    addRevealedLabelClass()
  }
}, [remainingTime]);



  // Convert remaining time to minutes, seconds, and milliseconds
  const minutes = Math.floor((remainingTime / 60000) % 60);
  const seconds = Math.floor((remainingTime / 1000) % 60);
  const milliseconds = Math.floor((remainingTime % 1000) / 10);

  const handleStartClick = () => {
    setRunning(true);
    setInputVisible(true);
    onClick(); // Invoke the onClick handler passed from the game component
    inputRef.current?.focus(); // Focus on the Autocomplete input field
    setGuessMade(true)
    focusInputField();
  };


  const handlePlayAgain = () => {
    setPlayAgain(false);
    reset()
    setCorrectStations([])
    setSkippedStations([])
  };

  const reset = () => {
    resetGame();
    setTime(initialTime);
    setInputVisible(false);
    setShowResults(false)
    // removeSkippedLabelClass()
    setCorrectStations([])
    setSkippedStations([])
    // Hide all labels
    const allLabels = document.querySelectorAll("[id^='label_']");
    allLabels.forEach(label => {
      label.classList.add(styles.labelHidden);
    });

    // Hide all markers immediately
    const allMarkers = document.querySelectorAll("[id^='marker_']");
    allMarkers.forEach(marker => {
      marker.className = styles.markerHidden;
    });

  };

  useEffect(() => {
    if (selectedCity !== "") {
      setRunning(false);
      setTime(initialTime);
    }
  }, [selectedCity]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Backspace') {
        setBackspacePressed(true)
      }
    };
    document.body.addEventListener('keydown', handleKeyPress);
    return () => {
      document.body.removeEventListener('keydown', handleKeyPress);
    };
  }, [backspacePressed]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Enter') {
        setEnterPressed(true)
      }
    };
    document.body.addEventListener('keydown', handleKeyPress);
    return () => {
      document.body.removeEventListener('keydown', handleKeyPress);
    };
  }, [enterPressed]);
  
  const handleSubmit = (event: React.SyntheticEvent<Element, Event>, value: string | null) => {
    event.preventDefault();
    const inputValue = value?.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/-/gi," ") || ''; // Provide a default value
    // const isBackspace = event.nativeEvent instanceof KeyboardEvent && (event.nativeEvent as KeyboardEvent).key === 'Backspace' && inputValue.length === 0;
    if (inputValue !== "") {
      if (inputValue === randomStationCleaned.trim().toLowerCase()) {
        // showCorrectMarker()
        setCorrectGuess(true)
        setTimeout(() => {
          setCorrectGuess(false);
        }, 500);
        setGuessMade(true)
        setTimeout(() => {
          setGuessMade(false);
        }, 500);
        setCorrectStation(randomStation);
        const newCorrectStations = [...correctStations, randomStation];
        setCorrectStations(newCorrectStations);
        // Notify the parent component (Game) that the guess is correct
        onKeyPress();
        handleGuessSubmit(inputValue, true);
        setResetInputField((prev) => !prev);
        // inputRef.current?.focus()
        // formRef.current?.focus()
        // resetFocus()
      } else {
        // Notify the parent component (Game) that the guess is incorrect
        // handleGuessSubmit(inputValue, false);
        if (inputValue !== prevInputValue) {
        setShakeAnimation(true); // Trigger shaking animation for incorrect guesses
        setTimeout(() => {
          setShakeAnimation(false);
        }, 500); // Adjust the duration as needed
      }
      }
    } else if (inputValue !== prevInputValue && prevInputValue !== null && !backspacePressed) {
      // if (inputValue !== prevInputValue && prevInputValue !== null && !backspacePressed) {
      // Handle empty input value (e.g., trigger shake animation)
      setShakeAnimation(true); // Trigger shaking animation for empty input
      setTimeout(() => {
        setShakeAnimation(false);
      }, 500); // Adjust the duration as needed
    // }
    } else if (enterPressed && !backspacePressed) {
      setShowError(true)
      setShakeAnimation(true); // Trigger shaking animation for empty input
      setTimeout(() => {
        setShakeAnimation(false);
      }, 500);
    }
    setPrevInputValue(inputValue);
    setBackspacePressed(false)
  };


  const handleSkipFont = () => {
    if (isMobile) {
      setResetHover(true); // Set resetHover state to true after click on mobile
      setTimeout(() => {
          setResetHover(false); // Reset resetHover state after a short delay
      }, 1000); // Adjust the delay as needed
  }
  }

  useEffect(() => {
    if (guessMade && inputRef.current) {
        // Focus on the input field after resetInputField changes
        inputRef.current.focus();
        handleSkipFont()
        setResetHover(true);
        const timeout = setTimeout(() => {
          setResetHover(false);
        }, 100);
        // Clear the timeout if the component unmounts or the resetInputField state changes
        return () => clearTimeout(timeout);
    }
  }, [resetInputField]);

  useEffect(() => {
    if (gameStarted && inputRef.current) {
      inputRef.current.focus();
    }
  })

  const focusInputField = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (resetInputField) {
      // Reset the resetInputField state back to its initial value after a short delay
      setShakeAnimation(false);
      const timeout = setTimeout(() => {
        setResetInputField(false);
      }, 100);
      // Clear the timeout if the component unmounts or the resetInputField state changes
      return () => clearTimeout(timeout);
    }
  }, [resetInputField, shakeAnimation]);

  const check = () => {
    setPlayAgain(true)
    handleModalClose()
  };

  // Function to remove accents and hyphens from a string
  function normalizeString(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/-/g, "");
  }

  // Custom filtering function for Autocomplete
  const filterOptions = (options: string[], { inputValue }: { inputValue: string }) => {
    const input = normalizeString(inputValue).toLowerCase();
    if (input.length < 2) {
      return []; // Return an empty array if the input length is less than 2
    }
    return options.filter(option => {
      const normalizedOption = normalizeString(option).toLowerCase(); // Call the normalizeString function and convert it to lowercase
      const inputWords = input.split(" ");  // Split the input string into individual words
      const normalizedOptionWithSpace = normalizedOption.replace(/-/g, " "); // Replace hyphens with spaces in the normalized option string
      return ( // Check if every word in the input matches any word in the normalized option string
        inputWords.every(word =>  // Check for matches without considering hyphens
          normalizedOption.includes(word) || // Check if the word is present as is
          normalizedOption.includes(word.replace("-", "")) // Check if the word is present without hyphen
        ) || // Check for matches after replacing hyphens with spaces
        inputWords.every(word => 
          normalizedOptionWithSpace.includes(word) || // Check if the word is present as is
          normalizedOptionWithSpace.includes(word.replace("-", "")) // Check if the word is present without hyphen
        )
      );
    });
  };

  const handleSkip = () => {
    setSkippedStation(randomStation);
    const newSkippedStations = [...skippedStations, randomStation];
    setSkippedStations(newSkippedStations);
    setGuessMade(true)
    setTimeout(() => {
      setGuessMade(false);
    }, 500);
    setSkipPressed(true)
    onSkip();
    setResetInputField((prev) => !prev)
    setBackspacePressed(false)
    handleSkipFont()
  };

  useEffect(() => {
    skippedStations.forEach((station) => {
      addSkippedLabelClass(station);
      showSkipMarker(station)
    })
    correctStations.forEach((station) => {
      addGuessedLabelClass(station);
      showCorrectMarker(station)
    })
  }, [skippedStations, correctStations]);
  
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
  

  const getFormWidth = () => { // Default width for computer
    if (isMobile) {
      return "200px";
    } else if (isTablet) {
      return "350px"; // Adjust width for tablet
    } else {
      return "400px"
    }
  }

  const getButtonFont = () => {
    if (isMobile) {
      return '1rem';
    } else if (isTablet) {
      return '1.625rem';
    } else {
      return '1.875rem';
    }
  };

  const getButtonHeight = () => {
    if (isMobile) {
      return '39px';
    } else if (isTablet) {
      return '51px';
    } else {
      return '51px';
    }
  };

  const getButtonWidth = () => {
    if (isMobile) {
      return '200px';
    } else if (isTablet) {
      return '350px';
    } else {
      return '400px';
    }
  };

  const getFormTopMargin = () => {
    if (isMobile) {
      return '60px';
    } else if (isTablet) {
      return '60px';
    } else {
      return '80px';
    }
  };

  const getTopMargin = () => {
    if (isMobile) {
      return '13px';
    } else if (isTablet) {
      return '7px';
    } else {
      return '7px';
    }
  };

  const getSkipLeftMargin = () => {
    if (isMobile) {
      return '260px';
    } else if (isTablet) {
      return '410px';
    } else {
      return '480px';
    }
  };
  
  const getSkipBotMargin= () => {
    if (isMobile) {
      return "0px";
    } else if (isTablet) {
      return "16px";
    } else {
      return '18px';
    }
  };

  const getTimerTopMargin= () => {
    if (isMobile) {
      return "25px";
    } else if (isTablet) {
      return "30px";
    } else {
      return '45px';
    }
  };

  let username = '';
  if (typeof window !== "undefined") {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername !== null) {
      username = storedUsername; // Assign the stored username if it's not null
    }
  }

  return (
    <Box 
  className={styles.mainContainer}
  sx={{marginTop: getFormTopMargin() }}
>
  {showResults ? (
    <>
      {showTryAgainButton ? (
        <button 
          onClick={handlePlayAgain} 
          className={styles.startButton}
          style={{fontSize: getButtonFont(), width: getButtonWidth(), height: getButtonHeight(), marginTop: getTopMargin()}}
        >
          TRY AGAIN
        </button>
      ) : null}
      {showResults && (
        <div>
          <Result
            time={remainingTime}
            count={count}
            reset={reset}
            skipClickCount={skipClickCount}
            numberCorrectGuesses={numberCorrectGuesses}
            selectedCity={selectedCity}
            incorrectGuesses={incorrectGuesses}
            check={check}
            handleTimeEnded={handleTimeEnded}
            timeEnded={timeEnded}
            username={username}
          />
        </div>
      )}
    </>
  ) : (
    <>
      {!gameStarted && !playAgain && (
        <button 
          onClick={handleStartClick} 
          id="startButton" 
          className={styles.startButton}
          style={{fontSize: getButtonFont(), width: getButtonWidth(), height: getButtonHeight(), marginTop: getTopMargin()}}
        >
          START
        </button>
      )}
      {gameStarted && !playAgain && (
        <Box className={styles.container}>
          <form ref={formRef} className={styles.formContainer}>
            <Box sx={{ animation: shakeAnimation ? `${shaker} 0.2s` : "none", "& .MuiInputBase-root": { height: getButtonHeight() } }}>
              <Autocomplete
                sx={{ width: getFormWidth(), backgroundColor: 'rgba(255, 255, 255, 1)', borderRadius: "5px" }} 
                size={isMobile ? 'small' : 'medium'}
                options={stations}
                value={guessedStation}
                onChange={handleSubmit}
                key={resetInputField.toString()}
                autoHighlight={true}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    if (!(guessedStation.trim().length > 0)) {
                      event.preventDefault(); // Prevent the default behavior (form submission)
                      handleSubmit(event, guessedStation); // Handle submission
                    }
                  }
                }}
                freeSolo
                openOnFocus={false}
                filterOptions={filterOptions}
                renderOption={(props, option, { selected }) => {
                  return (
                    <li
                      {...props}
                      key={option}
                      style={{
                        backgroundColor: selected ? '#E4E5E7' : '',
                        cursor: 'pointer',
                      }}
                    >
                      {option}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    autoComplete="new-off"
                    inputRef={inputRef} // Assign inputRef to the Autocomplete input field
                    // onKeyDown={handleKeyDown}
                  />
                )}
              />
            </Box>
            <button type="submit" hidden></button>
          </form>
          <div 
            className={styles.skipContainer}
            style={{marginLeft: getSkipLeftMargin(), marginBottom: getSkipBotMargin()}}
          >
            <Skip onClick={handleSkip} handleSkipFont={handleSkipFont} resetHover={resetHover}/>
          </div>
        </Box>
      )}
      {gameStarted && !playAgain && (
        <div 
          className={styles.timer}
          style={{marginTop: getTimerTopMargin()}}
        >
          <span>{("0" + minutes).slice(-2)}:</span>
          <span>{("0" + seconds).slice(-2)}:</span>
          <span>{("0" + milliseconds).slice(-2)}</span>
        </div>
      )}
    </>
  )}
</Box>
  );
}
  