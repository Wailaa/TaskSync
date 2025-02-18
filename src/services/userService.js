
import User from "../models/userModels.js";
import { createHashPass } from "../utils/hashPass.js";


const createUserService = (User) => {
    const UserService = {}


    UserService.createUser = async ({ username, password, email, role = 'user' }) => {
        if (!username || !password) {
            const error = new Error("Username or password not provided.")
            throw error
        }

        if (await User.findOne({ username })) {
            const error = new Error("Username already in use.")
            error.statusCode = 403
            throw error
        }

        const hashedPass = await createHashPass(password);

        const user = new User({ username, password: hashedPass, email, role });
        return await user.save()
    }

    UserService.findOne = async (filter) => {
        return await User.findOne(filter)
    }

    UserService.findByIdAndUpdate = async (id, filter) => {
        return await User.findByIdAndUpdate(id, filter, { new: true })
    }

    UserService.getUserById = async (userId) => {
        if (!userId) throw new Error("No userId provided.")
        return await User.findById(userId)
    }

    return UserService;
}

export const userService = createUserService(User);