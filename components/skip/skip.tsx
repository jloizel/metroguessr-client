"use client"

import React, { useState } from 'react';
import styles from "./page.module.css";
import { createTheme, useMediaQuery } from '@mui/material';

interface SkipProps {
    onClick: () => void;
    handleSkipFont: () => void
    resetHover: boolean
}

const Skip: React.FC<SkipProps> = ({ onClick, handleSkipFont, resetHover }) => {

  const handleButtonClick = () => {
    onClick(); 
    handleSkipFont()
  };

  return (
    <button className={`${styles.button} ${resetHover ? styles['hover-effect'] : ''}`} onClick={handleButtonClick}>
      SKIP
    </button>
  );
};

export default Skip;
