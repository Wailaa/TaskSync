import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        status: { type: String, enum: ["To-Do", "In-Progress", "Done"], default: "To-Do" },
        assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
        labels: [{ type: String }],
        priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
        dueDate: { type: Date },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        subtasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subtask" }]
    },
    { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);


const subtaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    parentTask: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

});

export const Subtask = mongoose.model("Subtask", subtaskSchema);

