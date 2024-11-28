import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true 
        },
        password: { 
            type: String, 
            required: true 
        },
        email: { 
            type: String, 
            required: true,
            unique: true 
        },
        emailVerified: { 
            type: Boolean, 
            default: false 
        },
        verificationToken: { 
            type: String 
        },
        fechaCreacion: { 
            type: Date, 
            default: Date.now 
        },
        role: { 
            type: String, 
            default: 'user',
            required: true
        },
        active: { 
            type: Boolean, 
            default: true 
        }
    }
)

const User = mongoose.model('Users', userSchema);

export default User