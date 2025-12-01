import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'NotificationMessageType',
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
      default_title: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      default_message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      icon_name: {
        type: DataTypes.STRING(50),
        allowNull: true, // ej: 'PersonAddAlt1'
      },
      chip_color: {
        type: DataTypes.STRING(30),
        allowNull: true, // ej: 'primary', 'success'
      },
    },
    {
      tableName: 'notification_message_type',
      timestamps: false,
    },
  );
};
