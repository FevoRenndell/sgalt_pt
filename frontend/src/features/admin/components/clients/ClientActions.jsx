// MUI
import { Button, Grid } from '@mui/material';
 
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

//  STYLED COMPONENTS
const Wrapper = styled('div')(({ theme }) => ({
  gap: '1rem',
  display: 'flex',
  alignItems: 'center',
  paddingBlock: '1.5rem',

  '.select': {
    flex: '1 1 200px',
  },
  '.navigation': {
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.grey[50],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[700],
    }),
    [theme.breakpoints.down(440)]: {
      display: 'none',
    },
  },
}));

export default function ClientActions({
  handleChangeFilter,
  handleCleanFilter,
  filter = {},
}) {
  const rutValue = filter.rut ?? '';
  const searchValue = filter.search ?? '';

  return (
    <Wrapper>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Buscar por RUT */}
        <Grid xs={12} md={4}>
          <TextField
            fullWidth
            name="rut"
            label="Buscar por RUT"
            value={rutValue}
            onChange={(e) => handleChangeFilter('rut', e.target.value)}
          />
        </Grid>

        {/* Buscar por cliente */}
        <Grid xs={12} md={4}>
          <TextField
            fullWidth
            name="search"
            label="Buscar por cliente"
            value={searchValue}
            onChange={(e) => handleChangeFilter('search', e.target.value)}
          />
        </Grid>

        {/* Botón limpiar */}
        <Grid xs={12} md={2}>
          <Button
            fullWidth
            variant="outlined"
            size="medium"
            sx={{ m: 0, height: '44.13px' }}
            color="warning"
            startIcon={<CleaningServicesIcon />}
            onClick={handleCleanFilter}
          >
            Limpiar
          </Button>
        </Grid>
      </Grid>
    </Wrapper>
  );
}
