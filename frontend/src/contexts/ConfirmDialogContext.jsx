import React, {
  createContext,
  useContext,
  useState,
} from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Box,
} from '@mui/material';

const ConfirmDialogContext = createContext(null);

export function ConfirmDialogProvider({ children }) {
  const [state, setState] = useState({
    open: false,
    title: '',
    description: '',
    severity: 'warning',
    type: 'warning',
    confirmText: 'Aceptar',
    cancelText: 'Cancelar',
    resolve: null,
  });

  // función que usarás en los componentes: const confirm = useConfirmDialog();
  const confirm = (options = {}) => {
    return new Promise((resolve) => {
      setState({
        open: true,
        title: options.title || 'Confirmación',
        description: options.description || '',
        severity: options.severity || 'warning',
        type: options.type || 'warning', // 'warning' | 'error' | 'info' | 'success'
        confirmText: options.confirmText || 'Aceptar',
        cancelText: options.cancelText || 'Cancelar',
        resolve,
      });
    });
  };

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
          <DialogTitle sx={{ m: 0, p: 2 }}>
            {state.title}
          </DialogTitle>
        )}

        <DialogContent sx={{ m: 0, p: 2 }} dividers>
          {state.description && (
            <Box sx={{ bgcolor: 'background.paper', py: 2, borderRadius: 2 }}>
              <Alert severity={state.severity} sx={{ m: 0 }}>
                {state.description}
              </Alert>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ m: 0, p: 2 }}>
          <Button
            onClick={() => handleClose(false)}
            variant="outlined"
            color="error"
            size="small"
          >
            {state.cancelText}
          </Button>

          <Button
            onClick={() => handleClose(true)}
            variant="outlined"
            color="success"
            size="small"
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
