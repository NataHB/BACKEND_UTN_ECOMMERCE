import jwt from 'jsonwebtoken'
import ENVIROMENT from '../config/enviroment.js'

const authMiddleware = (roles) => { 
    return (req, res, next) => {
        try{
        // tiene info de la autorizacion
        const auth_header = req.headers['authorization']

        if(!auth_header){
            return res.json({message:'Falta autorizacion'})
        }

        const access_token = auth_header.split(' ')[1]

        if(!access_token){
            return res.json({message:'El token es incorrecto'})
        }

        const user_payload_decoded = jwt.verify(access_token, ENVIROMENT.SECRET_KEY)

        if(!roles.includes(user_payload_decoded.role)){
        return res.json({message:'No tienes acceso', status_code: 403})
        }

        //req es un objeto que contiene la informacion de la peticion
        //guardar en el objeto req la informacion del usuario
        req.user = user_payload_decoded

        next() //para que pase a la siguiente middleware
        }
        catch(error){
            console.log(error)
            return res.json({message:'Error interno del servidor'})
        }
    }
}

export default authMiddleware