import ResponseBuilder from "../builders/response.builder.js";
import ENVIROMENT from "../config/enviroment.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import transportarEmail from "../helpers/emailTransporter.helper.js";
import jwt from "jsonwebtoken";
import AuthRepository from "../repositories/auth.repository.js";
import AppError from "../helpers/errors/app.error.js";


const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const verifyString = (field_name, field_value) => {
    if(!(typeof(field_value) === 'string')){
        return {
            error: 'STRING_VALIDATION',
            message: field_name + ' debe ser un texto',
        }
    }
}
const verifyMinLength = (field_name, field_value, minLength) => {
    if(!(field_value.length >= minLength)){
        return {
            error: 'MIN_LENGTH_VALIDATION',
            message: field_name + ' debe tener como minimo ' + minLength + ' caracteres',
        }
    }
}

const verifyNumber = (field_name, field_value) => {
    if(!(typeof field_value === 'number')){
        return {
            error: 'NUMBER_VALIDATION',
            message: field_name + ' debe ser un numero',
        }
    }
}

const verifyEmail = (field_name, field_value) => {
    if(!(emailRegex.test(field_value))){
        return {
            error: 'EMAIL_VALIDATION',
            message: field_name + ' no cumple el formato email'
        }
    }
}

export const registerController = async (req, res, next) => {
    try {
        const { name, password, email } = req.body;

        // Validar name, password, email
        const registerConfig = {
            name: {
                value: name,
                errors: [],
                validation: [
                    verifyString,
                    (field_name, field_value) => verifyMinLength(field_name, field_value, 5)
                ]
            },
            password: {
                value: password,
                errors: [],
                validation: [
                    verifyString,
                    (field_name, field_value) => verifyMinLength(field_name, field_value, 10)
                ]
            },
            email: {
                value: email,
                errors: [],
                validation: [
                    verifyEmail,
                    (field_name, field_value) => verifyMinLength(field_name, field_value, 10)
                ]
            }
        }

        let hayErrores = false;
        for (let field_name in registerConfig) {
            for (let validation of registerConfig[field_name].validation) {
                let result = validation(field_name, registerConfig[field_name].value);
                if (result) {
                    hayErrores = true;
                    registerConfig[field_name].errors.push(result);
                }
            }
        }

        if (hayErrores) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setCode('ERROR')
                .setMessage('Campos invalidos')
                .setData(
                    { errors: registerConfig }
                )
                .build();
            return res.json(response);
        }

        // Creación del usuario
        const userCreated = await AuthRepository.createUser({
            name: registerConfig.name.value,
            email: registerConfig.email.value,
            password: registerConfig.password.value
        });

        // Enviar correo de verificación
        const verificationToken = userCreated.verificationToken;
        const verificationUrl = `${ENVIROMENT.URL_FRONTEND}/auth/verify-email/${verificationToken}`;

        const result = await transportarEmail.sendMail({
            subject: 'Validación de correo',
            to: registerConfig.email.value,
            html: `
                <h1>Valida tu correo</h1>
                <p>Por favor, confirma tu correo haciendo clic en el siguiente enlace:</p>
                <a href="${verificationUrl}">Validar</a>
            `
        });

        const response = new ResponseBuilder()
            .setCode('SUCCESS')
            .setOk(true)
            .setStatus(200)
            .setMessage('Usuario registrado correctamente, por favor verifica tu correo')
            .setData(
                { registerResult: userCreated }
            )
            .build();

        return res.json(response);

    } catch (error) {
        if (error.code === 11000) {
            return next(new AppError('Email already exists', 400));
        }
        return next(new AppError(error.message, error.status_code));
    }
}


export const verifyEmailController = async (req, res, next) => {
    try {
        const { validationToken } = req.params;  // Asegura que el nombre del parámetro coincide
        console.log('Token recibido:', validationToken);

        const user = await AuthRepository.verifyEmail(validationToken); // Verifica el token y marca el email como verificado

        const response = new ResponseBuilder()
            .setOk(true)
            .setCode('EMAIL_VERIFIED')
            .setMessage('Email verificado correctamente')
            .setStatus(200)
            .build();

        return res.json(response);

    } catch (error) {
        return next(new AppError(error.message, 400));  // Manejo de errores si algo falla
    }
};


export const loginController = async (req, res, next) => {
    try{
        const { email, password } = req.body

        const user = await AuthRepository.getUserByEmail(email)
        if(!user){
            return next(new AppError('User not found', 404))
        }

        if(!user.emailVerified){
            return next(new AppError('Email not verified', 400))
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return next(new AppError('Incorrect password', 400))
        }

        const accessToken = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            ENVIROMENT.SECRET_KEY,
            {
                expiresIn: '1d'
            }
        )

        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setCode('LOGIN_SUCCES')
        .setMessage('Login exitoso')
        .setData(
            {accessToken: accessToken,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                }
            }
        )
        .build()
        return res.json(response)
    }
    catch(error){
        return next( new AppError(error.message, 404) )
    }
}

export const forgotPasswordController = async (req, res, next) => {
    try{
        const { email } = req.body

        const user = await AuthRepository.getUserByEmail(email)
        if(!user){
            return next(new AppError('User not found', 404))
        }

        const reset_token = jwt.sign(
            {email: user.email},
            ENVIROMENT.SECRET_KEY,
            { expiresIn: '1d'}
        )

        const resetUrl = `${ENVIROMENT.URL_FRONTEND}/auth/recovery-password/${reset_token}`

        const result = await transportarEmail.sendMail({
            subject: 'Recuperar password',
            to: user.email,
            html:`<a href=${resetUrl}> Recuperar </a>`
    })


    res.json({
        status: 200,
        ok: true,
        message: 'Email enviado'
    })
    }catch(error){
        return next( new AppError(error.message, 400) )
    }
}

export const recoveryPasswordController = async (req, res, next) => {
    try {
        const { reset_token } = req.params
        const { password } = req.body

        const payload = jwt.verify(reset_token, ENVIROMENT.SECRET_KEY)

        const user = await AuthRepository.getUserByEmail(payload.email)
        if (!user) {
            return next(new AppError('User not found', 404))
        }

        const updatedUser = await AuthRepository.resetPassword(user.email, password)
        if (!updatedUser) {
            return next(new AppError('Error al restablecer la contraseña', 500))
        }


        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setCode('PASSWORD_RESET')
        .setMessage('Password reset successfully')
        .build()
        return res.json(response)
    } catch (error) {
        return next( new AppError(error.message, error.status_code) )
    }
};

