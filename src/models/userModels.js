import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['admin', 'manager', 'user'], default: 'user' },
        manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
        activityLogs: [
            {
                action: String,
                taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
                subTaskId: { type: mongoose.Schema.Types.ObjectId, ref: "Subtask" },
                createdAt: { type: Date, default: Date.now }
            }
        ],
        notifications: [
            {
                type: { type: String, enum: ['task-update', 'message', 'system'], required: true },
                message: { type: String, required: true },
                task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
                isRead: { type: Boolean, default: false },
                createdAt: { type: Date, default: Date.now }
            }
        ]
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
