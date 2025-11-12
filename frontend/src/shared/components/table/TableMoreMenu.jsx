import PropTypes from 'prop-types';
// @mui
import { IconButton } from '@mui/material';
//

import Iconify from 'src/components/iconify/iconify';

import MenuPopover from '../MenuPopover';

// ----------------------------------------------------------------------

TableMoreMenu.propTypes = {
  actions: PropTypes.node,
  open: PropTypes.object,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  widthMenu: PropTypes.number,
};

export default function TableMoreMenu({ actions, open, onClose, onOpen, widthMenu = 160 }) {
  return (
    <>
      <IconButton onClick={onOpen}>
        <Iconify icon='eva:more-vertical-fill' width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={onClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -1,
          width: `${widthMenu}px`,
          '& .MuiMenuItem-root': {
            px: 1,
            typography: 'body2',
            borderRadius: 0.75,
            '& svg': { mr: 2, width: 20, height: 20 },
          },
        }}
      >
        {actions}
      </MenuPopover>
    </>
  );
}
