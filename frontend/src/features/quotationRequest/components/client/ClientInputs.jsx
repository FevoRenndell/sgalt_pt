import { Grid } from "@mui/material";
import { RHFTextField } from "../../../../shared/components/hook-form/index.jsx";

export default function ClientInputs( { blocked = false } ) {


    return (
        <>
            {/* Datos de la empresa */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Nombre empresa */}
                <Grid size={{ sm: 12, xs: 12 }}>
                    <RHFTextField
                        name="company_name"
                        label="Razón Social"
                        fullWidth
                        sizeParam="small"
                        disabled={blocked}
                    />
                </Grid>
            </Grid>

            {/* Datos de contacto */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Nombre contacto */}
                <Grid size={{ sm: 4, xs: 12 }}>
                    <RHFTextField
                        name="contact_name"
                        label="Nombre contacto ( opcional )"
                        fullWidth
                        sizeParam="small"
                        disabled={blocked}
                    />
                </Grid>

                {/* Correo contacto */}
                <Grid size={{ sm: 4, xs: 12 }}>
                    <RHFTextField
                        name="contact_email"
                        label="Correo contacto ( opcional )"
                        type="email"
                        fullWidth
                        sizeParam="small"
                        disabled={blocked}
                    />
                </Grid>

                {/* Teléfono contacto */}
                <Grid size={{ sm: 4, xs: 12 }}>
                    <RHFTextField
                        name="contact_phone"
                        label="Teléfono contacto ( opcional )"
                        fullWidth
                        sizeParam="small"
                        disabled={blocked}
                    />
                </Grid>
            </Grid>


          
     </>

    );
}