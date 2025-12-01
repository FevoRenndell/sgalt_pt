import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'NotificationStatus',
    {
      id: {
        type: DataTypes.SMALLINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: false,  
      },
      code: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      tableName: 'notification_status',
      timestamps: false,
    },
  );
};
