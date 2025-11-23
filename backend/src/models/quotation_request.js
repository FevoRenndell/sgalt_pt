import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'QuotationRequest',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      client_id: { type: DataTypes.INTEGER, allowNull: true },
      requester_full_name: { type: DataTypes.STRING(255), allowNull: false },
      requester_email: { type: DataTypes.STRING(255), allowNull: false },
      requester_phone: { type: DataTypes.STRING(20) },
      service_description: { type: DataTypes.TEXT },
      obra_direccion: { type: DataTypes.STRING(255) },
      commune_id: { type: DataTypes.INTEGER },
      city_id: { type: DataTypes.INTEGER },
      region_id: { type: DataTypes.INTEGER },
      competence_capacity: { type: DataTypes.STRING(2) },
      need_subcontracting_services: { type: DataTypes.STRING(2) },
      independence_issue: { type: DataTypes.STRING(2) },
      review_notes: { type: DataTypes.TEXT },
      status: { type: DataTypes.STRING(20), defaultValue: 'pending' },
      reviewed_by: { type: DataTypes.INTEGER },
      reviewed_at: { type: DataTypes.DATE(6) },
      review_notes: { type: DataTypes.TEXT },
      received_at: { type: DataTypes.DATE(6) },
      created_at: { type: DataTypes.DATE(6), allowNull: false },
      updated_at: { type: DataTypes.DATE(6), allowNull: false },
    },
    {
      tableName: 'quotation_request',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
};
