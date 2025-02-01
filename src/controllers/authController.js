import User from '../models/userModels.js'
import { compareHashed, createHashPass } from "../utils/hashPass.js";
import { createAccessToken, createRefreshToken } from "../utils/jwtTokens.js";
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
    return res.status(200).json({ message: "user logged out successfully" });
}