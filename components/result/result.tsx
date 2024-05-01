"use client"

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { Box, Button, Fade, Modal, IconButton, createTheme, useMediaQuery } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon
import Share from "../share/share";
import Leaderboard from "../leaderboard/leaderboard";

interface ResultProps {
    time: number;
    count: number;
    reset: () => void;
    skipClickCount: number;
    numberCorrectGuesses: number;
    selectedCity: string;
    incorrectGuesses: string[]
    check: () => void;
    handleTimeEnded: () => void;
    timeEnded: boolean
    username: string
}

export const Result: React.FC<ResultProps> = ({ time, count, reset, selectedCity, check, handleTimeEnded, timeEnded, username }) => {
    const [open, setOpen] = useState(false);
    const [scoreAdded, setScoreAdded] = useState(false);

    useEffect(() => {
      if (time === 0) {
          setOpen(true);
          handleTimeEnded()
      }
  }, [time]);

    const handleClose = () => {
        setOpen(false);
        check();
        // handleTimeEnded()
    };

    const handlePlayAgain = () => {
      reset();
      setOpen(false); // Close the modal after resetting the game
  };

//   useEffect(() => {
//     if (open) {
//        setScoreAdded(true)
//     } else {
//       setScoreAdded(false)
//     }
// }, []);

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

  const getText1FontSize = () => { // Default width for computer
    if (isMobile) {
      return "1.125rem";
    } else if (isTablet) {
      return "1.625rem"; // Adjust width for tablet
    } else {
      return "1.875rem"
    }
  }

  const getText2FontSize = () => { // Default width for computer
    if (isMobile) {
      return "1.875rem";
    } else if (isTablet) {
      return "2.25rem"; // Adjust width for tablet
    } else {
      return "3.125rem"
    }
  }

  return (
    <div>
      <Modal 
        className={styles.modal}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        disableAutoFocus={true} 
        // slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box className={styles.container}>
            {/* <div className={styles.closeButton}>
              <IconButton aria-label="close" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div> */}
            <div 
              className={styles.text1}
              style={{fontSize: getText1FontSize()}}
            >
              YOU SCORED
            </div>
            <div 
              className={styles.text2}
              style={{fontSize: getText2FontSize()}}
            >
              {count} POINTS
            </div>
            <Share selectedCity={selectedCity} count={count}/>
            <Button onClick={handlePlayAgain} className={styles.button} sx={{'&:hover': { backgroundColor: '#E4E5E7'}}}>TRY AGAIN </Button>
            <Leaderboard 
              username={username}
              points={count}
              city={selectedCity}
              timeEnded={timeEnded}
              reset={reset}
            />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default Result;
