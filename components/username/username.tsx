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
    const randomNumber = Math.floor(Math.random() * 1000); 
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

    if (newUsername.length > 15) {
      setErrorMessage('Username cannot exceed 15 characters');
      disableButtons();
      return;
    }
    
    setUsername(newUsername); // Update username state

    // Validate input using regex to allow only alphabetic characters and hyphens
    const isValid = /^[a-zA-Z0-9-]*$/.test(newUsername);
    setErrorMessage(isValid || newUsername === '' ? '' : 'Special characters are not allowed');
    
  };

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
      disableButtons(); 
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

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('blur', handleInputBlur);
        inputElement.removeEventListener('keypress', handleKeyPress);
      }
    };
  }, [savedUsername]);

  // Function to handle double click event
  const handleDoubleClick = () => {
      if (inputRef.current) {
        inputRef.current.select(); 
      }
    };

  const handleBlur = () => {
    saveUsername(); 
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
          ref={inputRef}
        />
        {errorMessage && 
          <div className={styles.error}>
            {errorMessage}
          </div>
        }
      </form>
    </div>
  );
};

export default Username;
