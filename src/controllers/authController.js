import BlackList from '../models/blackListedToken.js';
import User from '../models/userModels.js'
import { compareHashed, createHashPass } from "../utils/hashPass.js";
import { createAccessToken, createRefreshToken, getClaims, isTokenValid } from "../utils/jwtTokens.js";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Usr already exists" });
        }

        const hashedPass = await createHashPass(password);
        const newUser = new User({
            username,
            email,
            password: hashedPass,
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res
                .status(400)
                .json({ message: "Username and password are required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPassValid = await compareHashed(password, user.password);
        if (!isPassValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const accessToken = createAccessToken(user.username);
        const refreshToken = createRefreshToken(user.username);
        return res.status(201).json({ message: "User logged in successfully", accessToken, refreshToken });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal Server error" });
    }
};
export const logOut = async (req, res) => {
    try {
        const { authorization } = req.headers;
        const { refreshToken } = req.body;
        const accessToken = authorization?.split(' ')[1];

        if (!accessToken) {
            return res.status(401).send({
                message: 'Token required'
            });
        }

        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token required" });
        }

        const accessTokenClaims = getClaims(accessToken);
        const accTimeExpiresAt = new Date(accessTokenClaims.exp * 1000);
        await BlackList.create({ token: accessToken, expiresAt: accTimeExpiresAt });

        const refreshTokenClaims = getClaims(refreshToken);
        const refTimeExpiresAt = new Date(refreshTokenClaims.exp * 1000);
        await BlackList.create({ token: refreshToken, expiresAt: refTimeExpiresAt });

        return res.status(200).json({ message: "logged out successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error" });
    }

};

export const refreshRequest = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token required" });
    }

    const user = await isTokenValid(refreshToken);
    if (!user) {
        return res.status(401).send({ message: 'invalid token' });
    }

    const isTokenBlacklisted = await BlackList.findOne({ token: refreshToken });
    if (isTokenBlacklisted) {
        return res.status(401).json({ message: "expired token" });
    }

    const accessToken = createAccessToken(user.username);
    return res.status(200).json({ message: "new access token", accessToken });
};