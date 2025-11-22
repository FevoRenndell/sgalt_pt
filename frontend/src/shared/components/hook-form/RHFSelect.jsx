import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, Autocomplete } from '@mui/material';

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

export default function RHFSelect({ name, label, helperText, options = [], sx, ...other }) {

  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete

          size='small'
          {...field}
          options={options}
          getOptionLabel={(option) => option?.name || ''}
          noOptionsText="No Existe"
          isOptionEqualToValue={(option, selectedValue) => {
            if (option) {
              return !!selectedValue && option?.id === selectedValue?.id;
            }
          }}
          onChange={(_, newValue) => {
            field.onChange(newValue)
            setValue(name, newValue || null)}}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={!!error}
              helperText={error ? error?.message : helperText}
            />
          )}

        />
      )}
    />
  );
}