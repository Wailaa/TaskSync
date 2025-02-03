import mongoose from "mongoose";

const BlacklistSchema = new mongoose.Schema({
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

const BlackList = mongoose.model("BlacklistedToken", BlacklistSchema);
export default BlackList;