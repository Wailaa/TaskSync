
import Task from "../models/taskModels.js"
import User from "../models/userModels.js";
import { emitDeleteTask, emitNewTask, emitUpdatedTask } from "../notifications/userNotifications.js";


export const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate, assignee } = req.body;

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
            assignee,
            createdBy: userExists._id,
        });

        await newTask.save();
        emitNewTask(newTask);
        res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        console.error("create task error:", error);
        res.status(500).json({ message: "failed to create task" })
    }
};

export const getTasks = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, priority, userId } = req.query;

        let filter = { assignee: req.user._id };

        if (req.user.role === "Admin") {
            filter = {};
        }

        if (req.user.role === "Manager" && userId) {
            filter.assignee = userId;
        }


        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        const tasks = await Task.find(filter).limit(limit * 1).skip((page - 1) * limit).exec();
        const taskCount = await Task.countDocuments(filter);

        return res.status(200).json({
            totalTasks: taskCount,
            totalPages: Math.ceil(taskCount / limit),
            currentPage: page,
            tasks,
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch tasks" })
    }
};

export const getTaskById = async (req, res) => {
    try {
        const tasks = await Task.findById(req.params.id);
        if (!tasks) {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.status(200).json(tasks);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch task" })
    }
};

export const updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        emitUpdatedTask(updatedTask);
        res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: "Failed to update task", error });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        emitDeleteTask(req.params.id);
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete task", error });
    }
}