// MUI
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { Chip, IconButton } from '@mui/material';
import PageviewIcon from '@mui/icons-material/Pageview';
// ==============================================================

export default function QuotationRequestTableRow({ 
  quotationRequest , 
  handleView = () => { console.log("falta parametro función handleView") } 
}) {

  const {
    id,
    rut,
    received_at,
    updated_at,
    registered_by,
    reason_social,
    cotizacion_id,
    requester_email,
    requester_full_name,
    status,
    reviewed_by,
    reviewed_at,
    review_notes,
  } = quotationRequest;

  return (
    <TableRow hover>
      <TableCell padding="normal">
        <IconButton
          color="primary"
          size="small"
          onClick={() => handleView(quotationRequest)}>
          <PageviewIcon fontSize="small" />
        </IconButton>
      </TableCell>
      <TableCell padding="normal" >{id} </TableCell>
      <TableCell padding="normal" >{cotizacion_id ? cotizacion_id : ' Sin Cotización Asociada'} </TableCell>
      <TableCell padding="normal" >{rut ? rut : ' Sin Rut Asociado'} </TableCell>
      <TableCell padding="normal" >{reason_social ? reason_social : ' Sin Razón Social Asociada'} </TableCell>
      <TableCell padding="normal" >{'sin registrador'} </TableCell>
      <TableCell padding="normal" >{registered_by ? registered_by : ' Sin Nombre Registrador Asociado'} </TableCell>
      <TableCell padding="normal" >{requester_full_name ? requester_full_name : ' Sin Nombre Solicitante Asociado'} </TableCell>
      <TableCell padding="normal" >{status} </TableCell>
    </TableRow>
  );
}