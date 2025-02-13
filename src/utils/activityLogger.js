import { ActivityLog } from "../models/activityLogModels.js";


export const createActivityLogs = async (userId, taskId, action) => {
    try {
        await ActivityLog.create({ userId, taskId, action });
    } catch (error) {
        console.error("Error logging activity:", error);
    }
};
