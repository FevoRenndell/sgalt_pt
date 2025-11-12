import PropTypes from 'prop-types';
// @mui
import { TableRow, TableCell } from '@mui/material';

//
import EmptyContent from '../EmptyContent';
// ----------------------------------------------------------------------

TableNoData.propTypes = {
  isNotFound: PropTypes.bool,
  col:PropTypes.any,
};

export default function TableNoData({ isNotFound, col }) {

  return (
    <TableRow>
      {isNotFound ? (
        <TableCell colSpan={col}>
          <EmptyContent
            title='nada'
            sx={{
              '& span.MuiBox-root': { height: 160 },
            }}
          />
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}
