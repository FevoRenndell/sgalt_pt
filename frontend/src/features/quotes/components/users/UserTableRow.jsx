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

export default function UserTableRow({
  user,
  handleDeleteUser
}) {

  const confirm = useConfirmDialog();

  const {
    id,
    first_name,
    last_name_1,
    last_name_2,
    email,
    role,
    is_active,
    created_at,
    updated_at
  } = user;

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
    navigate(paths.user_edit(id));
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

    handleDeleteUser(user.id);
  }, [handleCloseOpenMenu, handleDeleteUser, user.id]);


  return (
    <TableRow hover>
      <TableCell padding="normal">
        <TableMoreMenu open={openMenuEl} handleOpen={handleOpenMenu} handleClose={handleCloseOpenMenu}>
          <TableMoreMenuItem Icon={Edit} title="Edit" handleClick={handleEdit} />
          <TableMoreMenuItem Icon={DeleteOutline} title="Delete" handleClick={handleDelete} />
        </TableMoreMenu>
      </TableCell>
      <TableCell padding="normal" >{id} </TableCell>
      <TableCell padding="normal" >{`${first_name} ${last_name_1} ${last_name_2}`}</TableCell>
      <TableCell padding="normal" >{email}</TableCell>
      <TableCell padding="normal" >{role?.name}</TableCell>
      <TableCell padding="normal">
        <Chip size="small" label={is_active ? 'Active' : 'Inactive'} color={is_active ? 'success' : 'error'} />
      </TableCell>
      <TableCell padding="normal" >{fDateLogic(created_at)}</TableCell>
      <TableCell padding="normal" >{fDateLogic(updated_at)}</TableCell>

    </TableRow>
  );
}