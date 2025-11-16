// CUSTOM ICON COMPONENTS
import Star from '../../shared/icons/Star';
import StarOutlined from '../../shared/icons/StarOutlined';

// ==============================================================

// ==============================================================

export const Rating = theme => ({
  styleOverrides: {
    root: {
      color: theme.palette.warning.main
    },
    iconEmpty: {
      color: theme.palette.grey[300]
    }
  },
  defaultProps: {
    icon: <Star fontSize="inherit" />,
    emptyIcon: <StarOutlined fontSize="inherit" />
  }
});