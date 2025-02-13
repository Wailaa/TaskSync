import { Comment } from "../models/commentModels.js";
import { Task } from "../models/taskModels.js";

export const createComment = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { content } = req.body;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const comment = await Comment.create({ taskId, userId: req.user._id, content });
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: "Failed to add comment", error });
    }

};

export const getComments = async (req, res) => {
    try {
        const { taskId } = req.params;
        const comments = await Comment.find({ taskId }).populate("userId", "username");
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch comments", error });
    }
};