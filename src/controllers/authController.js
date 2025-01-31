import { getDB } from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
    try {
        const {username , password, email } = req.body;
        const db = getDB();
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser){
            return res.status(400).json({message : 'Usr already exists'});
        }
        
        const newUser = {
            username,
            email,
            password,
            createdAt: new Date(),
        };

        await db.collection('users').insertOne(newUser)
        res.status(201).json({ message: 'User registered successfully'});
    }catch (error){
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req,res) => {
    console.log("login route activated")
    res.status(201).json({ message: 'User logged in successfully'});

};