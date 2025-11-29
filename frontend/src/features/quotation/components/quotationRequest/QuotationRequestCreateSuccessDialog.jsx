import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Container,
  Typography,
  Card,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { fDateTime } from '../../../../shared/utils/formatTime';
import { Scrollbar } from '../../../../shared/components/scrollbar';
import { StyleBoxSuccess } from '../../../../shared/components/style-box';

export default function QuotationRequestCreateSuccessDialog({ state, onClose, clean }) {
  const { data } = state || {};

  const folio = data?.id || data?.folio || '-';
  const companyName = data?.company_name || data?.razon_social || '';
  const createdAt = data?.created_at || data?.createdAt;


  const handleClose = () => {    if (onClose) {
      onClose();
    }
    if (clean) {
      clean();
    }
  };

  return (
    <Container>
      <Dialog open={state.isOpen}  maxWidth="sm" fullWidth>
        <DialogContent dividers>
          <div className="pt-2 pb-4">
            <Card className="p-3">
              <Scrollbar autoHide={false}>
                <StyleBoxSuccess
                  sx={{
                    py: 4,
                    px: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    gap: 2,
                  }}
                >
                  {/* Ícono grande */}
                  <CheckCircleOutlineIcon
                    sx={{
                      fontSize: 72,
                      color: 'success.main',
                    }}
                  />

                  {/* Mensaje principal */}
                  <Typography variant="h5" fontWeight={700} color="success.main">
                    ¡Solicitud de cotización enviada con éxito!
                  </Typography>

                  {/* Mensaje secundario */}
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
Hemos registrado su solicitud y en un plazo máximo de 48 horas hábiles, tendrá la cotización solicitada.
                  </Typography>

                  {/* Detalles */}
                  <Box sx={{ mt: 2 }}>
                    {folio && (
                      <Typography variant="body2">
                        <strong># Solicitud de Cotización:</strong> {folio}
                      </Typography>
                    )}

                    {companyName && (
                      <Typography variant="body2">
                        <strong>Razón social:</strong> {companyName}
                      </Typography>
                    )}

                    {createdAt && (
                      <Typography variant="body2">
                        <strong>Fecha creación:</strong> {fDateTime(createdAt)}
                      </Typography>
                    )}
                  </Box>

                  {/* Botón debajo del texto */}
                  <Button
                    variant="outlined"
                    color="success"
                    size="medium"
                    sx={{ mt: 3 }}
                    onClick={handleClose}
                    
                  >
                    Aceptar
                  </Button>
                </StyleBoxSuccess>
              </Scrollbar>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
