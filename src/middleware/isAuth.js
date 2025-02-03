import { isTokenValid, isTokenValid } from "../utils/jwtTokens";


export const isAuthorized = async (req, res, next) => {
    try {
        const accessToken = req.headers['authorization']?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).send({
                message: 'Token required'
            });
        }

        const isBlacklisted = await BlacklistedToken.findOne({ token: accessToken });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token has been revoked" });
        }

        const user = await isTokenValid(accessToken);
        if (!user) {
            return res.status(401).send({ message: 'invalid token' });
        }
        req.user = user;
        next();


    } catch (error) {
        console.error("Authorization Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};