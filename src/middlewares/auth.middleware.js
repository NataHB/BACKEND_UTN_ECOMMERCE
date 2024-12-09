import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/auth.repository.js';
import ENVIROMENT from '../config/enviroment.js';

const authMiddleware = (roles) => {
    return async (req, res, next) => {
        try {
            const auth_header = req.headers['authorization'];

            if (!auth_header) {
                return res.json({ message: 'Falta autorización' });
            }

            const access_token = auth_header.split(' ')[1];

            if (!access_token) {
                return res.json({ message: 'El token es incorrecto' });
            }

            const user_payload_decoded = jwt.verify(access_token, ENVIROMENT.SECRET_KEY);

            // Verificar que el correo esté verificado
            const user = await UserRepository.getUserByEmail(user_payload_decoded.email);
            if (!user.emailVerified) {
                return res.json({ message: 'Por favor, verifica tu correo electrónico', status_code: 403 });
            }

            if (roles && !roles.includes(user_payload_decoded.role)) {
                return res.json({ message: 'No tienes acceso', status_code: 403 });
            }

            req.user = {
                id: user.id,  // Asegúrate de incluir el id del usuario
                email: user.email,
                role: user.role
            };

            next();
        } catch (error) {
            console.log(error);
            return res.json({ message: 'Error interno del servidor' });
        }
    };
};

export default authMiddleware;
