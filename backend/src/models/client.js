import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'Client',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      company_rut: { type: DataTypes.STRING(20) },
      company_name: { type: DataTypes.STRING(255), allowNull: false },
      contact_name: { type: DataTypes.STRING(255) },
      contact_email: { type: DataTypes.STRING(255) },
      contact_phone: { type: DataTypes.STRING(50) },
      service_description: { type: DataTypes.TEXT },
      created_at: { type: DataTypes.DATE(6), allowNull: false },
      updated_at: { type: DataTypes.DATE(6), allowNull: false },
    },
    {
      tableName: 'clients',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
};
