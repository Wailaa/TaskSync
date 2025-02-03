import mongoose from "mongoose";

const BlacklistSchema = new mongoose.Schema({
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

export default mongoose.model("BlacklistedToken", BlacklistSchema);