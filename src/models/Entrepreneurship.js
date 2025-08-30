import { Schema, model } from 'mongoose';


const EntrepreneurshipSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name must be provided']
    },
    description: {
        type: String,
    },
    phone: {
        type: String,
        required: [true, 'Phone must be provided']
    },
    address: {
        type: String,
        required: [true, 'Address must be provided']
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
    }
},{versionKey: false});

export default model('Entrepreneurships', EntrepreneurshipSchema);