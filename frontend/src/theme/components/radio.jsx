import { svgIconClasses } from '@mui/material/SvgIcon';
// CUSTOM ICON COMPONENTS
import RadioButtonIcon from '../../shared/icons/RadioButtonIcon';
import RadioButtonChecked from '../../shared/icons/RadioButtonChecked';

// ==============================================================

// ==============================================================

export const Radio = () => ({
  defaultProps: {
    icon: <RadioButtonIcon />,
    checkedIcon: <RadioButtonChecked />
  },
  styleOverrides: {
    root: {
      padding: 6
    }
  },
  variants: [{
    props: {
      size: 'large'
    },
    style: {
      [`.${svgIconClasses.root}`]: {
        fontSize: '1.75rem'
      }
    }
  }]
});