const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// task routes
router.use(protect);

router
  .post("/create-task", restrictTo("admin", "user"), createTask)
  .get("/get-all-tasks", getTasks);

router
  .route("/:id")
  .patch(updateTask)
  .delete(restrictTo("admin", "user"), deleteTask);

module.exports = router;
