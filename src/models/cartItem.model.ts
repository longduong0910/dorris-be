import e from 'express';
import { Model, Sequelize, DataTypes } from 'sequelize';

class CartItemEntity extends Model {
  declare id: number;
  declare userId: number;
  declare sessionId: string;
  declare productId: number;
  declare quantity: number;
  declare createdAt: Date;
  declare updatedAt: Date;  
}

function CartItem(sequelize: Sequelize) {
  CartItemEntity.init(
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
      sessionId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'session_id',
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
    },
    {
      sequelize,
      modelName: 'CartItem',
      tableName: 'cart_items',
      timestamps: false,
      createdAt: 'created_at',  
      updatedAt: 'updated_at',
    }
  );

  return CartItemEntity;
}

export default {
  CartItem,
  CartItemEntity,
}