import cron from "node-cron";
import { emitNewEvent } from "../services/userNotifications.js"
import { taskService } from "../services/taskService.js";
import { buildDeuDatePipeLine } from "./taskUtils.js";

const checkTaskDeadlines = async () => {
    try {
        const pipeline = buildDeuDatePipeLine();
        const upcomingTasks = await taskService.findWithFilter(pipeline);

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