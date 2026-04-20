const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} = require("../controllers/itemController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllItems);
router.get("/:id", getItemById);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

module.exports = router;
