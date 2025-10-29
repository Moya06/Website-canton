import { Schema, model } from 'mongoose';


const AnnoucementSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name must be provided']
    },
    description: {
        type: String,
        required: [true, 'Description must be provided']
    },
    date: {
        type: Date,
        required: [true, 'Date must be provided']
    },
    address: {
        type: String,
        required: [true, 'Address must be provided']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'User must be provided']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        required: [true, 'Type must be provided'],
        enum: ['evento', 'oferta', 'servicio', 'general'],
        default: 'general'
    },
    image: {
        type: String,
        default: '/imgs/img_cards/advertisement.png'
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

export default model('Annoucements', AnnoucementSchema);