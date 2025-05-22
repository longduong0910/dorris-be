import { Model, Sequelize, DataTypes } from 'sequelize';

class ProductImageEntity extends Model {
  declare id: number;
  declare productId: number;
  declare imageUrl: string;
  declare imageDefault: boolean;
  declare createdAt: Date;
}

function ProductImage(sequelize: Sequelize) {
  ProductImageEntity.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id',
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'product_id',
      },
      imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'image_url',
      },
      imageDefault: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'image_default',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'created_at',
      },
    },
    {
      sequelize,
      modelName: 'ProductImage',
      tableName: 'product_images',
      timestamps: false,
      createdAt: 'created_at',
    }
  );

  return ProductImageEntity;
}

export default {
  ProductImage,
  ProductImageEntity,
};