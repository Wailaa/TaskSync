import { Task, Subtask } from "../models/taskModels.js"
import User from "../models/userModels.js";
import { emitNewEvent } from "../notifications/userNotifications.js"
import { createActivityLogs } from "../utils/activityLogger.js";
import { buildTaskFilter } from "../utils/taskUtils.js";


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
            assignee: userExists._id,
            createdBy: userExists._id,
        });

        if (req.user.role === "manager" || req.role === "admin") {
            if (assignee) {
                newTask.assignee = assignee;
            }
        }

        await newTask.save();

        await emitNewEvent("taskCreated", newTask.assignee, "Task created for you");

        res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        console.error("create task error:", error);
        res.status(500).json({ message: "failed to create task" })
    }
};

export const getTasks = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, priority, scope = 'self' } = req.query;

        const filter = await buildTaskFilter(req.user, scope, status, priority);

        const tasks = await Task.find(filter).populate("subtasks").limit(limit * 1).skip((page - 1) * limit).exec();
        const taskCount = await Task.countDocuments(filter);

        return res.status(200).json({
            totalTasks: taskCount,
            totalPages: Math.ceil(taskCount / limit),
            currentPage: page,
            tasks,
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return res.status(500).json({ message: "Failed to fetch tasks" })
    }
};

export const getTaskById = async (req, res) => {
    try {
        const tasks = await Task.findById(req.params.id).populate("subtasks");
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
        const userRole = req.user.role;

        if (userRole === 'user') {
            if (!req.body.hasOwnProperty('status')) {
                return res.status(400).json({ message: "Only the 'status' field can be updated, and it must be provided." });
            }
            req.body = { status: req.body.status };
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        const action = `Updated task: ${JSON.stringify(req.body)}`;
        createActivityLogs(req.user._id, req.params.id, action);

        await emitNewEvent("taskUpdated", updatedTask.assignee, "Task update for title: ${updatedTask.title}");

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

        await emitNewEvent("taskDeleted", deletedTask.assignee, "Task title: ${updatedTask.title} is deleted");

        const action = `Deleted task: ${JSON.stringify(req.body)}`;
        createActivityLogs(req.user._id, req.params.id, action);

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete task", error });
    }
}

export const assignTask = async (req, res) => {
    try {
        const { newUserId } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: "Task not found" });

        task.assignee = newUserId;
        await task.save();

        const action = `New user Assigned: ${newUserId}`;
        createActivityLogs(req.user._id, req.params.id, action);

        res.json({ message: "Task reassigned successfully", task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};

export const createSubtask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, assignedTo } = req.body;

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Parent task not found" });
        }

        const subtask = new Subtask({ title, parentTask: id, assignedTo, createdBy: req.user._id });
        await subtask.save();

        task.subtasks.push(subtask._id);
        await task.save();

        const action = `Subtask created task: ${JSON.stringify(req.body)}`;
        createActivityLogs(req.user._id, req.params.id, action);

        return res.status(201).json({ message: "Subtask created", subtask });
    } catch (error) {
        res.status(500).json({ message: "Error creating subtask" });
    }
};

export const assignSubtaskToUser = async (req, res) => {
    try {
        const { subtaskId } = req.params;
        const { userId } = req.body;

        const subtask = await Subtask.findById(subtaskId);
        if (!subtask) {
            return res.status(404).json({ message: "Subtask not found" });
        }

        subtask.assignedTo = userId;
        await subtask.save();

        const action = `Subtask assigned : for userId ${userId} ,subtaskId :${subtaskId}`;
        createActivityLogs(req.user._id, subtask.parentTask, action);

        return res.status(200).json({ message: "Subtask assigned", subtask });
    } catch (error) {
        res.status(500).json({ message: "Error assigning subtask" });
    }
};

export const updateSubTask = async (req, res) => {
    try {
        const userRole = req.user.role;

        if (userRole === 'user') {
            if (!req.body.hasOwnProperty('status')) {
                return res.status(400).json({ message: "Only the 'status' field can be updated, and it must be provided." });
            }
            req.body = { status: req.body.status };
        }

        const updatedSubTask = await Subtask.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSubTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        const action = `Subtask updated : subtaskId :${req.params.id}`;
        createActivityLogs(req.user._id, updatedSubTask.parentTask, action);

        res.status(200).json({ message: "Task updated successfully", task: updatedSubTask });
    } catch (error) {
        res.status(500).json({ message: "Failed to update task", error });
    }
};