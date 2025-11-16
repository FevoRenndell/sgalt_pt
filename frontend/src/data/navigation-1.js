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
        name: 'Panel de administración de usuarios',
        path: '/admin/users/list',
      },
      {
        name: 'Crear usuario',
        path: '/admin/users/crear',
      },
      {
        name: 'Editar usuario',
        path: '/admin/:id/users/editar',
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
        name: 'Panel de administración de cotizaciones',
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

  // --- ADMINISTRADOR: CLIENTES ---
  {
    name: 'Clientes',
    icon: duotone.UserProfile, // similar a perfil / clientes
    children: [
      {
        name: 'Panel de administración de clientes',
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

  // --- SECCIÓN PARA EL FLUJO DEL CLIENTE EXTERNO ---
  {
    type: 'label',
    label: 'Portal Cliente',
  },
  {
    name: 'Solicitud de cotización',
    icon: duotone.Inbox, // o un icono de formulario/correo
    path: '/cliente/solicitud-cotizacion',
  },
  {
    name: 'Estado de mi cotización',
    icon: duotone.DataTable,
    path: '/cliente/mis-cotizaciones',
  },

  // --- OTROS (SI QUIERES MANTENER SECCIONES GENERALES) ---
  {
    type: 'label',
    label: 'Cuenta',
  },
  {
    name: 'Mi perfil',
    icon: duotone.Accounts,
    path: '/dashboard/profile',
  },
];
