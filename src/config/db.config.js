//logica de conexión a la base de datos

import mongoDB from "mongoose";
import ENVIROMENT from "./enviroment.js";

const MONGO_URL = ENVIROMENT.MONGO_DB_CONNECTION + '/' + ENVIROMENT.MONGO_DB_DATABASE

mongoDB.connect(MONGO_URL)
    .then(
        () => {
        console.log("DB is connected")
    }
    )
    .catch(
        (error) => {
        console.error("DB is not connected", error)
    }
    )
    .finally(
        () => {
            console.log("DB is finally connected")
        }
    )


export default mongoDB