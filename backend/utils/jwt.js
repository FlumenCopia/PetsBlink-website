// const jwt = require("jsonwebtoken");

// exports.generate = (user) => {
//   if (!process.env.JWT_SECRET || !process.env.REFRESH_SECRET) {
//     throw new Error("JWT secrets missing in .env file");
//   }

//   const accessToken = jwt.sign(
//     { id: user.id || user.user_id },
//     process.env.JWT_SECRET,
//     { expiresIn: "15m" }
//   );

//   const refreshToken = jwt.sign(
//     { id: user.id || user.user_id },
//     process.env.REFRESH_SECRET,
//     { expiresIn: "7d" }
//   );

//   return { accessToken, refreshToken };
// };



const jwt = require("jsonwebtoken");

const requireSecret = (name) => {
  const secret = process.env[name];

  if (!secret) {
    throw new Error(`${name} is missing`);
  }

  return secret;
};

exports.generateTokens = (user) => {
  const jwtSecret = requireSecret("JWT_SECRET");
  const refreshSecret = requireSecret("REFRESH_SECRET");
  const id = user.id || user.user_id || user.userId;

  if (!id) {
    throw new Error("User id is missing");
  }

  const accessToken = jwt.sign(
    { id, email: user.email },
    jwtSecret,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id, email: user.email },
    refreshSecret,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

exports.generate = exports.generateTokens;

exports.verifyAccess = (token) => {
  return jwt.verify(token, requireSecret("JWT_SECRET"));
};

exports.verifyRefresh = (token) => {
  return jwt.verify(token, requireSecret("REFRESH_SECRET"));
};

exports.verifyRefreshToken = exports.verifyRefresh;
