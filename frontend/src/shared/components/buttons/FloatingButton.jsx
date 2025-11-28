import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export default function FloatingButton() {
  return (
    <Fab
      color="primary"
      aria-label="add"
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 2000,
      }}
    >
      <AddIcon />
    </Fab>
  );
}
