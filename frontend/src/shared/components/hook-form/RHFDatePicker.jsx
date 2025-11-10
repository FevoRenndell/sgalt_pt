import { Controller, useFormContext } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
 

export default function RHFDatePicker({
  name,
  helperText,
  disabled,
  sizeParam = "",
  InputProps = {},
  valueType = "string",
  stringFormat = "YYYY-MM-DD",
  minDate,
  maxDate,
  ...other
}) {
  const { control } = useFormContext();

  const toDayjs = (val) => {
    if (!val) return null;
    if (dayjs.isDayjs(val)) return val;
    return dayjs(val);
  };

  const fromDayjs = (djs) => {
    if (!djs || !djs.isValid()) return null;
    switch (valueType) {
      case "dayjs":
        return djs;
      case "date":
        return djs.toDate();
      case "string":
      default:
        return djs.format(stringFormat);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        defaultValue={null}
        render={({ field, fieldState: { error } }) => {
          const currentValue = toDayjs(field.value);

          return (
            <DatePicker
              value={currentValue}
              onChange={(newVal) => field.onChange(fromDayjs(newVal))}
              disabled={disabled}
              minDate={minDate ? toDayjs(minDate) : undefined}
              maxDate={maxDate ? toDayjs(maxDate) : undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!error,
                  helperText: error ? error.message : helperText,
                  size: sizeParam.length > 0 ? sizeParam : "small",
                  InputProps: {
                    ...InputProps,
                  },
                },
              }}
              // Puedes ajustar el formato que se muestra en la UI
              format="DD/MM/YYYY"
              {...other}
            />
          );
        }}
      />
    </LocalizationProvider>
  );
}
