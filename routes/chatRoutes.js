const express = require("express");
const { accessChat, fetchChats, fetchGroups, createGroupChat, groupExit, addSelfToGroup, deleteChat } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/createGroup").post(protect, createGroupChat);
router.route("/fetchGroups").get(protect, fetchGroups);
router.route("/groupExit").put(protect, groupExit);
router.route("/addSelfToGroup").put(protect, addSelfToGroup);
router.route("/:id").delete(protect, deleteChat);

module.exports = router;

