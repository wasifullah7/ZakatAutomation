import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeModeContext = createContext({
  mode: 'light',
  setMode: () => {},
});

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') || 'light';
    setMode(savedMode);
    document.documentElement.setAttribute('data-bs-theme', savedMode);
  }, []);

  const updateMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem('theme-mode', newMode);
    document.documentElement.setAttribute('data-bs-theme', newMode);
  };

  return (
    <ThemeModeContext.Provider value={{ mode, setMode: updateMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeModeContext); 