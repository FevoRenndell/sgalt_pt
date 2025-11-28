
// MUI
import { Button, IconButton } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
// CUSTOM ICON COMPONENTS
 
 
//  STYLED COMPONENTS
const Wrapper = styled('div')(({
  theme
}) => ({
  gap: '1rem',
  display: 'flex',
  alignItems: 'center',
  paddingBlock: '1.5rem',

  '.select': {
    flex: '1 1 200px'
  },
  '.navigation': {
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.grey[50],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[700]
    }),
    [theme.breakpoints.down(440)]: {
      display: 'none'
    }
  }
}));

// ==============================================================

// ==============================================================

 
export default function QuotationServiceActions({
  handleChangeFilter,
  handleCleanFilter, 
  serviceGroup = [],
  filter
}) {
 
  return <Wrapper>
      <TextField select fullWidth label="Todo" className="select" value={filter.area} onChange={e => handleChangeFilter('area', e.target.value)}>
        {serviceGroup?.map(({ id, area, value }) =>    {
          return (
            <MenuItem key={id} value={id}>
              {area}
            </MenuItem>
          );
        })}
      </TextField>

      <TextField fullWidth label="Buscar por servicio" value={filter.search} onChange={e => handleChangeFilter('search', e.target.value)} />

        <Button variant="outlined" size='large' sx={{ m : 0}} color='warning' startIcon={<CleaningServicesIcon />} onClick={handleCleanFilter}>
          Limpiar
        </Button>
    </Wrapper>;
}