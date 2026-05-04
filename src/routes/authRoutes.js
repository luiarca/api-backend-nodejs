const express = require("express");

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const { isAdminOrSuperAdmin } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.registerPublic);
router.post(
  "/register/admin",
  authMiddleware,
  isAdminOrSuperAdmin,
  authController.registerByAdmin
);

module.exports = router;
