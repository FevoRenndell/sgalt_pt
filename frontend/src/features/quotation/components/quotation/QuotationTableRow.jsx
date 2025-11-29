// MUI
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { Chip, IconButton } from '@mui/material';
import PageviewIcon from '@mui/icons-material/Pageview';
import { fDateLogic } from '../../../../shared/utils/formatTime';
import { getStatusChipColorQuotation2 } from '../../../../shared/utils/chipColor';
// ==============================================================
 

export default function QuotationTableRow({
  quotationRequest,
  handleView = () => { console.log("falta parametro función handleView") }
}) {
  console.log(quotationRequest)
  const {
    id,
    status,
  } = quotationRequest;

  const {
    received_at
  } = quotationRequest.request;

  const {
    company_rut,
    company_name,
  } = quotationRequest?.request?.client || {};


  const getStatusChipColor =  getStatusChipColorQuotation2;

  return (
    <TableRow hover>
      <TableCell padding="normal">
        <IconButton
          color="primary"
          onClick={() => handleView(quotationRequest)}>
          <PageviewIcon />
        </IconButton>
      </TableCell>
      <TableCell padding="normal" >{quotationRequest?.request.id} </TableCell>
      <TableCell padding="normal" >{id ? id : ''} </TableCell>
      <TableCell padding="normal" ><Chip sx={{ width : '100px'}} size="small" label={status} color={getStatusChipColor(status)} /> </TableCell>
      <TableCell padding="normal" >{company_rut ? company_rut : ' Sin Rut Asociado'} </TableCell>
      <TableCell padding="normal" >{company_name ? company_name : ' Sin Razón Social Asociada'} </TableCell>
      <TableCell padding="normal" >{received_at ? fDateLogic(received_at) : ' Sin Nombre Registrador Asociado'} </TableCell>

    </TableRow>
  );
}