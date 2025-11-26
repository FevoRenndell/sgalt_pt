import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'Quotation',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      quote_number: { type: DataTypes.BIGINT, unique: true, allowNull: true },
      request_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      issue_date: { type: DataTypes.DATEONLY, allowNull: true },
      request_summary: { type: DataTypes.TEXT, allowNull: true },
      discount : { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
      status: { type: DataTypes.STRING(20), defaultValue  : 'CREADA' },
      subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      total: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      pdf_url: { type: DataTypes.TEXT, allowNull: true },
      created_at: { type: DataTypes.DATE(6), allowNull: false },
      updated_at: { type: DataTypes.DATE(6), allowNull: false },
      soft_delete: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      tableName: 'quotations',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
};
