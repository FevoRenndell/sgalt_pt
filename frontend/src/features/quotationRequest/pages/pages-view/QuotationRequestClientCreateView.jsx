import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation, useNavigate } from 'react-router-dom';

// MUI
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { Box, Button, CardContent, CardHeader } from '@mui/material';

// CUSTOM
import { FormProvider, RHFSelect, RHFTextField } from '../../../../shared/components/hook-form/index.jsx';
import { quotationRequestCreateSchema } from '../../validations/quotationRequestCreateSchema';
import { validate, clean, format } from 'rut.js';

import {
  useFetchRegionsQuery,
  useFetchCityByIdQuery,
  useFetchCommuneByIdQuery,
  useFetchClientByRutQuery
} from '../../../quotationRequest/api/filterApi';

import { filterApi } from '../../../quotationRequest/api/filterApi';

import {
  useCreateQuoteRequestMutation
} from '../../../quotationRequest/api/quotationRequestClientApi';

import { handleApiError } from '../../../../shared/utils/handleApiError';
import { useConfirmDialog } from '../../../../contexts/ConfirmDialogContext';
import { useEffect, useState } from 'react';
import ClientInputs from '../../components/client/ClientInputs';
import { useDispatch } from 'react-redux';
import HeadingArea from '../../../../shared/components/heading-area/HeadingArea.jsx';
import CreateIcon from '@mui/icons-material/Create';
import { paths } from '../../../../routes/paths.js';

import SendIcon from '@mui/icons-material/Send';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import QuotationRequestCreateSuccessDialog from '../../components/quotationRequest/QuotationRequestCreateSuccessDialog.jsx';

// ---------------- COMPONENT ----------------
export default function QuotationRequestClientCreateView({ isPublic = true }) {

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [state , setState] = useState({
    isOpen : true,
    data : {}
  });

  const initialValues = {
    city_id: null,
    region_id: null,
    commune_id: null,
    company_rut: '',
    company_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    obra_direccion: '',
    requester_email: '',
    requester_phone: '',
    requester_full_name: '',
    service_description: '',
  };

  //estado locales
  const [isRutValid, setIsRutValid] = useState(false);
  const [client, setClient] = useState(null);

  const confirm = useConfirmDialog();

  const { data: regions } = useFetchRegionsQuery();

  const [createQuoteRequest, { isLoading: isCreating, error: createError }] = useCreateQuoteRequestMutation();

  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(quotationRequestCreateSchema),
  });

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = methods;

  const newValues = useWatch({ control });

  if (!newValues) {
    reset('region_id', null);
    reset('city_id', null);
    reset('commune_id', null);
  }

  const {
    data: cities,
    isLoading: citiesLoading,
    error: errorCities,
  } = useFetchCityByIdQuery(newValues.region_id?.id, {
    skip: newValues.region_id?.id ? false : true,
  });

  const {
    data: communes,
    isLoading: isCommunesLoading,
    error: errorCommunes,
  } = useFetchCommuneByIdQuery(newValues.city_id?.id, {
    skip: newValues.city_id?.id ? false : true,
  });

  const {
    data: dataClient,
    isLoading: isClientLoading,
    error: errorClient,
  } = useFetchClientByRutQuery(newValues.company_rut, {
    skip: !isRutValid
  });

  const onSubmit = handleSubmit(async (values) => {

    const data = {
      ...values,
      region_id: newValues.region_id.id,
      city_id: newValues.city_id.id,
      commune_id: newValues.commune_id.id,
    };

    try {

      const ok = await confirm({
        title: 'Requiere Confirmación',
        description: '¿Estás seguro de que deseas enviar esta solicitud de cotización?',
        confirmText: 'Si, enviar',
        cancelText: 'Cancelar',
        severity: 'info'
      });

      if (!ok) {
        return;
      }


      const result = await createQuoteRequest(data).unwrap();

      if(result){
        setState({
          isOpen: true,
          data: result
        });
      }

      /*enqueueSnackbar(
       'Solicitud de cotización enviada correctamente',
        {
          variant: 'success',
          autoHideDuration: 1500,
          onExited: () => {
            navigate(public_paths.quote_request_view);
          }
        }
      );*/

    } catch (err) {
      handleApiError(err);
    }
  });

  const searchClient = (e) => {

    if (newValues.company_rut === '') {
      setIsRutValid(false);
      return;
    }

    const inputValue = newValues.company_rut || '';
    const rutCleaned = clean(inputValue);
    const isValid = validate(rutCleaned);
    if (!isValid) {
      console.log("RUT inválido, no buscar");
      //error en company_rut
      return;
    }
    setIsRutValid(isValid);
  };

  const handleMask = (e) => {
    const inputValue = e.target.value || '';
    const rutCleaned = clean(inputValue);
    const rutFormateado = format(rutCleaned);
    setValue('company_rut', rutFormateado, { shouldValidate: true });
  };

  useEffect(() => {
    if (dataClient) {
      setClient(dataClient);
      setValue('company_name', dataClient.company_name);
      setValue('contact_name', dataClient.contact_name);
      setValue('contact_email', dataClient.contact_email);
      setValue('contact_phone', dataClient.contact_phone);
    }
  }, [dataClient]);

  const handleClean = () => {

    setClient(null);
    dispatch(filterApi.util.invalidateTags([{ type: "Client", id: "by_rut" }]));
    reset();
  }



  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <QuotationRequestCreateSuccessDialog 
        state={state} 
        onClose={() => setState({ isOpen: false, data: {} })} 
      />
      <div className="pt-2 pb-4" >
        <Card className="p-3" >
          <Box px={2} pt={2} mb={3}>
            <HeadingArea
              title='Nueva Solicitud de Cotización'
              addButton={
                <Button variant="outlined" color='primary' size="medium" onClick={() => navigate(paths.quotation_request_list)}>
                  Volver
                </Button>
              }
              icon={<CreateIcon className="icon" />
              } />
          </Box>
          <CardContent >
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid size={{ sm: 6, xs: 12 }}>
                {isPublic && (
                  <RHFTextField
                    size="small"
                    fullWidth
                    name="company_rut"
                    label="Rut Cotizante"
                    sizeParam="small"
                    search_rut={true}
                    onClick={(e) => searchClient(e)}
                    onKeyUp={(e) => handleMask(e)}
                    disabled={!!client}
                  />

                )}

                {!isPublic && (
                  <RHFSelect
                    fullWidth
                    name="rut_cliente"
                    label="Cliente"
                    options={[]}
                    sizeParam="small"
                  />
                )}
              </Grid>
              <Grid size={{ sm: 6, xs: 12 }}>
                <RHFTextField
                  size="small"
                  fullWidth
                  name="requester_full_name"
                  label="Nombre contacto"
                  sizeParam="small"
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {/* Teléfono contacto */}
              <Grid size={{ sm: 6, xs: 12 }}>
                <RHFTextField
                  size="small"
                  fullWidth
                  name="requester_phone"
                  label="Teléfono contacto"
                  sizeParam="small"
                />
              </Grid>

              {/* Email contacto */}
              <Grid size={{ sm: 6, xs: 12 }}>
                <RHFTextField
                  size="small"
                  fullWidth
                  name="requester_email"
                  label="Email contacto"
                  sizeParam="small"
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {/* Obra / Dirección de la obra */}
              <Grid size={{ sm: 12, xs: 12 }}>
                <RHFTextField
                  size="small"
                  fullWidth
                  name="obra_direccion"
                  label="Nombre / Dirección de la Obra"
                  sizeParam="small"
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {/* Región */}
              <Grid size={{ sm: 4, xs: 12 }}>
                <RHFSelect
                  fullWidth
                  name="region_id"
                  label="Región"
                  options={regions || []}
                  sizeParam="small"
                />
              </Grid>

              {/* Ciudad */}
              <Grid size={{ sm: 4, xs: 12 }}>
                <RHFSelect
                  fullWidth
                  name="city_id"
                  label="Ciudad"
                  options={cities || []}
                  sizeParam="small"
                />
              </Grid>

              {/* Comuna */}
              <Grid size={{ sm: 4, xs: 12 }}>
                <RHFSelect
                  fullWidth
                  name="commune_id"
                  label="Comuna"
                  options={communes || []}
                  sizeParam="small"
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {/* Descripción del servicio */}
              <Grid size={{ sm: 12, xs: 12 }}>
                <RHFTextField
                  size="small"
                  fullWidth
                  multiline
                  rows={4}
                  name="service_description"
                  label="Descripción del servicio"
                  sizeParam="small"
                />
              </Grid>
            </Grid>
            <ClientInputs blocked={!!client} />
            <Grid container spacing={3} sx={{ pt: 3 }}>
              <Grid size={{ sm: 3, xs: 12 }}>
                <Button
                  size='small'
                  type="submit"
                  startIcon={<SendIcon />} 
                  variant="outlined"
                  
                  color="success"
                  fullWidth
                  disabled={isSubmitting || isCreating}
                >
                  {isCreating ? 'Enviando...' : 'Enviar Solicitud'}
                </Button>
              </Grid>

              <Grid size={{ sm: 3, xs: 12 }}>
                <Button
                  size='small'
                  startIcon={<CleaningServicesIcon />} 
                  variant="outlined"
                  
                  color="warning"
                  fullWidth
                  onClick={() => handleClean()}
                >
                  Limpiar
                </Button>
              </Grid>
            </Grid>

          </CardContent>
        </Card>
      </div>
    </FormProvider>

  );
}
