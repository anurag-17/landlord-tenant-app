const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorRes");

exports.isAuthenticatedUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else {
    token = authHeader;
  }
  if (!token) {
    return res.status(401).json({ message: "Please login to access this resource" });
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findOne({ email: decodedData?.email });
    // if (!req.user) {
    //   req.user = await Admin.findOne({ email: decodedData?.email });
    // }
    if (req.user.activeToken  && req.user.activeToken === token) {
      next();
    } else {
      return res.status(401).json({ message: 'Token expired, please login again' });
    }

    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please login again' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      console.error('Other error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};
