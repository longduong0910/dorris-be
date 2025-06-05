import { Model, Sequelize, DataTypes } from 'sequelize';

class VoucherEntity extends Model {
  declare id: number;
  declare code: string;
  declare description: string;
  declare voucherType: 'shipping' | 'product';
  declare discountType: 'percentage' | 'fixed';
  declare discountValue: number;
  declare minOrderValue: number;
  declare maxDiscountValue: number;
  declare quantity: number;
  declare used: number;
  declare startDate: Date;
  declare endDate: Date;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

function Voucher(sequelize: Sequelize) {
  VoucherEntity.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id',
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'code',
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'description',
      },
      voucherType: {
        type: DataTypes.ENUM('shipping', 'product'),
        allowNull: false,
        field: 'voucher_type',
      },
      discountType: {
        type: DataTypes.ENUM('percentage', 'fixed'),
        allowNull: false,
        field: 'discount_type',
      },
      discountValue: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'discount_value',
      },
      minOrderValue: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'min_order_value',
      },
      maxDiscountValue: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: 'max_discount_value',
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'quantity',
      },
      used: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'used',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'start_date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'end_date',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      modelName: 'Voucher',
      tableName: 'vouchers',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );

  return VoucherEntity;
}

export default {
  Voucher,
  VoucherEntity,
};