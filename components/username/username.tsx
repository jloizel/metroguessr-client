"use client"

import React, { useState, useEffect, useRef } from 'react';
import styles from "./page.module.css";
import { Box, Button, createTheme, useMediaQuery } from '@mui/material';
import { useUsernameContext } from './usernameContext';
import { getAllUsernames } from '@/app/API';
// import Filter from 'bad-words';

interface UsernameProps {
  disableButtons: () => void
  enableButtons: () => void
}

const Username: React.FC<UsernameProps> = ({disableButtons, enableButtons}) => {
  const { username, setUsername } = useUsernameContext();
  const [keyPressed, setKeyPressesed] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [allUsernames, setAllUsernames] = useState<string[]>([]);
  const [savedUsername, setSavedUsername] = useState<string>('');

 

  const generateRandomUsername = (): string => {
    const randomNumber = Math.floor(Math.random() * 1000); // Generate a random number between 0 and 99
    return `Random-Wagon-${randomNumber}`;
  };

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const usernames = await getAllUsernames();
        setAllUsernames(usernames);
      } catch (error) {
        console.error('Error fetching usernames:', error);
      }
    };

    fetchUsernames();
    setSavedUsername(localStorage.getItem('username') || '');
  }, []);

  const Filter = require('bad-words'),
  filter = new Filter();

  // Function to handle username input change
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = event.target.value.trim();

    // Check for profanity
    if (filter.isProfane(newUsername)) {
      setErrorMessage('Profanity is not allowed');
      disableButtons();
      // resetUsername()
      return;
    }
    setUsername(newUsername); // Update username state

    // Validate input using regex to allow only alphabetic characters and hyphens
    const isValid = /^[a-zA-Z0-9-]*$/.test(newUsername);
    setErrorMessage(isValid || newUsername === '' ? '' : 'Special characters are not allowed');
    
  };

  // Function to handle form submission when Enter key is pressed
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      saveUsername();
    }
  };

  useEffect(() => {
    // Focus on the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const resetUsername = () => {
    const randomUsername = generateRandomUsername();
      setUsername(randomUsername);
      setSavedUsername(randomUsername);
      localStorage.setItem('username', randomUsername);
      enableButtons();
      setErrorMessage("")
  };

  // Function to save the username in LocalStorage
  const saveUsername = () => {
    const trimmedUsername = username.trim();
  
    if (trimmedUsername === '') {
      const randomUsername = generateRandomUsername();
      setUsername(randomUsername);
      setSavedUsername(randomUsername);
      localStorage.setItem('username', randomUsername);
      enableButtons();
      return;
    }
  
    // Check if the username exists in the database
    const usernameExistsInDatabase = allUsernames.includes(trimmedUsername);
    const isValidUsername = /^[a-zA-Z0-9-]*$/.test(trimmedUsername);

    if (!isValidUsername) {
      disableButtons(); // Disable buttons if username is invalid
      resetUsername()
      return;
    }
  
    // if (usernameExistsInDatabase && trimmedUsername !== savedUsername) {
    //   setErrorMessage('Username already taken, select another');
    //   disableButtons();
    //   return;
    // }
  
    // Save the username to localStorage only if it's not already in the system
      setUsername(trimmedUsername); 
      setSavedUsername(trimmedUsername);
      localStorage.setItem('username', trimmedUsername);
      enableButtons();
  };

  useEffect(() => {
    const handleInputBlur = () => {
      setErrorMessage('');
      // resetUsername()
      enableButtons();
    };

    const handleKeyPress = (e:any) => {
      if (e.key === 'Enter') {
        setErrorMessage('');
        // resetUsername()
        enableButtons();
      }
    };

    // Add event listeners to handle input blur and Enter key press
    const inputElement = document.getElementById('usernameInput');

    if (inputElement) {
      inputElement.addEventListener('blur', handleInputBlur);
      inputElement.addEventListener('keypress', handleKeyPress);
    }

    // Cleanup event listeners when component unmounts
    return () => {
      if (inputElement) {
        inputElement.removeEventListener('blur', handleInputBlur);
        inputElement.removeEventListener('keypress', handleKeyPress);
      }
    };
  }, [savedUsername]);

  // Function to handle form submission
  const handleSubmit = (event:any) => {
    event.preventDefault();
    // Store the username in LocalStorage
    localStorage.setItem('username', username);
  };

  // Function to retrieve the username from LocalStorage
  const getStoredUsername = () => {
    return localStorage.getItem('username');
  };    

  // Function to handle double click event
  const handleDoubleClick = () => {
      if (inputRef.current) {
        inputRef.current.select(); // Select the text in the input field
      }
    };

  const handleBlur = () => {
    saveUsername(); // Save the username when input loses focus
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

  const getHeader1FontSize = () => {
    if (isMobile) {
      return '1.125rem';
    } else if (isTablet) {
      return '1.125rem';
    } else {
      return '1.375rem';
    }
  };

  const getErrorFontSize = () => {
    if (isMobile) {
      return '12px';
    } else if (isTablet) {
      return '14px';
    } else {
      return '14px';
    }
  };

  return (
    <div className={styles.container}>
      <form
        onSubmit={(event) => event.preventDefault()}
      >
        <input
          id="usernameInput"
          type="text"
          value={username}
          onChange={handleUsernameChange}
          onKeyDown={handleKeyPress}
          onDoubleClick={handleDoubleClick}
          onBlur={handleBlur}
          className={styles.input}
          spellCheck={false}
          autoComplete='off'
          style={{ fontSize: getHeader1FontSize(), fontWeight: 600 }}
          ref={inputRef}
        />
        {errorMessage && <div className={styles.error} style={{ fontSize: getErrorFontSize() }}>{errorMessage}</div>}
      </form>
    </div>
  );
};

export default Username;
