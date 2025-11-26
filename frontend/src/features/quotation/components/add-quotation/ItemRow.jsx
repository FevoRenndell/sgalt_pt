import { memo } from 'react';
import IconButton from '@mui/material/IconButton';
import { Delete } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { RHFMultiSelect,  RHFTextField } from '../../../../shared/components/hook-form';

const ItemRow = memo(function ItemRow({ index, onRemove, filter }) {

    return (
        <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid size={{ sm: 1, xs: 12 }}>
                <IconButton onClick={onRemove} color="error">
                    <Delete />
                </IconButton>
            </Grid>

            <Grid size={{ sm: 4, xs: 12 }}>
                <RHFMultiSelect
                    name={`items.${index}.service_id`}
                    label="Servicio"
                    options={filter?.services || []}
                />
            </Grid>

            {/* Cantidad */}
            <Grid size={{ sm: 2, xs: 12 }}>
                <RHFTextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Cantidad"
                    name={`items.${index}.quantity`}
                />
            </Grid>

            {/* Valor Unitario */}
            <Grid size={{ sm: 2, xs: 12 }}>
                <RHFTextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Valor Unitario"
                    name={`items.${index}.unit_price`}
                />
            </Grid>

            {/* Total */}
            <Grid size={{ sm: 2, xs: 12 }}>
                <RHFTextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Total"
                    name={`items.${index}.total`}
                />
            </Grid>
        </Grid>

    );
});

export default ItemRow;
