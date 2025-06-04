const Sequelize = require('sequelize');
import QueryTypes from 'sequelize';
import config from '../configs';
import UserModel from '../models/user.model';
import UserReportModel from '../models/userReport.model';
import ProductModel from '../models/product.model';
import ProductImageModel from '../models/productImage.model';
import cartItemModel from '../models/cartItem.model';

// Start debug sequelize
console.log('Start create sequelize');
const sequelize = new Sequelize( config.DB_NAME, null, null, {
  dialect: 'mysql',
  host: config.DB_HOST,
  port: config.DB_PORT,
  dialectOptions: { 
    multipleStatements: true,
  },
  pool: {
    max: 10,
    min: 0,
    idle: 5,
    acquire: 3000,
    evict: 900000,
  },
  define: {
    timestamps: false,
  }
});
console.log('End create sequelize');
// End debug sequelize

sequelize.beforeConnect(async(db: any) => {
  db.username = config.DB_USERNAME;
  db.password = config.DB_PASSWORD;
});

const User = UserModel.User(sequelize);
const UserReport = UserReportModel.UserReport(sequelize);
const Product = ProductModel.Product(sequelize);
const ProductImage = ProductImageModel.ProductImage(sequelize);
const CartItem = cartItemModel.CartItem(sequelize);

User.hasMany(UserReport, {
  foreignKey: 'userId',
  as: 'reports'
});
UserReport.belongsTo(User, {
  foreignKey: 'userId'
});
Product.hasMany(ProductImage, {
  foreignKey: 'sku',
  sourceKey: 'sku',
  as: 'images'
});
ProductImage.belongsTo(Product, {
  foreignKey: 'sku',
  targetKey: 'sku',
});
CartItem.hasMany(Product, {
  foreignKey: 'sku',
  as: 'products'
});
CartItem.belongsTo(User, {
  foreignKey: 'userId'
});

const Models = {
  Sequelize,
  sequelize,
  QueryTypes,
  User,
  UserReport,
  Product,
  ProductImage,
  CartItem,
};

const connection = { isConnected: false };

async function connect(): Promise<{
  Sequelize: any;
  sequelize: typeof Sequelize;
  QueryTypes: typeof QueryTypes;
  User: typeof UserModel.UserEntity;
  UserReport: typeof UserReportModel.UserReportEntity;
  Product: typeof ProductModel.ProductEntity;
  ProductImage: typeof ProductImageModel.ProductImageEntity;
  CartItem: typeof cartItemModel.CartItemEntity;
}> {
  if (connection.isConnected) {
    return Models;
  }
  
  // await sequelize.sync(); // Sync all models that aren't already in the database

  // await sequelize.sync({force: true}); // this will drop the table first and re-create it afterwards

  await sequelize.authenticate();
  connection.isConnected = true;
  return Models;
}

async function query(q: any, options: any) {
  return await sequelize.query(q, options);
}

export default {
  connect,
  query,
};