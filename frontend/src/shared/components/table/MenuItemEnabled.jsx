import { PropTypes } from 'prop-types';

import { MenuItem } from '@mui/material';

import Iconify from '../iconify/iconify';

const MenuEnabled = ({ onDeleteRow, onEditRow, handleCloseMenu }) => (
  <>
    <MenuItem
      onClick={() => {
        onDeleteRow();
        handleCloseMenu();
      }}
      sx={{ color: 'error.main' }}
    >
      <Iconify icon='carbon:error-filled' />
      Desactivar
    </MenuItem>

    <MenuItem
      onClick={() => {
        onEditRow();
        handleCloseMenu();
      }}
    >
      <Iconify icon='eva:edit-fill'/>
      Editar
    </MenuItem>
  </>
);

MenuEnabled.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  handleCloseMenu: PropTypes.func,
};

export default MenuEnabled;
