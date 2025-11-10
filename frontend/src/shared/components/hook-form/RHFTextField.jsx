import { Controller, useFormContext } from "react-hook-form";
import TextField from "@mui/material/TextField";

export default function RHFTextField({ handlefilterService = null, name, helperText, type = "text", sizeParam ='', disabled, InputProps = {},...other }) {

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={type === "number" ? '' : ""} // 🔹 Evita `undefined`
      render={({ field, fieldState: { error } }) => (
        <TextField
          color="primary"
          {...field}
          fullWidth
          type={type}
          value={field.value || ''} // 🔹 Manejo correcto de valores iniciales
          onChange={(event) => {
            let newValue = event.target.value.length > 100
            ? event.target.value.slice(0,100)
            : event.target.value;
            field.onChange(newValue);
          }}
          disabled={disabled}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
          size={sizeParam.length > 0 ? sizeParam : "small"}
          InputProps={{
            ...InputProps,
            inputProps : {maxLength : 100}
          }}
        />
      )}
    />
  );
}

