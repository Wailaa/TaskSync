import { getRedisClient } from "../config/redis.js";

export const addOnlineUser = async (userId, socketId) => {
    if (!userId || !socketId) return;
    await getRedisClient().hSet("onlineUsers", userId, socketId);
    console.log(`✅ User ${userId} is online (Socket: ${socketId})`);
};
export const addSocketToUser = async (userId, socketId) => {
    if (!userId || !socketId) return;

    await getRedisClient().hSet("socketToUser", socketId, userId);
    console.log(`✅ socketToUser is online ${socketId}: ${userId})`);
};

export const removeOnlineUser = async (soketID) => {

    const userId = await getRedisClient().hGet("socketToUser", soketID);
    if (!userId) return;

    await getRedisClient().hDel("onlineUsers", userId);
    await getRedisClient().hDel("socketToUser", soketID);

    console.log(`❌ User ${userId} is offline`);
};