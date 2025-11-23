import { Controller, useFormContext } from "react-hook-form";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

export default function RHFTextField({
  handlefilterService = null,
  name,
  helperText,
  type = "text",
  sizeParam = '',
  disabled,
  InputProps = {},
  search_rut = false,   
  ...other
}) {

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={type === "number" ? '' : ""}
      render={({ field, fieldState: { error } }) => (
        <TextField
          color="primary"
          {...field}
          fullWidth
          type={type}
          value={field.value || ""}
          onChange={(event) => {
            let newValue =
              event.target.value.length > 100
                ? event.target.value.slice(0, 100)
                : event.target.value;

            field.onChange(newValue);
          }}
          disabled={disabled}
          error={!!error}
          helperText={error ? error?.message : helperText}
          size={sizeParam}
          {...other}
          InputProps={{
            ...InputProps,
            endAdornment: search_rut ? (
              <InputAdornment position="end">
                <SearchIcon sx={{ cursor: "pointer", opacity: 0.8 }} />
              </InputAdornment>
            ) : null
          }}
        />
      )}
    />
  );
}
