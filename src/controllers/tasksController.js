import Task from "../models/taskModels.js"
import User from "../models/userModels.js";
export const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        const userExists = await User.findById(req.user._id);
        if (!userExists) {
            return res.status(404).json({ message: "Assignee not found" });
        }

        const newTask = new Task({
            title,
            description,
            status,
            priority,
            dueDate,
            assignee: userExists._id,
        });

        await newTask.save();
        res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        console.error("create task error:", error);
        res.status(500).json({ message: "failed to create task" })
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignee: req.user._id });
        return res.status(200).json(tasks);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch tasks" })
    }
};

