const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// /**
//  * Middleware to protect routes and check roles dynamically
//  * @param {...string} allowedRoles - Roles that have access to the route
//  */
const protect = (...allowedRoles) => {
  return async (req, res, next) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user without password
        req.user = await User.findById(decoded.id).select("-password");

        // Check if user role is allowed
        if (!allowedRoles.includes(req.user.role)) {
          res.status(403); // Forbidden
          throw new Error("Access denied: insufficient permissions");
        }

        next();
      } catch (error) {
        res.status(401); // Unauthorized
        throw new Error("Not authorized, token failed");
      }
    } else {
      res.status(401); // Unauthorized
      throw new Error("Not authorized, no token");
    }
    next()
  };
};

module.exports = protect;

// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
 
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ status: 'Access denied. No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
//     req.user = decoded; // Attach the decoded user data (e.g., userId) to the request
//     next();
//   } catch (error) {
//     res.status(403).json({ status: 'Invalid or expired token', error: error.message });
//   }
// };

// module.exports = authMiddleware;


