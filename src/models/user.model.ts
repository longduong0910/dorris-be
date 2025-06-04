import { Model, Sequelize, DataTypes } from 'sequelize';

class UserEntity extends Model {
  declare userId: number;
  declare username: string;
  declare email: string;
  declare password: string;
  declare fullName: string;
  declare phoneNumber: string;
  declare address: string;
  declare role: 'admin' | 'user';
  declare ssoProvider: 'local' | 'google' | 'facebook';
  declare ssoId: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

function User(sequelize: Sequelize) {
  UserEntity.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'user_id',
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'username',
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        field: 'email',
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password',
      },
      fullName: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'full_name',
      },
      phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'phone_number',
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'address',
      },
      role: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user',
        field: 'role',
      },
      ssoProvider: {
        type: DataTypes.ENUM('local', 'google', 'facebook'),
        allowNull: false,
        defaultValue: 'local',
        field: 'sso_provider',
      },
      ssoId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'sso_id',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'updated_at',
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return UserEntity;
}

export default {
  User,
  UserEntity,
}