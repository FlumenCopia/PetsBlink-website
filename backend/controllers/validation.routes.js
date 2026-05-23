const router = require("express").Router();
const { checkEmail } = require("../controllers/validation.controller");

router.get("/check-email/:email", checkEmail);

module.exports = router;