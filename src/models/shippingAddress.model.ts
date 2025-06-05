import { Model, Sequelize, DataTypes } from 'sequelize';

class ShippingAddressEntity extends Model {
  declare id: number;
  declare userId: number;
  declare fullName: string;
  declare phoneNumber: string;
  declare shippingAddress: string;
  declare note: string | null;
  declare isDefault: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

function ShippingAddress(sequelize: Sequelize) {
  ShippingAddressEntity.init(
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
      fullName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'full_name',
      },
      phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'phone_number',
      },
      shippingAddress: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'shipping_address',
      },
      note: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'note',
      },
      isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_default',  
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      modelName: 'ShippingAddress',
      tableName: 'shipping_addresses',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return ShippingAddressEntity;
}

export default {
  ShippingAddress,
  ShippingAddressEntity,
};