import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'Notification',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      message_type_id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },

      entity_type_id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },

      entity_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      recipient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      status_id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1, // 1 = UNREAD
      },

      custom_title: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },

      custom_message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      created_at: {
        type: DataTypes.DATE(6),
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },

      read_at: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },

      payload: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: 'notifications',
      timestamps: false, // manejamos created_at manualmente, no hay updated_at
    },
  );
};
