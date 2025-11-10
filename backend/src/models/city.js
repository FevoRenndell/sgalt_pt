import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'City',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      region_id: { type: DataTypes.INTEGER, allowNull: false },
      created_at: { type: DataTypes.DATE(6), allowNull: false },
      updated_at: { type: DataTypes.DATE(6), allowNull: false },
    },
    {
      tableName: 'cities',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
};
