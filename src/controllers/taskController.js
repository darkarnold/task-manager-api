const Task = require("../models/tasks");
const TaskService = require("../services/taskService");

// create a task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    const task = await Task.create({ ...req.body, assignedBy: req.user.id });
    return res.status(201).json({
      success: true,
      task,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getTasks = async (req, res) => {
  try {
    console.log("Full Request Details:", {
      user: {
        _id: req.user._id,
        role: req.user.role,
      },
      query: req.query,
    });

    const { page, limit, sortBy, sortOrder, ...filters } = req.query;

    const result = await TaskService.getTasks(req.user, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sortBy: sortBy || "createdAt",
      sortOrder: sortOrder || "desc",
      ...filters,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await TaskService.updateTask(
      req.params.id,
      req.body,
      req.user
    );

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const result = await TaskService.deleteTask(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
