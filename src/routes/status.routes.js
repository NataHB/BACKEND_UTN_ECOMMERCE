/*Logica del status*/

import express from "express";
import testMiddleware from "../middlewares/test.middleware.js";
import { postPingController } from "../controllers/status.controller.js";

const statusRouter = express.Router();

// el middleware se aplica a todas las rutas 
statusRouter.post("/ping", testMiddleware, postPingController);

export default statusRouter