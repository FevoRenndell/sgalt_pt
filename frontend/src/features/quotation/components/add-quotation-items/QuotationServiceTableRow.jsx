import { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
// MUI
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';
import { formatThousands } from '../../../../shared/utils/formatNumber';

function QuotationServiceTableRow({
  service,
  isSelected,
  quantity,                 
  handleSelectRow,
  handleChangueQuantity,
}) {
  
  const {
    id,
    unit,
    area,
    name,
    norma,
    base_price,
  } = service;
  
  const onChangeQuantity = useCallback((event) => {
    const { name, value } = event.target;
    handleChangueQuantity(id, parseInt(value));
  }, [handleChangueQuantity, id]);
  

  return (
    <TableRow hover>
      <TableCell padding="checkbox">
        <Checkbox size="small" color="primary" checked={isSelected} onClick={event => handleSelectRow({id, name, base_price, quantity}, event.target.checked)} />
      </TableCell>

      <TableCell padding="normal">
        {area}
      </TableCell>
      <TableCell padding="normal">
        {name}
      </TableCell>
      <TableCell padding="normal">
        {norma}
      </TableCell>
      <TableCell padding="normal">
        {unit}
      </TableCell>
      <TableCell padding="normal">
         <TextField label="Cantidad" type='number' disabled={!isSelected} name="quantity" variant="outlined" size="small" value={quantity} onChange={onChangeQuantity} />
      </TableCell>
      <TableCell padding="normal">
          <TextField label="Precio Unitario" disabled={true} value={formatThousands(base_price) } name="unit_price" variant="outlined" size="small" />
      </TableCell>
      <TableCell padding="normal">
        <TextField label="Total" name="total" disabled={true} value={formatThousands(base_price * quantity)} variant="outlined" size="small" />
      </TableCell>
    </TableRow>
  );
}

export default memo(QuotationServiceTableRow);