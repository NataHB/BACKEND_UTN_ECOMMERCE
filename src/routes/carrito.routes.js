import express from "express";
import { getCartController, addProductToCartController, removeProductFromCartController, updateProductQuantityController } from "../controllers/carrito.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const carritoRouter = express.Router();

carritoRouter.get('/cart/:userId', authMiddleware(['user']), getCartController);
carritoRouter.post('/cart/add', authMiddleware(['user']), addProductToCartController);
carritoRouter.delete('/cart/remove', authMiddleware(['user']), removeProductFromCartController);
carritoRouter.put('/cart/update', authMiddleware(['user']), updateProductQuantityController);

export default carritoRouter