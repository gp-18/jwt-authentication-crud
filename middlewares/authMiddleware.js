import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

const checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await UserModel.findById(decoded.user.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ status: "failed", message: "Unauthorized user" });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ status: "failed", message: "Unauthorized user" });
    }
  } else {
    return res.status(401).json({ status: "failed", message: "Unauthorized user, no token" });
  }
};

export default checkUserAuth;
