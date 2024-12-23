import express from "express";
import authRouter from "./routes/auth.router.js";
import cors from "cors";
import mongoDB from "./config/db.config.js";
import carritoRouter from "./routes/carrito.routes.js";
import productRouter from "./routes/product.route.js";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware.js";

import { costumCorsMiddleware } from "./middlewares/cors.middleware.js";

const PORT = 3000;
const app = express();

app.use(costumCorsMiddleware)
app.use(cors());
app.use(express.json({limit: '3mb'}));

app.use('/auth', authRouter)
app.use('/products', productRouter)
app.use('/cart', carritoRouter)

app.use(errorHandlerMiddleware)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

