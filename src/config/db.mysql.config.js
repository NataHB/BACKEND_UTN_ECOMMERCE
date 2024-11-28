import mysql from "mysql2/promise";
import ENVIROMENT from "./enviroment.js";

//Nos permite crear un pool de conexiones
const pool = mysql.createPool({
    host: ENVIROMENT.MYSQL.HOST,
    user: ENVIROMENT.MYSQL.USER,
    password: ENVIROMENT.MYSQL.PASSWORD,
    database: ENVIROMENT.MYSQL.DATABASE
})

pool.getConnection().then(() => {
    console.log('mysql is connected');
})
.catch((error) => {
    console.error('mysql is not connected', error);
})

export default pool