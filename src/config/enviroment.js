import dotenv from "dotenv"
dotenv.config()

const ENVIROMENT = {
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || 'password',
    EMAIL_USER: process.env.EMAIL_USER || 'email',
    SECRET_KEY: process.env.SECRET_KEY || 'secret',
    URL_FRONTEND: process.env.URL_FRONTEND,
    MYSQL: {
        HOST: process.env.MYSQL_HOST || 'localhost',
        USER: process.env.MYSQL_USER || 'root',
        PASSWORD: process.env.MYSQL_PASSWORD || 'password',
        DATABASE: process.env.MYSQL_DATABASE || 'database'},
    MONGO_DB_CONNECTION: process.env.MONGO_DB_CONNECTION || 'mongodb://localhost:27017',
    MONGO_DB_DATABASE: process.env.MONGO_DB_DATABASE || 'database'
}

export default ENVIROMENT
