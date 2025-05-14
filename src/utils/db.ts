const Sequelize = require('sequelize');
import QueryTypes from 'sequelize';
import config from '../configs';
import UserModel from '../models/user.model';
import UserReportModel from '../models/userReport.model';
import ProductModel from '../models/product.model';

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

User.hasMany(UserReport);
UserReport.belongsTo(User, {
  foreignKey: 'user_id'
});

const Models = {
  Sequelize,
  sequelize,
  QueryTypes,
  User,
  UserReport,
  Product,
};

const connection = { isConnected: false };

async function connect(): Promise<{
  Sequelize: any;
  sequelize: typeof Sequelize;
  QueryTypes: typeof QueryTypes;
  User: typeof UserModel.UserEntity;
  UserReport: typeof UserReportModel.UserReportEntity;
  Product: typeof ProductModel.ProductEntity;
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