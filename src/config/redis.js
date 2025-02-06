import redis from "redis";



export const connectRedis = async () => {


    const redisClient = redis.createClient({
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