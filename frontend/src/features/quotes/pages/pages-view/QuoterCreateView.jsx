import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// MUI
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { Button, CardContent, CardHeader, Snackbar } from '@mui/material';

// CUSTOM
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField } from '../../../../shared/components/hook-form';
import { quotationRequestCreateSchema } from '../../validations/quotationRequestCreateSchema';
import { paths, public_paths } from '../../../../routes/paths';
 
import { 
  useFetchRegionsQuery,
  useFetchCityByIdQuery,  
  useFetchCommuneByIdQuery
 } from '../../api/filterApi';
 import { 
    useCreateQuoteRequestMutation
 } from '../../api/quoteApi';
import { enqueueSnackbar } from 'notistack';
import { handleApiError } from '../../../../shared/utils/handleApiError';
import { useConfirmDialog } from '../../../../contexts/ConfirmDialogContext';

// ---------------- COMPONENT ----------------
export default function QuoterCreateView() {

  const location = useLocation();
  const navigate = useNavigate();

  const initialValues = {
    requester_full_name: '',
    requester_email: '',
    requester_phone: '',
    service_description: '',
    obra_direccion: '',
    commune_id: null,
    city_id: null,
    region_id: null,
  };

  const confirm = useConfirmDialog();

  const { data : regions } = useFetchRegionsQuery();

  const [createQuoteRequest, { isLoading: isCreating, error: createError }] = useCreateQuoteRequestMutation();

  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(quotationRequestCreateSchema),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = methods;

 const newValues = useWatch({ control }); 

    console.log(newValues)

    if(!newValues){
      reset('region_id', null);
      reset('city_id', null);
      reset('commune_id', null);
    }

    const {
    data: cities,
    isLoading: citiesLoading,
    error : errorCities,
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


  const onSubmit = handleSubmit(async (values) => {

    const { role, ...rest } = values;
   const data = {
      ...values,
      region_id: newValues.region_id.id,
      city_id: newValues.city_id.id,
      commune_id: newValues.commune_id.id,
    };

    try {

      const ok = await confirm({
        title:  'Requiere Confirmación',
        description: '¿Estás seguro de que deseas enviar esta solicitud de cotización?',
        confirmText: 'Si, enviar',
        cancelText: 'Cancelar',
        severity :  'info'
      });

      if (!ok) {
        return;
      }

 
      await createQuoteRequest(data).unwrap();
  
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

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card>
        <CardHeader title='Solicitud de Cotización' />
        <CardContent sx={{ pt: 0, pl: 10, pr: 10 }}>
          <div className="pt-2 pb-4">
        <Grid container spacing={3} sx={{ mt: 2 }}>
         
              <Grid size={{ sm: 12, xs: 12 }}>
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
              <Grid container spacing={3} sx={{ pt: 3 }}>
                <Grid size={{ sm: 3, xs: 12 }}>
                  <Button
                    size='small'
                    type="submit"
                    
                    variant="outlined"
                    outlined={true}
                    color="success"
                    fullWidth
                    disabled={isSubmitting || isCreating }
                  >
                    {isCreating ? 'Enviando...' : 'Enviar Solicitud de Cotización'}
                  </Button>
                </Grid>
        
      
              </Grid>
          </div>
        </CardContent>
      </Card>
    </FormProvider>
  );
}
