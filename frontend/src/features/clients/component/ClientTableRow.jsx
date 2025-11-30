// src/features/clients/components/clients/ClientTableRow.jsx
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// MUI
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Edit from '@mui/icons-material/Edit';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
 
 
 
import { TableMoreMenu, TableMoreMenuItem } from '../../../shared/components/table';
import { fDateLogic } from '../../../shared/utils/formatTime';
import { paths } from '../../../routes/paths';
import { useConfirmDialog } from '../../../contexts/ConfirmDialogContext';

export default function ClientTableRow({ client, handleDeleteClient }) {
  const confirm = useConfirmDialog();

  const {
    id,
    company_rut,
    company_name,
    contact_name,
    contact_email,
    contact_phone,
    created_at,
    updated_at,
  } = client;

  const navigate = useNavigate();
  const [openMenuEl, setOpenMenuEl] = useState(null);

  const handleOpenMenu = useCallback((event) => {
    setOpenMenuEl(event.currentTarget);
  }, []);

  const handleCloseOpenMenu = useCallback(() => {
    setOpenMenuEl(null);
  }, []);

  const handleEdit = useCallback(() => {
    handleCloseOpenMenu();
    navigate(paths.client_edit(id));
  }, [navigate, handleCloseOpenMenu, id]);

  const handleDelete = useCallback(async () => {
    handleCloseOpenMenu();

    const ok = await confirm({
      title: 'Confirmar eliminación',
      description: `¿Estás seguro de que deseas eliminar al cliente ${company_name}? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
    });

    if (!ok) return;

    handleDeleteClient(id);
  }, [handleCloseOpenMenu, handleDeleteClient, id, company_name, confirm]);

  return (
    <TableRow hover>
      <TableCell padding="normal">
        <TableMoreMenu
          open={openMenuEl}
          handleOpen={handleOpenMenu}
          handleClose={handleCloseOpenMenu}
        >
          <TableMoreMenuItem Icon={Edit} title="Editar" handleClick={handleEdit} />
          <TableMoreMenuItem Icon={DeleteOutline} title="Eliminar" handleClick={handleDelete} />
        </TableMoreMenu>
      </TableCell>

      <TableCell padding="normal">{id}</TableCell>
      <TableCell padding="normal">{company_rut}</TableCell>
      <TableCell padding="normal">{company_name}</TableCell>
      <TableCell padding="normal">{contact_name}</TableCell>
      <TableCell padding="normal">{contact_email}</TableCell>
      <TableCell padding="normal">{contact_phone}</TableCell>
      <TableCell padding="normal">{fDateLogic(created_at)}</TableCell>
      <TableCell padding="normal">{fDateLogic(updated_at)}</TableCell>
    </TableRow>
  );
}
