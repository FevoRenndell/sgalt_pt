import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
// MUI
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
// MUI ICON COMPONENTS
import Edit from '@mui/icons-material/Edit';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
// CUSTOM COMPONENTS
import { TableMoreMenuItem, TableMoreMenu } from '../../../../shared/components/table';
import { fDateLogic } from '../../../../shared/utils/formatTime';
// DATA TYPES
import { paths } from '../../../../routes/paths';
import { Chip } from '@mui/material';
import { useConfirmDialog } from '../../../../contexts/ConfirmDialogContext';

// ==============================================================

// ==============================================================

export default function QuotationRequestTableRow({
  quotationRequest,
  handleDeleteQuotationRequest
}) {

  const confirm = useConfirmDialog();

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

  const navigate = useNavigate();
  const [openMenuEl, setOpenMenuEl] = useState(null);

  const handleOpenMenu = useCallback(event => {
    setOpenMenuEl(event.currentTarget);
  }, []);

  const handleCloseOpenMenu = useCallback(() => {
    setOpenMenuEl(null);
  }, []);

  const handleEdit = useCallback(() => {
    handleCloseOpenMenu();
    navigate(paths.quotationRequest_edit(id));
  }, [navigate, handleCloseOpenMenu]);

  const handleDelete = useCallback(async () => {
    
    handleCloseOpenMenu();

    const ok = await confirm({
      title: 'Confirmar eliminación',
      description: `¿Estás seguro de que deseas eliminar al usuario ${first_name} ${last_name_1}? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
    });

    if (!ok) {
      return;
    }

    handleDeleteQuotationRequest(quotationRequest.id);
  }, [handleCloseOpenMenu, handleDeleteQuotationRequest, quotationRequest.id]);


  return (
    <TableRow hover>
      <TableCell padding="normal">
        <TableMoreMenu open={openMenuEl} handleOpen={handleOpenMenu} handleClose={handleCloseOpenMenu}>
          <TableMoreMenuItem Icon={Edit} title="Edit" handleClick={handleEdit} />
          <TableMoreMenuItem Icon={DeleteOutline} title="Delete" handleClick={handleDelete} />
        </TableMoreMenu>
      </TableCell>
      <TableCell padding="normal" >{id} </TableCell>
      <TableCell padding="normal" >{ cotizacion_id ? cotizacion_id : ' Sin Cotización Asociada'} </TableCell>
      <TableCell padding="normal" >{ rut ? rut : ' Sin Rut Asociado'} </TableCell>
      <TableCell padding="normal" >{ reason_social ? reason_social : ' Sin Razón Social Asociada'} </TableCell>
      <TableCell padding="normal" >{ 'sin registrador'} </TableCell>
      <TableCell padding="normal" >{registered_by ? registered_by : ' Sin Nombre Registrador Asociado'} </TableCell>
      <TableCell padding="normal" >{requester_full_name ? requester_full_name : ' Sin Nombre Solicitante Asociado'} </TableCell>
      <TableCell padding="normal" >{status} </TableCell>
    </TableRow>
  );
}