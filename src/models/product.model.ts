import { Model, Sequelize, DataTypes } from 'sequelize';

class ProductEntity extends Model {
  declare productId: number;
  declare productName: string;
  declare category: 'iPhone' | 'MacBook' | 'iPad' | 'Apple Watch' | 'AirPods' | 'Accessories';
  declare description: string | null;
  declare price: number;
  declare discountPercent: number | null;
  declare stockQuantity: number;
  declare color: string | null;
  declare colorBackground: string | null;
  declare storage: string | null;
  declare sku: string;
  declare status: 'active' | 'inactive' | 'out_of_stock';
  declare flashSale: boolean;
  declare flashSalePercent: number | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

function Product(sequelize: Sequelize) {
  ProductEntity.init(
    {
      productId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'product_id',
      },
      productName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'product_name',
      },
      category: {
        type: DataTypes.ENUM('iPhone', 'MacBook', 'iPad', 'Apple Watch', 'AirPods', 'Accessories'),
        allowNull: false,
        field: 'category',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'description',
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'price',
      },
      discountPercent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        field: 'discount_percent',
      },
      stockQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'stock_quantity',
      },
      color: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'color',
      },
      colorBackground: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'color_background',
      },
      storage: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'storage',
      },
      sku: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'sku',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'out_of_stock'),
        allowNull: false,
        defaultValue: 'active',
        field: 'status',
      },
      flashSale: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'flash_sale',
      },
      flashSalePercent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        field: 'flash_sale_percent',
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
      modelName: 'Product',
      tableName: 'products',
      timestamps: false,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return ProductEntity;
}

export default {
  Product,
  ProductEntity,
};