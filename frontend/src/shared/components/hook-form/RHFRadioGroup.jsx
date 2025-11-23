import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from '@mui/material';

export default function RHFRadioGroup({ name, label, options = [], row = false, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} {...other}>
          {label && <FormLabel>{label}</FormLabel>}

          <RadioGroup
            {...field}
            row={row}
            value={field.value ?? ''}
            onChange={(event) => field.onChange(event.target.value)}
          >
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>

          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}

RHFRadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  row: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.node.isRequired,
    })
  ),
};
