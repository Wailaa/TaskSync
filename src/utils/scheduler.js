import cron from "node-cron";
import { emitNewEvent } from "../notifications/userNotifications.js";
import { taskService } from "../services/taskService.js";

const checkTaskDeadlines = async () => {
    try {
        const now = new Date();
        const upcomingTasks = await taskService
            .find({
                dueDate: {
                    $gte: now,
                    $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000),
                },
                status: { $ne: "Done" },
            })

        console.log(upcomingTasks);
        if (upcomingTasks) {
            for (const task of upcomingTasks) {
                const message = `deadline is approaching for "${task.title}"`;
                const assignee = task.assignee.toString();
                await emitNewEvent("DueDate", assignee, message);
            }
        }

        console.log("Task deadline checker is running every hour...");
    } catch (error) {
        console.error(
            "there was an error scheduling task to check notification,error:",
            error
        );
    }
};

export const activateCheckTaskDeadlines = () => {
    cron.schedule("0 * * * *", checkTaskDeadlines);
};