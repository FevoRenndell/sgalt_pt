import PropTypes from 'prop-types';

import { Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';
import { useState } from 'react';


const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

const getPadding = (isStretch) => {
  if(isStretch){
    return {pr:0, pl:0.4, pt:1, pb:1}
  }
  return {}
}

TableHead.propTypes = {
  onSort: PropTypes.func,
  orderBy: PropTypes.string,
  headLabel: PropTypes.array,
  rowCount: PropTypes.number,
  numSelected: PropTypes.number,
  onSelectAllRows: PropTypes.func,
  order: PropTypes.oneOf(['asc', 'desc']),
  sx: PropTypes.object,
  stretch : PropTypes.any,
};

export default function TableHeadCustom({
  order,
  orderBy,
  rowCount = 0,
  headLabel,
  numSelected = 0,
  onSort,
  onSelectAllRows,
  sx,
  stretch
}) {

  const [checked, setChecked] = useState(false);


  const onSelectAll = (event, isSelectAll) => {
    setChecked(isSelectAll);
    onSelectAllRows(null, isSelectAll)
  }

  return (
    <TableHead sx={sx}>
      <TableRow>
          {onSelectAllRows && (
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={checked}
                onChange={(event) => onSelectAll(null, event.target.checked)}
              />
            </TableCell>
          )}



        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ width: headCell.width, minWidth: headCell.minWidth, ...getPadding(stretch?.modify) }}
          >
            {onSort ? (
              <TableSortLabel
                hideSortIcon
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={() => onSort(headCell.id)}
                sx={{ textTransform: 'capitalize' }}
              >
                {headCell.label}

                {orderBy === headCell.id ? (
                  <Box sx={{ ...visuallyHidden }}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
