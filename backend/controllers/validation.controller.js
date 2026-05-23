// const pool = require("../config/db");

// exports.checkEmail = async (req, res) => {
//   try {
//     const { email } = req.params;

//     const [rows] = await pool.query(
//       "SELECT email FROM users WHERE email = ?",
//       [email]
//     );

//     res.status(200).json({
//       exists: rows.length > 0,
//     });

//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       error: "Internal Server Error",
//     });
//   }
// };