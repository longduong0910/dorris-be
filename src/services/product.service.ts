import db from '../utils/db';
import cloudinary from '../configs/cloudinary';

function extractPublicId(imageUrl: string): string | null {
  try {
    const url = new URL(imageUrl);
    const parts = url.pathname.split('/'); // /image/upload/v12345678/dorris/products/1_0_xxx.jpg
    const uploadIndex = parts.indexOf('upload');
    const publicIdParts = parts.slice(uploadIndex + 2); // bỏ "upload" và "v12345678"
    const filename = publicIdParts.pop()?.split('.')[0]; // remove .jpg or .png
    const folderPath = publicIdParts.join('/');
    return filename ? `${folderPath}/${filename}` : null;
  } catch (error) {
    console.error('Error extracting publicId:', error);
    return null;
  }
}

export const getProductBySKU = async (sku: string) => {
  const { Product, ProductImage } = await db.connect();
  // Tìm sản phẩm theo SKU
  const product = await Product.findOne({
    where: {
      sku: sku
    },
    include: [
      {
        model: ProductImage,
        as: 'images',
        attributes: ['imageUrl'], // chỉ lấy trường imageUrl thôi
      },
    ],
  });
  if (!product) {
    return {
      status: 404,
      message: 'Product not found!',
    };
  }
  return {
    status: 200,
    data: product,
  };
};

export const getProductsByName = async (productName: string) => {
  const { Product, ProductImage } = await db.connect();
  const product = await Product.findAll({
    where: {
      productName: productName,
    },
    include: [
      {
        model: ProductImage,
        as: 'images',
        attributes: ['imageUrl'], // chỉ lấy trường imageUrl thôi
      },
    ],
  });
  if (!product) {
    return {
      status: 404,
      message: 'Product not found!',
    };
  }
  return {
    status: 200,
    data: product,
  };
}

export const getProductsByCategory = async (category: string) => {
  const { Product, ProductImage } = await db.connect();
  const products = await Product.findAll({
    where: {
      category: category
    },
    include: [
      {
        model: ProductImage,
        as: 'images',
        attributes: ['imageUrl'], // chỉ lấy trường imageUrl
        where: { imageDefault: 1 },
        required: false,
      },
    ],
  });
  if (!products || products.length === 0) {
    return {
      status: 404,
      message: 'No products found in this category!',
    };
  }
  // Lọc trùng theo tên sản phẩm, chỉ giữ sản phẩm đầu tiên cho mỗi tên
  const uniqueProductsMap = new Map();
  for (const product of products) {
    if (!uniqueProductsMap.has(product.productName)) {
      uniqueProductsMap.set(product.productName, product);
    }
  }
  const uniqueProducts = Array.from(uniqueProductsMap.values());
  return {
    status: 200,
    data: uniqueProducts,
  };
}

export const getAllProducts = async () => {
  const { Product, ProductImage } = await db.connect();
  const products = await Product.findAll({
    include: [
      {
        model: ProductImage,
        as: 'images',
        attributes: ['imageUrl'], // chỉ lấy trường imageUrl
        where: { imageDefault: 1 },
        required: false,
      },
    ],
  });
  if (!products || products.length === 0) {
    return {
      status: 404,
      message: 'No products found!',
    };
  }
  // Lọc trùng theo tên sản phẩm, chỉ giữ sản phẩm đầu tiên cho mỗi tên
  const uniqueProductsMap = new Map();
  for (const product of products) {
    if (!uniqueProductsMap.has(product.productName)) {
      uniqueProductsMap.set(product.productName, product);
    }
  }
  const uniqueProducts = Array.from(uniqueProductsMap.values());
  return {
    status: 200,
    data: uniqueProducts,
  };
};

export const createProduct = async (productjson: any) => {
  const { Product, ProductImage } = await db.connect();
  // Kiểm tra dữ liệu đầu vào
  if (
    !productjson.productName ||
    !productjson.category ||
    !productjson.price ||
    !productjson.stockQuantity || 
    !productjson.color ||
    !productjson.colorBackground ||
    !productjson.storage ||
    !productjson.sku
  ) {
    return {
      status: 400,
      message: 'Invalid product data!',
    };
  }
  // Kiểm tra SKU đã tồn tại
  const existingProduct = await Product.findOne({
    where: {
      sku: productjson.sku,
    },
  });
  if (existingProduct) {
    return {
      status: 409,
      message: 'Product with SKU already exists!',
    };
  }
  // Tạo sản phẩm mới
  const newProduct = await Product.create({
    productName: productjson.productName,
    category: productjson.category,
    description: productjson.description,
    price: productjson.price,
    stockQuantity: productjson.stockQuantity,
    color: productjson.color,
    colorBackground: productjson.colorBackground,
    storage: productjson.storage,
    sku: productjson.sku,
    status: productjson.status || 'active',
  });
  // Upload ảnh lên Cloudinary và lưu vào bảng product_images
  const images = productjson.images || [];
  for (const [index, file] of images.entries()) {
    try {
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'dorris/products',
            public_id: `${newProduct.sku}_${index}_${Date.now()}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });
      await ProductImage.create({
        sku: newProduct.sku,
        imageUrl: uploadResult.secure_url,
        imageDefault: index === 0, // Chỉ set true nếu là ảnh đầu tiên
      });
    } catch (error: any) {
      console.log(error);
      return {
        status: error.code || 400,
        message: error.message,
      };
    }
  }
  // Trả về thông tin sản phẩm mới tạo
  const createdProduct = await Product.findOne({
    where: {
      sku: newProduct.sku,
    },
    include: [
      {
        model: ProductImage,
        as: 'images',
        attributes: ['imageUrl'], // chỉ lấy trường imageUrl thôi
      },
    ],
  });
  return {
    status: 201,
    message: 'Product created successfully!',
    data: createdProduct,
  };
};

export const updateProduct = async (sku: string, productjson: any) => {
  const { Product, ProductImage } = await db.connect();
  // Kiểm tra dữ liệu đầu vào
  if (
    !productjson.productName ||
    !productjson.category ||
    !productjson.price ||
    !productjson.stockQuantity || 
    !productjson.color ||
    !productjson.colorBackground ||
    !productjson.storage ||
    !productjson.sku
  ) {
    return {
      status: 400,
      message: 'Invalid product data!',
    };
  }
  // Cập nhật sản phẩm
  const updatedProduct = await Product.update(productjson, {
    where: {
      sku: sku,
    },
  });
  if (!updatedProduct) {
    return {
      status: 404,
      message: 'Product not found!',
    };
  }
  // Upload ảnh lên Cloudinary và lưu vào bảng product_images
  const images = productjson.images || [];
  const hasDefault = await ProductImage.findOne({
      where: {
        sku: sku,
        imageDefault: true,
      },
  });
  for (const [index, file] of images.entries()) {
    try {
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'dorris/products',
            public_id: `${sku}_${index}_${Date.now()}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });
      await ProductImage.create({
        sku: sku,
        imageUrl: uploadResult.secure_url,
        imageDefault: !hasDefault && index === 0, // Chỉ set true nếu là ảnh đầu tiên
      });
    } catch (error: any) {
      console.log(error);
      return {
        status: error.code || 400,
        message: error.message,
      };
    }
  }
  return {
    status: 200,
    message: 'Product updated successfully!',
  };
}

export const deleteProduct = async (sku: string) => {
  const { Product, ProductImage } = await db.connect();
  // Tìm tất cả ảnh liên quan tới product
  const images = await ProductImage.findAll({
    where: {
      sku: sku
    },
  });
  // Xóa ảnh trên Cloudinary
  for (const image of images) {
    const publicId = extractPublicId(image.imageUrl);
    console.log('publicId', publicId);
    // Nếu publicId không phải là null thì xóa ảnh trên Cloudinary
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error(`Failed to delete image ${publicId} from Cloudinary`, error);
      }
    }
  }
  // Xóa ảnh khỏi database
  const deletedImages = await ProductImage.destroy({
    where: {
      sku: sku
    },
  });
  if (!deletedImages) {
    return {
      status: 404,
      message: 'Product images not found!',
    };
  }
  // Xóa sản phẩm
  const deletedProduct = await Product.destroy({
    where: {
      sku: sku,
    },
  });
  if (!deletedProduct) {
    return {
      status: 404,
      message: 'Product not found!',
    };
  }
  return {
    status: 200,
    message: 'Product deleted successfully!',
  };
}