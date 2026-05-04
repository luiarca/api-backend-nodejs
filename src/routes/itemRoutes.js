const express = require("express");

const itemController = require("../controllers/itemController");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  isAuthenticatedUser,
  isAdminOrSuperAdmin
} = require("../middlewares/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", isAuthenticatedUser, itemController.getAllItems);
router.get("/:id", isAuthenticatedUser, itemController.getItemById);
router.post("/", isAdminOrSuperAdmin, itemController.createItem);
router.put("/:id", isAdminOrSuperAdmin, itemController.updateItem);
router.delete("/:id", isAdminOrSuperAdmin, itemController.deleteItem);

module.exports = router;
