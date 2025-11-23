import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CardHeader, Box, Container } from "@mui/material";
import { Card, Chip, Grid, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { fDateTime } from "../../../../shared/utils/formatTime";
import { useConfirmDialog } from "../../../../contexts/ConfirmDialogContext";
import { FormProvider, RHFRadioGroup, RHFTextField } from '../../../../shared/components/hook-form';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { quotationReviewValidationCreateSchema } from "../../validations/quotationReviewValidationCreateSchema";
import { Scrollbar } from '../../../../shared/components/scrollbar';
import { handleApiError } from "../../../../shared/utils/handleApiError";
import {
  useUpdateQuotationRequestSaveReviewMutation,
} from '../../api/quotationRequestQuoterApi';
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";


export const StyledBox = styled('div')(({ theme }) => ({
  padding: 24,
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  backdropFilter: 'blur(4px)',
  border: `1px solid ${theme.palette.divider}`,
}));
;


export default function QuotationRequestDetailDialog({ state: { isOpen = false, client = {} }, onClose }) {

  const confirm = useConfirmDialog();

  const [updateQuotationRequestSaveReview, { isLoading: isUpdating, error: updateError }] = useUpdateQuotationRequestSaveReviewMutation();

  const initialValues = {
    competence_capacity: '',
    need_subcontracting_services: '',
    independence_issue: '',
    review_notes: '',
  };


  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(quotationReviewValidationCreateSchema),
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, isValid },
  } = methods;

  useEffect(() => {
    if (client && client.id && !isUpdating) {
      reset({
        competence_capacity: client.competence_capacity || '',
        need_subcontracting_services: client.need_subcontracting_services || '',
        independence_issue: client.independence_issue || '',
        review_notes: client.review_notes || '',
      });
    }

  }, [client?.id, isUpdating]);

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
    competence_capacity,
    need_subcontracting_services,
    independence_issue,
    obra_direccion,
  } = client || {};

  const {
    company_rut,
    company_name,
    contact_name,
    contact_email,
    contact_phone,
  } = client?.client || {};

  const companyName = reason_social || company_name || "—";
  const clientRut = company_rut || "—";
  const contactName = contact_name || requester_full_name || "—";
  const contactEmail = contact_email || requester_email || "—";
  const contactPhone = requester_phone || contact_phone || "—";

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



  const onSubmit = handleSubmit(async (values) => {

    const data = values;

    try {

      const ok = await confirm({
        title: 'Confirmar Revisión',
        description: `¿ Desea guardar los cambios, este proceso cambiara de estado la solicitud de la cotización : ${id} ?`,
        confirmText: 'Enviar Revisión',
        cancelText: 'Cancelar',
      });

      if (!ok) {
        return;
      }

      const result = await updateQuotationRequestSaveReview({ id, ...data }).unwrap();

      enqueueSnackbar(
        `Solicitud de cotización ${values.first_name} ha sido revisada`,
        {
          variant: 'success',
          autoHideDuration: 1500,
          onExited: () => {
            reset();
            onClose();
          }
        }
      );

    } catch (err) {
      handleApiError(err);
    }
  });


  const getStatusChipColor = (status) => {
    switch (status) {
      case 'REVISADA':
        return 'success';
      case 'RECHAZADA':
        return 'error';
      case 'PENDIENTE':
        return 'sencodary';
      default:
        return 'default';
    }
  }

  const renderButton = () => {
    if (!competence_capacity && !need_subcontracting_services && !independence_issue && status === 'PENDIENTE') {
      return (
        <Button variant="outlined" color='success' size="small" onClick={() => onSubmit()}>
          Guardar Revisión
        </Button>);
    }

    if (competence_capacity && need_subcontracting_services && independence_issue && status === 'REVISADA') {
      return (
        <Button variant="outlined" color='info' size="small" onClick={() => onSubmit()}>
           Crear Cotización
        </Button>);
    }
  }

  const renderEditButton = () => {
    if (competence_capacity || need_subcontracting_services || independence_issue) {
      return (
        <Button variant="outlined" color='warning' size="small" onClick={() => onSubmit()}>
          Editar Revisión
        </Button>
      );
    }
  }

  // renderiza botones segun el estado de la solicitud de cotizacion
  const actionButton = renderButton();
  const editButton = renderEditButton();

  return (
    <Container>

      <Dialog open={isOpen} maxWidth="md" fullWidth>
        <DialogContent dividers>
          <div className="pt-2 pb-4">
            <Card className="p-3">

              <CardHeader action={

                <Box sx={{ gap: 1, display: 'flex' }}>
                  <Button variant="outlined" color='primary' size="small" onClick={onClose}>Cerrar</Button>
                    {editButton}
                    {actionButton}
                </Box>

              } />
              <Scrollbar autoHide={true}>
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

                          />
                          <Chip label={status ?? "—"} size="small" color={getStatusChipColor(status)} />
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
                          <ListItem text="Razón social:" description={companyName} />
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
                          <ListItem text="RUT cliente:" description={clientRut} />
                        </Grid>

                        <Grid size={{ sm: 6, xs: 12 }}>
                          <ListItem
                            text="Contacto:"
                            description={contactName}
                          />
                        </Grid>

                        <Grid size={{ sm: 6, xs: 12 }}>
                          <ListItem
                            text="Correo contacto:"
                            description={contactEmail}
                          />
                        </Grid>

                        <Grid size={{ sm: 6, xs: 12 }}>
                          <ListItem
                            text="Fono / Móvil:"
                            description={contactPhone}
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
                          <ListItem description={service_description ?? "—"} />
                        </Grid>

                      </Grid>
                    </Grid>


                  </Grid>

                </StyledBox>
                <FormProvider methods={methods} onSubmit={onSubmit}>
                  <StyledBox sx={{ mt: 1 }}>
                    <Grid container spacing={4}>
                      {/* Columna Derecha */}
                      <Grid size={{ md: 12, xs: 12 }}>
                        <Typography variant="h6" fontWeight={600} mb={2}>
                          Revisión de la Solicitud:
                        </Typography>


                        <Grid container spacing={3} sx={{ mt: 2 }}>
                          <Grid size={{ sm: 6, xs: 12 }}>
                            <RHFRadioGroup
                              name="competence_capacity"
                              label="¿Se cuenta con la competencia y capacidad necesarias?"
                              row
                              options={[
                                { value: 'SI', label: 'Sí' },
                                { value: 'NO', label: 'No' },
                              ]}
                            />
                          </Grid>
                          <Grid size={{ sm: 6, xs: 12 }}>
                            <RHFRadioGroup
                              name="need_subcontracting_services"
                              label="¿Es necesario subcontratar los servicios?"
                              row
                              options={[
                                { value: 'SI', label: 'Sí' },
                                { value: 'NO', label: 'No' },
                              ]}
                            />
                          </Grid>




                          <Grid size={{ sm: 6, xs: 12 }}>
                            <RHFRadioGroup
                              name="independence_issue"
                              label="¿Existe problema de independencia?"
                              row
                              options={[
                                { value: 'SI', label: 'Sí' },
                                { value: 'NO', label: 'No' },
                              ]}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container spacing={3} sx={{ mt: 2 }}>
                      <Grid size={{ sm: 12, xs: 12 }}>
                        <RHFTextField
                          size="small"
                          fullWidth
                          multiline
                          rows={4}
                          name="review_notes"
                          label="Descripción del servicio"
                          sizeParam="small"
                        />
                      </Grid>
                    </Grid>
                  </StyledBox>
                </FormProvider>
              </Scrollbar>
            </Card>
          </div>
          <DialogActions>
            <Box sx={{ gap: 1, display: 'flex' }}>
              <Button variant="outlined" color='primary' size="small" onClick={onClose}>Cerrar</Button>
                {editButton}
                {actionButton}
            </Box>
          </DialogActions>
        </DialogContent>


      </Dialog>

    </Container>
  );
}
