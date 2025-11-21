// AppConfirmDialog.jsx

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
} from '@mui/material';
 

export default function AppConfirmDialog({
  open,
  title = 'Confirmación',
  description = '',
  type = 'warning',
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  onConfirm,
  onClose,
}) {
  const handleClose = () => {
    onClose?.();
  };

  const handleConfirm = () => {
    onConfirm?.();
  };

  return (

    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
    >
      {title && (
        <DialogTitle sx={{ m : 0, p: 2 }}>
          {title}
        </DialogTitle>
      )}

      <DialogContent sx={{ m : 0, p: 2 }} dividers>
        {description && (<Alert severity={type}> {description}</Alert>)}
      </DialogContent>


      <DialogActions sx={{ m : 0, p: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          color="error"
          size="small"
        >
          {cancelText}
        </Button>

        <Button
          onClick={handleConfirm}
          variant="outlined"
          color="success"
          size="small"
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>

  );
}
