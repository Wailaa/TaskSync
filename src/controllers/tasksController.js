import { taskService } from "../services/taskService.js";
import { emitNewEvent } from "../services/userNotifications.js";
import { userService } from "../services/userService.js";
import { buildSearchPipeLine, buildTaskFilter } from "../utils/taskUtils.js";

export const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate, assignee, labels } =
            req.body;
        const userId = req.user._id;
        const role = req.user.role;
        const newTask = await taskService.createNewTask({
            userId,
            title,
            description,
            status,
            priority,
            dueDate,
            assignee,
            labels,
            role

        });

        await emitNewEvent("taskCreated", newTask.assignee, newTask.title);

        res
            .status(201)
            .json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        console.error("create task error:", error);
        res.status(500).json({ message: "failed to create task" });
    }
};

export const getTasks = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            priority,
            scope = "self",
            search,
        } = req.query;

        const filter = await buildTaskFilter(req.user, scope, status, priority);
        const pipeline = buildSearchPipeLine(filter, search, page, limit);
        const [tasks, taskCount] = await taskService.findWithFilter(pipeline);

        return res.status(200).json({
            totalTasks: taskCount,
            totalPages: Math.ceil(taskCount / limit),
            currentPage: page,
            tasks,
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return res.status(500).json({ message: "Failed to fetch tasks" });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await taskService.findById(req.params.taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.status(200).json(task);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Failed to fetch task" });
    }
};

export const updateTask = async (req, res) => {
    try {
        const userRole = req.user.role;
        const taskId = req.params.taskId;
        let requestBody = req.body;
        const task = await taskService.findById(taskId);

        if (!task) {
            return res.status(400).json({
                message: "could not find task",
            });
        }

        const allSubtasksCompleted = await taskService.IsSubtasksDone(taskId);

        if (req.body.status == "done" && !allSubtasksCompleted) {
            return res.status(400).json({
                message: "Cannot mark task as 'Done' while subtasks are incomplete.",
            });
        }

        if (userRole === "user") {
            if (!req.body.hasOwnProperty("status")) {
                return res.status(400).json({
                    message:
                        "Only the 'status' field can be updated, and it must be provided.",
                });
            }
            requestBody = { status: req.body.status };
        }

        const result = await taskService.findByIdAndUpdate(taskId, requestBody);
        if (!result) {
            return res.status(404).json({ message: "Task not found" });
        }

        const action = `Updated task: ${JSON.stringify(requestBody)}`;
        userService.addActivityLog(req.user._id, { taskId, action });

        await emitNewEvent(
            "taskUpdated",
            task.assignee,
            `Task update for title: ${task.title}`
        );

        res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update task", error });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await taskService.findById(req.params.taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await taskService.findByIdAndDelete(req.params.taskId);

        await emitNewEvent(
            "taskDeleted",
            task.assignee,
            `Task title: ${updatedTask.title} is deleted`
        );

        const action = `Deleted task: ${JSON.stringify(req.body)}`;
        userService.addActivityLog(req.user._id, { taskId: req.params.taskId, action });

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete task", error });
    }
};

export const assignTask = async (req, res) => {
    try {
        const { newUserId } = req.body;
        const task = await taskService.findById(req.params.taskId);

        if (!task) return res.status(404).json({ message: "Task not found" });
        if (newUserId == task.assignee) return res.status(400).json({ message: "Task already assigned to user" });

        await taskService.assignUserToTask(newUserId, task);

        const action = `New user Assigned: ${newUserId}`;
        userService.addActivityLog(req.user._id, { taskId: req.params.taskId, action });

        res.json({ message: "Task reassigned successfully", task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addTaskComment = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const comment = req.body;

        await taskService.addTaskComment(taskId, comment);
        res.json({ message: "Comment added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createSubtask = async (req, res) => {
    try {
        const id = req.params.taskId;
        const { title, status } = req.body;
        const subtask = {
            title,
            status,
            parentTask: id,
            createdBy: req.user._id,
        };

        const createSubtask = await taskService.createSubTask(id, subtask);
        const action = `Subtask created task: ${JSON.stringify(req.body)}`;

        userService.addActivityLog(req.user._id, { taskId: req.params.taskId, action });

        return res.status(201).json({ message: "Subtask created", createSubtask });
    } catch (error) {
        res.status(500).json({ message: "Error creating subtask" });
    }
};

export const updateSubTask = async (req, res) => {
    try {
        const userRole = req.user.role;

        if (userRole === "user") {
            if (!req.body.hasOwnProperty("status")) {
                return res.status(400).json({
                    message:
                        "Only the 'status' field can be updated, and it must be provided.",
                });
            }
            req.body = { status: req.body.status };
        }

        const updatedSubTask = await taskService.updateSubTask(req.user._id, req.params.taskId, req.params.subtaskId, req.body)

        if (!updatedSubTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        const action = `Subtask updated : subtaskId :${req.params.subtaskId}`;
        userService.addActivityLog(req.user._id, { taskId: req.params.taskId, action });

        res.status(200).json({ message: "Task updated successfully", task: updatedSubTask });
    } catch (error) {
        res.status(500).json({ message: "Failed to update task", error });
    }
};

export const createSubtaskComment = async (req, res) => {
    try {
        const userId = req.user._id;
        const taskId = req.params.taskId;
        const subtasId = req.params.subtaskId;
        const comment = req.body;
        console.log('comment', comment);
        await taskService.addSubtaskComment(userId, taskId, subtasId, comment);
        res.status(200).json({ message: "Comment added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};