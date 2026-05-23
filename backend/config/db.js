// const mysql = require("mysql2/promise");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "testdatabase"
// });

// // TEST CONNECTION
// pool.getConnection()
//   .then(conn => {
//     console.log("DB CONNECTED SUCCESSFULLY");
//     conn.release();
//   })
//   .catch(err => {
//     console.log("DB CONNECTION FAILED:", err.message);
//   });

// module.exports = pool;



const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;