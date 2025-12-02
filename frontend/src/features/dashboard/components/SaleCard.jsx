import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';
// CUSTOM UTILS METHOD
import { formatK } from '@/shared/utils/currency';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
 

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

  ...(color === 'primary' && {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  }),
  ...(color === 'success' && {
    color: theme.palette.success.main,
    backgroundColor: alpha(theme.palette.success.main, 0.2),
  }),
  ...(color === 'error' && {
    color: theme.palette.error.main,
    backgroundColor: alpha(theme.palette.error.main, 0.2),
  }),
  ...(color === 'warning' && {
    color: theme.palette.warning.main,
    backgroundColor: alpha(theme.palette.warning.main, 0.2),
  }),
}));


const styleQuotationTotal = [
  {
    Icon: CheckCircleOutlineIcon,
    title: 'Cotizaciones Aceptadas',
    color: 'success',
    key: 'ACEPTADA'
  },
  {
    Icon: AccessTimeIcon,
    title: 'Cotizaciones por Vencer',
    color: 'warning',
    key: 'POR VENCER'
  },
  {
    Icon: HighlightOffIcon,
    title: 'Cotizaciones Rechazadas',
    color: 'error',
    key: 'RECHAZADA'
  },
];


export default function SalesCard({ quotation = {} }) {
  return <Grid container spacing={3}>
    {styleQuotationTotal.map(({
      Icon,
      amount,
      color,
      id,
      key,
      title
    }) => <Grid size={{
      sm: 4,
      xs: 12
    }} key={id}>
        <StyledRoot>
          <IconWrapper color={color}>
            <Icon color="inherit" />
          </IconWrapper>

          <div className="content">
            <Typography noWrap variant="body2" color="text.secondary" fontWeight={500}>
              {title}
            </Typography>

            <Typography variant="h6" fontWeight={700} color={color}>
              {formatK(quotation[key]) }
            </Typography>
          </div>
        </StyledRoot>
      </Grid>)}
  </Grid>;
}