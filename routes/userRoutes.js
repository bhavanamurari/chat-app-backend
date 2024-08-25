const express = require("express");
const {
  loginController,
  registerController,
  fetchAllUsersController,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.get("/fetchUsers", protect, fetchAllUsersController);


module.exports = router;
