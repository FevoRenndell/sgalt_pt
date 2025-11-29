import {  useCallback, useEffect, useMemo, useState } from 'react';
import {  useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// MUI
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Box,  CardContent,  Tab } from '@mui/material';

// CUSTOM
import { FormProvider } from '../../../../shared/components/hook-form';

import {
  quotationValidationSchema
} from '../../validations/quotationValidationSchema';

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
import QuotationSummary from '../../components/totalize-quotation/QuotationSummary';
import { useDispatch, useSelector } from 'react-redux';
import { resetQuotationDraft, setQuotationDraft } from '../../quotationSlice/quotationSlice';
import { StyledBox } from '../../../../shared/components/style-box/StyledBox';
import QuotationServiceTableList from '../../components/add-quotation-items/QuotationServiceTableList';
import QuotationSummaryDrawer from '../../components/totalize-quotation/QuotationSummaryDrawer';
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';
import { HeadingWrapper } from '../../../../shared/components/heading-wrapper/HeadingWrapper';

// ---------------- COMPONENT ----------------
export default function QuotationCreateView() {

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectTab, setSelectTab] = useState('');
  const dispatch = useDispatch();

  //objeto que sera el borradfor de la cotización
  const draft = useSelector((state) => state.quotation.draft);

  const confirm = useConfirmDialog();

  useEffect(() => {
    if (id) {
      dispatch(setQuotationDraft({
        ...draft,
        request_id: parseInt(id),
      }));
    }
  }, [id, dispatch]);
  

  const [createQuotation, { isLoading: isCreating, error: createError }] = useCreateQuotationMutation();

  const onSubmit = async() => { 
 
    if(draft.items.length === 0){
      enqueueSnackbar('La cotización debe tener al menos un servicio seleccionado', {
        variant: 'error',
        autoHideDuration: 3000,
      });
      return;
    }

    try {

      const ok = await confirm({
        title:  'Confirmar creación',
        description: `¿Deseas crear y asignar esta nueva cotización a la solicitud de cotización  ${id}?`,
        confirmText: 'Crear',
        cancelText: 'Cancelar',
      });

      if (!ok) {
        return;
      }

      const data = {
        ...draft,
        request_id: parseInt(id),
      }

      const create = await createQuotation(data).unwrap();  

      if(create){
        cleanDraft();
        navigate(paths.quotation_created(create.id));
        enqueueSnackbar(`Cotización creada exitosamente`, {
          variant: 'success',
          autoHideDuration: 3000,
        });
      }
      
    } catch (error) {
      handleApiError(error, enqueueSnackbar);
    }


  }

  const handleChangeTab = useCallback((_, newTab) => {
    setSelectTab(newTab);
  }, []);

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
    cleanDraft();
   
  };

  const cleanDraft = () => {
    dispatch(resetQuotationDraft());
  }

  const addItemToSlice = (items) => {
    const itemArray = Object.values(items);
    dispatch(setQuotationDraft({
      ...draft,
      items: itemArray,
    }));
  };

  const handleDiscount = (discount) => {
    dispatch(setQuotationDraft({
      ...draft,
      discount,
    }));
  }
  
  const buttons = (<Grid container spacing={3} sx={{ pt: 3 }}>
    <Grid size={{ sm: 8, xs: 12 }}>
      <Button
        onClick={onSubmit}
        startIcon={<SaveIcon />}
        variant="outlined"
        color="success"
        fullWidth

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
  </Grid>);

  const quotationSymmary = <QuotationSummary draft={draft} handleDiscount={handleDiscount} buttons={buttons} />;

  return (
 
      <div className="pt-2 pb-4">
        <TabContext value={selectTab}>
          <HeadingWrapper>

            <TabList onChange={handleChangeTab}>
              <Tab disableRipple label="Todos" value="" />
              <Tab disableRipple label="Seleccionados" value="seleccionado" />
            </TabList>

          </HeadingWrapper>
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

              <QuotationServiceTableList 
                draft={draft}
                addItem={addItemToSlice} 
                selectTab={selectTab} 
                setSelectTab={setSelectTab}
               />

              <Grid container spacing={3} >
                <Grid size={{ sm: 7 }}> </Grid>
                <Grid size={{ sm: 5 }}>
                  <StyledBox>
                    {quotationSymmary}
                  </StyledBox>
                </Grid>
              </Grid>

              <QuotationSummaryDrawer children={quotationSymmary} />
            </CardContent>
          </Card>

        </TabContext>
      </div>
 
  );
}
