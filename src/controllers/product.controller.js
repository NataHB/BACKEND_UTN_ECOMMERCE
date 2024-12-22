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

const verifyPositiveNumber = (field_name, field_value) => {
    if(!(field_value > 0)){
        return {
            error: 'POSITIVE_NUMBER_VALIDATION',
            message: field_name + ' debe ser un numero positivo',
        }
    }
}

export const createProductController = async (req, res, next) => {
    try{
        const {title, description, price, stock, category, image_base64} = req.body
        const seller_id = req.user.id

        console.log(req.body);

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
                    (field_name, field_value) => verifyPositiveNumber(field_name, field_value)
                ]
            },
            stock: {
                value: stock,
                errors: [],
                validation: [ verifyString,
                    (field_name, field_value) => verifyPositiveNumber(field_name, field_value)
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
                validation: []
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

        console.log('Product to create:', product_to_create); // Confirmar los datos que se envían al repositorio

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
    try {
        const { product_id } = req.params;

        const productUpdated = await ProductRepository.updateProduct(product_id, req.body);

        return res.status(200).json(
            new ResponseBuilder()
                .setOk(true)
                .setStatus(200)
                .setCode('UPDATED')
                .setMessage('Producto actualizado correctamente')
                .setData(productUpdated)
                .build()
        );
    } catch (error) {
        console.error(error);
        return next(new AppError(error.message, error.status_code || 500));
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

export const getProductsBySellerController = async (req, res, next) => {
    try {
        const seller_id = req.user.id; // ID del usuario actual
        const products = await ProductRepository.getProductsBySeller(seller_id);

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setCode('OK')
            .setMessage('Productos del usuario obtenidos con éxito')
            .setData({myProducts: products})
            .build();

        return res.json(response);
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const getCategoriesController = async (req, res, next) => {
    try{
        const categories = await ProductRepository.getCategories()
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setCode('OK')
        .setMessage('Categories found')
        .setData({categories: categories})
        .build()
        return res.json(response)
    }catch(error){
        return next( new AppError(error.message, error.status_code) )
    }
}

export const getProductsByCategoryController = async (req, res) => {
    const { category } = req.params;
    try {
      const products = await ProductRepository.getProductsByCategory(category);

      const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setCode('OK')
        .setMessage('Productos de la categoría obtenidos con éxito')
        .setData({category: products})
        .build();
      return res.json(response);
    } catch (error) {
      return next(new AppError(error.message, 500));
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