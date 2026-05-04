const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const { isSuperAdmin } = require("../middlewares/roleMiddleware");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.use(authMiddleware, isSuperAdmin);

router.post("/users", adminController.createUser);
router.get("/users", adminController.getAllUsers);
router.put("/users/:id/role", adminController.changeUserRole);
router.delete("/users/:id", adminController.deleteUser);

module.exports = router;
