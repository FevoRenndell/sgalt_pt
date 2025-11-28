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

// ==============================================================

// ==============================================================

const headCells = [
{
  id: 'area',
  numeric: false,
  disablePadding: false,
  label: 'Area'
},
{
  id: 'name',
  numeric: true,
  disablePadding: false,
  label: 'Nombre'
}, 
{
  id: 'norma',
  numeric: true,
  disablePadding: false,
  label: 'Norma'
}, 
{
  id: 'unit',
  numeric: true,
  disablePadding: false,
  label: 'Unidad'
}, 
{
  id: 'quantity',
  numeric: true,
  disablePadding: false,
  label: 'Cantidad'
}, 
{
  id: 'value',
  numeric: true,
  disablePadding: false,
  label: 'Valor'
}, 
{
  id: 'total',
  numeric: true,
  disablePadding: false,
  label: 'Total'
}, 
 
 

];
export default function QuotationServiceTableHead({
  order,
  orderBy,
  rowCount,
  numSelected,
  onRequestSort,
  onSelectAllRows
}) {
  const createSortHandler = useCallback(property => event => {
    onRequestSort(event, property);
  }, [onRequestSort]);
  return <StyledTableHead>
      <TableRow>
        <TableCell padding="checkbox">
          
        </TableCell>

        {headCells.map(headCell => <HeaderCell key={headCell.id} padding={headCell.disablePadding ? 'none' : 'normal'} sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel active={orderBy === headCell.id} onClick={createSortHandler(headCell.id)} direction={orderBy === headCell.id ? order : 'asc'}>
              {headCell.label}
              {orderBy === headCell.id && <span style={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>}
            </TableSortLabel>
          </HeaderCell>)}
      </TableRow>
    </StyledTableHead>;
}