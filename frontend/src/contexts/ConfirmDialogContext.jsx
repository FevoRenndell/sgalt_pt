import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

const ConfirmDialogContext = createContext(null);

export function ConfirmDialogProvider({ children }) {
  const [state, setState] = useState({
    open: false,
    title: '',
    description: '',
    confirmText: 'Aceptar',
    cancelText: 'Cancelar',
    resolve: null,
  });

  const confirm = useCallback((options = {}) => {
    console.log('confirm() description =>', options.description);

    return new Promise((resolve) => {
      setState({
        open: true,
        title: options.title || 'Confirmación',
        description: options.description || '',
        confirmText: options.confirmText || 'Aceptar',
        cancelText: options.cancelText || 'Cancelar',
        resolve,
      });
    });
  }, []);

  const handleClose = (result) => {
    setState((prev) => {
      if (prev.resolve) {
        prev.resolve(result); // true / false
      }
      return { ...prev, open: false, resolve: null };
    });
  };

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}

      <Dialog
        open={state.open}
        onClose={() => handleClose(false)}
        fullWidth
        maxWidth="xs"
      >
        {state.title && (
          <DialogTitle>
            {state.title}
          </DialogTitle>
        )}

        {state.description && (
          <DialogContent dividers>
            <Typography variant="body1">
              {state.description}
            </Typography>
          </DialogContent>
        )}

        <DialogActions>
          <Button onClick={() => handleClose(false)} color="inherit">
            {state.cancelText}
          </Button>
          <Button
            onClick={() => handleClose(true)}
            variant="contained"
            color="primary"
          >
            {state.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirmDialog() {
  const ctx = useContext(ConfirmDialogContext);
  if (!ctx) {
    throw new Error('useConfirmDialog debe usarse dentro de ConfirmDialogProvider');
  }
  return ctx.confirm;
}
