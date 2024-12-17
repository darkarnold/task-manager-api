const Task = require("../models/tasks");
const User = require("../models/users");

class TaskService {
  // get tasks with advanced filtering and pagination
  async getTasks(user, filters = {}) {
    console.log("Received Filters:", filters);

    const { page, limit, sortBy, sortOrder, ...queryFilters } = filters;
    const query =
      user.role === "admin"
        ? queryFilters
        : {
            ...queryFilters,
            $or: [{ assignedBy: user._id }, { assignedTo: user._id }],
          };

    console.log("Constructed Query:", query);

    return await Task.getFilteredTasks(query, page, limit, sortBy, sortOrder);
  }

  // update a task
  async updateTask(taskId, updateData, user) {
    const task = await Task.findById(taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    // authorization check on who can update task
    const canUpdate =
      user.role === "admin" ||
      task.assignedBy.toString() === user._id.toString() ||
      task.assignedTo.toString() === user._id.toString();

    if (!canUpdate) {
      throw new Error("Not authorized to update this task");
    }

    Object.keys(updateData).forEach((key) => {
      task[key] = updateData[key];
    });

    // add time stamp for when task is done
    if (updateData.status === "done") {
      task.completedAt = new Date();
    }

    await task.save();
    return task;
  }

  // delete task
  async deleteTask(taskId, user) {
    const task = await Task.findById(taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    //authorization check on who can delete tasks
    const canDelete =
      user.role === "admin" ||
      task.assignedBy.toString() === user._id.toString();

    if (!canDelete) {
      throw new Error("Not authorized to delete this task");
    }

    await task.deleteOne();
    return { message: "Task deleted successfully" };
  }

  // task reminders
  async checkUpcomingTasks() {
    const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

    const upcomingTasks = await Task.find({
      status: { $ne: "completed" },
      dueDate: { $lte: twoDaysFromNow },
    }).populate("assignedTo", "email");

    //send notifications via email
    upcomingTasks.forEach(async (task) => {
      await this.senTaskReminder(task);
    });
  }

  async sendTaskReminder(task) {
    console.log(
      `Reminder: Task "${task.title}" is due soon for ${task.assignedTo.email}`
    );
  }
}

module.exports = new TaskService();
