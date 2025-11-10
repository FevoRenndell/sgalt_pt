import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'QuotationItem',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      quotation_id: { type: DataTypes.INTEGER, allowNull: false },
      service_id: { type: DataTypes.INTEGER, allowNull: false },
      description: { type: DataTypes.TEXT },
      quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
      unit: { type: DataTypes.STRING(50) },
      unit_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      line_discount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
      subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      created_at: { type: DataTypes.DATE(6), allowNull: false },
      updated_at: { type: DataTypes.DATE(6), allowNull: false },
    },
    {
      tableName: 'quotation_items',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
};
