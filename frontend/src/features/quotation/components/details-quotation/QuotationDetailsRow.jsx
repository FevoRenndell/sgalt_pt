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
import { BodyTableCell } from '../../../../shared/components/table';

function QuotationDetailsRow({ data }) {
  
  const {
    id,
    unit_price,
    quantity,
  } = data;

  const {
    unit,
    area,
    name,
    norma,
  } = data.service ?? {}
  

  return (
    <TableRow hover>
      <BodyTableCell padding="normal">
        {area}
      </BodyTableCell>
      <BodyTableCell padding="normal">
        {name}
      </BodyTableCell>
      <BodyTableCell padding="normal">
        {norma}
      </BodyTableCell>
      <BodyTableCell padding="normal">
        {unit}
      </BodyTableCell>
      <BodyTableCell padding="normal">
        {quantity}
      </BodyTableCell>
      <BodyTableCell padding="normal">
        {formatThousands(unit_price)}
      </BodyTableCell>
      <BodyTableCell padding="normal">
        {formatThousands((parseInt(unit_price) * quantity))}
      </BodyTableCell>
    </TableRow>
  );
}

export default memo(QuotationDetailsRow);