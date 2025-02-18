import { userService } from "./userService.js";
import { Task } from "../models/taskModels.js";

const createTaskService = (Task) => {
    const taskService = {};

    taskService.createNewTask = async ({ userId, title, description, status, priority, dueDate, assignee, role }) => {
        const userExists = await userService.getUserById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "Assignee not found" });
        }
        const newTask = new Task({
            title,
            description,
            status,
            priority,
            dueDate,
            assignee: userId,
            createdBy: userId,
        });
        if (role === "manager" || role === "admin") {
            if (assignee) {
                newTask.assignee = assignee;
            }
        }

        await newTask.save();
        return newTask;
    }

    taskService.find = async (filter, limit, page) => {
        const tasks = await Task.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        return tasks;
    }

    taskService.countDocuments = async (filter) => {
        const count = await Task.countDocuments(filter);
        return count;
    }

    taskService.findById = async (taskId) => {
        const task = await Task.findById(taskId);
        if (!task) {
            const error = new Error("no task found")
            error.statusCode = 403
            throw error
        }
    }

    taskService.findByIdAndUpdate = async (taskId, userId, filter) => {
        const updatedTask = await Task.findByIdAndUpdate(taskId, filter, {
            new: true,
            userId,
        });
        return updatedTask;
    }

    taskService.findByIdAndDelete = async (taskId) => {
        const deletedTask = await Task.findByIdAndDelete(taskId);
        return deletedTask;
    }


    return taskService;
}

export const taskService = createTaskService(Task);