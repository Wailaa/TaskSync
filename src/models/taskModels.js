import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        status: { type: String, enum: ["To-Do", "In-Progress", "Done"], default: "To-Do" },
        assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
        dueDate: { type: Date },
    },
    { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
