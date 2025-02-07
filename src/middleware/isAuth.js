import User from "../models/userModels.js";
import { isTokenBlacklisted } from "../services/tokenBlacklist.js";
import { isTokenValid } from "../utils/jwtTokens.js";


export const isAuthorized = async (req, res, next) => {
    try {
        const accessToken = req.headers['authorization']?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).send({
                message: 'Token required'
            });
        }

        const isBlacklisted = await isTokenBlacklisted(accessToken);
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token has been revoked" });
        }

        const user = await isTokenValid(accessToken);
        if (!user) {
            return res.status(401).send({ message: 'invalid token' });
        }

        const userExists = await User.findById(user._id);
        if (!userExists) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        req.user = { username: userExists.username, _id: userExists._id, role: userExists.role };
        next();

    } catch (error) {
        console.error("Authorization Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};