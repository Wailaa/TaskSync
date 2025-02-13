import { Notification } from "../models/notificationModels.js"

export const getNotifications = async (req, res) => {
    const userId = req.user._id;
    const notifications = await Notification.find({ userId });

    if (!notifications) {
        return res.status(200).json({ message: "no new notifications" });
    }
    return res.status(200).json({ message: "new notifications ", notifications });

}