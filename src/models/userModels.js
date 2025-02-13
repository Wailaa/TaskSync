import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['admin', 'manager', 'user'], default: 'user' },
        manager: { type: mongoose.Schema.Types.ObjectId, ref: "user", default: null },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
