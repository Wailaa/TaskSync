import { getRedisClient } from "../config/redis.js";
import { calculateExpInSec } from "../utils/helpers.js";
import { isTokenValid } from "../utils/jwtTokens.js";

export const blacklistJWT = async (token) => {
    const claims = await isTokenValid(token);
    if (!claims) {
        return;
    }
    const tokenExpInSec = calculateExpInSec(claims.exp, claims.iat);
    const client = getRedisClient();
    await client.set(`blacklist: ${token}`, "blacklisted", { EX: tokenExpInSec });
};

export const isTokenBlacklisted = async (token) => {
    try {
        const client = getRedisClient();
        const isBlacklisted = await client.get(`blacklist: ${token}`);
        return isBlacklisted !== null;
    } catch (error) {
        console.error("Error checking token blacklist:", error);
        return false;
    }
};