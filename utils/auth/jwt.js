import jwt from 'jsonwebtoken';

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username }, 
        process.env.SECRET_KEY, 
        { expiresIn: '2m' }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { userId: user.id, username: user.username },
        process.env.SECRET_REFRESH_KEY, 
        { expiresIn: '30d' }); 
  };

const verifyToken = (token) => {
    return jwt.verify(token, process.env.SECRET_KEY);
};

export default { generateAccessToken, generateRefreshToken, verifyToken };
