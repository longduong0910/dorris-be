import { Model, Sequelize, DataTypes } from 'sequelize';

class OrderItemEntity extends Model {
  declare id: number;
  declare orderId: number;
  declare productId: number;
  declare quantity: number;
  declare price: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

function OrderItem(sequelize: Sequelize) {
  OrderItemEntity.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id',
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'order_id',
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'product_id',
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'quantity',
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'price',
      },
    },
    {
      sequelize,
      modelName: 'OrderItem',
      tableName: 'order_items',
      timestamps: false,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return OrderItemEntity;
}

export default {
  OrderItem,
  OrderItemEntity,
};