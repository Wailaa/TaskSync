import User from "../models/userModels.js";
import { ObjectId } from "mongodb";

export const buildTaskFilter = async (user, scope, status, priority) => {
    const { role, _id: userId } = user;
    let filter = {};

    if (role === "admin") {
        return filter;
    }

    if (role === "manager" && scope === "team") {
        const managedUsers = await User.find({ manager: userId }).select("_id");
        filter["tasks.assignee"] = { $in: managedUsers.map((user) => user._id) };
    } else {
        filter["tasks.assignee"] = userId;
    }

    if (status) filter["tasks.status"] = status;
    if (priority) filter["tasks.priority"] = priority;

    return filter;
};

export const isSubTasksDone = async (taskId) => {
    const subtasks = await Subtask.find({ parentTask: taskId });
    if (subtasks.length === 0) return true;

    const isComplete = subtasks.every((subtask) => subtask.status === "Done");
    return isComplete;
};

export const buildSearchPipeLine = (filter, search, page, limit) => {
    let pipeline = [{ $unwind: "$tasks" }];
    if (search) {
        pipeline.push({
            $match: {
                $or: [
                    { "tasks.title": { $regex: search, $options: "i" } },
                    { "tasks.description": { $regex: search, $options: "i" } },
                ],
            },
        });
    }
    if (filter && Object.keys(filter).length > 0) {
        pipeline.push({ $match: filter });
    }

    pipeline.push({
        $facet: {
            metadata: [
                { $count: "totalTasks" },
            ],
            tasks: [
                { $skip: (page - 1) * limit },
                { $limit: limit },
                { $replaceRoot: { newRoot: "$tasks" } },
            ],
        },
    });

    pipeline.push({
        $project: {
            totalTasks: { $arrayElemAt: ["$metadata.totalTasks", 0] },
            tasks: 1,
        },
    });

    return pipeline;
};

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
};

export const buildFindTaskByIdPipeline = (taskId) => {
    const ObjectIdTask = ObjectId.createFromHexString(taskId);
    const pipeline = [
        { $unwind: "$tasks" },
        {
            $match: {
                "tasks._id": ObjectIdTask
            }
        },
        { $replaceRoot: { newRoot: "$tasks" } },
    ];
    return pipeline;
};


export const createTaskKeys = (filter) => {
    const tasksKeys = {};
    for (const key in filter) {
        tasksKeys[`tasks.$.${key}`] = filter[key];
    }

    return tasksKeys;
};

export const createSubTaskKeys = (filter) => {

    const subTasksKeys = {};
    for (const key in filter) {
        subTasksKeys[`tasks.$.subtasks.$[subtasks].${key}`] = filter[key];
    }

    return subTasksKeys;
};

export const createDeleteTaskOperator = (taskId) => {
    const ObjectIdTask = ObjectId.createFromHexString(taskId);
    return {
        $pull: {
            tasks: { _id: ObjectIdTask },
        },
    };
}