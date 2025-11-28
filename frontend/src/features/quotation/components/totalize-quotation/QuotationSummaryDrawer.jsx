import { Fragment, useState } from 'react';

import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Clear from '@mui/icons-material/Clear';
 
import { FlexBox } from '../../../../shared/components/FlexBox';
import QuotationSummary from '../../components/totalize-quotation/QuotationSummary';

// Botón fijo que siempre está visible
const StyledButton = styled(Button)(() => ({
  position: 'fixed',
  top: '40%',
  right: -30,
  height: 30,
  fontWeight: 400,
  transform: 'rotate(90deg)',
  borderRadius: '0 0 5px 5px',
  zIndex: 1300,
}));

const CustomDrawer = styled(Drawer)(({ theme }) => ({
  width: 320,
  flexShrink: 0,
  boxSizing: 'border-box',
  '& .MuiPaper-root': {
    width: 320,
    overflow: 'hidden',
    boxShadow: theme.shadows[2],
  },
}));

export default function QuotationSummaryDrawer({ children }) {

  const [open, setOpen] = useState(true);   
  const toggleDrawer = () => setOpen(prev => !prev);



  return (
    <Fragment>
  
      <StyledButton color="primary" variant="contained" onClick={toggleDrawer}>
        Resumen
      </StyledButton>

      <CustomDrawer
        open={open}
        anchor="right"
        variant="persistent"             
        ModalProps={{
          keepMounted: true,
          hideBackdrop: true,             
        }}>
        <FlexBox alignItems="center" justifyContent="space-between" px={2} py={1}>
          <Typography variant="body2" fontWeight={500}>
            Resumen de Cotización
          </Typography>
          <IconButton size="small" onClick={toggleDrawer}>
            <Clear fontSize="inherit" />
          </IconButton>
        </FlexBox>
        <Divider />
        <Box p={2}>
          {children}
        </Box>
      </CustomDrawer>
    </Fragment>
  );
}
