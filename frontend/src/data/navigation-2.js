// CUSTOM ICON COMPONENT
import duotone from '../shared/icons/duotone';

export const navigation = [
  // --- ADMINISTRACIÓN GENERAL (ADMINISTRADOR) ---
  {
    name: 'Administración',
    Icon: duotone.PersonChalkboard,
    children: [
      {
        name: 'Usuarios',
        path: '/admin/users',
      },
      {
        name: 'Cotizaciones',
        path: '/dashboard/admin/cotizaciones',
      },
      {
        name: 'Clientes',
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
        name: 'Adm. Cotizaciones',
        path: '/quotation/list',
      },
      {
        name: 'Solicitudes de Cotizaciones',
        path: '/quotation_request/list',
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
        path: '/public/solicitud-cotizacion',
      },
      {
        name: 'Estado de mi cotización',
        path: '/public//public/cotizacion/:id',
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
