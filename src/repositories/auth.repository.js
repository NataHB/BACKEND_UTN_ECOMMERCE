import pool from "../config/db.mysql.config.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import ENVIROMENT from "../config/enviroment.js"

class AuthRepository {

    static async createUser(user_data) {
        user_data.password = await bcrypt.hash(user_data.password, 10)
        const verificationToken = jwt.sign(
            { email: user_data.email },
            ENVIROMENT.SECRET_KEY,
            { expiresIn: '1d' }
        )

        const query = `INSERT INTO users (name, password, email, role, verificationToken, active) 
                    VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.execute(query, [
            user_data.name,
            user_data.password,
            user_data.email,
            user_data.role || 'user',
            verificationToken,
            user_data.active || true
        ]);

        return { ...user_data, id: result.insertId, verificationToken };
    }

    static async getUserByEmail(email) {
        const query = "SELECT * FROM users WHERE email = ?"
        const [rows] = await pool.execute(query, [email])
        return rows.length > 0 ? rows[0] : null
    }

    static async verifyEmail(token) {
        const payload = jwt.verify(token, ENVIROMENT.SECRET_KEY)
        const query = "SELECT * FROM users WHERE email = ?"
        const [rows] = await pool.execute(query, [payload.email])

        if (rows.length === 0) throw new Error("Usuario no encontrado")
        const user = rows[0];

        if (user.emailVerified) throw new Error("El correo ya está verificado")

        const updateQuery = "UPDATE users SET emailVerified = TRUE WHERE email = ?"
        const [updateResult] = await pool.execute(updateQuery, [payload.email])

        if (updateResult.affectedRows === 0) {
            throw new Error("Error al verificar el email")
        }

        return user
    }

    static async resetPassword(email, password) {
        const hashedPassword = await bcrypt.hash(password, 10)
        const query = "UPDATE users SET password = ? WHERE email = ?"
        const [result] = await pool.execute(query, [hashedPassword, email])

        if (result.affectedRows === 0) {
            throw new Error(`Usuario con email ${email} no encontrado`)
        }

        return { email, password: hashedPassword }
    }
}

export default AuthRepository
