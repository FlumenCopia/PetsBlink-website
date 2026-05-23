const authService = require("../services/auth.service");

// CHECK EMAIL
exports.checkEmail = async (req, res) => {
  try {
    const email = req.params.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        status: 400,
        message: "Email is required"
      });
    }

    const result = await authService.checkEmail(email);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Server error"
    });
  }
};

// CHECK USERNAME
exports.checkUsername = async (req, res) => {
  try {
    const username = req.params.username?.trim();

    if (!username) {
      return res.status(400).json({
        status: 400,
        message: "Username is required"
      });
    }

    const result = await authService.checkUsername(username);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Server error"
    });
  }
};

// CURRENT USER
exports.getMe = async (req, res) => {
  try {
    const result = await authService.getMe(req.user.id);
    res.status(result.status).json(result);
  } catch (err) {
    console.error("GET ME ERROR:", err);
    res.status(500).json({
      status: 500,
      message: "Unable to load user"
    });
  }
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(result.status).json(result);
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({
      status: 500,
      message: "Registration failed"
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.status(result.status).json(result);
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      status: 500,
      message: "Server error"
    });
  }
};

// OTP LOGIN
exports.loginWithCode = async (req, res) => {
  try {
    const result = await authService.loginWithCode(req.body);
    res.status(result.status).json(result);
  } catch (err) {
    console.error("OTP LOGIN ERROR:", err);
    res.status(500).json({
      status: 500,
      message: "Server error"
    });
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  res.status(200).json({
    message: "Logged out successfully"
  });
};

// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  try {
    const result = await authService.verifyEmail(req.body);
    res.status(result.status).json(result);
  } catch (err) {
    console.error("VERIFY EMAIL ERROR:", err);
    res.status(500).json({
      status: 500,
      message: "Server error"
    });
  }
};

// RESEND CODE
exports.resendCode = async (req, res) => {
  try {
    const result = await authService.resendCode(req.body.email);
    res.status(result.status).json(result);
  } catch (err) {
    console.error("RESEND CODE ERROR:", err);
    res.status(500).json({
      status: 500,
      message: "Server error"
    });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const result = await authService.updateProfile({
      ...req.body,
      email: req.body.email || req.user?.email
    });
    res.status(result.status).json(result);
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Server error"
    });
  }
};

//jwt
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required"
      });
    }

    const jwtUtil = require("../utils/jwt");

    const decoded =
      jwtUtil.verifyRefreshToken(refreshToken);

    const tokens = jwtUtil.generate({
      id: decoded.id,
      email: decoded.email
    });

    res.status(200).json(tokens);

  } catch (err) {
    res.status(401).json({
      message: "Invalid refresh token"
    });
  }
};
