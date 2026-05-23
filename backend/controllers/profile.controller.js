const profileService = require("../services/profile.service");

exports.getMyProfile = async (req, res) => {
  try {
    const result = await profileService.getMyProfile(req.user.id);
    res.status(result.status).json(result);
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({
      status: 500,
      message: "Unable to load profile",
    });
  }
};

exports.saveMyProfile = async (req, res) => {
  try {
    const result = await profileService.upsertMyProfile(
      req.user.id,
      req.body,
      req.file
    );

    res.status(result.status).json(result);
  } catch (err) {
    console.error("SAVE PROFILE ERROR:", err);
    res.status(500).json({
      status: 500,
      message: "Unable to save profile",
    });
  }
};
