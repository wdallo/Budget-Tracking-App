const express = require("express");
const {
  getUsers,
  getUserCount,
  register,
  login,
  verify,
  updateUser,
  deleteUser,
  banUser,
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

// admin only [ user controls ]
router.get("/admin/users/count", requireAuth, requireAdmin, getUserCount);
router.get("/admin/users", requireAuth, requireAdmin, getUsers);
router.put("/admin/users/:id", requireAuth, requireAdmin, updateUser);
router.put("/admin/users/ban/:id", requireAuth, requireAdmin, banUser);
router.delete("/admin/users/:id", requireAuth, requireAdmin, deleteUser);

module.exports = router;
