import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

export default function Modal({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  hideActions = false,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {title && (
        <DialogTitle>
          <Typography variant="h6">{title}</Typography>
        </DialogTitle>
      )}

      <DialogContent dividers>
        {children}
      </DialogContent>

      {!hideActions && (
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            {cancelText}
          </Button>
          <Button onClick={onConfirm} variant="contained" color="primary">
            {confirmText}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
