import {
  Container,
  Card,
  Box,
  Typography,
  Button,
} from '@mui/material';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { fDateTime } from '../../../../shared/utils/formatTime';
import { Scrollbar } from '../../../../shared/components/scrollbar';
import { StyleBoxSuccess } from '../../../../shared/components/style-box';

export default function QuotationAcceptSuccess({ quotation, onContinue }) {
  const q = quotation?.quotation || {};
  const client = quotation?.client || {};
  const request = quotation?.request || {};

  return (
    <Container sx={{ py: 4 }}>
      <Card className="p-3" sx={{ maxWidth: 600, margin: '0 auto' }}>
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
              minHeight: 380,
            }}
          >
            {/* Ícono */}
            <CheckCircleOutlineIcon
              sx={{
                fontSize: 80,
                color: 'success.main',
              }}
            />

            {/* Título */}
            <Typography variant="h5" fontWeight={700} color="success.main">
              ¡Cotización aceptada con éxito!
            </Typography>

            {/* Mensaje secundario */}
            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 400 }}>
              Hemos registrado su aceptación. Nuestro equipo se pondrá en contacto con usted para coordinar los próximos pasos.
            </Typography>

            {/* Detalles */}
            <Box sx={{ mt: 2 }}>
              {q.quote_number && (
                <Typography variant="body2">
                  <strong># Cotización:</strong> {q.quote_number}
                </Typography>
              )}

              {client.company_name && (
                <Typography variant="body2">
                  <strong>Razón Social:</strong> {client.company_name}
                </Typography>
              )}

              {q.created_at && (
                <Typography variant="body2">
                  <strong>Fecha creación:</strong> {fDateTime(q.created_at)}
                </Typography>
              )}
            </Box>

            {/* Botón */}
            <Button
              variant="outlined"
              color="success"
              size="medium"
              sx={{ mt: 3 }}
              onClick={onContinue}
            >
              Continuar
            </Button>
          </StyleBoxSuccess>
        </Scrollbar>
      </Card>
    </Container>
  );
}
