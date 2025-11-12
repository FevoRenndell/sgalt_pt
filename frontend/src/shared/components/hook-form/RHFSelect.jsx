import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, MenuItem } from '@mui/material';

RHFSelect.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
};

export default function RHFSelect({ name, label, options = [], ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          size="small"
          label={label}
          InputLabelProps={{ shrink: true }}
          error={!!error}
          helperText={error?.message}
          {...other}
        >
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
