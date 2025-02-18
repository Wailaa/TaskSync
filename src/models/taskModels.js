import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        status: {
            type: String,
            enum: ["to-do", "in-progress", "done"],
            required: true,
        },
        priority: { type: String, enum: ["low", "medium", "high"], required: true },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        dueDate: { type: Date },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        labels: [String],
        subtasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                content: String,
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);


const subtaskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        parentTask: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "in-progress", "done"],
            default: "pending",
        },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                content: String,
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

TaskSchema.index({ title: "text", description: "text" });
export const Task = mongoose.model("Task", TaskSchema);
export const Subtask = mongoose.model("Subtask", subtaskSchema);
