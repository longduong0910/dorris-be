import db from '../utils/db';

export const getUserInfo = async (userId: number) => {
  const { User } = await db.connect();
  const user = await User.findOne({
    where: {
      userId: userId,
    },
  });
  if (!user) {
    return {
      status: 404,
      message: 'User not found',
    };
  }
  return {
    status: 200,
    data: user,
  };
}