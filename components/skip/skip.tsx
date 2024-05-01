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
    
      const getFontSize = () => { // Default width for computer
        if (isMobile) {
          return "0.875rem";
        } else if (isTablet) {
          return "1.125rem"; // Adjust width for tablet
        } else {
          return "1.25rem"
        }
      }

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
          return '60px';
        } else if (isTablet) {
          return '70px';
        } else {
          return '90px';
        }
      };

      const getLeftMargin = () => {
        if (isMobile) {
          return '15px';
        } else if (isTablet) {
          return '35px';
        } else {
          return '35px';
        }
      };

      const handleButtonClick = () => {
        onClick(); // Call the onClick prop function
        handleSkipFont()
      };

    return (
        <div>
            <button 
                className={`${styles.button} ${resetHover ? styles['hover-effect'] : ''}`}
                onClick={handleButtonClick}
                style={{fontSize: getFontSize(), height: getButtonHeight(), width: getButtonWidth(), marginLeft: getLeftMargin() }}
            >SKIP</button>
        </div>
    );
};

export default Skip;
