import { Schema, model } from 'mongoose';


const EntrepreneurshipSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name must be provided']
    },
    description: {
        type: String,
        required: [true, 'Description must be provided']
    },
    phone: {
        type: String,
        required: [true, 'Phone must be provided']
    },
    address: {
        type: String,
        required: [true, 'Address must be provided']
    },
    type_entrepreneur: {
        type: String,
        required: [true, 'Type must be provided'],
        enum: ['Comida', 'Artesanía', 'Tecnología', 'Servicios', 'Otro'],
        default: 'Otro'
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'User must be provided']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    img:{
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
},{versionKey: false});

export default model('Entrepreneurships', EntrepreneurshipSchema);