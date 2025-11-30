import duotone from '../shared/icons/duotone';

export const navigation = [
  // --- ADMINISTRACIÓN GENERAL (ADMIN) ---
  {
    name: 'Administración',
    Icon: duotone.PersonChalkboard,
    roles: [1], // SOLO ADMIN
    children: [
      { name: 'Usuarios', path: '/admin/users', roles: [1] },
      { name: 'Cotizaciones', path: '/dashboard/admin/cotizaciones', roles: [1] },
      { name: 'Clientes', path: '/dashboard/admin/clientes', roles: [1] },
    ],
  },

  // --- USUARIOS (ADMIN) ---
  {
    name: 'Usuarios',
    Icon: duotone.UserList,
    roles: [1], // SOLO ADMIN
    children: [
      { name: 'Listado de usuarios', path: '/admin/users', roles: [1] },
      { name: 'Roles y permisos', path: '/admin/users/roles', roles: [1] },
    ],
  },

  // --- COTIZACIONES (ADMIN + COTIZADOR) ---
  {
    name: 'Cotizaciones',
    Icon: duotone.Invoice,
    roles: [1, 3], // Admin + Cotizador
    children: [
      { name: 'Adm. Cotizaciones', path: '/quotation/list', roles: [1, 3] },
      { name: 'Solicitudes de Cotizaciones', path: '/quotation_request/list', roles: [1, 3] },
    ],
  },

  // --- CLIENTES (ADMIN + COTIZADOR) ---
  {
    name: 'Clientes',
    Icon: duotone.UserProfile,
    roles: [1, 3], // Admin + Cotizador
    children: [
      { name: 'Administrar clientes', path: '/clients/list', roles: [1, 3] },
    ],
  },

  // --- PORTAL CLIENTE (ADMIN + CLIENTE) ---
  {
    name: 'Portal Cliente',
    Icon: duotone.Inbox,
    roles: [1, 2, 3], // Admin + Cliente (agrega 3 si quieres)
    children: [
      {
        name: 'Solicitud de cotización',
        path: '/public/solicitud-cotizacion',
        roles: [1, 2 , 3],
      },
    ],
  },
];
