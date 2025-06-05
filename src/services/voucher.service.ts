import db from '../utils/db';

export const getAllVouchers = async () => {
  const { Voucher } = await db.connect();
  const vouchers = await Voucher.findAll({
    where: {
      isActive: true,
    },
  });
  return {
    status: 200,
    data: vouchers,
  };
}

export const getVoucherByCode = async (code: string) => {
  const { Voucher } = await db.connect();
  const voucher = await Voucher.findOne({
    where: {
      code: code,
      isActive: true,
    },
  });
  if (!voucher) {
    return {
      status: 404,
      message: 'Voucher not found or inactive!',
    };
  }
  return {
    status: 200,
    data: voucher,
  };
};

export const createVoucher = async (voucherjson: any) => {
  const { Voucher } = await db.connect();
  // Kiểm tra dữ liệu đầu vào
  if (!voucherjson.code || !voucherjson.discountType || !voucherjson.discountValue || !voucherjson.endDate) {
    return {
      status: 400,
      message: 'Invalid voucher data!',
    };
  }
  // Kiểm tra xem mã voucher đã tồn tại chưa
  const existingVoucher = await Voucher.findOne({
    where: {
      code: voucherjson.code,
    },
  });
  if (existingVoucher) {
    return {
      status: 409,
      message: 'Voucher code already exists!',
    };
  }
  const newVoucher = await Voucher.create(voucherjson);
  const createdVoucher = await Voucher.findOne({
    where: {
      code: newVoucher.code,
    },
  });
  return {
    status: 201,
    message: 'Voucher created successfully!',
    data: createdVoucher,
  };
};