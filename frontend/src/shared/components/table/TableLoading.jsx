
import { PropTypes } from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { TableRow, TableCell } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
//

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  height: '100%',
  display: 'flex',
  textAlign: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(8, 2),
}));

TableLoading.propTypes = {
  load : PropTypes.any,
  col : PropTypes.any,
  }

export default function TableLoading({ load, col}) {
  return (
    <TableRow>
      <TableCell colSpan={col}>
        <RootStyle>
          <CircularProgress size={100} thickness={4} sx={{ top: 0, left: 0, opacity: 0.48 }} />
        </RootStyle>
      </TableCell>
    </TableRow>
  );
}
