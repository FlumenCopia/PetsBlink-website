const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const authMiddleware = require("../middle/auth.middleware");
const profileController = require("../controllers/profile.controller");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads", "profiles");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }

    cb(null, true);
  },
});

router.get("/me", authMiddleware, profileController.getMyProfile);

router.post(
  "/me",
  authMiddleware,
  upload.single("logo"),
  profileController.saveMyProfile
);

module.exports = router;
