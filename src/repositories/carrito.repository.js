import pool from "../config/db.mysql.config.js";

class CartRepository {
    static async getCartByUser(userId) {
        const query = `
            SELECT 
            cart_items.id AS cartItemId,
            products.id AS productId,
            products.title AS productName,
            products.price AS productPrice,
            cart_items.quantity AS quantity,
            (products.price * cart_items.quantity) AS total
            FROM cart_items
            JOIN products ON cart_items.product_id = products.id
            WHERE cart_items.user_id = ?`
        const [rows] = await pool.execute(query, [userId]);
        return rows; // Devuelve el carrito con los detalles del producto
    }

    static async addProductToCart(userId, productId, quantity) {
        const query = 'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?';
        const [existingCartItem] = await pool.execute(query, [userId, productId]);
    
        if (existingCartItem.length > 0) {
            const updateQuery = 'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?';
            await pool.execute(updateQuery, [quantity, userId, productId]);
            return { productId, quantity }; // Retornamos los datos del producto actualizado
        } else {
            const insertQuery = 'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)';
            const [result] = await pool.execute(insertQuery, [userId, productId, quantity]);
            return result.insertId; // Retorna el ID del nuevo producto insertado
        }
    }
    
    

    static async removeProductFromCart(userId, productId) {
            const query = `DELETE FROM cart_items WHERE user_id = ? AND product_id = ?`
            const [result] = await pool.execute(query, [userId, productId])
            return result.affectedRows
    }

    static async updateProductQuantity(userId, productId, quantity) {
        if (quantity <= 0) {
            throw new Error('La cantidad debe ser mayor a cero');
        }
        
        const query = 'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?';
        const [result] = await pool.execute(query, [quantity, userId, productId]);
        return result.affectedRows;
    }
    
}

export default CartRepository;
