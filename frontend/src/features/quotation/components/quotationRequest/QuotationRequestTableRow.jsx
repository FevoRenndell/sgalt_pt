// MUI
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { Chip, IconButton } from '@mui/material';
import PageviewIcon from '@mui/icons-material/Pageview';
import { getStatusChipColorRequestQuotation } from '../../../../shared/utils/chipColor';
import { fDateLogic } from '../../../../shared/utils/formatTime';
// ==============================================================

export default function QuotationRequestTableRow({
  quotationRequest,
  handleView = () => { console.log("falta parametro función handleView") }
}) {
  const {
    id,
    received_at,
    cotizacion_id,
    status,
  } = quotationRequest;

  const {
    company_rut,
    company_name,
  } = quotationRequest?.client || {};

  const getStatusChipColor =  getStatusChipColorRequestQuotation;

  return (
    <TableRow hover>
      <TableCell padding="normal">
        <IconButton
          color="primary"
          onClick={() => handleView(quotationRequest)}>
          <PageviewIcon fontSize="medium" />
        </IconButton>
      </TableCell>
      <TableCell padding="normal" >{id} </TableCell>
      <TableCell padding="normal" >{cotizacion_id ? cotizacion_id : ''} </TableCell>
      <TableCell padding="normal" ><Chip sx={{ width : '100px'}} size="small" label={status} color={getStatusChipColor(status)} /> </TableCell>
      <TableCell padding="normal" >{company_rut ? company_rut : ' Sin Rut Asociado'} </TableCell>
      <TableCell padding="normal" >{company_name ? company_name : ' Sin Razón Social Asociada'} </TableCell>
      <TableCell padding="normal" >{received_at ? fDateLogic(received_at) : ' Sin Nombre Registrador Asociado'} </TableCell>
    </TableRow>
  );
}