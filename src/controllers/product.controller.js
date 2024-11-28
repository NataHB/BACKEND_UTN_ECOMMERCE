import ProductRepository from "../repositories/product.repository.js";
import ResponseBuilder from "../builders/response.builder.js";
import AppError from "../helpers/errors/app.error.js";

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

export const createProductController = async (req, res, next) => {
    try{
        const {title, description, price, stock, category, seller_id, image_base64} = req.body

        const product_data = {
            title: {
                value: title,
                errors: [],
                validation: [
                    verifyString,
                    (field_name, field_value) => verifyMinLength(field_name, field_value, 5)
                ]
            },
            image_base64: {
                value: image_base64,
                errors: [],
                validation: []
            },
            description: {
                value: description,
                errors: [],
                validation: [
                    verifyString,
                    (field_name, field_value) => verifyMinLength(field_name, field_value, 5)
                ]
            },
            price: {
                value: price,
                errors: [],
                validation: [ verifyString,
                    (field_name, field_value) => verifyMinLength(field_name, field_value, 1)
                ]
            },
            stock: {
                value: stock,
                errors: [],
                validation: [ verifyString,
                    (field_name, field_value) => verifyMinLength(field_name, field_value, 1)
                ]
            },
            category: {
                value: category,
                errors: [],
                validation: [
                    verifyString,
                    (field_name, field_value) => verifyMinLength(field_name, field_value, 5)
                ]
            },
            seller_id: {
                value: seller_id,
                errors: [],
                validation: [
                    verifyString,
                    (field_name, field_value) => verifyMinLength(field_name, field_value, 5)
                ]
            }
        }
    
        let hayErrores = false
        for (let field_name in product_data){
            for(let validation of product_data[field_name].validation){
                let result = validation(field_name, product_data[field_name].value)
                if(result){
                    hayErrores = true
                    product_data[field_name].errors.push(result)
                }
            }
        }
    
        if(hayErrores){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(400)
            .setCode('ERROR')
            .setMessage('Campos invalidos')
            .setData(
                {errors: product_data}
            )
            .build()
            return res.json(response)
        }
        
        // Extraer solo los valores validados
        const product_to_create = {};
        for (const field_name in product_data) {
            product_to_create[field_name] = product_data[field_name].value; // Solo el valor validado
        }

        const product = await ProductRepository.createProduct(product_to_create);

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(201)
            .setCode('OK')
            .setMessage('Producto creado')
            .setData(product)
            .build();
        return res.json(response);
    } catch (error) {
        return next(new AppError(error.message, error.status_code));
    }
};

export const updateProductController = async (req, res, next) => {
    try{
        const {product_id} = req.params
        const {title, description, price, stock, category, seller_id, image_base64} = req.body
        
        const product = await ProductRepository.getProductById(product_id)

        const updatedFields={
            title: title || product.title,
            description: description || product.description,
            price: price || product.price,
            stock: stock || product.stock,
            category: category || product.category,
            seller_id: seller_id || product.seller_id,
            image_base64: null
        }

        const product_data = {
            title: {
                value: updatedFields.title,
                errors: [],
                validation: [
                    verifyString,
                    (field_name, field_value) => verifyMinLength(field_name, field_value, 5)
                ]
            },
            image_base64: {
                value: updatedFields.image_base64,
                errors: [],
                validation: []
            },
            description: {
                value: updatedFields.description,
                errors: [],
                validation: [
                    verifyString,
                    (field_name, field_value) => verifyMinLength(field_name, field_value, 5)
                ]
            },
            price: {
                value: updatedFields.price,
                errors: [],
                validation: [ verifyString,
                    (field_name, field_value) => verifyMinLength(field_name, field_value, 1)
                ]
            },
            stock: {
                value: updatedFields.stock,
                errors: [],
                validation: [ verifyString,
                    (field_name, field_value) => verifyMinLength(field_name, field_value, 1)
                ]
            },
            category: {
                value: updatedFields.category,
                errors: [],
                validation: [
                    verifyString,
                    (field_name, field_value) => verifyMinLength(field_name, field_value, 5)
                ]
            },
            seller_id: {
                value: updatedFields.seller_id,
                errors: [],
                validation: [
                    verifyString,
                    (field_name, field_value) => verifyMinLength(field_name, field_value, 5)
                ]
            }
        }

        let hayErrores = false;
        // Validar solo los campos que están presentes en el body
        for (let field_name in product_data) {
            if (product_data[field_name].value !== product[field_name]) { // Si el valor ha cambiado
                for (let validation of product_data[field_name].validation) {
                    let result = validation(field_name, product_data[field_name].value);
                    if (result) {
                        hayErrores = true;
                        product_data[field_name].errors.push(result);
                    }
                }
            }
        }

        if(hayErrores){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(400)
            .setCode('ERROR')
            .setMessage('Campos invalidos')
            .setData(
                {errors: product_data}
            )
            .build()
            return res.json(response)
        }

        // Extraer solo los valores validados
        const product_to_update = {}

        // Solo incluir los campos que tienen valores definidos
        for (const field_name in product_data) {
            if (product_data[field_name].value !== undefined && product_data[field_name].value !== null) {
                product_to_update[field_name] = product_data[field_name].value;
            } else {
                product_to_update[field_name] = null;  // Asignar null si no se proporciona un valor
            }
        }

        const productUpdated = await ProductRepository.updateProduct(product_id, product_to_update);

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setCode('OK')
            .setMessage('Producto actualizado')
            .setData(productUpdated)
            .build()
        return res.json(response)
    } catch (error) {
        return next(new AppError(error.message, error.status_code))
    }
};

export const getProductsController = async (req, res, next) => {
    try{
        const products = await ProductRepository.getProducts()
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setCode('OK')
        .setMessage('Products found')
        .setData({products: products})
        .build()
        return res.json(response)
    }catch(error){
        return next( new AppError(error.message, error.status_code) )
    }
}

export const getProductByIdController = async (req, res, next) => {
    try{
        const {product_id} = req.params
        const product = await ProductRepository.getProductById(product_id)

        if(!product){
            return next(new AppError('Product not found', 404))
        }
        
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setCode('OK')
        .setMessage('Product found')
        .setData({product: product})
        .build()
        return res.json(response)
    }catch(error){
        return next( new AppError(error.message, error.status_code) )
    }
}



export const deleteProductController = async (req, res, next) => {
    try{
        const {product_id} = req.params
        const product = await ProductRepository.deleteProduct(product_id)

        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setCode('OK')
        .setMessage('Product deleted')
        .setData({product: product})
        .build()
        return res.json(response)
    }catch(error){  
        return next( new AppError(error.message, error.status_code) )
    }
}