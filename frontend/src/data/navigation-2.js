// CUSTOM ICON COMPONENT
import duotone from '../shared/icons/duotone';

export const navigation = [
  // --- ADMINISTRACIÓN GENERAL (ADMINISTRADOR) ---
  {
    name: 'Administración',
    Icon: duotone.PersonChalkboard,
    children: [
      {
        name: 'Panel de usuarios',
        path: '/admin/users',
      },
      {
        name: 'Panel de cotizaciones',
        path: '/dashboard/admin/cotizaciones',
      },
      {
        name: 'Panel de clientes',
        path: '/dashboard/admin/clientes',
      },
    ],
  },

  // --- USUARIOS (ADMINISTRACIÓN DE USUARIOS) ---
  {
    name: 'Usuarios',
    Icon: duotone.UserList,
    children: [
      {
        name: 'Listado de usuarios',
        path: '/admin/users',
      },
      {
        name: 'Crear usuario',
        path: '/admin/users/crear',
      },
      {
        name: 'Roles y permisos',
        path: '/admin/users/roles',
      },
    ],
  },

  // --- COTIZACIONES (ADMINISTRADOR + COTIZADOR) ---
  {
    name: 'Cotizaciones',
    Icon: duotone.Invoice,
    children: [
      {
        name: 'Administrar cotizaciones',
        path: '/dashboard/cotizaciones',
      },
      {
        name: 'Crear cotización',
        path: '/dashboard/cotizaciones/crear',
      },
      {
        name: 'Cotizaciones en revisión',
        path: '/dashboard/cotizaciones/en-revision',
      },
      {
        name: 'Cotizaciones aceptadas',
        path: '/dashboard/cotizaciones/aceptadas',
      },
      {
        name: 'Cotizaciones rechazadas',
        path: '/dashboard/cotizaciones/rechazadas',
      },
    ],
  },

  // --- CLIENTES (ADMINISTRACIÓN DE CLIENTES) ---
  {
    name: 'Clientes',
    Icon: duotone.UserProfile,
    children: [
      {
        name: 'Administrar clientes',
        path: '/dashboard/clientes',
      },
      {
        name: 'Crear cliente',
        path: '/dashboard/clientes/crear',
      },
      {
        name: 'Historial de clientes',
        path: '/dashboard/clientes/historial',
      },
    ],
  },

  // --- PORTAL / FLUJO CLIENTE EXTERNO ---
  {
    name: 'Portal Cliente',
    Icon: duotone.Inbox,
    children: [
      {
        name: 'Solicitud de cotización',
        path: '/cliente/solicitud-cotizacion',
      },
      {
        name: 'Estado de mi cotización',
        path: '/cliente/mis-cotizaciones',
      },
    ],
  },

  // --- OPCIONES DE CUENTA GENERALES ---
  {
    name: 'Profile',
    Icon: duotone.UserProfile,
    path: '/dashboard/profile',
  },
  {
    name: 'Account',
    Icon: duotone.Accounts,
    path: '/dashboard/account',
  },
];
