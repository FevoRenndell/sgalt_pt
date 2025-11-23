import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CardHeader, Box } from "@mui/material";
import { Card, Chip, Grid, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { fDateTime } from "../../../../shared/utils/formatTime";
import { useConfirmDialog } from "../../../../contexts/ConfirmDialogContext";

export const StyledBox = styled('div')(({ theme }) => ({
  padding: 24,
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  backdropFilter: 'blur(4px)',
  border: `1px solid ${theme.palette.divider}`,
}));
;


export default function QuotationRequestDetailDialog({ state: { isOpen = false, client = {} }, onClose }) {

  const confirm = useConfirmDialog()

  const {
    id,
    status,
    updated_at,
    received_at,
    reviewed_by,
    reviewed_at,
    review_notes,
    registered_by,
    reason_social,
    cotizacion_id,
    requester_email,
    requester_full_name,
    requester_phone,
    service_description,
    obra_direccion,
  } = client || {};

  const {
    company_rut,
    company_name,
    contact_name,
    contact_email,
    contact_phone,
  } = client?.client || {};

  const razonSocial = reason_social || company_name || "—";
  const rutCliente = company_rut || "—";
  const contactoNombre = contact_name || requester_full_name || "—";
  const contactoCorreo = contact_email || requester_email || "—";
  const contactoTelefono = requester_phone || contact_phone || "—";

  function ListItem({
    text,
    description
  }) {
    return <Typography variant="body2" sx={{
      color: 'text.secondary',
      span: {
        fontWeight: 500,
        color: 'text.primary'
      }
    }}>
      {text} <br />
      <span>{description}</span>
    </Typography>;
  }

  const onReviewSave = async () => {

    const ok = await confirm({
      title: 'Confirmar Revisión',
      description: `¿Estás seguro de que deseas guardar la revisión? Esta acción no se puede deshacer.`,
      confirmText: 'Guardar',
      cancelText: 'Cancelar',
    });

    if (!ok) {
      return;
    }
    
    // guardar revisión


  }

  return (
    <Dialog open={isOpen} maxWidth="md" fullWidth>
      <DialogContent dividers>
        <div className="pt-2 pb-4">
          <Card className="p-3">
            <CardHeader action={

              <Box sx={{ gap: 1, display: 'flex' }}>
                <Button variant="outlined" color='primary' size="small" onClick={onClose}>Cerrar</Button>
                <Button variant="outlined" color='success' size="small" onClick={() => onReviewSave()}>
                  Guardar Revisión
                </Button>

              </Box>

            } />
             <StyledBox>
              <Grid container spacing={4}>
                {/* Columna Izquierda: Solicitud */}
                <Grid size={{ md: 6, xs: 12 }}>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Información de la Solicitud
                  </Typography>

                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid size={{ sm: 6, xs: 12 }}>
                      <ListItem text="ID:" description={id ?? "—"} />
                    </Grid>

                    <Grid size={{ sm: 6, xs: 12 }}>
                      <ListItem
                        text="Estado:"
                        description={status ?? "—"}
                      />
                    </Grid>

                    <Grid size={{ sm: 6, xs: 12 }}>
                      <ListItem
                        text="Solicitado el:"
                        description={received_at ? fDateTime(received_at) : "—"}
                      />
                    </Grid>

                    <Grid size={{ sm: 6, xs: 12 }}>
                      <ListItem
                        text="Actualizado el:"
                        description={updated_at ? fDateTime(updated_at) : "—"}
                      />
                    </Grid>

                    <Grid size={{ sm: 6, xs: 12 }}>
                      <ListItem text="Razón social:" description={razonSocial} />
                    </Grid>

                    <Grid size={{ sm: 6, xs: 12 }}>
                      <ListItem
                        text="Dirección obra:"
                        description={obra_direccion || "—"}
                      />
                    </Grid>

                    <Grid size={{ sm: 6, xs: 12 }}>
                      <ListItem
                        text="Registrado por:"
                        description={registered_by ?? "—"}
                      />
                    </Grid>

                    <Grid size={{ sm: 6, xs: 12 }}>
                      <ListItem
                        text="ID Cotización:"
                        description={cotizacion_id ?? "—"}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Columna Derecha: Cliente / Contacto / Revisión */}
                <Grid size={{ md: 6, xs: 12 }}>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Información del Cliente / Contacto
                  </Typography>

                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid size={{ sm: 6, xs: 12 }}>
                      <ListItem text="RUT cliente:" description={rutCliente} />
                    </Grid>

                    <Grid size={{ sm: 6, xs: 12 }}>
                      <ListItem
                        text="Contacto:"
                        description={contactoNombre}
                      />
                    </Grid>

                    <Grid size={{ sm: 6, xs: 12 }}>
                      <ListItem
                        text="Correo contacto:"
                        description={contactoCorreo}
                      />
                    </Grid>

                    <Grid size={{ sm: 6, xs: 12 }}>
                      <ListItem
                        text="Fono / Móvil:"
                        description={contactoTelefono}
                      />
                    </Grid>

                    <Grid size={{ sm: 6, xs: 12 }}>
                      <ListItem
                        text="Revisado por:"
                        description={reviewed_by ?? "—"}
                      />
                    </Grid>

                    <Grid size={{ sm: 6, xs: 12 }}>
                      <ListItem
                        text="Revisado el:"
                        description={reviewed_at ? fDateTime(reviewed_at) : "—"}
                      />
                    </Grid>

                    <Grid size={{ sm: 12, xs: 12 }}>
                      <ListItem
                        text="Notas de revisión:"
                        description={review_notes ?? "—"}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </StyledBox>


            <StyledBox sx={{ mt: 1 }}>
              <Grid container spacing={4}>
                {/* Columna Derecha */}
                <Grid size={{ md: 6, xs: 12 }}>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Servicio:
                  </Typography>

                  <Grid container spacing={3} sx={{ mt: 2 }}>

                    <Grid size={{ sm: 6, xs: 12 }}>
                      <ListItem   description={service_description ?? "—"} />
                    </Grid>

                  </Grid>
                </Grid>


              </Grid>

            </StyledBox>
          </Card>
        </div>
      </DialogContent>


    </Dialog>
  );
}
