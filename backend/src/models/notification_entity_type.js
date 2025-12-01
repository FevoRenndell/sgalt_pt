import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'NotificationEntityType',
    {
      id: {
        type: DataTypes.SMALLINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: false, // catálogo
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      table_name: {
        type: DataTypes.STRING(100),
        allowNull: false, // ej: 'quotation_request', 'quotations'
      },
    },
    {
      tableName: 'notification_entity_type',
      timestamps: false,
    },
  );
};
