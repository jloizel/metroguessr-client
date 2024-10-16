import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UsernameContextType {
  username: string;
  setUsername: (username: string) => void;
}

const UsernameContext = createContext<UsernameContextType | undefined>(undefined);

export const useUsernameContext = (): UsernameContextType => {
  const context = useContext(UsernameContext);
  if (!context) {
    throw new Error('useUsernameContext must be used within a UsernameProvider');
  }
  return context;
};

interface UsernameProviderProps {
  children: ReactNode; 
}

export const UsernameProvider: React.FC<UsernameProviderProps> = ({ children }) => {
  const [username, setUsername] = useState<string>(() => {
    // Initialize username from localStorage, or use a default value
    if (typeof window !== "undefined") {
      return localStorage.getItem('username') || '';
    } else {
      return ''; 
    }
  });

  const setUsernameAndStore = (newUsername: string) => {
    setUsername(newUsername);
    // localStorage.setItem('username', newUsername);
  };

  return (
    <UsernameContext.Provider value={{ username, setUsername: setUsernameAndStore }}>
      {children}
    </UsernameContext.Provider>
  );
};
