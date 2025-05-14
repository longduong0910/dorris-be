import db from '../utils/db';

export const createProduct = async (productjson: any) => {
  const { Product } = await db.connect();
  if (!productjson.productName || !productjson.category || !productjson.price || !productjson.stockQuantity || !productjson.sku)  {
    return {
      status: 404,
      message: 'Invalid product data!',
    };
  }
  const product = await Product.findOne({
    where: {
      sku: productjson.sku,
    }
  });
  if (product) {
    return {
      status: 404,
      message: 'Product with SKU already exists!',
    };
  }
  await Product.create({
    productName: productjson.productName,
    category: productjson.category,
    description: productjson.description,
    price: productjson.price,
    stockQuantity: productjson.stockQuantity,
    color: productjson.color,
    storage: productjson.storage,
    sku: productjson.sku,
    imageUrl: productjson.imageUrl,
    status: productjson.status,
  });
  return {
    status: 201,
    message: 'Product created successfully!',
  };
}

export const getProductByCategory = async (categoryId: string) => {
  const { Product } = await db.connect();
  const products = await Product.findAll({
    where: {
      category: categoryId
    }
  });
  return products;
}

