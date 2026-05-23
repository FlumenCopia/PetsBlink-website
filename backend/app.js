// const express = require("express");
// const cors = require("cors");

// const app = express();

// app.use(cors());
// app.use(express.json());



// // routes
// const authRoutes = require("./routes/auth.routes");
// app.use("/api/auth", authRoutes);

// app.get("/", (req, res) => {
//   res.send("Backend Running");
// });

// module.exports = app;




const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const errorHandler = require("./middlewares/error.middleware");
app.use(errorHandler);

module.exports = app;
