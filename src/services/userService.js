import User from "../models/userModels.js";
import { createHashPass } from "../utils/hashPass.js";

const createUserService = (User) => {
    const userService = {};

    userService.createUser = async ({
        username,
        password,
        email,
        role = "user",
    }) => {
        if (!username || !password) {
            const error = new Error("Username or password not provided.");
            throw error;
        }

        if (await User.findOne({ username })) {
            const error = new Error("Username already in use.");
            error.statusCode = 403;
            throw error;
        }

        const hashedPass = await createHashPass(password);

        const user = new User({ username, password: hashedPass, email, role });
        return await user.save();
    };

    userService.findOne = async (filter) => {
        return await User.findOne(filter);
    };

    userService.find = async (filter) => {
        return await User.find(filter);
    };

    userService.findByIdAndUpdate = async (id, filter) => {
        return await User.findByIdAndUpdate(id, filter, { new: true });
    };

    userService.getUserById = async (userId) => {
        if (!userId) throw new Error("No userId provided.");
        return await User.findById(userId);
    };

    userService.findOneAndUpdate = async (target, updateContent) => {
        return await User.findOneAndUpdate(target, updateContent);
    };

    userService.aggregate = async (pipeline = {}) => {
        const result = await User.aggregate(pipeline);
        return result;
    };

    userService.addNotification = async (event, userId, message) => {
        const user = await userService.getUserById(userId);
        const updateNotification = {
            type: event,
            message: message,
            isRead: false,
        };

        user.notifications.push(updateNotification);
        user.save();
    };

    userService.addActivityLog = async (userId, filter) => {
        const user = await userService.getUserById(userId);
        user.activityLogs.push(filter);
        user.save();
    };

    userService.addTask = async (userId, task) => {
        const user = await userService.getUserById(userId);
        user.tasks.push(task);
        user.save();
    };
    userService.addSubTask = async (taskId, subtask) => {
        return await User.updateOne(
            { "tasks._id": taskId },
            {
                $push: {
                    "tasks.$.subtasks": subtask,
                },
            }
        );
    };
    userService.updateSubTask = async (userId, taskId, subtaskId, subtask) => {
        return await User.updateOne(
            {
                _id: userId,
                "tasks._id": taskId,
            },
            {
                $set: subtask,
            },
            {
                arrayFilters: [{ "subtasks._id": subtaskId }],
            }
        );

    };

    userService.addComment = async (taskId, comment) => {

        return await User.updateOne(
            { "tasks._id": taskId },
            {
                $push: {
                    "tasks.$.comments": comment,
                },
            }
        );
    };

    userService.addSubtaskComment = async (userId, taskId, subtaskId, comment) => {
        
        return await User.updateOne(
            {
                _id: userId,
                "tasks._id": taskId
            },
            {
                $push: {
                    "tasks.$.subtasks.$[subtask].comments": comment
                }
            },
            {
                arrayFilters: [{ "subtask._id": subtaskId }]
            }
        );
    };


    return userService;
};

export const userService = createUserService(User);
