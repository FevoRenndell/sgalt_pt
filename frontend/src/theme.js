// src/theme.js
import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#2065D1' },
          secondary: { main: '#3366FF' },
          background: { default: '#F9FAFB', paper: '#FFFFFF' },
          text: { primary: '#212B36', secondary: '#637381' },
        }
      : {
          primary: { main: '#2065D1' },
          secondary: { main: '#3366FF' },
          background: { default: '#121212', paper: '#1E1E1E' },
          text: { primary: '#FFFFFF', secondary: '#B0B0B0' },
        }),
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: "'Public Sans', sans-serif",
    h5: { fontWeight: 600 },
  },
});

export const buildTheme = (mode = 'light') => createTheme(getDesignTokens(mode));
