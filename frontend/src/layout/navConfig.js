import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

export const navItems = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: DashboardIcon, 
  },
  {
    path: '/clients',
    label: 'Clientes',
    icon: PeopleIcon,
  },
{
    path: '/users',
    label: 'Usuarios',
    icon: PeopleOutlineIcon,
  },
];
