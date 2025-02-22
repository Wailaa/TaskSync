import { userService } from "./userService.js";
import { TaskSchema } from "../models/taskModels.js";
import { buildFindTaskByIdPipeline, createTaskKeys } from "../utils/taskUtils.js";

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
        const pipeline = buildFindTaskByIdPipeline(taskId);
        const task = await userService.aggregate(pipeline);

        if (!task) {
            const error = new Error("no task found");
            error.statusCode = 403;
            throw error;
        }
        return task[0];
    };

    taskService.findByIdAndUpdate = async (taskId, filter) => {
        const updatedFields = createTaskKeys(filter)

        const updatedTask = await userService.updateOne({
            'tasks._id': taskId
        }, updatedFields);

        return updatedTask;

    };

    taskService.findByIdAndDelete = async (taskId) => {
        const deleteOperator = createDeleteTaskOperator(taskId);
        const deletedTask = await userService.updateOne(deleteOperator);
        return deletedTask;
    };

    taskService.getAllTasks = async (userId = {}) => {
        const users = await userService.find(userId);
        const allTasks = users.map((user) => user.tasks || []).flat();

        return allTasks;
    };

    taskService.assignUserToTask = async (newUserId, task) => {
        const currentAssignedUser = await userService.getUserById(task.assignee);
        const NewAssignedUser = await userService.getUserById(newUserId);

        task.assignee = newUserId;
        NewAssignedUser.tasks.push(task);
        currentAssignedUser.tasks = currentAssignedUser.tasks.filter((currentTask) => !currentTask._id.equals(task._id));

        await NewAssignedUser.save();
        await currentAssignedUser.save();
    };

    return taskService;
};

export const taskService = createTaskService(TaskSchema);
