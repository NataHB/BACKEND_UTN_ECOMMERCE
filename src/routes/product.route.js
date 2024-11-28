import express from "express";
import { createProductController, getProductsController, getProductByIdController, updateProductController, deleteProductController } from "../controllers/product.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const productRouter = express.Router();

productRouter.post('/create', authMiddleware(['user']), createProductController)
productRouter.get('/products/:product_id', getProductByIdController)
productRouter.get('/products', getProductsController)
productRouter.put('/update/:product_id', authMiddleware(['user']), updateProductController)
productRouter.delete('/delete/:product_id', authMiddleware(['user']), deleteProductController)

export default productRouter