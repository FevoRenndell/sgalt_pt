import { checkboxClasses } from '@mui/material/Checkbox';
// CUSTOM ICON COMPONENTS
import CheckBoxIcon from '../../shared/icons/CheckBoxIcon';
import BlankCheckBoxIcon from '../../shared/icons/BlankCheckBoxIcon';
import CheckboxIndeterminateIcon from '../../shared/icons/CheckboxIndeterminateIcon';
export const Checkbox = theme => ({
  defaultProps: {
    icon: <BlankCheckBoxIcon />,
    checkedIcon: <CheckBoxIcon />,
    indeterminateIcon: <CheckboxIndeterminateIcon />
  },
  styleOverrides: {
    colorSecondary: {
      [`&.${checkboxClasses.checked}`]: {
        color: theme.palette.grey[700]
      }
    }
  }
});