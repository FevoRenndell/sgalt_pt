// routes/paths.js

 

export const paths = {
  root: '/dashboard/general_performance',

  login : '/login',

  // Usuarios
  users_list:   '/users/list',
  user_edit: (id) => `/users/${id}/edit`,
  users_create: '/users/create',
  users_roles:  '/users/roles',

  // Cotizaciones
  quotation_request_list: '/quotation_request/list',
  quotation_request_create: '/quotation_request/create',
  quotation_view: (id) => `/quotation_request/${id}/view`,
  quotation_list : '/quotation/list',
  quotation_create: '/quotation/create',
  quotation_create_from_request: (id) => `/quotation/${id}/quotation_create`,
  quotation_created: (id) => `/quotation/${id}/quotation_created`,

  clients_list: '/clients/list',
  client_create: '/clients/create',
  client_edit: (id) => `/clients/edit/${id}`,

  // Cuenta
  perfil: '/dashboard/profile',

};

export const public_paths = {
  solicitud: '/public/solicitud-cotizacion',
  estado: '/public//public/cotizacion/:id',
  quote_request_view: '/public/quote-request/view',
};
