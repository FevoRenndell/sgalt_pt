// src/layouts/DashboardLayout.jsx
import { Outlet, NavLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { navItems } from './navConfig';
import { useLogoutMutation } from '@/features/auth/api/authApi';

const drawerWidth = 220;

export default function DashboardLayout() {
  const user = useSelector((state) => state.auth.user);
  const [logoutTrigger] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutTrigger().unwrap();
      // onQueryStarted del logout ya limpia el estado + localStorage
    } catch (err) {
      console.error('Error al cerrar sesión', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: '1px solid rgba(148,163,253,0.08)',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            SG Panel
          </Typography>
        </Box>

        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              sx={{
                '&.active': {
                  bgcolor: 'primary.main',
                  color: 'grey.900',
                  '& .MuiListItemIcon-root': { color: 'grey.900' },
                },
              }}
            >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                    {item.icon && <item.icon />}   
                    </ListItemIcon>

              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Topbar + contenido */}
      <Box sx={{ flexGrow: 1, ml: `${drawerWidth}px` }}>
        <AppBar
          position="fixed"
          sx={{
            ml: `${drawerWidth}px`,
            width: `calc(100% - ${drawerWidth}px)`,
            bgcolor: 'background.paper',
            borderBottom: '1px solid rgba(148,163,253,0.08)',
            boxShadow: 'none',
          }}
        >
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2">Panel</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {user?.name || user?.email || 'Usuario'}
              </Typography>
              <Typography
                variant="caption"
                sx={{ cursor: 'pointer', color: 'primary.main' }}
                onClick={handleLogout}
              >
                Salir
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ pt: 8, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
