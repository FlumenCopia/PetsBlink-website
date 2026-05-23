// const express = require("express");
// const router = express.Router();

// const authController = require("../controllers/auth.controller");

// // AUTH
// router.post("/register", authController.register);
// router.post("/login", authController.login);
// router.post("/login-with-code", authController.loginWithCode);

// // EMAIL / USER CHECK
// router.get("/check-email/:email", authController.checkEmail);
// router.get("/check-username/:username", authController.checkUsername);

// // VERIFICATION
// router.post("/verify-email", authController.verifyEmail);
// router.post("/resend-code", authController.resendCode);

// // PROFILE
// router.post("/update-profile", authController.updateProfile);

// module.exports = router;




const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middle/auth.middleware");

// AUTH
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/login-with-code", authController.loginWithCode);
router.post("/logout", authController.logout);

// EMAIL / USER CHECK
router.get("/check-email/:email", authController.checkEmail);
router.get("/check-username/:username", authController.checkUsername);
router.get("/me", authMiddleware, authController.getMe);

// VERIFICATION
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-code", authController.resendCode);

// PROFILE (JWT Protected)
router.post(
  "/update-profile",
  authMiddleware,
  authController.updateProfile
);

router.post(
  "/refresh-token",
  authController.refreshToken
);

module.exports = router;
