// routes/paths.js

export const paths = {
  root: '/dashboard',

  login : '/login',

  // Usuarios
  users_list:   '/admin/users/list',
  user_edit: (id) => `/admin/users/${id}/edit`,
  users_create: '/admin/users/create',
  users_roles:  '/admin/users/roles',

  // Cotizaciones
  cotizaciones: '/dashboard/cotizaciones',
  cotizacionesCrear: '/dashboard/cotizaciones/crear',
  cotizacionesRevision: '/dashboard/cotizaciones/en-revision',
  cotizacionesAceptadas: '/dashboard/cotizaciones/aceptadas',
  cotizacionesRechazadas: '/dashboard/cotizaciones/rechazadas',

  // Clientes
  clientes: '/dashboard/clientes',
  clientesCrear: '/dashboard/clientes/crear',
  clientesHistorial: '/dashboard/clientes/historial',

  // Cuenta
  perfil: '/dashboard/profile',

};

export const public_paths = {
  solicitud: '/public/solicitud-cotizacion',
  estado: '/public/mis-cotizaciones',
  quote_request_view: '/public/quote-request/view',
};
