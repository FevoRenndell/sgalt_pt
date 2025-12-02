import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import PendingIcon from '@mui/icons-material/Pending';

// SIN JSX ⛔
// SOLO RETORNAMOS EL COMPONENTE DE ICONO

export function getNotificationIcon(status) {
  const key = String(status || '').toUpperCase().trim();

  switch (key) {
    case 'ACEPTADA':
      return { Icon: CheckCircleOutlineIcon, color: 'success.main' };

    case 'RECHAZADA':
      return { Icon: HighlightOffIcon, color: 'error.main' };

    case 'PENDIENTE':
      return { Icon: PendingIcon, color: 'warning.main' };

    case 'ENVIADA':
      return { Icon: MarkEmailReadIcon, color: 'primary.main' };

    case 'POR VENCER':
      return { Icon: AccessTimeIcon, color: 'warning.main' };

    case 'VENCIDA':
      return { Icon: AlarmOffIcon, color: 'info.main' };

    case 'CREADA':
      return { Icon: PendingIcon, color: 'secondary.main' };

    default:
      return { Icon: PendingIcon, color: 'grey.500' };
  }
}
