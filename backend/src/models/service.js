import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'Service',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(150), allowNull: false },
      area: { type: DataTypes.STRING(150) },
      norma: { type: DataTypes.STRING(150) },
      description: { type: DataTypes.TEXT },
      base_price: { type: DataTypes.DECIMAL(12, 2) },
      created_at: { type: DataTypes.DATE(6), allowNull: false },
      updated_at: { type: DataTypes.DATE(6), allowNull: false },
    },
    {
      tableName: 'services',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
};
