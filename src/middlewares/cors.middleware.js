import ENVIROMENT from "../config/enviroment.js";

const allowed_origins = [
    'http://localhost:5173',
    ENVIROMENT.URL_FRONTEND
]

export const costumCorsMiddleware = ((req, res, next) => {
    const origin = req.headers.origin;
    if (allowed_origins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});