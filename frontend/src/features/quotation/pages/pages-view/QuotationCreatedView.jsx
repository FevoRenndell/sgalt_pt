import { Dialog, DialogContent, DialogActions, Button, Box, Container } from "@mui/material";
import { Card, Chip, Grid, Typography } from "@mui/material";
import { fDateTime } from "../../../../shared/utils/formatTime";
import { useConfirmDialog } from "../../../../contexts/ConfirmDialogContext";
import { FormProvider, RHFRadioGroup, RHFTextField } from '../../../../shared/components/hook-form';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Scrollbar } from '../../../../shared/components/scrollbar';
import { handleApiError } from "../../../../shared/utils/handleApiError";
import {
    useFetchQuotationByIdQuery,
    useSendQuotationEmailMutation
} from '../../api/quotationApi';
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import HeadingArea from "../../../../shared/components/heading-area/HeadingArea";
import GradingIcon from '@mui/icons-material/Grading';
import { StyledBox } from "../../../../shared/components/style-box";
import { paths } from "../../../../routes/paths";

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getStatusChipColorRequestQuotation } from "../../../../shared/utils/chipColor";
import QuotationDetailsList from "../../components/details-quotation/QuotationDetailsList";
import QuotationSummary from "../../components/totalize-quotation/QuotationSummary";



export default function QuotationCreatedView({ }) {

    const { id } = useParams();
    const confirm = useConfirmDialog();
    const navigate = useNavigate();
    const location = useLocation();
    const isCreated = location.pathname.includes('quotation_created');

    const [quotation, setQuotation] = useState({
        request: {},
        quotation: {},
        items: [],
        client: {},
    });

 
    const { data, isLoading } = useFetchQuotationByIdQuery(id);
 
    const [sendQuotation, { isLoading: isCreating, error: createError }] = useSendQuotationEmailMutation();

    useEffect(() => {


        if (data) {
            console.log(data)
            setQuotation({
                ...data,
                request: data?.request,
                quotation: data?.quotation,
                items: data?.items,
                client: data?.request.client,
            });
        }

    }, [data]);

    const initialValues = {
        competence_capacity: '',
        need_subcontracting_services: '',
        independence_issue: '',
        review_notes: '',
    };

    const methods = useForm({
        defaultValues: initialValues,
        // resolver: yupResolver(quotationReviewValidationCreateSchema),
    });

    const {
        handleSubmit,
        reset,
        watch,
        formState: { isSubmitting, isValid },
    } = methods;

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

                    }
                }
            );

        } catch (err) {
            handleApiError(err);
        }
    });

    const getStatusChipColor = getStatusChipColorRequestQuotation;

    const onSubmitSendEmail = async () => {
        try {

            // Desea enviar la cotización #${quotation.quotation.id} al correo ${quotation.client.contact_email} 
            const ok = await confirm({
                title: 'Enviar Cotización por Correo',
                description: `¿?`,
                confirmText: 'Enviar Correo',
                cancelText: 'Cancelar',
            });
            if (!ok) {
                return;
            }
            console.log(quotation)
            const result = await sendQuotation({ 
                request_id :  quotation.request_id,
                quotation_id :  quotation.id,
             }).unwrap();

            enqueueSnackbar('Cotización enviada por correo correctamente.', {
                variant: 'success',
            });
        } catch (err) {
            handleApiError(err);
        }
    };

    const renderEmailButton = () => {  
      if ( quotation.status === 'CREADA' && quotation.request.status==='REVISADA' ) {
        return (
          <Button variant="outlined" color='info' size="small" onClick={() => onSubmitSendEmail() }>
            Enviar Correo
          </Button>);
      }
    }

    const sendEmail = renderEmailButton();
  

    if (isLoading) {
        return;
    }

    console.log
    return (
        <Container>

            <div className="pt-2 pb-4">
                <Card className="p-3">
                    <Box pt={1} mb={3}>
                        <HeadingArea title={`Detalle Cotización # ${id}`} addButton={<Box sx={{ gap: 1, display: 'flex' }}>
                            <Button variant="outlined" color='primary' size="small" onClick={() => { }}>Atras</Button>
                            {sendEmail}
                        </Box>} icon={<GradingIcon className="icon" />} />
                    </Box>

                    <Scrollbar autoHide={false}>
                        <StyledBox>
                            <Grid container spacing={4}>
                                {/* Columna Izquierda: Solicitud */}
                                <Grid size={{ md: 6, xs: 12 }}>
                                    <Typography variant="h6" fontWeight={600} mb={2}>
                                        Información de la Cotización
                                    </Typography>

                                    <Grid container spacing={3} sx={{ mt: 2 }}>
                                        <Grid size={{ sm: 6, xs: 12 }}>
                                            <ListItem text="ID Solicitud Cotización :" description={quotation.request.id ?? "—"} />
                                        </Grid>

                                        <Grid size={{ sm: 6, xs: 12 }}>
                                            <ListItem
                                                text="Estado Cotización:"

                                            />
                                            <Chip label={quotation.status ?? "—"} size="small" color={getStatusChipColor(quotation.status)} />
                                        </Grid>

                                        <Grid size={{ sm: 6, xs: 12 }}>
                                            <ListItem
                                                text="Fecha Solicitud:"
                                                description={quotation.request.received_at ? fDateTime(quotation.request.received_at) : "—"}
                                            />
                                        </Grid>

                                        <Grid size={{ sm: 6, xs: 12 }}>
                                            <ListItem
                                                text="Actualizado el:"
                                                description={quotation.request.updated_at ? fDateTime(quotation.request.updated_at) : "—"}
                                            />
                                        </Grid>

                                        <Grid size={{ sm: 6, xs: 12 }}>
                                            <ListItem text="Razón social:" description={quotation.client.company_name} />
                                        </Grid>

                                        <Grid size={{ sm: 6, xs: 12 }}>
                                            <ListItem
                                                text="Dirección obra:"
                                                description={quotation.request.obra_direccion || "—"}
                                            />
                                        </Grid>

                                        <Grid size={{ sm: 6, xs: 12 }}>
                                            <ListItem
                                                text="Registrado por:"
                                                description={quotation.request.registered_by ?? "—"}
                                            />
                                        </Grid>

                                        <Grid size={{ sm: 6, xs: 12 }}>
                                            <ListItem
                                                text="ID Cotización:"
                                                description={quotation.request.cotizacion_id ?? "—"}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Columna Derecha: Quotatione / Contacto / Revisión */}
                                <Grid size={{ md: 6, xs: 12 }}>
                                    <Typography variant="h6" fontWeight={600} mb={2}>
                                        Información del Cotizante / Contacto
                                    </Typography>

                                    <Grid container spacing={3} sx={{ mt: 2 }}>
                                        <Grid size={{ sm: 6, xs: 12 }}>
                                            <ListItem text="RUT cliente:" description={quotation.client.company_rut} />
                                        </Grid>

                                        <Grid size={{ sm: 6, xs: 12 }}>
                                            <ListItem
                                                text="Contacto:"
                                                description={quotation.client.company_name}
                                            />
                                        </Grid>

                                        <Grid size={{ sm: 6, xs: 12 }}>
                                            <ListItem
                                                text="Correo contacto:"
                                                description={quotation.client.contact_email}
                                            />
                                        </Grid>

                                        <Grid size={{ sm: 6, xs: 12 }}>
                                            <ListItem
                                                text="Fono / Móvil:"
                                                description={quotation.client.contact_phone}
                                            />
                                        </Grid>

                                        <Grid size={{ sm: 6, xs: 12 }}>
                                            <ListItem
                                                text="Revisado por:"
                                                description={quotation.request.reviewed_by ?? "—"}
                                            />
                                        </Grid>

                                        <Grid size={{ sm: 6, xs: 12 }}>
                                            <ListItem
                                                text="Revisado el:"
                                                description={quotation.request.reviewed_at ? fDateTime(quotation.request.reviewed_at) : "—"}
                                            />
                                        </Grid>

                                        <Grid size={{ sm: 12, xs: 12 }}>
                                            <ListItem
                                                text="Notas de revisión:"
                                                description={quotation.request.review_notes ?? "—"}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </StyledBox>

                        <StyledBox sx={{ mt: 2 }}>
                            <Grid container  >
                                <Grid size={{ sm: 12, xs: 12 }}>
                                    <QuotationDetailsList items={quotation.items} />
                                </Grid>
                            </Grid>
                        </StyledBox>
                        <StyledBox sx={{ mt: 2 }}>
                            <Grid container  >
                                 <Grid size={{ sm: 7, xs: 12 }}></Grid>
                                <Grid size={{ sm: 5, xs: 12 }}>
                                    <QuotationSummary draft={quotation} handleDiscount={() => { }} buttons={null} withInput={false} />
                                </Grid>
                            </Grid>
                        </StyledBox>
                      
                    </Scrollbar>
                </Card>
            </div>

        </Container>
    );
}
