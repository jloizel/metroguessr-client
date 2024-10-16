"use client"

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { Box, Button, Fade, Modal, IconButton, createTheme, useMediaQuery } from "@mui/material";
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
            <div className={styles.text1}>
              YOU SCORED
            </div>
            <div className={styles.text2}>
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
