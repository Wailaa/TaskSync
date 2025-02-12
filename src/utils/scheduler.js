import cron from "node-cron";
import { Task } from "../models/taskModels.js";
import { Notification } from "../models/notificationModels.js";

const checkTaskDeadlines = async () => {

    try {
        const now = new Date();
        const upcomingTasks = await Task.find({
            dueDate: { $gte: now, $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) },
            status: { $ne: 'Done' }
        }).populate("assignee", "email username");

        if (upcomingTasks) {
            console.log();

            for (const task of upcomingTasks) {
                const notification = new Notification({
                    userId: task.assignee,
                    message: `Your task "${task.title}" is due soon.`,
                    type: "task_reminder",
                });
                await notification.save();
            }
        }

        console.log("Task deadline checker is running every hour...");

    } catch (error) {
        console.error("there was an error scheduling task to check notification,error:", error);
    }
};

export const activateCheckTaskDeadlines = () => {
    cron.schedule("0 * * * *", checkTaskDeadlines);
};