import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define a new context for managing the username state
interface UsernameContextType {
  username: string;
  setUsername: (username: string) => void;
}

const UsernameContext = createContext<UsernameContextType | undefined>(undefined);

// Custom hook to use the UsernameContext
export const useUsernameContext = (): UsernameContextType => {
  const context = useContext(UsernameContext);
  if (!context) {
    throw new Error('useUsernameContext must be used within a UsernameProvider');
  }
  return context;
};

// Define props for UsernameProvider component
interface UsernameProviderProps {
  children: ReactNode; // Define children prop as ReactNode
}

// Provider component to wrap the application and provide the UsernameContext
export const UsernameProvider: React.FC<UsernameProviderProps> = ({ children }) => {
  const [username, setUsername] = useState<string>(() => {
    // Initialize username from localStorage, or use a default value
    if (typeof window !== "undefined") {
      return localStorage.getItem('username') || '';
    } else {
      return ''; // Return default value if localStorage is not available
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
