import {
  Container,
  Card,
  Box,
  Typography,
  Button,
} from '@mui/material';

import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { fDateTime } from '../../../../shared/utils/formatTime';
import { Scrollbar } from '../../../../shared/components/scrollbar';
import { StyleBoxError } from '../../../../shared/components/style-box'; // si no existe, uso StyleBoxSuccess con color rojo

// Si NO tienes StyleBoxError, crea fallback:
const ErrorBox = StyleBoxError || StyleBoxSuccess;

export default function QuotationErrorView({ quotation, message = "La cotización ha sido rechazada, por tanto cerrada.", onContinue }) {
  const q = quotation?.quotation || {};
  const client = quotation?.client || {};
  const request = quotation?.request || {};

  return (
    <Container sx={{ py: 4 }}>
      <Card className="p-3" sx={{ maxWidth: 600, margin: '0 auto' }}>
        <Scrollbar autoHide={false}>
          <ErrorBox
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
              borderColor: 'error.main',
            }}
          >
            {/* Ícono grande rojo */}
            <CancelOutlinedIcon
              sx={{
                fontSize: 80,
                color: 'error.main',
              }}
            />

            {/* Título */}
            <Typography variant="h5" fontWeight={700} color="error.main">
              La cotización ha sido rechazada.
            </Typography>

            {/* Mensaje dinámico */}
            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 400 }}>
              {message}
            </Typography>

            {/* Si existe información, la mostramos */}
            {(q.quote_number || client.company_name || q.created_at) && (
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
            )}

            {/* Botón de volver o continuar */}
            <Button
              variant="outlined"
              color="error"
              size="medium"
              sx={{ mt: 3 }}
              onClick={onContinue}
            >
              Volver
            </Button>
          </ErrorBox>
        </Scrollbar>
      </Card>
    </Container>
  );
}
