import User from "../models/user.model.js";
import bcrypt from "bcrypt";


class AuthRepository {
    
    static async createUser (user_data) {
        user_data.password = await bcrypt.hash(user_data.password, 10)
        const new_user = new User(user_data)
        await new_user.save()
        return new_user
    }

    static async getUserByEmail (email) {
        const user = await User.findOne({email: email})
        return user
    }

    static async resetPassword (email, password) {
        const user = await User.findOne({email: email})
        user.password = await bcrypt.hash(password, 10)
        await user.save()
        return user
    }
}

export default AuthRepository