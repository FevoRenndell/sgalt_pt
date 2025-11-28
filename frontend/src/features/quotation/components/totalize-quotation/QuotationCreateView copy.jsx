import { useEffect, useMemo } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// MUI
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Box, CardActions, CardContent, Fab } from '@mui/material';

// CUSTOM
import { FormProvider } from '../../../../shared/components/hook-form';

import {
  quotationValidationCreateSchema
} from '../../validations/quotationValidationCreateSchema';

import { paths } from '../../../../routes/paths';
import {
  useCreateQuotationMutation,
} from '../../api/quotationApi';

import { enqueueSnackbar } from 'notistack';
import { handleApiError } from '../../../../shared/utils/handleApiError';
import { useConfirmDialog } from '../../../../contexts/ConfirmDialogContext';
import HeadingArea from '../../../../shared/components/heading-area/HeadingArea';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import SaveIcon from '@mui/icons-material/Save';
import QuotationSummary from './QuotationSummary';
import { useDispatch, useSelector } from 'react-redux';
import { resetQuotationDraft, setQuotationDraft } from '../../quotationSlice/quotationSlice';
import { StyledBox } from '../../../../shared/components/style-box/StyledBox';
import QuotationServiceTableList from '../add-quotation-items/QuotationServiceTableList';
import FloatingButton from '../../../../shared/components/buttons/FloatingButton';
import QuotationSummaryDrawer from './QuotationSummaryDrawer';
// ---------------- COMPONENT ----------------
export default function QuotationCreateView() {

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  //objeto que sera el borradfor de la cotización
  const draft = useSelector((state) => state.quotation.draft);

  const defaultValues = useMemo(() => draft, [draft]);

  const confirm = useConfirmDialog();

  const isEdit = location.pathname.includes('quotation_create');



  // const { data: options } = useFetchQuotationRequestFiltersQuery();

  /*const {
    data: quotation_existing,
    isLoading: isQuotationRequestLoading,
    error,
  } = useFetchQuotationRequestByIdQuery(id, {
    skip: !isEdit || !id,
  });*/

  const quotation_existing = null; // temporal mientras se arregla lo de arriba

  useEffect(() => {
    if (isEdit && quotation_existing) {
      dispatch(setQuotationDraft({
        ...quotation_existing,
        items: quotation_existing.items?.map((i) => ({ ...i })),
      }));
    }
  }, [isEdit, quotation_existing, dispatch]);

  const [createQuotation, { isLoading: isCreating, error: createError }] = useCreateQuotationMutation();

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(quotationValidationCreateSchema),
  });

  const {
    handleSubmit,
    reset,
    watch,
    control,
    formState: { isSubmitting, isValid },
  } = methods;

  const newValues = useWatch({ control });

  useEffect(() => {

  }, [newValues]);

  const {
    fields,
    append,
    remove
  } = useFieldArray({ // manejar arreglos de campos dinámicos
    name: 'items',
    control
  });

  // sincroniza los cambios del formulario con el draft (borrador de cotización) en el store
  useEffect(() => {
    console.log("D:;")
    const subscription = watch((values) => {
      dispatch(
        setQuotationDraft({
          ...values,
          items: values.items?.map((i) => ({ ...i })),
        })
      );
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  /*useEffect(() => {
    if (isEdit && quotation_existing) {
      reset({
        first_name: quotation_existing.first_name ?? '',
        last_name_1: quotation_existing.last_name_1 ?? '',
        last_name_2: quotation_existing.last_name_2 ?? '',
        role: quotation_existing.role ?? null,
        is_active: quotation_existing.is_active ?? null,
        email: quotation_existing.email ?? '',
        password_hash: '',
        repeat_password: '',
      });
    }
  }, [isEdit, quotation_existing, reset]);*/


  const onSubmit = handleSubmit(async (values) => {



    try {
      const ok = await confirm({
        title: isEdit ? 'Confirmar actualización' : 'Confirmar creación',
        description: `¿Deseas ${isEdit ? `actualizar los cambios de  la cotización ${'id de la cotizacion'} ` : `crear y asignar esta nueva cotización a la solicitud de cotización  ${id}`}?`,
        confirmText: isEdit ? 'Actualizar' : 'Crear',
        cancelText: 'Cancelar',
      });

      if (!ok) {
        return;
      }

      const data = {
        items: values.items,
        request_id: id,
      }

      // f (isEdit) {
      await createQuotation(data).unwrap();
      /*} else {
        await updateQuotation({ id, ...data }).unwrap();
      }*/
    } catch (error) {
      handleApiError(error, enqueueSnackbar);
    }

    /*      enqueueSnackbar(
        isEdit ? `Usuario actualizado ${values.first_name}` : 'Usuario creado',
        {
          variant: 'success',
          autoHideDuration: 1500,
          onExited: () => {
            navigate(paths.quotationRequests_list);
          }
        }
      ); */


  });

  const handleGoBack = () => {
    navigate(paths.quotationRequests_list);
  };

  const handleClean = async () => {
    const ok = await confirm({
      title: 'Desechar Borrador',
      description: `¿Deseas desechar el borrador de cotización actual ${id}? Se perderán los datos no guardados.`,
      confirmText: 'Si, Desechar',
      cancelText: 'Cancelar',
    });

    if (!ok) {
      return;
    }
    console.log("lleguie")
    dispatch(resetQuotationDraft(defaultValues));
  };

  const handleAddItem = () => {
    append({
      service_id: null,
      quantity: 0,
      unit_price: 0,
      total: 0,
      is_active: true,
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <div className="pt-2 pb-4">
        <Card className="p-3" size="xl">
          <Box px={2} pt={2}  >
            <HeadingArea
              title="Nueva Cotización"
              addButton={
                <Button
                  variant="outlined"
                  color="primary"
                  size="medium"
                  onClick={() => navigate(paths.quotation_list)}
                >
                  Volver
                </Button>
              }
              icon={<AttachMoneyIcon className="icon" />}
            />
          </Box>

          <CardContent>

            <QuotationServiceTableList />

            <Grid container spacing={3} >
              <Grid size={{ sm: 8, xs: 12 }}> </Grid>
              <Grid size={{ sm: 4, xs: 12 }}>
                <StyledBox>
                  <QuotationSummary /*items={items} */ />
                </StyledBox>
              </Grid>
            </Grid>
            
            <QuotationSummaryDrawer
              subtotal={0}
              discount={0}
              tax={0}
            />

            <CardActions sx={{ justifyContent: 'flex-end', mt: 3 }}>

              <Grid container spacing={3} sx={{ pt: 3 }}>
                <Grid size={{ sm: 8, xs: 12 }}>
                  <Button
                    type="submit"
                    startIcon={<SaveIcon />}
                    variant="outlined"
                    color="success"
                    fullWidth
                    disabled={isSubmitting || isCreating}
                  >
                    {isCreating ? 'Guardando...' : 'Guardar Cotización'}
                  </Button>
                </Grid>

                <Grid size={{ sm: 4, xs: 12 }}>
                  <Button
                    type="button"
                    startIcon={<CleaningServicesIcon />}
                    variant="outlined"
                    color="warning"
                    fullWidth
                    onClick={handleClean}
                  >
                    Limpiar
                  </Button>
                </Grid>
              </Grid>
            </CardActions>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
}
