"use client"

import React, { useState, useEffect } from 'react';
import styles from "./page.module.css";
import { createTheme, useMediaQuery } from '@mui/material';

const Stripe: React.FC = () => {

    const handleButtonClick = () => {
        // When the button is clicked, open the Stripe donation page with the determined currency
        window.open("https://buy.stripe.com/6oE3eC6HTcBNcE0aEF", "_blank");
    };

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

      const getFontSize = () => {
        if (isMobile) {
          return '0.85rem';
        } else if (isTablet) {
          return '1.25rem';
        } else {
          return '1.625rem';
        }
      };

    return (
        <div>
            <button 
                className={styles.button} 
                onClick={handleButtonClick}
                style={{ fontSize: getFontSize(), paddingLeft: "15px", paddingRight: "15px", paddingTop: "10px", paddingBottom: "10px"}}
            >SUPPORT THE PROJECT</button>
        </div>
    );
};

export default Stripe;
