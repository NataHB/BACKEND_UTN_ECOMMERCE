import express from "express";
import { registerController, verifyEmailController, loginController, forgotPasswordController, recoveryPasswordController } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post('/register', registerController)
authRouter.post('/login', loginController)
authRouter.get('/verify-email/:validationToken', verifyEmailController)
authRouter.post('/forgot-password', forgotPasswordController)
authRouter.put('/recovery-password/:reset_token', recoveryPasswordController)

//implementar middleware de autorizacion

export default authRouter