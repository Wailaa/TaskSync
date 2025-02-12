import { getRedisClient } from "../config/redis.js";

export const addOnlineUser = async (userId, socketId) => {
    if (!userId || !socketId) return;
    const previousSocketId = await getSocketIdByUserId(userId);
    if (previousSocketId != null) {
        await getRedisClient().hDel("socketToUser", previousSocketId);
    }

    await getRedisClient().hSet("onlineUsers", userId, socketId);
    await getRedisClient().hSet("socketToUser", socketId, userId);

    console.log(`✅ User ${userId} is online (Socket: ${socketId})`);
};

export const removeOnlineUser = async (socketID) => {

    const userId = await getRedisClient().hGet("socketToUser", socketID);
    if (!userId) return;

    await getRedisClient().hDel("onlineUsers", userId);
    await getRedisClient().hDel("socketToUser", socketID);

    console.log(`❌ User ${userId} is offline`);
};

export const getSocketIdByUserId = async (userId) => {
    userId = userId.toString();
    const socketID = await getRedisClient().hGet("onlineUsers", userId);
    return socketID;
}