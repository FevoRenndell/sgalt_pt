import PropTypes from 'prop-types';
import { TableRow, TableCell, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEdit: PropTypes.func,
};

export default function UserTableRow({ row, selected, onEdit }) {
  
  const {
    id,
    first_name,
    last_name_1,
    last_name_2,
    email,
    role_id,
    is_active,
    created_at,
    updated_at,
  } = row;

  const handleEdit = () => {
    if (onEdit) onEdit(row);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell align="left">
        <IconButton onClick={handleEdit}>
          <EditIcon />
        </IconButton>
      </TableCell>

      <TableCell align="left">{id}</TableCell>
      <TableCell align="left">{first_name}</TableCell>
      <TableCell align="left">{last_name_1}</TableCell>
      <TableCell align="left">{last_name_2 || '-'}</TableCell>
      <TableCell align="left">{email}</TableCell>
      <TableCell align="left">{role_id ?? '-'}</TableCell>

      <TableCell align="left">
        <Typography color={is_active ? 'success.main' : 'error.main'}>
          {is_active ? 'Activo' : 'Inactivo'}
        </Typography>
      </TableCell>

      <TableCell align="left">{created_at || '-'}</TableCell>
      <TableCell align="left">{updated_at || '-'}</TableCell>
    </TableRow>
  );
}
