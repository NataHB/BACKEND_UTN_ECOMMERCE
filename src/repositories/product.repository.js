import pool from "../config/db.mysql.config.js";

class ProductRepository{

    static async createProduct (product_data) {
        const {
            title,
            price,
            stock,
            description,
            category,
            seller_id,
            image_base64
        } = product_data

        const query = `
        INSERT INTO products (title, price, stock, description, seller_id, category, image_base64) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `

        const [result] = await pool.execute(query, [title, price, stock, description, seller_id, category, image_base64])
        if(result.affectedRows > 0){
            return {title, price, stock, description, seller_id, category, image_base64, id: result.insertId}
        }
        else{
            return console.log(result)
        }
    }
    

    static async updateProduct(product_id, product_data) {
        const [products] = await pool.execute(`SELECT * FROM products WHERE id = ?`, [product_id])
        if (products.length === 0) throw new Error(`Producto con id ${product_id} no encontrado`)
    
        const existingProduct = products[0]
    
        const updatedFields = {
            title: product_data.title || existingProduct.title,
            price: product_data.price || existingProduct.price,
            stock: product_data.stock || existingProduct.stock,
            description: product_data.description || existingProduct.description,
            category: product_data.category || existingProduct.category,
            seller_id: product_data.seller_id || existingProduct.seller_id,
            image_base64: product_data.image_base64 || existingProduct.image_base64,
        };
    
        const query = `
            UPDATE products 
            SET title = ?, price = ?, stock = ?, description = ?, seller_id = ?, category = ?, image_base64 = ?
            WHERE id = ?
        `;
        const params = [
            updatedFields.title,
            updatedFields.price,
            updatedFields.stock,
            updatedFields.description,
            updatedFields.seller_id,
            updatedFields.category,
            updatedFields.image_base64,
            product_id,
        ]
    
        const [result] = await pool.execute(query, params)
        if (!result.affectedRows) throw new Error(`No se pudo actualizar el producto con id ${product_id}`)
    
        return { ...updatedFields, id: product_id }
    }

    static async getProducts () {
        const [rows] = await pool.execute(`SELECT * FROM products WHERE active = true`)
        return rows
    }

    static async getProductById (product_id) {
        const [rows] = await pool.execute(`SELECT * FROM products WHERE id = ?`, [product_id])
        return rows.length > 0 ? rows[0] : null
    }

    static async deleteProduct (product_id) {
        const [rows] = await pool.execute(`UPDATE products SET active = false WHERE id = ?`, [product_id])
        return rows
    }

    static async getProductsBySeller(sellerId) {
        const query = 'SELECT * FROM products WHERE seller_id = ? AND active = TRUE'
        const [rows] = await pool.execute(query, [sellerId])
        return rows
    }

    static async getCategories() {
        const query = 'SELECT DISTINCT category FROM products WHERE active = TRUE'
        const [rows] = await pool.execute(query)
        return rows
    }

    static async getProductsByCategory(category) {
        const query = 'SELECT * FROM products WHERE category = ? AND active = TRUE'
        const [rows] = await pool.execute(query, [category])
        return rows
    }
}

export default ProductRepository