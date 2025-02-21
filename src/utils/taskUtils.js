import { Subtask } from "../models/taskModels.js";
import User from "../models/userModels.js";

export const buildTaskFilter = async (user, scope, status, priority) => {
    const { role, _id: userId } = user;
    let filter = {};

    if (role === "admin") {
        return filter;
    }

    if (role === "manager" && scope === 'team') {
        const managedUsers = await User.find({ manager: userId }).select("_id");
        filter.assignee = { $in: managedUsers.map(user => user._id) };
    } else {
        filter.assignee = userId;
    }



    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    return filter;
}

export const isSubTasksDone = async (taskId) => {
    const subtasks = await Subtask.find({ parentTask: taskId });
    if (subtasks.length === 0) return true;

    const isComplete = subtasks.every(subtask => subtask.status === "Done");
    return isComplete;
};

export const buildSearchPipeLine = (filter, search) => {
    let pipeline = [{ $unwind: "$tasks" },];

    if (search) {

        pipeline.push({
            $match: {
                $or: [
                    { "tasks.title": search },
                    { "tasks.description": search },
                ],
            },
        });
    }

    pipeline.push(

        {
            $match: filter,
        },
        { $replaceRoot: { newRoot: "$tasks" } },
    );

    return pipeline;
}
export const buildDeuDatePipeLine = () => {

    const now = new Date();

    const pipeline = [
        { $unwind: "$tasks" },
        {
            $match: {
                "tasks.dueDate": {
                    $gte: now,
                    $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000),
                },
                "tasks.status": { $ne: "done" },
            },
        },
        { $replaceRoot: { newRoot: "$tasks" } },
    ];

    return pipeline;
}