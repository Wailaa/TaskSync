import { ActivityLog } from "../models/activityLogModels.js";

export const getActivityLogs = async (req, res) => {
    try {
        const { taskId } = req.params;
        const logs = await ActivityLog.find({ taskId }).populate("userId", "username");
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch activity logs", error });
    }
};

