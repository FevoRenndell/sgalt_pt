import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'Quotation',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      quote_number: { type: DataTypes.BIGINT, unique: true, allowNull: false },
      request_id: { type: DataTypes.INTEGER, allowNull: false },
      request_summary: { type: DataTypes.TEXT },
      issue_date: { type: DataTypes.DATEONLY, allowNull: false },
      status: { type: DataTypes.STRING(20), allowNull: false },
      subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      tax_rate: { type: DataTypes.DECIMAL(5, 4), allowNull: false },
      tax_amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      total: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      pdf_url: { type: DataTypes.TEXT },
      created_at: { type: DataTypes.DATE(6), allowNull: false },
      updated_at: { type: DataTypes.DATE(6), allowNull: false },
    },
    {
      tableName: 'quotations',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
};
