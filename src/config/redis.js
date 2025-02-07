import redis from "redis";


let redisClient;

export const connectRedis = async () => {


    redisClient = redis.createClient({
        host: '127.0.0.1',
        port: 6379,
    });

    redisClient.on("error", (err) => {
        console.error("❌ Redis error:", err);
    });

    await redisClient.connect();

    console.log("✅ Redis connected");
    return redisClient;

};

export const getRedisClient = () => {
    if (!redisClient) {
        throw new Error("Redis client is not initialized. Call connectRedis() first.");
    }
    return redisClient;
};