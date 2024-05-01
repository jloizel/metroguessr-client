"use client"

import { Box, createTheme, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import styles from "./page.module.css";


interface ShareProps {
    selectedCity: string
    count: number
}

const Share: React.FC<ShareProps> = ({selectedCity, count}) => {
    const [copied, setCopied] = useState(false);

    const shareUrl = "https://www.metroguessr.com/";

    const customText = `I managed a score of ${count} on ${selectedCity}, try and beat that!`;
    const scoreText = `I just scored ${count} points on metroguessr 🚇`;
    const cityText = `🗺️ ${selectedCity}`;
    const urlText = 'Try to beat me at https://www.metroguessr.com/';
    const text = `${scoreText}\n\n${cityText}\n\n${urlText}`;

    const handleShare = async () => {
        try {
            if (navigator.share && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Ópera Mini/i.test(navigator.userAgent)) {
                
                await navigator.share({
                    title: scoreText,
                    text: text,
                });
            } else {
                // For non-mobile devices, copy text to clipboard
                navigator.clipboard.writeText(text);
                setCopied(true)
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
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
        return isMobile ? "1.125rem" : "1.875rem";
    }

    const getWidth = () => {
        if (isMobile) {
          return '150px';
        } else if (isTablet) {
          return '180px';
        } else {
          return '230px';
        }
      };

    return (
        <button 
            onClick={handleShare} 
            className={styles.button}
            style={{ fontSize:getFontSize(), paddingTop: "10px", paddingBottom: "10px", width: getWidth() }}
        >
            {copied ? "COPIED!" : "SHARE"}
        </button>
    );
};

export default Share;
