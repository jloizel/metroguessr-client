"use client"

import React, { useState, useEffect } from 'react';
import styles from "./page.module.css";
import { createTheme, useMediaQuery } from '@mui/material';

const Stripe: React.FC = () => {

  const handleButtonClick = () => {
    // When the button is clicked, open the Stripe donation page with the determined currency
    window.open("https://buy.stripe.com/6oE3eC6HTcBNcE0aEF", "_blank");
  };

  return (
    <div>
      <button className={styles.button} onClick={handleButtonClick}>
        SUPPORT THE PROJECT
      </button>
    </div>
  );
};

export default Stripe;
