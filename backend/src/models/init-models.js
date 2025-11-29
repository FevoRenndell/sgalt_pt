// models/init-models.js
import Region from './region.js';
import City from './city.js';
import Commune from './commune.js';
import Client from './client.js';
import QuotationRequest from './quotation_request.js';
import Role from './role.js';
import User from './users.js';
import Service from './service.js';
import Quotation from './quotation.js';
import QuotationItem from './quotation_item.js';

export function initModels(sequelize) {
    
  // Instanciar modelos
  const RegionModel = Region(sequelize);
  const CityModel = City(sequelize);
  const CommuneModel = Commune(sequelize);
  const ClientModel = Client(sequelize);
  const QuotationRequestModel = QuotationRequest(sequelize);
  const RoleModel = Role(sequelize);
  const UserModel = User(sequelize);
  const ServiceModel = Service(sequelize);
  const QuotationModel = Quotation(sequelize);
  const QuotationItemModel = QuotationItem(sequelize);

  // ----- RELACIONES GEOGRÁFICAS -----

  // Region 1 - N Cities
  RegionModel.hasMany(CityModel, {
    foreignKey: 'region_id',
    as: 'cities',
  });
  CityModel.belongsTo(RegionModel, {
    foreignKey: 'region_id',
    as: 'region',
  });

  // City 1 - N Communes
  CityModel.hasMany(CommuneModel, {
    foreignKey: 'city_id',
    as: 'communes',
  });
  CommuneModel.belongsTo(CityModel, {
    foreignKey: 'city_id',
    as: 'city',
  });

  // Region / City / Commune 1 - N QuotationRequest
  RegionModel.hasMany(QuotationRequestModel, {
    foreignKey: 'region_id',
    as: 'quotation_requests',
  });
  QuotationRequestModel.belongsTo(RegionModel, {
    foreignKey: 'region_id',
    as: 'region',
  });

  CityModel.hasMany(QuotationRequestModel, {
    foreignKey: 'city_id',
    as: 'quotation_requests',
  });
  QuotationRequestModel.belongsTo(CityModel, {
    foreignKey: 'city_id',
    as: 'city',
  });

  CommuneModel.hasMany(QuotationRequestModel, {
    foreignKey: 'commune_id',
    as: 'quotation_requests',
  });
  QuotationRequestModel.belongsTo(CommuneModel, {
    foreignKey: 'commune_id',
    as: 'commune',
  });

  // ----- CLIENTES & REQUESTS -----

  // Client 1 - N QuotationRequest
  ClientModel.hasMany(QuotationRequestModel, {
    foreignKey: 'client_id',
    as: 'quotation_requests',
  });
  QuotationRequestModel.belongsTo(ClientModel, {
    foreignKey: 'client_id',
    as: 'client',
  });

  // ----- ROLES & USERS -----

  // Role 1 - N Users
  RoleModel.hasMany(UserModel, {
    foreignKey: 'role_id',
    as: 'users',
  });
  UserModel.belongsTo(RoleModel, {
    foreignKey: 'role_id',
    as: 'role',
  });

  // ----- QUOTATIONS -----

  // QuotationRequest 1 - N Quotations
  QuotationRequestModel.hasMany(QuotationModel, {
    foreignKey: 'request_id',
    as: 'quotations',
  });
  QuotationModel.belongsTo(QuotationRequestModel, {
    foreignKey: 'request_id',
    as: 'request',
  });

  // (Opcional) User 1 - N Quotations (si decides guardar quién la emite)
  UserModel.hasMany(QuotationModel, {
    foreignKey: 'user_id',
    as: 'quotations',
  });
  QuotationModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user',
  });

  // ----- QUOTATION ITEMS & SERVICES -----

  // Quotation 1 - N QuotationItems
  QuotationModel.hasMany(QuotationItemModel, {
    foreignKey: 'quotation_id',
    as: 'items',
  });
  QuotationItemModel.belongsTo(QuotationModel, {
    foreignKey: 'quotation_id',
    as: 'quotation',
  });

  // Service 1 - N QuotationItems
  ServiceModel.hasMany(QuotationItemModel, {
    foreignKey: 'service_id',
    as: 'quotation_items',
  });
  QuotationItemModel.belongsTo(ServiceModel, {
    foreignKey: 'service_id',
    as: 'service',
  });

  return {
    Region: RegionModel,
    City: CityModel,
    Commune: CommuneModel,
    Client: ClientModel,
    QuotationRequest: QuotationRequestModel,
    Role: RoleModel,
    User: UserModel,
    Service: ServiceModel,
    Quotation: QuotationModel,
    QuotationItem: QuotationItemModel,
  };
}

export default initModels;
