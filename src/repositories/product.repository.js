import pool from "../config/db.mysql.config.js";
import Product from "../models/products.model.js";

class ProductRepository{

    static async createProduct (product_data) {
        const {
            title,
            price,
            stock,
            description,
            category,
            seller_id,
            image_base64 = null
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
    

    static async updateProduct (product_id, product_data) {
        const {
            title,
            price,
            stock,
            description,
            category,
            seller_id,
            image_base64 = null
        } = product_data

        const query = `
        UPDATE products 
        SET title = ?, price = ?, stock = ?, description = ?, seller_id = ?, category = ?, image_base64 = ?
        WHERE id = ?
        `

        const [result] = await pool.execute(query, [title, price, stock, description, seller_id, category, image_base64, product_id])
        if(result.affectedRows > 0){
            return {title, price, stock, description, seller_id, category, image_base64, id: product_id}
        }
        else{
            return console.log(result)
        }
    }

    static async getProducts () {
        const [rows] = await pool.execute(`SELECT * FROM products WHERE active = true`);
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
}

export default ProductRepository