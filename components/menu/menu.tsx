"use client"

import React, { useState } from 'react';
import { Box, createTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import styles from "./page.module.css";
import ModalClose from '@mui/joy/ModalClose';
import Button from '@mui/joy/Button';
import Drawer from '@mui/joy/Drawer';
import Stripe from '../stripe/stripe';
import ReactGA from 'react-ga';
import { IoLogoLinkedin } from "react-icons/io";
import { FaGithub } from "react-icons/fa";
import LinkedInIcon from './public/linkedin.png';
import { FaGithubSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import Username from '../username/username';



interface MenuProps {
    cityChange: (city: string) => void;
    resetGame: () => void
    disableButtons: () => void
    enableButtons: () => void
    isUsernameAllowed: boolean
}

const Menu: React.FC<MenuProps> = ({ cityChange, resetGame, disableButtons, enableButtons, isUsernameAllowed }) => {
    const [open, setOpen] = useState(false);

    const handleCityClick = (city: string) => {
        cityChange(city);
        setOpen(false); // Close the drawer after selecting a city
        resetGame()
        ReactGA.event({
            category: 'Button Click',
            action: `Clicked on ${city}`,
            label: 'City Button',
          });
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

    const getButtonGap = () => {
        if (isMobile) {
          return '20px';
        } else if (isTablet) {
          return '25px';
        } else {
          return '30px';
        }
      };

    const logoSize = () => {
    if (isMobile) {
        return '30px';
    } else if (isTablet) {
        return '40px';
    } else {
        return '50px';
    }
    };

    const getTopPadding = () => {
        if (isMobile) {
            return '5px';
        } else if (isTablet) {
            return '8px';
        } else {
            return '11px';
        }
    };

    const getContainerWidth  = () => {
        if (isMobile) {
          return '90%';
        } else {
          return '80%';
        }
      };

    const getColumnGap  = () => {
        if (isMobile) {
            return '10px';
        } else {
            return '25px';
        }
    }; 

    const linkedinProfileUrl = 'https://www.linkedin.com/in/jackloizel/';
    const githubProfileUrl = 'https://github.com/jloizel';


    return (
        <Box className={styles.menu}>
            <div className={styles.button}>
                <Button 
                    onClick={() => setOpen(true)} 
                    className={styles.button} 
                    variant="plain" 
                    sx={{ minHeight: 0, minWidth: 0, padding: 0, '&:hover': { backgroundColor: 'transparent', '&:focus': {outline: 'none'} }}}>
                    <MenuIcon className={styles.icon}/>
                </Button>
            </div>
            <Drawer
                sx={{height: "100%"}}
                open={open} 
                onClose={() => {
                    // Only close the drawer if username is allowed
                    if (isUsernameAllowed) {
                        setOpen(false);
                    }
                }}
                anchor="right"
                size={isMobile ? "lg" : "lg"}
            >
                <div className={styles.leaderboardContainer}>
                    <div className={styles.header}>
                        Username 👇
                    </div>
                    <div>
                        <Username disableButtons={disableButtons} enableButtons={enableButtons}/>
                    </div>
                </div>
                <div className={styles.header}>
                    Select Your City 📍
                </div>
                <ModalClose/>
                <div 
                    className={styles.cityButtonContainer}
                    style={{width: getContainerWidth(), columnGap: getColumnGap()}}
                >
                    <Button className={styles.cityButton}
                        variant="plain"
                        onClick={() => handleCityClick('Barcelona')}
                        sx={{ color: "black", '&:hover': { backgroundColor: '#E4E5E7' } }}
                        disabled={!isUsernameAllowed}
                    >BARCELONA</Button>
                    <Button className={styles.cityButton}
                        variant="plain"
                        onClick={() => handleCityClick('Berlin')}
                        sx={{ color: "black", '&:hover': { backgroundColor: '#E4E5E7' } }}
                        disabled={!isUsernameAllowed}
                    >BERLIN</Button>
                    <Button className={styles.cityButton}
                        variant="plain"
                        onClick={() => handleCityClick('London')}
                        sx={{ color: "black", '&:hover': { backgroundColor: '#E4E5E7' } }}
                        disabled={!isUsernameAllowed}
                    >LONDON</Button>
                    <Button className={styles.cityButton}
                        variant="plain" 
                        onClick={() => handleCityClick('Lyon')}
                        sx={{ color: "black", '&:hover': { backgroundColor: '#E4E5E7' } }}
                        disabled={!isUsernameAllowed}
                    >LYON</Button>
                    <Button className={styles.cityButton}
                        variant="plain" 
                        onClick={() => handleCityClick('Madrid')}
                        sx={{ color: "black", '&:hover': { backgroundColor: '#E4E5E7' } }}
                        disabled={!isUsernameAllowed}
                    >MADRID</Button>
                    <Button className={styles.cityButton}
                        variant="plain" 
                        onClick={() => handleCityClick('NewYorkCity')}
                        sx={{ color: "black", '&:hover': { backgroundColor: '#E4E5E7' } }}
                        disabled={!isUsernameAllowed}
                    >NEW YORK CITY</Button>
                    <Button className={styles.cityButton}
                        variant="plain" 
                        onClick={() => handleCityClick('Paris')}
                        sx={{ color: "black", '&:hover': { backgroundColor: '#E4E5E7' } }}
                        disabled={!isUsernameAllowed}
                    >PARIS</Button>
                </div>
                <Box className={styles.info}>
                    <Stripe />
                    <Box className={styles.logos}>
                        <Box className={styles.linKedin}>
                            <a href={linkedinProfileUrl} target="_blank" rel="noopener noreferrer">
                                <FaLinkedin style={{ fontSize: logoSize()}} className={styles.linkedinIcon}/>
                            </a>
                        </Box>
                        <Box className={styles.github}>
                            <a href={githubProfileUrl} target="_blank" rel="noopener noreferrer">
                                <FaGithubSquare style={{ fontSize: logoSize()}} className={styles.githubIcon}/>
                            </a>
                        </Box>
                    </Box>
                </Box>
            </Drawer>
        </Box>
    );
};

export default Menu;