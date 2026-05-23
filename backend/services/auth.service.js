// const pool = require("../config/db");
// const bcrypt = require("bcrypt");
// const crypto = require("crypto");
// const jwt = require("../utils/jwt");



// /* =========================
//    CHECK EMAIL
// ========================= */
// exports.checkEmail = async (email) => {
//   const [rows] = await pool.query(
//     "SELECT id FROM users WHERE email = ?",
//     [email]
//   );

//   return {
//     status: 200,
//     exists: rows.length > 0
//   };
// };

// /* =========================
//    CHECK USERNAME
// ========================= */
// exports.checkUsername = async (username) => {
//   const [rows] = await pool.query(
//     "SELECT id FROM users WHERE username = ?",
//     [username]
//   );

//   return {
//     status: 200,
//     exists: rows.length > 0
//   };
// };

// /* =========================
//    REGISTER / UPDATE USER
// ========================= */
// exports.register = async (data) => {
//   const { email, username, password, firstName, lastName } = data;

//   const [rows] = await pool.query(
//     "SELECT * FROM users WHERE email = ?",
//     [email]
//   );

//   const code = crypto.randomInt(1000, 9999).toString();
//   const hash = password ? await bcrypt.hash(password, 10) : null;

//   if (rows.length > 0) {
//     await pool.query(
//       `UPDATE users 
//        SET username=?, first_name=?, last_name=?, password_hash=?, activation_token=?, is_verified=0
//        WHERE id=?`,
//       [username, firstName, lastName, hash, code, rows[0].id]
//     );
//   } else {
//     await pool.query(
//       `INSERT INTO users 
//        (email, username, password_hash, first_name, last_name, activation_token, is_verified)
//        VALUES (?, ?, ?, ?, ?, ?, 0)`,
//       [email, username, hash, firstName, lastName, code]
//     );
//   }

//   return {
//     status: 201,
//     message: "Verification code sent"
//   };
// };

// /* =========================
//    LOGIN (PASSWORD)
// ========================= */
// exports.login = async (data) => {
//   const { email, password } = data;

//   const [rows] = await pool.query(
//     "SELECT * FROM users WHERE email = ?",
//     [email]
//   );

//   if (!rows.length) {
//     return { status: 404, message: "User not found" };
//   }

//   const user = rows[0];

//   const match = await bcrypt.compare(password, user.password_hash || "");

//   if (!match) {
//     return { status: 401, message: "Invalid credentials" };
//   }

//   const tokens = jwt.generate(user);

//   return {
//     status: 200,
//     tokens,
//     user: {
//       userId: user.id,
//       email: user.email
//     }
//   };
// };

// /* =========================
//    RESEND LOGIN CODE
// ========================= */
// exports.resendCode = async (email) => {
//   try {
//     const [rows] = await pool.query(
//       "SELECT * FROM users WHERE email = ?",
//       [email]
//     );

//     if (!rows.length) {
//       return { status: 404, message: "User not found" };
//     }

//     const user = rows[0];

//     const code = crypto.randomInt(1000, 9999).toString();
//     const expiry = new Date(Date.now() + 5 * 60 * 1000);

//     await pool.query(
//       "UPDATE users SET login_code = ?, login_code_expiry = ? WHERE id = ?",
//       [code, expiry, user.id]
//     );

//     return {
//       status: 200,
//       message: "Code sent successfully"
//     };

//   } catch (err) {
//     console.error("RESEND ERROR:", err);
//     return {
//       status: 500,
//       message: "Internal Server Error"
//     };
//   }
// };

// /* =========================
//    LOGIN WITH CODE (OTP)
// ========================= */
// exports.loginWithCode = async (data) => {
//   try {
//     const { email, code } = data;

//     const [rows] = await pool.query(
//       "SELECT * FROM users WHERE email = ?",
//       [email]
//     );

//     if (!rows.length) {
//       return { status: 404, message: "User not found" };
//     }

//     const user = rows[0];

//     if (!user.login_code) {
//       return { status: 400, message: "OTP not generated" };
//     }

//     if (user.login_code.toString() !== code.toString()) {
//       return { status: 401, message: "Invalid code" };
//     }

//     if (
//       user.login_code_expiry &&
//       new Date() > new Date(user.login_code_expiry)
//     ) {
//       return { status: 401, message: "Code expired" };
//     }

//     const tokens = jwt.generate(user);

//     await pool.query(
//       "UPDATE users SET login_code=NULL, login_code_expiry=NULL WHERE id=?",
//       [user.id]
//     );

//     return {
//       status: 200,
//       tokens,
//       user: {
//         userId: user.id,
//         email: user.email
//       }
//     };

//   } catch (error) {
//     console.error("LOGIN WITH CODE ERROR:", error);
//     return {
//       status: 500,
//       message: "Internal Server Error"
//     };
//   }
// };


// //updated-profile
// exports.updateProfile = async (data) => {
//   const { email, username, firstName, lastName } = data;

//   const [rows] = await pool.query(
//     "SELECT * FROM users WHERE email = ?",
//     [email]
//   );

//   if (rows.length > 0) {
//     await pool.query(
//       `UPDATE users
//        SET username=?, first_name=?, last_name=?
//        WHERE email=?`,
//       [username, firstName, lastName, email]
//     );
//   } else {
//     await pool.query(
//       `INSERT INTO users
//        (email, username, first_name, last_name)
//        VALUES (?, ?, ?, ?)`,
//       [email, username, firstName, lastName]
//     );
//   }

//   return {
//     status: 200,
//     message: "Profile updated successfully"
//   };
// };

// //verify-email
// exports.verifyEmail = async (data) => {
//   const { email, code } = data;

//   const [rows] = await pool.query(
//     "SELECT * FROM users WHERE email=?",
//     [email]
//   );

//   if (!rows.length) {
//     return {
//       status: 404,
//       message: "User not found"
//     };
//   }

//   const user = rows[0];

//   if (user.is_verified) {
//     return {
//       status: 200,
//       message: "Email already verified"
//     };
//   }

//   if (user.activation_token !== code) {
//     return {
//       status: 400,
//       message: "Invalid verification code"
//     };
//   }

//   await pool.query(
//     `UPDATE users
//      SET is_verified=1,
//          activation_token=NULL
//      WHERE email=?`,
//     [email]
//   );

//   return {
//     status: 200,
//     message: "Email verified successfully"
//   };
// };




const pool = require("../config/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("../utils/jwt");
const mail = require("./mail.service");

/* =========================
   CHECK EMAIL
========================= */
exports.checkEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  return {
    status: 200,
    exists: rows.length > 0
  };
};

/* =========================
   CHECK USERNAME
========================= */
exports.checkUsername = async (username) => {
  const [rows] = await pool.query(
    "SELECT id FROM users WHERE username = ?",
    [username]
  );

  return {
    status: 200,
    exists: rows.length > 0
  };
};

/* =========================
   CURRENT USER
========================= */
exports.getMe = async (userId) => {
  const [rows] = await pool.query(
    `SELECT id, email, username, first_name, last_name
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [userId]
  );

  if (!rows.length) {
    return {
      status: 404,
      message: "User not found"
    };
  }

  const user = rows[0];

  return {
    status: 200,
    user: {
      userId: user.id,
      email: user.email,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name
    }
  };
};

/* =========================
   REGISTER
========================= */
exports.register = async (data) => {
  const email = data.email?.trim().toLowerCase();
  const username = data.username?.trim();
  const firstName = data.firstName?.trim();
  const lastName = data.lastName?.trim();
  const password = data.password;

  if (!email || !username || !firstName || !lastName || !password) {
    return {
      status: 400,
      message: "All fields are required"
    };
  }

  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  const hash = password ? await bcrypt.hash(password, 10) : null;
  const code = crypto.randomInt(1000, 9999).toString();

  if (rows.length > 0) {
    await pool.query(
      `UPDATE users 
       SET username=?, first_name=?, last_name=?, password_hash=?, activation_token=?, is_verified=0
       WHERE id=?`,
      [username, firstName, lastName, hash, code, rows[0].id]
    );
  } else {
    await pool.query(
      `INSERT INTO users 
       (email, username, password_hash, first_name, last_name, activation_token, is_verified)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [email, username, hash, firstName, lastName, code]
    );
  }

  await mail.sendOTP(email, code);

  return {
    status: 201,
    message: "Verification code sent"
  };
};

/* =========================
   LOGIN (PASSWORD)
========================= */
exports.login = async (data) => {
  const email = data.email?.trim().toLowerCase();
  const password = data.password;

  if (!email || !password) {
    return {
      status: 400,
      message: "Email and password are required"
    };
  }

  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (!rows.length) {
    return { status: 404, message: "User not found" };
  }

  const user = rows[0];

  const match = await bcrypt.compare(password, user.password_hash || "");

  if (!match) {
    return { status: 401, message: "Invalid credentials" };
  }

  const tokens = jwt.generate(user);

  return {
    status: 200,
    tokens,
    user: {
      userId: user.id,
      email: user.email,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name
    }
  };
};

/* =========================
   RESEND OTP (EMAIL OTP)
========================= */
exports.resendCode = async (email) => {
  try {
    email = email?.trim().toLowerCase();

    if (!email) {
      return { status: 400, message: "Email is required" };
    }

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!rows.length) {
      return { status: 404, message: "User not found" };
    }

    const user = rows[0];

    const code = crypto.randomInt(1000, 9999).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query(
      "UPDATE users SET login_code = ?, login_code_expiry = ? WHERE id = ?",
      [code, expiry, user.id]
    );

    await mail.sendOTPEmail(email, code);

    return {
      status: 200,
      message: "OTP sent successfully"
    };

  } catch (err) {
    console.error(err);
    return {
      status: 500,
      message: "Internal Server Error"
    };
  }
};

/* =========================
   LOGIN WITH OTP
========================= */
exports.loginWithCode = async (data) => {
  try {
    const email = data.email?.trim().toLowerCase();
    const code = data.code;

    if (!email || !code) {
      return { status: 400, message: "Email and code are required" };
    }

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!rows.length) {
      return { status: 404, message: "User not found" };
    }

    const user = rows[0];

    if (!user.login_code) {
      return { status: 400, message: "OTP not generated" };
    }

    if (user.login_code.toString() !== code.toString()) {
      return { status: 401, message: "Invalid code" };
    }

    if (new Date() > new Date(user.login_code_expiry)) {
      return { status: 401, message: "Code expired" };
    }

    const tokens = jwt.generate(user);

    await pool.query(
      "UPDATE users SET login_code=NULL, login_code_expiry=NULL WHERE id=?",
      [user.id]
    );

    return {
      status: 200,
      tokens,
      user: {
        userId: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name
      }
    };

  } catch (err) {
    console.error(err);
    return {
      status: 500,
      message: "Internal Server Error"
    };
  }
};

/* =========================
   VERIFY EMAIL
========================= */
exports.verifyEmail = async (data) => {
  const email = data.email?.trim().toLowerCase();
  const code = data.code;

  if (!email || !code) {
    return { status: 400, message: "Email and code are required" };
  }

  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email=?",
    [email]
  );

  if (!rows.length) {
    return { status: 404, message: "User not found" };
  }

  const user = rows[0];

  if (user.activation_token !== code) {
    return { status: 400, message: "Invalid code" };
  }

  await pool.query(
    "UPDATE users SET is_verified=1, activation_token=NULL WHERE email=?",
    [email]
  );

  const tokens = jwt.generate(user);

  return {
    status: 200,
    message: "Email verified successfully",
    tokens,
    user: {
      userId: user.id,
      email: user.email,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name
    }
  };
};

/* =========================
   UPDATE PROFILE
========================= */
exports.updateProfile = async (data) => {
  const email = data.email?.trim().toLowerCase();
  const username = data.username?.trim();
  const firstName = data.firstName?.trim();
  const lastName = data.lastName?.trim();

  if (!email || !username || !firstName || !lastName) {
    return {
      status: 400,
      message: "Email, username, firstName, and lastName are required"
    };
  }

  await pool.query(
    `UPDATE users SET username=?, first_name=?, last_name=? WHERE email=?`,
    [username, firstName, lastName, email]
  );

  return {
    status: 200,
    message: "Profile updated successfully"
  };
};
