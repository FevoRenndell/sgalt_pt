// CUSTOM ICON COMPONENT
import duotone from '../shared/icons/duotone';

export const navigations = [
  // --- LABEL PRINCIPAL ---
  {
    type: 'label',
    label: 'Administración interna',
  },

  // --- ADMINISTRADOR: USUARIOS ---
  {
    name: 'Usuarios',
    icon: duotone.UserList, // o el icono que prefieras
    children: [
      {
        name: 'Adm. Usuarios',
        path: '/admin/users/list',
      },
      {
        name: 'Roles y permisos',
        path: '/admin/users/roles',
      },
    ],
  },

  // --- ADMINISTRADOR / COTIZADOR: COTIZACIONES ---
  {
    name: 'Cotizaciones',
    icon: duotone.Invoice, // reutilizo el de Invoice que ya traía el template
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

  // --- ADMINISTRADOR: CLIENTES ---
  {
    name: 'Clientes',
    icon: duotone.UserProfile, // similar a perfil / clientes
    children: [
      {
        name: 'Adm. Clientes',
        path: '/clients/list',
      },
    ],
  },

  // --- SECCIÓN PARA EL FLUJO DEL CLIENTE EXTERNO ---
  {
    type: 'label',
    label: 'Portal Cliente',
  },
  {
    name: 'Solicitud de cotización',
    icon: duotone.Inbox, // o un icono de formulario/correo
    path: '/public/solicitud-cotizacion',
  },
 

 
];
