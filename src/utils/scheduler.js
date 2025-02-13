import cron from "node-cron";
import { Task } from "../models/taskModels.js";
import { emitNewEvent } from "../notifications/userNotifications.js";

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
                const message = `deadline is approaching for "${task.title}"`
                await emitNewEvent("DueDate", task.assignee, message);
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