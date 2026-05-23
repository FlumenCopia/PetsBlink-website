// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({
//         status: 401,
//         message: "Access denied. No token provided."
//       });
//     }

//     const token = authHeader.startsWith("Bearer ")
//       ? authHeader.split(" ")[1]
//       : authHeader;

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     req.user = decoded;

//     next();
//   } catch (err) {
//     return res.status(401).json({
//       status: 401,
//       message: "Invalid or expired token"
//     });
//   }
// };


const jwtUtil = require("../utils/jwt");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({
        status: 401,
        message: "Access token required"
      });
    }

    const decoded = jwtUtil.verifyAccess(token);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 401,
      message: "Invalid or expired token"
    });
  }
};
