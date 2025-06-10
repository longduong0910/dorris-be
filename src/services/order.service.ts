import db from '../utils/db';

export const createOrder = async (orderJson: any) => {
  const { Order, OrderItem } = await db.connect();

  // Kiểm tra dữ liệu đầu vào
  if (
    !orderJson.userId ||
    !orderJson.totalAmount ||
    !orderJson.paymentMethod ||
    !orderJson.paymentStatus ||
    !orderJson.orderStatus ||
    !orderJson.shippingAddress ||
    !Array.isArray(orderJson.items) ||
    orderJson.items.length === 0
  ) {
    return {
      status: 400,
      message: 'Invalid order data!',
    };
  }

  try {
    // Tạo order mới
    const newOrder = await Order.create({
      userId: orderJson.userId,
      totalAmount: orderJson.totalAmount,
      paymentMethod: orderJson.paymentMethod,
      paymentStatus: orderJson.paymentStatus,
      orderStatus: orderJson.orderStatus,
      shippingAddress: orderJson.shippingAddress,
      trackingNumber: orderJson.trackingNumber || null,
    });

    // Tạo các order item
    for (const item of orderJson.items) {
      if (
        !item.productId ||
        !item.quantity ||
        !item.price
      ) {
        return {
          status: 400,
          message: 'Invalid order item data!',
        };
      }
      await OrderItem.create({
        orderId: newOrder.orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }

    // Lấy lại order vừa tạo cùng các order item
    const createdOrder = await Order.findOne({
      where: { orderId: newOrder.orderId },
      include: [
        {
          model: OrderItem,
          as: 'items',
        },
      ],
    });

    return {
      status: 201,
      message: 'Order created successfully!',
      data: createdOrder,
    };
  } catch (error: any) {
    return {
      status: error.code || 400,
      message: error.message,
    };
  }
};