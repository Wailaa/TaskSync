import { getDB } from "../config/db.js";
import { compareHashed, creatHashPass } from "../utils/hassPass.js";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const db = getDB();
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Usr already exists" });
    }

    const hashedPass = await creatHashPass(password);
    const newUser = {
      username,
      email,
      password: hashedPass,
      createdAt: new Date(),
    };

    await db.collection("users").insertOne(newUser);
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

    const db = getDB();
    const user = await db.collection("users").findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPassValid = await compareHashed(password, user.password);
    if (!isPassValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    return res.status(201).json({ message: "User logged in successfully" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};
