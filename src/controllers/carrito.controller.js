import CartRepository from "../repositories/carrito.repository.js"
import ResponseBuilder from "../builders/response.builder.js"
import AppError from "../helpers/errors/app.error.js"

export const getCartController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const cart = await CartRepository.getCartByUser(userId)

        const response = new ResponseBuilder()
            .setOk(true)
            .setCode('SUCCESS')
            .setMessage('Carrito obtenido correctamente')
            .setStatus(200)
            .setData({ cart })
            .build()

        return res.json(response)
    } catch (error) {
        return next(new AppError(error.message, 500))
    }
};

export const addProductToCartController = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body
        const userId = req.user.id

        if (!productId || !quantity || quantity <= 0) {
            return next(new AppError('Producto o cantidad inválida', 400))
        }

        const productAdded = await CartRepository.addProductToCart(userId, productId, quantity)

        const cart = await CartRepository.getCartByUser(userId)

        const response = new ResponseBuilder()
            .setOk(true)
            .setCode('PRODUCT_ADDED')
            .setMessage('Producto agregado al carrito correctamente')
            .setStatus(200)
            .setData({ productAdded, cart })
            .build()

        return res.json(response)
    } catch (error) {
        return next(new AppError(error.message, 500))
    }
};

export const removeProductFromCartController = async (req, res, next) => {
    try {
        const { productId } = req.body
        const userId = req.user.id

        if (!productId) {
            return next(new AppError('Producto inválido', 400))
        }

        const result = await CartRepository.removeProductFromCart(userId, productId)

        if (result === 0) {
            return next(new AppError('Producto no encontrado en el carrito', 404))
        }

        const cart = await CartRepository.getCartByUser(userId)

        const response = new ResponseBuilder()
            .setOk(true)
            .setCode('PRODUCT_REMOVED')
            .setMessage('Producto eliminado del carrito correctamente')
            .setStatus(200)
            .setData({ cart })
            .build()

        return res.json(response);
    } catch (error) {
        return next(new AppError(error.message, 500))
    }
};

export const updateProductQuantityController = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body
        const userId = req.user.id

        if (!productId || !quantity || quantity <= 0) {
            return next(new AppError('Producto o cantidad inválida', 400))
        }

        const result = await CartRepository.updateProductQuantity(userId, productId, quantity)

        if (result === 0) {
            return next(new AppError('Producto no encontrado en el carrito', 404))
        }

        const cart = await CartRepository.getCartByUser(userId)
        
        const response = new ResponseBuilder()
            .setOk(true)
            .setCode('QUANTITY_UPDATED')
            .setMessage('Cantidad del producto actualizada correctamente')
            .setStatus(200)
            .setData({ cart })
            .build()

        return res.json(response)
    } catch (error) {
        return next(new AppError(error.message, 500))
    }
};
