import { Model, Sequelize, DataTypes } from 'sequelize';

class UserReportEntity extends Model {
  declare id: number;
  declare userId: number;
  declare productId: number;
  declare rating: number;
  declare comment: string | null;
  declare reason: string | null;
  declare status: 'pending' | 'approved' | 'rejected';
  declare createdAt: Date;
  declare updatedAt: Date;
}

function UserReport(sequelize: Sequelize) {
  UserReportEntity.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'product_id',
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
        field: 'rating',
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'comment',
      },
      reason: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'reason',
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
        field: 'status',
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
      modelName: 'UserReport',
      tableName: 'user_reports',
      timestamps: false,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return UserReportEntity;
}

export default {
  UserReport,
  UserReportEntity,
};
