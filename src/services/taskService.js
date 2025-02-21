import { userService } from "./userService.js";
import { TaskSchema } from "../models/taskModels.js";

const createTaskService = (Task) => {
    const taskService = {};

    taskService.createNewTask = async ({
        userId,
        title,
        description,
        status,
        priority,
        dueDate,
        assignee,
        role,
    }) => {
        const userExists = await userService.getUserById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "Assignee not found" });
        }
        const newTask = {
            title,
            description,
            status,
            priority,
            dueDate,
            assignee: userId,
            createdBy: userId,
        };

        if (role === "manager" || role === "admin") {
            if (assignee) {
                newTask.assignee = assignee;
            }
        }

        await userService.addTask(userId, newTask);
        return newTask;
    };

    taskService.findWithFilter = async (pipeline) => {
        const result = await userService.aggregate(pipeline);
        if (result.length == 0) {
            return result;
        }

        const paginatedTasks = result[0].tasks
        const countDocuments = result[0].totalTasks;

        return [paginatedTasks, countDocuments];
    };

    taskService.findById = async (taskId) => {
        const task = await Task.findById(taskId);
        if (!task) {
            const error = new Error("no task found");
            error.statusCode = 403;
            throw error;
        }
    };

    taskService.findByIdAndUpdate = async (taskId, userId, filter) => {
        const updatedTask = await Task.findByIdAndUpdate(taskId, filter, {
            new: true,
            userId,
        });
        return updatedTask;
    };

    taskService.findByIdAndDelete = async (taskId) => {
        const deletedTask = await Task.findByIdAndDelete(taskId);
        return deletedTask;
    };

    taskService.getAllTasks = async (userId = {}) => {
        const users = await userService.find(userId);
        const allTasks = users.map((user) => user.tasks || []).flat();

        return allTasks;
    };

    return taskService;
};

export const taskService = createTaskService(TaskSchema);
