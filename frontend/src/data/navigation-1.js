// CUSTOM ICON COMPONENT
import duotone from '../shared/icons/duotone';

export const navigations = [
  // --- LABEL PRINCIPAL ---
  {
    type: 'label',
    label: 'Administración interna',
    roles: [1, 3], // admin + cotizador
  },

  // --- ADMINISTRADOR: USUARIOS ---
  {
    name: 'Usuarios',
    icon: duotone.UserList,
    roles: [1], // solo admin
    children: [
      {
        name: 'Adm. Usuarios',
        path: '/users/list',
        roles: [1],
      },
    ],
  },

  // --- ADMINISTRADOR / COTIZADOR: COTIZACIONES ---
  {
    name: 'Cotizaciones',
    icon: duotone.Invoice,
    roles: [1, 3], // admin + cotizador
    children: [
      {
        name: 'Adm. Cotizaciones',
        path: '/quotation/list',
        roles: [1, 3],
      },
      {
        name: 'Solicitudes de Cotizaciones',
        path: '/quotation_request/list',
        roles: [1, 3],
      },
    ],
  },

  // --- ADMINISTRADOR / COTIZADOR: CLIENTES ---
  {
    name: 'Clientes',
    icon: duotone.UserProfile,
    roles: [1, 3], // admin + cotizador
    children: [
      {
        name: 'Adm. Clientes',
        path: '/clients/list',
        roles: [1, 3],
      },
    ],
  },

  // --- SECCIÓN PARA EL FLUJO DEL CLIENTE EXTERNO ---
  {
    type: 'label',
    label: 'Portal Cliente',
    roles: [1, 2, 3], // admin + cliente (si quieres agregas 3)
  },
  {
    name: 'Solicitud de cotización',
    icon: duotone.Inbox,
    path: '/public/solicitud-cotizacion',
    roles: [1, 2, 3], // admin + cliente
  },
];
