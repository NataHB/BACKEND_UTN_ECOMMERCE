import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true
        },
        price:{
            type: Number,
            required: true
        },
        stock:{
            type: Number,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        category:{
            type: String,
            required: true
        },
        active: {
            type: Boolean,
            default: true
        },
        seller_id: {
            type: String,
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now
        }
    }
)

const Product = mongoose.model('Product', productSchema)

export default Product