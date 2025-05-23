import db from '../utils/db';

export const getCart = async (userId: number | null, sessionId: string | null) => {
  const { CartItem, Product } = await db.connect();
  const where = userId ? { userId } : { sessionId };
  const cartItems = await CartItem.findAll({
    where,
    include: [
      {
        model: Product,
        as: 'product',
      },
    ],
  });
  return {
    status: 200,
    data: cartItems,
  };
};

export const addToCart = async (userId: number | null, sessionId: string | null, productId: number, quantity: number) => {
  const { CartItem } = await db.connect();
  const where = userId ? { userId, productId } : { sessionId, productId };
  // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
  const item = await CartItem.findOne({
    where
  });
  if (item) {
    // Nếu có rồi thì cập nhật số lượng
    await CartItem.update(
      { quantity: item.quantity + quantity },
      { where }
    );
  } else {
    // Nếu chưa có thì thêm mới
    await CartItem.create({
      userId: userId || null,
      sessionId: sessionId || null,
      productId,
      quantity
    });
  }
  return {
    status: 200,
    message: 'Product added to cart successfully!',
  };
}

export const updateCartItem = async (userId: number | null, sessionId: string | null, productId: number, quantity: number) => {
  const { CartItem } = await db.connect();
  const where = userId ? { userId, productId } : { sessionId, productId };
  // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
  const item = await CartItem.findOne({
    where
  });
  // Nếu không có thì trả về lỗi
  if (!item) {
    return {
      status: 404,
      message: 'Cart item not found.',
    };
  }
  // Nếu số lượng <= 0 thì xóa sản phẩm khỏi giỏ hàng
  if (quantity <= 0) {
    await item.destroy();
    return {
      status: 200,
      message: 'Cart item removed.',
    };
  }
  item.quantity = quantity;
  await item.save();
  return {
    status: 200,
    message: 'Cart item updated successfully!',
  };
};

export const deleteCartItem = async (userId: number | null, sessionId: string | null, productId: number) => {
  const { CartItem } = await db.connect();
  const where = userId ? { userId, productId } : { sessionId, productId };
  // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
  const item = await CartItem.findOne({
    where
  });
  if (!item) {
    return {
      status: 404,
      message: 'Cart item not found.',
    };
  }
  await item.destroy();
  return {
    status: 200,
    message: 'Cart item removed successfully!',
  };
}