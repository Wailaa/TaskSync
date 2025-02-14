import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        status: { type: String, enum: ["pending", "In-Progress", "Done"], default: "To-Do" },
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

taskSchema.index({ title: "text", description: "text" });


const subtaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    parentTask: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["pending", "in-progress", "Done"], default: "pending" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

});


const taskVersionSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    previousData: { type: Object, required: true },
    modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    modifiedAt: { type: Date, default: Date.now }
});

const subTaskVersionSchema = new mongoose.Schema({
    subTaskId: { type: mongoose.Schema.Types.ObjectId, ref: "Subtask", required: true },
    previousData: { type: Object, required: true },
    modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    modifiedAt: { type: Date, default: Date.now }
});


taskSchema.pre("findOneAndUpdate", async function (next) {
    try {
        const task = await this.model.findOne(this.getQuery());

        if (task) {
            await TaskVersion.create({
                taskId: task._id,
                previousData: task.toObject(),
                modifiedBy: this.getOptions().userId,
            });
        }
    } catch (error) {
        console.error("Error creating task version:", error);
    }

    next();
});

subtaskSchema.pre("findOneAndUpdate", async function (next) {
    try {
        const task = await this.model.findOne(this.getQuery());

        if (task) {
            await SubtaskVersion.create({
                taskId: task._id,
                previousData: task.toObject(),
                modifiedBy: this.getOptions().userId,
            });
        }
    } catch (error) {
        console.error("Error creating task version:", error);
    }

    next();
});

export const Task = mongoose.model("Task", taskSchema);
export const Subtask = mongoose.model("Subtask", subtaskSchema);
export const TaskVersion = mongoose.model("TaskVersion", taskVersionSchema);
export const SubtaskVersion = mongoose.model("SubtaskVersion", subTaskVersionSchema);