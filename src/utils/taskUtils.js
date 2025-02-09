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
};
