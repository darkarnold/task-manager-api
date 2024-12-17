const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - assignedBy
 *         - assignedTo
 *         - dueDate
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the task.
 *           example: "60d5f4843d1d4c0015b3c4e8"
 *         title:
 *           type: string
 *           description: The title of the task.
 *           example: "Finish Swagger Documentation"
 *         description:
 *           type: string
 *           description: A brief description of the task.
 *           example: "Write Swagger docs for all task routes."
 *         assignedBy:
 *           type: string
 *           format: uuid
 *           description: User ID of the assigner.
 *           example: "60d5f4843d1d4c0015b3c4e6"
 *         assignedTo:
 *           type: string
 *           format: uuid
 *           description: User ID of the assignee.
 *           example: "60d5f4843d1d4c0015b3c4e7"
 *         status:
 *           type: string
 *           enum: ["created", "to-do", "in-progress", "done"]
 *           description: The current status of the task.
 *           example: "to-do"
 *         priority:
 *           type: string
 *           enum: ["low", "normal", "medium", "high", "critical"]
 *           description: The priority level of the task.
 *           example: "high"
 *         dueDate:
 *           type: string
 *           format: date
 *           description: The due date of the task.
 *           example: "2024-09-01"
 *         completedAt:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: The date when the task was completed.
 *           example: null
 */

// task routes
router.use(protect);

/**
 * @swagger
 * /api/v1/tasks/create-task:
 *   post:
 *     summary: Create a new task
 *     tags: [tasks]
 *     description: Create a task. Only users with "admin" or "user" roles can create tasks.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Task successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request - Invalid input.
 *       401:
 *         description: Unauthorized - Missing or invalid token.
 *       403:
 *         description: Forbidden - User lacks permission.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/v1/tasks/get-all-tasks:
 *   get:
 *     summary: Retrieve all tasks
 *     tags: [tasks]
 *     description: Fetch all tasks. Accessible to authenticated users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of tasks retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized - Missing or invalid token.
 *       500:
 *         description: Internal server error.
 */

router
  .post("/create-task", restrictTo("admin", "user"), createTask)
  .get("/get-all-tasks", getTasks);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   patch:
 *     summary: Update a task
 *     tags: [tasks]
 *     description: Update details of a specific task.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the task to be updated.
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request - Invalid input.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [tasks]
 *     description: Remove a specific task. Only "admin" or "user" roles can delete tasks.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the task to delete.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Task successfully deleted.
 *       403:
 *         description: Forbidden - User lacks permission.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Internal server error.
 */

router
  .route("/:id")
  .patch(updateTask)
  .delete(restrictTo("admin", "user"), deleteTask);

module.exports = router;
