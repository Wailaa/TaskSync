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

    userService.findByIdAndUpdate = async (id, filter) => {
        return await User.findByIdAndUpdate(id, filter, { new: true });
    };

    userService.getUserById = async (userId) => {
        if (!userId) throw new Error("No userId provided.");
        return await User.findById(userId);
    };

    userService.addNotification = async (event, userId, message) => {
        const updateNotification = await User.updateOne(
            { _id: userId },
            {
                $push: {
                    notifications: {
                        type: event,
                        message: message,
                        isRead: false,
                    },
                },
            }
        );
        return updateNotification;
    };

    userService.addActivityLog = async (userId, filter) => {
        const addNewActivityLog = await User.updateOne(
            { _id: userId },
            {
                $push: {
                    activityLogs: filter
                },
            }
        );
        return addNewActivityLog;
    };

    return userService;
};

export const userService = createUserService(User);
