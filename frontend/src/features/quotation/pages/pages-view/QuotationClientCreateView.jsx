import { useEffect, useState } from 'react';
import {
  Container,
  Card,
  Box,
  Grid,
  Typography,
  Button,
  Chip,
} from '@mui/material';

import { useParams, useSearchParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import GradingIcon from '@mui/icons-material/Grading';

import { Scrollbar } from '../../../../shared/components/scrollbar';
import { StyledBox } from '../../../../shared/components/style-box';
import HeadingArea from '../../../../shared/components/heading-area/HeadingArea';
import { fDateTime } from '../../../../shared/utils/formatTime';
import { handleApiError } from '../../../../shared/utils/handleApiError';
import { useConfirmDialog } from '../../../../contexts/ConfirmDialogContext';
import { getStatusChipColorRequestQuotation } from '../../../../shared/utils/chipColor';

import {
  useGetPublicQuotationByIdQuery,
  useAcceptQuotationMutation,
  useRejectQuotationMutation,
} from '../../api/quotationRequestClientApi';

import QuotationDetailsList from '../../components/details-quotation/QuotationDetailsList';
import QuotationSummary from '../../components/totalize-quotation/QuotationSummary';
import QuotationAcceptSuccess from '../../components/quotationRequest/QuotationAcceptSuccess';
import QuotationErrorView from '../../components/quotationRequest/QuotationErrorView';

function ListItem({ text, description }) {
  return (
    <Typography
      variant="body2"
      sx={{
        color: 'text.secondary',
        span: {
          fontWeight: 500,
          color: 'text.primary',
        },
      }}
    >
      {text} <br />
      <span>{description}</span>
    </Typography>
  );
}

export default function QuotationClientCreateView() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const confirm = useConfirmDialog();
  const getStatusChipColor = getStatusChipColorRequestQuotation;

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetPublicQuotationByIdQuery({ id, token });

  const [acceptQuotation] = useAcceptQuotationMutation();
  const [rejectQuotation] = useRejectQuotationMutation();

  const [quotation, setQuotation] = useState({
    request: {},
    quotation: {},
    items: [],
    client: {},
    user: {},
  });

  useEffect(() => {
    if (!data) return;

    // Si el backend devuelve directamente la cotización (id, quote_number, etc.)
    // la usamos como quotation. Si viene envuelta en { quotation: {...} } usamos esa.
    const quotationData = data.quotation ?? data;

    setQuotation({
      request: data.request ?? quotationData.request ?? {},
      quotation: quotationData,
      items: data.items ?? quotationData.items ?? [],
      client:
        data.request?.client ??
        quotationData.request?.client ??
        {},
      user: data.user ?? quotationData.user ?? {},
    });
  }, [data]);

  if (isLoading) {
    return null; // aquí puedes poner un skeleton si quieres
  }

  if (isError) {
    console.error(error);
    return (
      <Container sx={{ py: 3 }}>
        <Typography color="error">
          No se pudo cargar la cotización. Verifica el enlace o solicita una nueva.
        </Typography>
      </Container>
    );
  }

  if (!quotation.quotation?.id) {
    // Data vacía o enlace inválido
    return (
      <Container sx={{ py: 3 }}>
        <Typography>
          Cotización no encontrada o enlace inválido.
        </Typography>
      </Container>
    );
  } 

  if (quotation.quotation.status === 'ACEPTADA') {
    // Data vacía o enlace inválido
    return (
      <QuotationAcceptSuccess quotation={quotation} onContinue={() => {}} />
    );
  }

  if (quotation.quotation.status === 'RECHAZADA') {
    // Data vacía o enlace inválido
    return (
      <QuotationErrorView quotation={quotation} onContinue={() => {}} />
    );
  }

  const handleAccept = async () => {
    try {
      const ok = await confirm({
        title: 'Aceptar cotización',
        description: `¿Desea aceptar la cotización #${quotation.quotation.quote_number}?`,
        confirmText: 'Aceptar',
        cancelText: 'Cancelar',
      });

      if (!ok) return;

      const result = await acceptQuotation({ id, token, request_id: quotation.request.id, quotation_id: quotation.quotation.id }).unwrap();

      if (result) {
        setQuotation(result);
      }

      enqueueSnackbar('Cotización aceptada correctamente.', {
        variant: 'success',
      });
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleReject = async () => {
    try {
      const ok = await confirm({
        title: 'Rechazar cotización',
        description: `¿Desea rechazar la cotización #${quotation.quotation.quote_number}?`,
        confirmText: 'Rechazar',
        cancelText: 'Cancelar',
      });

      if (!ok) return;

      const result = await rejectQuotation({ id, token, request_id: quotation.request.id, quotation_id: quotation.quotation.id }).unwrap();

      if (result) {
        setQuotation(result);
      }

      enqueueSnackbar('Cotización rechazada.', {
        variant: 'info',
      });
    } catch (err) {
      handleApiError(err);
    }
  };
  console.log(quotation)
  const buttons = 
    quotation.status !== 'ACEPTADA' && quotation.status !== 'RECHAZADA' && (
    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
      <Button
        variant="outlined"
        color="error"
        size="small"
        onClick={handleReject}
      >
        Rechazar
      </Button>

      <Button
        variant="contained"
        color="success"
        size="small"
        onClick={handleAccept}
      >
        Aceptar Cotización
      </Button>
    </Box>
  );

  return (
    <Container sx={{ py: 3 }}>
      <Card className="p-3">
        <Box pt={1} mb={3}>
          <HeadingArea
            title={`Cotización #${quotation.quotation.quote_number ?? id}`}
            icon={<GradingIcon className="icon" />}

          />
        </Box>

        <Scrollbar autoHide={false}>
          <StyledBox>
            <Grid container spacing={4}>
              <Grid size={{ md: 6, xs: 12 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Información de la Cotización
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ sm: 6, xs: 12 }}>
                    <ListItem
                      text="Razón social:"
                      description={quotation.client.company_name ?? '—'}
                    />
                  </Grid>

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <ListItem
                      text="RUT Cliente:"
                      description={quotation.client.company_rut ?? '—'}
                    />
                  </Grid>

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <ListItem
                      text="Dirección de obra:"
                      description={quotation.request.obra_direccion || '—'}
                    />
                  </Grid>

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <ListItem
                      text="Fecha de solicitud:"
                      description={
                        quotation.request.received_at
                          ? fDateTime(quotation.request.received_at)
                          : '—'
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={{ md: 6, xs: 12 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Contacto
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ sm: 6, xs: 12 }}>
                    <ListItem
                      text="Nombre contacto:"
                      description={quotation.request.requester_full_name ?? '—'}
                    />
                  </Grid>

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <ListItem
                      text="Correo contacto:"
                      description={quotation.request.requester_email ?? '—'}
                    />
                  </Grid>

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <ListItem
                      text="Teléfono:"
                      description={quotation.request.requester_phone ?? '—'}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </StyledBox>

          <StyledBox sx={{ mt: 2 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Detalle de servicios
            </Typography>
            <QuotationDetailsList items={quotation.items} />
          </StyledBox>

          <StyledBox sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ sm: 7, xs: 12 }} />

              <Grid
                size={{ sm: 5, xs: 12 }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <QuotationSummary
                  draft={quotation}
                  withInput={false}
                  buttons={buttons}
                />
              </Grid>
            </Grid>
          </StyledBox>
        </Scrollbar>
      </Card>
    </Container>
  );
}
