const express = require("express");
const {
  getUsers,
  getUserCount,
  register,
  login,
  verify,
} = require("../controllers/userController");
const {
  requireAuth,
  requireAdmin,
} = require("../middleware/authMiddleware.js");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

/// authorization
router.get("/verify", verify);

// admin only
router.get("/admin/users/count", requireAuth, requireAdmin, getUserCount);
router.get("/admin/users", requireAuth, requireAdmin, getUsers);

module.exports = router;
