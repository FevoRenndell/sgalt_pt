import { MenuItem } from '@mui/material';

import { PropTypes } from 'prop-types';

import Iconify from '../iconify/iconify';

const MenuDisabled = ({ onEnabledRow, handleCloseMenu }) => (

    <MenuItem
      onClick={() => {
        onEnabledRow();
        handleCloseMenu();
      }}
      sx={{ color: 'success.main' }}
    >
      <Iconify icon='bi:clipboard2-plus' /> Activar
    </MenuItem>

);

MenuDisabled.propTypes = {
  onEnabledRow : PropTypes.func,
  handleCloseMenu : PropTypes.func,
}

export default MenuDisabled;
