import BlackList from "../models/blackListedToken.js";
import { isTokenValid } from "../utils/jwtTokens.js";


export const isAuthorized = async (req, res, next) => {
    try {
        const accessToken = req.headers['authorization']?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).send({
                message: 'Token required'
            });
        }

        const isBlacklisted = await BlackList.findOne({ token: accessToken });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token has been revoked" });
        }

        const user = await isTokenValid(accessToken);
        if (!user) {
            return res.status(401).send({ message: 'invalid token' });
        }
        req.user = { username: user.username, _id: user._id };

        next();


    } catch (error) {
        console.error("Authorization Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};