"use client"

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import styles from "./page.module.css";

interface CounterProps {
    count: number;
    countChange: number | null;
}

const Counter: React.FC<CounterProps> = ({ count, countChange }) => {
    const [marginLeft, setMarginLeft] = useState('0px'); 
    const [countChangeColor, setCountChangeColor] = useState('black');
    
    useEffect(() => {
        // Set marginLeft based on countChange value
        if (countChange !== null && countChange !== undefined) {
            setMarginLeft('20px');
            if (countChange > 0) {
                setCountChangeColor('#0ddb5a');
            } else {
                setCountChangeColor('#DF0505');
            }
        } else {
            setMarginLeft('0px');
        }
    }, [countChange]);

    return (
        <Box className={styles.container} style={{ marginLeft: marginLeft }}>
            <Box className={styles.counter}>
                {count}
            </Box>
            <Box id="fader" className={styles.counterChange} style={{ color: countChangeColor }}>
                {countChange !== null && countChange !== undefined && countChange > 0 ? `+${countChange}` : countChange}
            </Box>
        </Box>
    );
};

export default Counter;
