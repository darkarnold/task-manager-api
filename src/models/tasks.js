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

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
