import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';
// CUSTOM UTILS METHOD
import { formatK } from '@/shared/utils/currency';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatThousands } from '../../../shared/utils/formatNumber';
import { getNotificationIcon } from '../../../shared/utils/notificationIcon';


// STYLED COMPONENTS
const StyledRoot = styled(Card)(({
  theme
}) => ({
  height: '100%',
  padding: theme.spacing(3),
  '& .content': {
    marginTop: '1rem',
    textAlign: 'center'
  }
}));

const IconWrapper = styled('div')(({ theme, color }) => ({
  width: 40,
  height: 40,
  flexShrink: 0,
  borderRadius: 6,
  display: 'flex',
  margin: 'auto',
  alignItems: 'center',
  justifyContent: 'center',

  ...(color.includes('success') && {
    color: theme.palette.success.main,
    backgroundColor: alpha(theme.palette.success.main, 0.2),
  }),
  ...(color.includes('error') && {
    color: theme.palette.error.main,
    backgroundColor: alpha(theme.palette.error.main, 0.2),
  }),
  ...(color.includes('warning') && {
    color: theme.palette.warning.main,
    backgroundColor: alpha(theme.palette.warning.main, 0.2),
  }),
  ...(color.includes('primary') && {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  }),
    ...(color.includes('info') && {
    color: theme.palette.info.main,
    backgroundColor: alpha(theme.palette.info.main, 0.2),
  }),
}));


export const styleQuotationTotal = [
  {
    id: 1,
    status: 'ACEPTADA',
    key: 'ACEPTADA',
    title: 'Monto de Cotizaciones Aceptadas',
  },
  {
    id: 2,
    status: 'VENCIDA',
    key: 'VENCIDA',
    title: 'Monto de Cotizaciones Vencidas',
  },
  {
    id: 3,
    status: 'RECHAZADA',
    key: 'RECHAZADA',
    title: 'Monto de Cotizaciones Rechazadas',
  },
  {
    id: 4,
    status: 'ENVIADA',   // o POR ACEPTAR si decides renombrarlo en backend
    key: 'ENVIADA',
    title: 'Monto de Cotizaciones Por Aceptar',
  },
];


export default function SalesCard({ quotation = {} }) {
  return (
    <Grid container spacing={3}>
      {styleQuotationTotal.map(({ id, status, key, title }) => {
        const { Icon, color } = getNotificationIcon(status);

        return (
          <Grid key={id} size={{
            sm: 3,
            xs: 12
          }}>
            <StyledRoot>
              <IconWrapper color={color}>
                <Icon color="inherit" />
              </IconWrapper>

              <div className="content">
                <Typography noWrap variant="body2" color="text.secondary" fontWeight={500}>
                  {title}
                </Typography>

                <Typography variant="h6" fontWeight={700} color={color}>
                  {formatThousands(quotation[key] || 0)}
                </Typography>
              </div>
            </StyledRoot>
          </Grid>
        );
      })}
    </Grid>
  );
}

