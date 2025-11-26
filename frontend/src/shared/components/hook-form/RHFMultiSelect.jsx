import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';

export default function RHFMultiSelect({
  name,
  label,
  options = [],
  optionLabelKey = 'name',
  optionValueKey = 'id',
  helperText,
  ...other
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => {
        // value = id (ej: 3)
        const selectedOption =
          options.find((opt) => opt?.[optionValueKey] === value) ?? null;

        return (
          <Autocomplete
            {...other}             // 👈 solo tus props externos
            size="small"
            options={options}
            value={selectedOption}  // objeto o null
            onChange={(_, newValue) =>
              onChange(newValue ? newValue[optionValueKey] : null)
            }
            onBlur={onBlur}
            getOptionLabel={(option) => option?.[optionLabelKey] ?? ''}
            isOptionEqualToValue={(option, val) =>
              option?.[optionValueKey] === val?.[optionValueKey]
            }
            renderInput={(params) => (
              <TextField
                {...params}
                inputRef={ref}
                label={label}
                error={!!error}
                helperText={error?.message || helperText}
              />
            )}
          />
        );
      }}
    />
  );
}

RHFMultiSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.array,
  optionLabelKey: PropTypes.string,
  optionValueKey: PropTypes.string,
  helperText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};
