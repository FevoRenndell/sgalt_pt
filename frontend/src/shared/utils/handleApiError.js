import { enqueueSnackbar } from 'notistack';

export function handleApiError(error, defaultMsg = 'Error inesperado') {
  if (!error) {
    enqueueSnackbar(defaultMsg, { variant: 'error' });
    return;
  }
  
  const message = error?.data?.message;

  if (error?.data?.errors?.length > 0) {
    return error.data.errors.forEach((e) => {
      enqueueSnackbar(e.message, { variant: 'error' });
    });
  }

  enqueueSnackbar(message || defaultMsg, { variant: 'error' });
}
