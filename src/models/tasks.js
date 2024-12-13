const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title "],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["created", "to-do", "in-progress", "done"],
      default: "created",
    },
    priority: {
      type: String,
      enum: ["low", "normal", "medium", "high", "critical"],
      default: "low",
    },
    dueDate: {
      type: Date,
      required: [true, "Please provide a due date"],
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// validate the due date
TaskSchema.pre("save", function (next) {
  if (this.dueDate < Date.now()) {
    return next(new Error("Due date cannot be in the past"));
  }
  next();
});

TaskSchema.statics.getFilteredTasks = async function (
  query,
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  sortOrder = "desc"
) {
  const skip = (page - 1) * limit;

  const tasks = await this.find(query)
    .sort({
      [sortBy]: sortOrder === "desc" ? -1 : 1,
    })
    .skip(skip)
    .limit(limit)
    .populate("assignedBy", "name email")
    .populate("assignedTo", "name email");

  const total = await this.countDocuments(query);

  return {
    tasks,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTasks: total,
    },
  };
};

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
