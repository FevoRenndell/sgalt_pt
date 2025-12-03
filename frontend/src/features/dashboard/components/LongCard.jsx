import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { getNotificationIcon } from '../../../shared/utils/notificationIcon';

// ========================= STYLES =========================


const list = [

    { id: 2, status: 'ENVIADA', count: 30 },
    { id: 3, status: 'POR VENCER', count: 10 },
    { id: 4, status: 'ACEPTADA', count: 20 },
    { id: 5, status: 'RECHAZADA', count: 12 },
    { id: 6, status: 'VENCIDA', count: 8 },
];

const StyledStack = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    alignItems: 'flex-start',
    '& hr': {
      display: 'none',
    },
  },
}));

const ListItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

const LisItemIcon = styled('div', {
  shouldForwardProp: (prop) => prop !== 'type',
})(({ theme, type }) => ({
  width: 40,
  height: 40,
  flexShrink: 0,
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,

  ...(type && {
    backgroundColor: theme.palette?.[type.split('.')[0]]?.[type.split('.')[1]] || theme.palette.primary.main,
  }),
}));

// ========================= COMPONENT =========================

export default function LongCard({ data }) {
  console.log(data)
  return (
    <Card className="p-3 h-full">
      <StyledStack
        spacing={1}
        height="100%"
        alignItems="center"
        justifyContent="space-between"
        direction={{ sm: 'row', xs: 'column' }}
        divider={<Divider flexItem orientation="vertical" />}
      >
        {list.map(({ id, status = '', count }) => {
          const { Icon, color } = getNotificationIcon(status);

          const paletteKey = color.includes('.') ? color : `${color}.main`;

          return (
            <ListItem key={id}>
              <LisItemIcon type={paletteKey}>
                <Icon fontSize="small" color="inherit" />
              </LisItemIcon>

              <div>
                <Typography variant="body2" noWrap fontWeight={500}>
                  {status}
                </Typography>

                <Typography
                  variant="h6"
                  fontSize={20}
                  fontWeight={600}
                  lineHeight={1.4}
                  color={paletteKey}
                >
                  {data[status] || 0}
                </Typography>
              </div>
            </ListItem>
          );
        })}
      </StyledStack>
    </Card>
  );
}
