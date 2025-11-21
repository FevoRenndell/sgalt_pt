import { createBrowserRouter, RouterProvider } from 'react-router';
import { ProgressProvider } from '@bprogress/react';
// MUI
import CssBaseline from '@mui/material/CssBaseline';

import { ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
 

import { store } from './app/store';
import { Provider } from 'react-redux';
// RIGHT-TO-LEFT SUPPORT COMPONENT
import { RTL } from './shared/components/RTL';
// ROUTES METHOD

// MUI THEME CREATION METHOD
import { createCustomTheme } from './theme';
// SITE SETTINGS CUSTOM DEFINED HOOK
import { useSettings } from './shared/hooks/useSettings';
// I18N FILE
import './i18n';
import { routes } from './routes';

export default function App() {
  // SITE SETTINGS CUSTOM DEFINED HOOK
  const {
    settings
  } = useSettings();

  // MUI THEME CREATION
  const theme = createCustomTheme(settings);

  // ROUTER CREATE
  const router = createBrowserRouter(routes());
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >

        
          <RTL>
            <ProgressProvider options={{
              showSpinner: false
            }}>
              <CssBaseline />
              <Provider store={store}>
                <RouterProvider router={router} />
              </Provider>
            </ProgressProvider>
          </RTL>
        

      </SnackbarProvider>
    </ThemeProvider>
  )

}

