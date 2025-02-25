import { taskService } from "../services/taskService.js";
import { emitNewEvent } from "../services/userNotifications.js";
import { userService } from "../services/userService.js";
import { buildSearchPipeLine, buildTaskFilter, isSubTasksDone } from "../utils/taskUtils.js";

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
        const task = await taskService.findById(req.params.id);
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
        const taskId = req.params.id;
        let requestBody = req.body;
        const task = await taskService.findById(taskId);

        if (!task) {
            return res.status(400).json({
                message: "could not find task",
            });
        }
        if (req.status === "Done") {
            const allSubtasksCompleted = await isSubTasksDone(taskId);
            if (!allSubtasksCompleted) {
                return res.status(400).json({
                    message: "Cannot mark task as 'Done' while subtasks are incomplete.",
                });
            }
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
            "Task update for title: ${updatedTask.title}"
        );

        res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update task", error });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const deletedTask = await taskService.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        await emitNewEvent(
            "taskDeleted",
            deletedTask.assignee,
            "Task title: ${updatedTask.title} is deleted"
        );

        const action = `Deleted task: ${JSON.stringify(req.body)}`;
        userService.addActivityLog(req.user._id, { taskId: req.params.id, action });

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete task", error });
    }
};

export const assignTask = async (req, res) => {
    try {
        const { newUserId } = req.body;
        const task = await taskService.findById(req.params.id);

        if (!task) return res.status(404).json({ message: "Task not found" });
        if (newUserId == task.assignee) return res.status(400).json({ message: "Task already assigned to user" });

        await taskService.assignUserToTask(newUserId, task);

        const action = `New user Assigned: ${newUserId}`;
        userService.addActivityLog(req.user._id, { taskId: req.params.id, action });

        res.json({ message: "Task reassigned successfully", task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createSubtask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, status } = req.body;
        const subtask = {
            title,
            status,
            parentTask: id,
            createdBy: req.user._id,
        };

        const createSubtask = await taskService.createSubTask(id, subtask);
        const action = `Subtask created task: ${JSON.stringify(req.body)}`;

        userService.addActivityLog(req.user._id, { taskId: req.params.id, action });

        return res.status(201).json({ message: "Subtask created", createSubtask });
    } catch (error) {
        res.status(500).json({ message: "Error creating subtask" });
    }
};

export const assignSubtaskToUser = async (req, res) => {
    try {
        const { subtaskId } = req.params;
        const { userId } = req.body;

        const subtask = await Subtask.findById(subtaskId);
        if (!subtask) {
            return res.status(404).json({ message: "Subtask not found" });
        }

        subtask.assignedTo = userId;
        await subtask.save();

        const action = `Subtask assigned : for userId ${userId} ,subtaskId :${subtaskId}`;
        userService.addActivityLog(req.user._id, { taskId: subtask.parentTask, action });

        return res.status(200).json({ message: "Subtask assigned", subtask });
    } catch (error) {
        res.status(500).json({ message: "Error assigning subtask" });
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

        const updatedSubTask = await Subtask.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, userId: req.user._id }
        );
        if (!updatedSubTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        const action = `Subtask updated : subtaskId :${req.params.id}`;
        userService.addActivityLog(req.user._id, { taskId: updatedSubTask.parentTask, action });

        res
            .status(200)
            .json({ message: "Task updated successfully", task: updatedSubTask });
    } catch (error) {
        res.status(500).json({ message: "Failed to update task", error });
    }
};
