// MUI
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import PageviewIcon from '@mui/icons-material/Pageview';

import { fDateLogic } from '../../../../shared/utils/formatTime';
import { getStatusChipColorQuotation2 } from '../../../../shared/utils/chipColor';
import { useTokenVisualState } from '../../hooks/quotation/useTokenVisualState';

 
export default function QuotationTableRow({
  quotationRequest,
  handleView = () => { console.log("falta parametro función handleView") }
}) {
 const token = quotationRequest.quotation_token;
  const hasToken = !!token;

  const { status: tokenStatus, hoursLeft, color, Icon, blinkSx } =
    useTokenVisualState(hasToken ? token : null);

  const { id, status } = quotationRequest;
  const { received_at } = quotationRequest.request;
  const { company_rut, company_name } = quotationRequest?.request?.client || {};

  const getStatusChipColor = getStatusChipColorQuotation2;

  return (
    <TableRow hover>
      {/* NUEVA COLUMNA TOKEN */}
<TableCell padding="normal">
  {hasToken ? (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1.2,
        py: 0.6,
        borderRadius: 1,         // ⬅ redondeado
        border: '1px solid',
        borderColor: color,
        color: color,
        backgroundColor: `${color}22`, // ⬅ color suave (#RRGGBBAA → 22 = opacidad 13%)
        ...blinkSx,
      }}
    >
      <Icon fontSize="small" />
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {status === 'expired'
          ? 'Token expirado'
          : `${hoursLeft.toFixed(1)}h restantes`}
      </Typography>
    </Box>
  ) : (
    <Typography variant="body2" color="text.secondary">
       
    </Typography>
  )}
</TableCell>


      <TableCell padding="normal">
        <IconButton color="primary" onClick={() => handleView(quotationRequest)}>
          <PageviewIcon />
        </IconButton>
      </TableCell>

      <TableCell padding="normal">{quotationRequest?.request.id}</TableCell>
      <TableCell padding="normal">{id || ''}</TableCell>
      <TableCell padding="normal">
        <Chip
          sx={{ width: '100px' }}
          size="small"
          label={status}
          color={getStatusChipColor(status)}
        />
      </TableCell>
      <TableCell padding="normal">
        {company_rut || ' Sin Rut Asociado'}
      </TableCell>
      <TableCell padding="normal">
        {company_name || ' Sin Razón Social Asociada'}
      </TableCell>
      <TableCell padding="normal">
        {received_at ? fDateLogic(received_at) : ' Sin Nombre Registrador Asociado'}
      </TableCell>
    </TableRow>
  );
}
