"use client"

import React, { useState, useEffect } from 'react';
import styles from "./page.module.css";
import { createTheme, useMediaQuery } from '@mui/material';

const Poll: React.FC = () => {

  const handleButtonClick = () => {
    // When the button is clicked, open the Stripe donation page with the determined currency
    window.open("https://forms.gle/syqcJ1Zw3295AEuX8", "_blank");
  };

  return (
    <div>
      <button className={styles.button} onClick={handleButtonClick}>
        VOTE FOR NEXT CITY
      </button>
    </div>
  );
};

export default Poll;
