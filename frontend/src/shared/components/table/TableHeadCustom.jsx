import { useCallback } from 'react';
// MUI
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import visuallyHidden from '@mui/utils/visuallyHidden';
import { styled } from '@mui/material/styles';

// STYLED COMPONENTS
const StyledTableHead = styled(TableHead)(({
  theme
}) => ({
  backgroundColor: theme.palette.action.hover
}));
const HeaderCell = styled(TableCell)(({
  theme
}) => ({
  fontWeight: 500,
  color: theme.palette.text.primary
}));

export default function TableHeadCCustom({
  order,
  orderBy,
  headCells,
  onRequestSort,
}) {
  const createSortHandler = useCallback(property => event => {
    onRequestSort(event, property);
  }, [onRequestSort]);
 
  return (
    <StyledTableHead>
      <TableRow>
 
        {headCells.map(headCell => <HeaderCell key={headCell.id} padding={headCell.disablePadding ? 'none' : 'normal'} sortDirection={orderBy === headCell.id ? order : false} sx={{ minWidth: headCell.minWidth }}>
            <TableSortLabel active={orderBy === headCell.id} onClick={createSortHandler(headCell.id)} direction={orderBy === headCell.id ? order : 'asc'}>
              {headCell.label}
              {orderBy === headCell.id ? <span style={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span> : null}
            </TableSortLabel>
          </HeaderCell>)}
      </TableRow>
    </StyledTableHead>
  );
}