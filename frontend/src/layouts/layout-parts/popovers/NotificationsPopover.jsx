import { useCallback, useEffect, useState } from 'react';
// MUI
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
// CUSTOM COMPONENTS
import PopoverLayout from './_PopoverLayout';
// ICONO
import NotificationsIcon from '../../../shared/icons/NotificationsIcon';
// API
import {
  useFetchNotificationPopoverQuery,
  useMarkNotificationAsReadMutation,
} from '../../../app/api/notificationApi';
import { useAuth } from '../../../shared/hooks/useAuth';
import { getNotificationIcon } from '../../../shared/utils/notificationIcon';
import { getTimeAgo } from '../../../shared/utils/getTimeAgo';
import { paths } from '../../../routes/paths';
import { useNavigate } from 'react-router-dom';

// =======================
// STYLES
// =======================
const StyledTab = styled(Tab)({
  flex: 1,
  marginLeft: 0,
  marginRight: 0,
});

const ListItemWrapper = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isNew',
})(({ theme, isNew }) => ({
  padding: '1rem',
  gap: '1rem',
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  cursor: 'pointer',
  alignItems: 'flex-start',
  backgroundColor: isNew ? theme.palette.action.hover : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '.iconBox': {
    width: 42,
    height: 42,
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.grey[800],
    marginTop: 2,
  },
}));

const QUOTATION_ENTITY_TYPE_ID = 2;
const UNREAD_STATUS_ID = 1;
const READ_STATUS_ID = 2;

export default function NotificationsPopover() {

  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [tabValue, setTabValue] = useState('1');

  const { user } = useAuth();

  const { data } = useFetchNotificationPopoverQuery(user.id, {
    pollingInterval: 3_000,
  });

  const [markAsRead] = useMarkNotificationAsReadMutation();

  useEffect(() => {
    if (data) {
      // ordenar de más nueva a más antigua por created_at
      const sorted = [...data].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setNotifications(sorted);
    }
  }, [data]);

  const handleTabChange = useCallback((_, value) => {
    setTabValue(value);
  }, []);

  // Solo cotizaciones
  const quotationNotifications = notifications.filter(
    (msg) => msg.entity_type_id === QUOTATION_ENTITY_TYPE_ID
  );

  const unreadNotifications = quotationNotifications.filter(
    (msg) => msg.status_id === UNREAD_STATUS_ID
  );
  const readNotifications = quotationNotifications.filter(
    (msg) => msg.status_id === READ_STATUS_ID
  );

  const unreadCount = unreadNotifications.length;
  const readCount = readNotifications.length;

  const handleViewNotification = async (notification) => {
    try {
      const result = await markAsRead(notification.id).unwrap();
 
      if (result) {
        const redirects = {
          QUOTATION_REQUEST: paths.quotation_created(result.payload.quotation_id),
          quotations: paths.quotation_created(result.payload.quotation_id),
        }

        console.log(redirects[result.entityType.table_name])

         navigate(redirects[result.entityType.table_name])
      }
     
    } catch (err) {
      console.error('Error al marcar como leída', err);
    }
  };

  const handleRedirect = (notification) => {
    const redirects = {
      QUOTATION_REQUEST: paths.quotation_created(notification.payload.quotation_id),
      quotations: paths.quotation_created(notification.payload.quotation_id),
    }

    navigate(redirects[notification.entityType.table_name])
  }

  const RENDER_CONTENT = () => (
    <TabContext value={tabValue}>
      <TabList onChange={handleTabChange}>
        <StyledTab value="1" label={`No leídos (${unreadCount})`} />
        <StyledTab value="2" label={`Leídos (${readCount})`} />
      </TabList>

      <TabPanel value="1" sx={{ p: 0 }}>
        {unreadNotifications.length === 0 ? (
          <Typography
            variant="body2"
            fontWeight={500}
            textAlign="center"
            sx={{ p: 2 }}
          >
            no tienes notificaciones no leídas
          </Typography>
        ) : (
          unreadNotifications.map((msg) => (
            <ListItem
              key={msg.id}
              statusId={msg.status_id}
              name={msg.custom_title}
              message={msg.custom_message}
              status={msg.payload?.status}
              createdAt={msg.created_at}
              onView={() => handleViewNotification(msg)}
            />
          ))
        )}
      </TabPanel>

      <TabPanel value="2" sx={{ p: 0 }}>
        {readNotifications.length === 0 ? (
          <Typography
            variant="body2"
            fontWeight={500}
            textAlign="center"
            sx={{ p: 2 }}
          >
            no tienes notificaciones leídas
          </Typography>
        ) : (
          readNotifications.map((msg) => (
            <ListItem
              key={msg.id}
              statusId={msg.status_id}
              name={msg.custom_title}
              message={msg.custom_message}
              status={msg.payload?.status}
              createdAt={msg.created_at}
              onView={() => handleRedirect(msg)}
            />
          ))
        )}
      </TabPanel>
    </TabContext>
  );

  const SELECT_BUTTON = (
    <Badge color="error" badgeContent={unreadCount}>
      <NotificationsIcon sx={{ color: 'grey.400' }} />
    </Badge>
  );

  return (
    <PopoverLayout
      title="Notificaciones"
      renderContent={RENDER_CONTENT}
      selectButton={SELECT_BUTTON}
    />
  );
}

// ==============================================================

function ListItem({ name, message, statusId, status, createdAt, onView }) {
  const isNew = statusId === UNREAD_STATUS_ID;
  const { Icon, color } = getNotificationIcon(status);
  const timeAgo = getTimeAgo(createdAt);

  return (
    <ListItemWrapper isNew={isNew} onClick={onView}>
      <div className="iconBox">
        <Icon sx={{ color, fontSize: 24 }} />
      </div>

      <div style={{ flex: 1 }}>
        <Typography variant="body2" fontWeight={500}>
          {name}
        </Typography>

        <Typography
          variant="body2"
          fontSize={12}
          color="text.secondary"
          sx={{ whiteSpace: 'normal', wordBreak: 'break-word', mb: 0.5 }}
        >
          {message}
        </Typography>

        {timeAgo && (
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ fontSize: 11 }}
          >
            {timeAgo}
          </Typography>
        )}
      </div>
    </ListItemWrapper>
  );
}
